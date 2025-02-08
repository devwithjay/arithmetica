class Calculator {
  constructor() {
    this.initializeDOM();
    this.initializeTheme();
    this.attachEventListeners();
  }

  initializeDOM() {
    this.lightToggle = document.querySelector('.sun');
    this.darkToggle = document.querySelector('.moon');
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  attachEventListeners() {
    this.lightToggle.addEventListener('click', () => this.setTheme('light'));
    this.darkToggle.addEventListener('click', () => this.setTheme('dark'));
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
