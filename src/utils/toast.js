/**
 * Simple toast notification utility
 * This is a basic implementation - in production, consider using a library like react-toastify
 */

class ToastNotification {
  constructor() {
    this.container = null;
  }

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    toast.style.cssText = `
      padding: 16px 20px;
      border-radius: 8px;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
      max-width: 500px;
    `;

    const bgColor = colors[type] || colors.info;
    if (bgColor === 'bg-green-500') toast.style.backgroundColor = '#10b981';
    else if (bgColor === 'bg-red-500') toast.style.backgroundColor = '#ef4444';
    else if (bgColor === 'bg-yellow-500') toast.style.backgroundColor = '#f59e0b';
    else toast.style.backgroundColor = '#3b82f6';

    toast.textContent = message;
    this.container.appendChild(toast);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    if (!document.getElementById('toast-animation-style')) {
      style.id = 'toast-animation-style';
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (this.container && this.container.contains(toast)) {
          this.container.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  success(message, duration) {
    this.show(message, 'success', duration);
  }

  error(message, duration) {
    this.show(message, 'error', duration);
  }

  warning(message, duration) {
    this.show(message, 'warning', duration);
  }

  info(message, duration) {
    this.show(message, 'info', duration);
  }
}

const toast = new ToastNotification();

export default toast;
