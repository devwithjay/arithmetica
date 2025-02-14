class Calculator {
  constructor() {
    this.displayString = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetDisplay = false;

    this.initializeDOM();
    this.initializeTheme();
    this.attachEventListeners();
  }

  initializeDOM() {
    this.display = document.querySelector('.current-op');
    this.previousDisplay = document.querySelector('.previous-op');
    this.lightToggle = document.querySelector('.sun');
    this.darkToggle = document.querySelector('.moon');
    this.numberButtons = document.querySelectorAll('.button');
    this.clearButton = document.querySelector('.control');
    this.deleteButton = document.querySelector('.del');
    this.toggleSignButton = document.querySelector('.control:nth-child(2)');
    this.operationButtons = document.querySelectorAll('.arithmetic');
    this.equalsButton = document.querySelector('.arithmetic:last-child');
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

    this.operationButtons.forEach(button => {
      if (button.textContent !== '=') {
        button.addEventListener('click', () =>
          this.chooseOperation(button.textContent),
        );
      }
    });

    this.equalsButton.addEventListener('click', () => this.compute());
    document.addEventListener('keydown', event =>
      this.handleKeyboardInput(event),
    );
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

  getOperatorPrecedence = op => {
    const precedence = {
      '+': 1,
      '-': 1,
      '×': 2,
      '÷': 2,
      '%': 2,
    };
    return precedence[op] || 0;
  };

  applyOperation = (a, b, op) => {
    const operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '×': (a, b) => a * b,
      '÷': (a, b) => {
        if (b === 0) throw new Error('Division by zero');
        return Number.isInteger(a / b) ? a / b : Number((a / b).toFixed(6));
      },
      '%': (a, b) => {
        if (b === 0) {
          alert('Modulo by zero is undefined');
          return null;
        }
        return a % b;
      },
    };

    try {
      return operations[op](a, b);
    } catch (error) {
      alert(error.message);
      return null;
    }
  };

  evaluateExpression = expression => {
    const tokens = expression.split(' ').filter(token => token !== '');
    const values = [];
    const operators = [];

    const processOperator = () => {
      const b = values.pop();
      const a = values.pop();
      const op = operators.pop();
      const result = this.applyOperation(a, b, op);
      if (result === null) return null;
      values.push(result);
    };

    for (const token of tokens) {
      if (!isNaN(token)) {
        values.push(parseFloat(token));
      } else {
        while (
          operators.length > 0 &&
          this.getOperatorPrecedence(operators[operators.length - 1]) >=
            this.getOperatorPrecedence(token)
        ) {
          if (processOperator() === null) return null;
        }
        operators.push(token);
      }
    }

    while (operators.length > 0) {
      if (processOperator() === null) return null;
    }

    return values[0];
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

  chooseOperation = op => {
    if (this.displayString === '') return;

    const parts = this.displayString.trim().split(' ');
    const lastPart = parts[parts.length - 1];

    if (['+', '-', '×', '÷', '%'].includes(lastPart)) {
      parts[parts.length - 1] = op;
      this.displayString = parts.join(' ') + ' ';
    } else {
      this.displayString += ` ${op} `;
    }

    this.operation = op;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  };

  compute = () => {
    if (this.displayString.endsWith(' ') || this.displayString.trim() === '') {
      return;
    }

    const result = this.evaluateExpression(this.displayString);
    if (result !== null) {
      this.previousOperand = this.displayString;
      this.displayString = result.toString();
      this.operation = undefined;
      this.shouldResetDisplay = true;
    }
    this.updateDisplay();
  };

  clear() {
    this.displayString = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.textContent = this.displayString;
    this.previousDisplay.textContent = this.previousOperand;

    this.display.scrollLeft = this.display.scrollWidth;
  }

  handleKeyboardInput(event) {
    const key = event.key;

    if (
      (key >= '0' && key <= '9') ||
      (key >= '0' && key <= '9' && event.code.startsWith('Numpad'))
    ) {
      this.appendNumber(key);
    } else if (key === '.') {
      this.appendNumber('.');
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
      const operatorMap = {
        '*': '×',
        '/': '÷',
      };
      this.chooseOperation(operatorMap[key] || key);
    } else if (key === 'Enter' || key === '=') {
      this.compute();
    } else if (key === 'Backspace') {
      this.delete();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
      this.clear();
    } else if (key.toLowerCase() === 'n') {
      this.toggleSign();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
