/**
 * AIDA Chatbot Widget Embed Script
 * This script creates a floating chatbot button and iframe for embedding into third-party websites
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    widgetUrl: 'https://your-vercel-app.vercel.app/widget', // Replace with your actual Vercel URL
    buttonText: 'Chat with AIDA',
    buttonColor: '#2E008B',
    buttonHoverColor: '#00B7F1',
    position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    zIndex: 999999,
    width: '380px',
    height: '600px',
    maxHeight: '80vh'
  };

  // Override config with custom attributes if provided
  const script = document.currentScript;
  if (script) {
    CONFIG.widgetUrl = script.getAttribute('data-widget-url') || CONFIG.widgetUrl;
    CONFIG.buttonText = script.getAttribute('data-button-text') || CONFIG.buttonText;
    CONFIG.buttonColor = script.getAttribute('data-button-color') || CONFIG.buttonColor;
    CONFIG.position = script.getAttribute('data-position') || CONFIG.position;
    CONFIG.width = script.getAttribute('data-width') || CONFIG.width;
    CONFIG.height = script.getAttribute('data-height') || CONFIG.height;
  }

  // Create styles
  const createStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .aida-chat-widget {
        position: fixed;
        ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        z-index: ${CONFIG.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .aida-chat-button {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, ${CONFIG.buttonColor}, ${CONFIG.buttonHoverColor});
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(46, 0, 139, 0.3);
        transition: all 0.3s ease;
        border: none;
        color: white;
        font-size: 24px;
      }

      .aida-chat-button:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 40px rgba(46, 0, 139, 0.4);
      }

      .aida-chat-button:active {
        transform: scale(0.95);
      }

      .aida-chat-iframe {
        width: ${CONFIG.width};
        height: ${CONFIG.height};
        max-height: ${CONFIG.maxHeight};
        border: none;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        background: white;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }

      .aida-chat-iframe.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .aida-chat-iframe.hidden {
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
      }

      @media (max-width: 480px) {
        .aida-chat-iframe {
          width: calc(100vw - 40px);
          height: calc(100vh - 40px);
          max-height: none;
          ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        }
      }

      .aida-notification-dot {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 12px;
        height: 12px;
        background: #ff4757;
        border-radius: 50%;
        border: 2px solid white;
        animation: aida-pulse 2s infinite;
      }

      @keyframes aida-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  };

  // Create the widget
  const createWidget = () => {
    const widget = document.createElement('div');
    widget.className = 'aida-chat-widget';

    // Create button
    const button = document.createElement('button');
    button.className = 'aida-chat-button';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
        <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="currentColor"/>
      </svg>
    `;
    button.title = CONFIG.buttonText;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'aida-chat-iframe';
    iframe.src = CONFIG.widgetUrl;
    iframe.allow = 'microphone; camera';
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';

    // Add notification dot (initially hidden)
    const notificationDot = document.createElement('div');
    notificationDot.className = 'aida-notification-dot';
    notificationDot.style.display = 'none';
    button.appendChild(notificationDot);

    // Toggle functionality
    let isOpen = false;
    const toggleChat = () => {
      isOpen = !isOpen;
      if (isOpen) {
        iframe.classList.remove('hidden');
        iframe.classList.add('visible');
        button.style.display = 'none';
        // Hide notification dot when opened
        notificationDot.style.display = 'none';
      } else {
        iframe.classList.remove('visible');
        iframe.classList.add('hidden');
        setTimeout(() => {
          if (!isOpen) {
            button.style.display = 'flex';
          }
        }, 300);
      }
    };

    button.addEventListener('click', toggleChat);

    // Listen for messages from iframe to close chat
    window.addEventListener('message', (event) => {
      if (event.origin !== new URL(CONFIG.widgetUrl).origin) return;
      
      if (event.data === 'aida-close-chat') {
        isOpen = false;
        iframe.classList.remove('visible');
        iframe.classList.add('hidden');
        setTimeout(() => {
          button.style.display = 'flex';
        }, 300);
      } else if (event.data === 'aida-new-message') {
        // Show notification dot when there's a new message
        if (!isOpen) {
          notificationDot.style.display = 'block';
        }
      }
    });

    // Close chat when clicking outside
    document.addEventListener('click', (event) => {
      if (isOpen && !widget.contains(event.target)) {
        toggleChat();
      }
    });

    // Close chat on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen) {
        toggleChat();
      }
    });

    widget.appendChild(button);
    widget.appendChild(iframe);
    document.body.appendChild(widget);

    // Show button after a brief delay
    setTimeout(() => {
      button.style.display = 'flex';
    }, 1000);
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createStyles();
      createWidget();
    });
  } else {
    createStyles();
    createWidget();
  }

  // Expose global API for advanced usage
  window.AIDA = {
    open: () => {
      const button = document.querySelector('.aida-chat-button');
      if (button) button.click();
    },
    close: () => {
      const iframe = document.querySelector('.aida-chat-iframe');
      if (iframe && iframe.classList.contains('visible')) {
        iframe.contentWindow.postMessage('aida-close', '*');
      }
    },
    toggle: () => {
      const button = document.querySelector('.aida-chat-button');
      if (button) button.click();
    }
  };

})();
