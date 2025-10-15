import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = (window as any).API_BASE || 'http://localhost:5000';

  streamChat(question: string, sessionId?: string): EventSource {
    const params = new URLSearchParams({ question, ...(sessionId ? { session_id: sessionId } : {}) });
    return new EventSource(`${this.base}/chat/stream?${params.toString()}`);
  }
}


