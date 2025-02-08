class Calculator {
  constructor() {
    this.displayString = '0';
    this.shouldResetDisplay = false;

    this.initializeDOM();
    this.initializeTheme();
    this.attachEventListeners();
  }

  initializeDOM() {
    this.display = document.querySelector('.current-op');
    this.lightToggle = document.querySelector('.sun');
    this.darkToggle = document.querySelector('.moon');
    this.numberButtons = document.querySelectorAll('.button');
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  attachEventListeners() {
    // Theme toggles
    this.lightToggle.addEventListener('click', () => this.setTheme('light'));
    this.darkToggle.addEventListener('click', () => this.setTheme('dark'));

    // Number and decimal buttons
    this.numberButtons.forEach(button => {
      const value = button.textContent;
      if (!isNaN(value) || value === '.') {
        button.addEventListener('click', () => this.appendNumber(value));
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  appendNumber(number) {
    if (this.shouldResetDisplay) {
      this.displayString = '';
      this.shouldResetDisplay = false;
    }

    if (this.displayString === '0' && number !== '.') {
      this.displayString = number;
    } else if (number === '.' && this.displayString.includes('.')) {
      return;
    } else {
      this.displayString += number;
    }

    this.updateDisplay();
  }

  updateDisplay() {
    this.display.textContent = this.displayString;
    this.display.scrollLeft = this.display.scrollWidth;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
