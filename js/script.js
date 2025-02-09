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
    this.clearButton = document.querySelector('.control');
    this.deleteButton = document.querySelector('.del');
    this.toggleSignButton = document.querySelector('.control:nth-child(2)');
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  attachEventListeners() {
    this.lightToggle.addEventListener('click', () => this.setTheme('light'));
    this.darkToggle.addEventListener('click', () => this.setTheme('dark'));

    this.numberButtons.forEach(button => {
      const value = button.textContent;
      if (!isNaN(value) || value === '.') {
        button.addEventListener('click', () => this.appendNumber(value));
      }
    });

    this.clearButton.addEventListener('click', () => this.clear());
    this.deleteButton.addEventListener('click', () => this.delete());
    this.toggleSignButton.addEventListener('click', () => this.toggleSign());
  }

  setTheme = theme => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  delete = () => {
    if (this.shouldResetDisplay) {
      this.clear();
      return;
    }

    if (this.displayString.endsWith(' ')) {
      this.displayString = this.displayString.slice(0, -3);
      this.operation = undefined;
    } else {
      this.displayString = this.displayString.slice(0, -1);
    }

    if (this.displayString === '' || this.displayString === '-') {
      this.displayString = '0';
    }

    this.updateDisplay();
  };

  toggleSign = () => {
    if (this.displayString.includes(' ')) {
      const parts = this.displayString.split(' ');
      const lastNumber = parts[parts.length - 1];

      if (lastNumber !== '') {
        parts[parts.length - 1] = (-parseFloat(lastNumber)).toString();
        this.displayString = parts.join(' ');
      }
    } else {
      const currentNumber = parseFloat(this.displayString);
      this.displayString = (-currentNumber).toString();
    }

    this.updateDisplay();
  };

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

  clear() {
    this.displayString = '0';
    this.shouldResetDisplay = false;
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
