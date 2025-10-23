import { Component, ElementRef, ViewChild, NgZone, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import { marked } from 'marked';
import * as DOMPurify from 'dompurify';

type Turn = { role:'user'|'ai'; content:string; html?: string };

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss']
})
export class ChatWidgetComponent implements OnInit {
  @ViewChild('input') input!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  
  turns: Turn[] = [];
  sessionId?: string;
  pending = false;
  speakingIndex: number | null = null;
  isRecording = false;
  isMinimized = false;
  isVisible = false;
  
  private rec?: MediaRecorder;
  private recChunks: BlobPart[] = [];
  private renderTimer: any;
  private currentAudio?: HTMLAudioElement;

  apiBase = (window as any).API_BASE || 'https://ai-assistant-backend-ciq9.vercel.app';

  constructor(private http: HttpClient, private api: ApiService, private zone: NgZone) {}

  ngOnInit(): void {
    // Initial assistant greeting
    const msg = 'Hi! I\'m AIDA, your Advantis Assistant. How can I help you today?';
    this.turns.push({ role: 'ai', content: msg, html: this.toHtml(msg) });
    
    // Show widget after a brief delay
    setTimeout(() => {
      this.isVisible = true;
    }, 500);
  }

  toggleWidget() {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      setTimeout(() => this.input?.nativeElement?.focus(), 100);
    }
  }

  async send(text?: string) {
    const q = (text ?? this.input.nativeElement.value).trim();
    if (!q) return;
    
    this.input.nativeElement.value = '';
    this.turns.push({ role: 'user', content: q });
    this.pending = true;
    
    try {
      const body: any = { question: q };
      if (this.sessionId) body.session_id = this.sessionId;
      
      const res = await this.http.post<any>(`${this.apiBase}/chat`, body).toPromise();
      if (res?.session_id && !this.sessionId) this.sessionId = res.session_id;
      
      this.turns.push({ role: 'ai', content: res?.answer || '[no answer]' });
      const last = this.turns.length - 1;
      this.turns[last].html = this.toHtml(this.turns[last].content);
      
      // Auto-scroll to bottom
      this.scrollToBottom();
    } finally { 
      this.pending = false; 
    }
  }

  keyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      this.startStream(); 
    }
  }

  async toggleMic() {
    try {
      if (!this.isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.rec = new MediaRecorder(stream);
        this.recChunks = [];
        this.rec.ondataavailable = ev => this.recChunks.push(ev.data);
        this.rec.onstop = async () => {
          const blob = new Blob(this.recChunks, { type: 'audio/webm' });
          const fd = new FormData(); 
          fd.append('audio', blob, 'audio.webm');
          const r: any = await this.http.post(`${this.apiBase}/stt`, fd).toPromise().catch(() => null);
          this.isRecording = false;
          if (r?.text) this.startStreamFromText(r.text);
        };
        this.rec.start();
        this.isRecording = true;
      } else {
        this.rec?.stop();
        this.isRecording = false;
      }
    } catch {
      this.isRecording = false;
    }
  }

  private startStreamFromText(text: string) {
    const q = text.trim(); 
    if (!q) return;
    
    this.turns.push({ role: 'user', content: q });
    this.turns.push({ role: 'ai', content: '' });
    
    const es = this.api.streamChat(q, this.sessionId);
    es.onmessage = (ev) => this.zone.run(() => { 
      this.turns[this.turns.length - 1].content += ev.data; 
      this.scheduleRender();
      this.scrollToBottom();
    });
    es.addEventListener('done', (ev: MessageEvent) => { 
      this.zone.run(() => { 
        if (!this.sessionId) this.sessionId = ev.data; 
      }); 
      es.close(); 
    });
    es.onerror = () => es.close();
  }

  async speak(text: string, idx?: number) {
    // Toggle if same bubble is already playing
    if (this.currentAudio && !this.currentAudio.paused && this.speakingIndex === idx) {
      this.currentAudio.pause();
      this.currentAudio = undefined;
      this.speakingIndex = null;
      return;
    }
    
    this.speakingIndex = typeof idx === 'number' ? idx : null;
    const expected = this.speakingIndex;
    
    try {
      const blob = await this.http.post(`${this.apiBase}/tts`, { text }, { responseType: 'blob' }).toPromise();
      if (this.speakingIndex !== expected) return;
      if (!blob) throw new Error('tts-failed');
      
      const url = URL.createObjectURL(blob as Blob);
      const audio = new Audio(url);
      this.currentAudio = audio;
      audio.onended = () => { 
        this.speakingIndex = null; 
        this.currentAudio = undefined; 
      };
      audio.play();
    } catch {
      if (this.speakingIndex === expected) { 
        this.speakingIndex = null; 
      }
    }
  }

  startStream() {
    const q = this.input.nativeElement.value.trim();
    if (!q) return;
    
    this.input.nativeElement.value = '';
    this.turns.push({ role: 'user', content: q });
    this.turns.push({ role: 'ai', content: '' });
    
    const es = this.api.streamChat(q, this.sessionId);
    es.onmessage = (ev) => {
      this.zone.run(() => { 
        this.turns[this.turns.length - 1].content += ev.data; 
        this.scheduleRender();
        this.scrollToBottom();
      });
    };
    es.addEventListener('done', (ev: MessageEvent) => {
      this.zone.run(() => { 
        if (!this.sessionId) this.sessionId = ev.data; 
      });
      const last = this.turns.length - 1;
      this.zone.run(() => { 
        this.turns[last].html = this.toHtml(this.turns[last].content); 
      });
      es.close();
    });
    es.onerror = () => es.close();
  }

  private toHtml(md: string): string {
    md = this.normalizeMarkdown(md);
    const raw = marked.parse(md, { breaks: true }) as string;
    const purify: any = (DOMPurify as any).default || (DOMPurify as any);
    return purify.sanitize(raw);
  }

  private normalizeMarkdown(md: string): string {
    // Ensure a newline before numbered items
    md = md.replace(/([^\n])(\d+\.\s)/g, '$1\n$2');
    // Ensure a newline before bullets
    md = md.replace(/([^\n])(\-\s)/g, '$1\n$2');
    // Convert unicode bullet to markdown list
    md = md.replace(/^\s*•\s+/gm, '- ');
    // After a colon directly followed by list, add a break
    md = md.replace(/:\s*(?=(\d+\.|\-\s))/g, ':\n');
    // Split concatenated sentences in numbered items
    md = md.replace(/(^\s*\d+\.\s[^\n]*?)(?=(These|This|Those|The|Our|We|Advantis)[A-Za-z])/gm, '$1\n');
    md = md.replace(/^(\s*\d+\.\s+[A-Za-z]*[a-z])([A-Z])/gm, '$1\n$2');
    // Split concatenated sentences in bullet items
    md = md.replace(/(^\s*[-*+]\s[^\n]*?)(?=(These|This|Those|The|Our|We|Advantis)[A-Za-z])/gm, '$1\n');
    md = md.replace(/^(\s*[-*+]\s+[A-Za-z]*[a-z])([A-Z])/gm, '$1\n$2');
    return md;
  }

  private scheduleRender() {
    if (this.renderTimer) return;
    this.renderTimer = setTimeout(() => {
      const last = this.turns.length - 1;
      if (last >= 0) { 
        this.turns[last].html = this.toHtml(this.turns[last].content); 
      }
      this.renderTimer = undefined;
    }, 80);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  adjustTextareaHeight(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Prevent clicks from bubbling up to parent window
    event.stopPropagation();
  }
}
