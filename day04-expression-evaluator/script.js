// ===================================
// Shunting Yard Algorithm & Expression Evaluator
// ===================================

class ExpressionEvaluator {
    constructor() {
        this.operators = {
            '+': { precedence: 2, associativity: 'left', fn: (a, b) => a + b },
            '-': { precedence: 2, associativity: 'left', fn: (a, b) => a - b },
            '*': { precedence: 3, associativity: 'left', fn: (a, b) => a * b },
            '/': { precedence: 3, associativity: 'left', fn: (a, b) => a / b },
            '^': { precedence: 4, associativity: 'right', fn: (a, b) => Math.pow(a, b) }
        };

        this.functions = {
            'sin': (x) => Math.sin(x * Math.PI / 180),
            'cos': (x) => Math.cos(x * Math.PI / 180),
            'tan': (x) => Math.tan(x * Math.PI / 180),
            'sqrt': (x) => Math.sqrt(x),
            'log': (x) => Math.log10(x)
        };

        this.constants = {
            'pi': Math.PI,
            'e': Math.E
        };

        this.conversionSteps = [];
        this.evaluationSteps = [];
    }

    tokenize(expression) {
        // Replace special characters with standard operators
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        
        const tokens = [];
        let currentNumber = '';
        let currentFunction = '';

        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];

            if (char === ' ') continue;

            // Check for numbers and decimal points
            if (/\d|\./.test(char)) {
                currentNumber += char;
            } else {
                if (currentNumber) {
                    tokens.push({ type: 'number', value: parseFloat(currentNumber) });
                    currentNumber = '';
                }

                // Check for functions or constants
                if (/[a-z]/i.test(char)) {
                    currentFunction += char;
                } else {
                    if (currentFunction) {
                        if (this.constants[currentFunction]) {
                            tokens.push({ type: 'number', value: this.constants[currentFunction] });
                        } else {
                            tokens.push({ type: 'function', value: currentFunction });
                        }
                        currentFunction = '';
                    }

                    // Operators and parentheses
                    if ('+-*/^'.includes(char)) {
                        tokens.push({ type: 'operator', value: char });
                    } else if (char === '(') {
                        tokens.push({ type: 'leftParen', value: char });
                    } else if (char === ')') {
                        tokens.push({ type: 'rightParen', value: char });
                    }
                }
            }
        }

        // Handle remaining number or function/constant
        if (currentNumber) {
            tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        }
        if (currentFunction) {
            if (this.constants[currentFunction]) {
                tokens.push({ type: 'number', value: this.constants[currentFunction] });
            } else {
                tokens.push({ type: 'function', value: currentFunction });
            }
        }

        return tokens;
    }

    // Shunting Yard Algorithm: Infix to Postfix conversion
    infixToPostfix(tokens) {
        const output = [];
        const operatorStack = [];
        this.conversionSteps = [];

        for (const token of tokens) {
            const stepBefore = {
                token: token,
                operatorStack: [...operatorStack],
                output: [...output]
            };

            if (token.type === 'number') {
                output.push(token);
            } else if (token.type === 'function') {
                operatorStack.push(token);
            } else if (token.type === 'operator') {
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1].type !== 'leftParen' &&
                    ((this.operators[operatorStack[operatorStack.length - 1].value]?.precedence > this.operators[token.value].precedence) ||
                    (this.operators[operatorStack[operatorStack.length - 1].value]?.precedence === this.operators[token.value].precedence &&
                    this.operators[token.value].associativity === 'left'))
                ) {
                    output.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token.type === 'leftParen') {
                operatorStack.push(token);
            } else if (token.type === 'rightParen') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'leftParen') {
                    output.push(operatorStack.pop());
                }
                operatorStack.pop(); // Remove left parenthesis

                // If there's a function at the top, pop it to output
                if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'function') {
                    output.push(operatorStack.pop());
                }
            }

            this.conversionSteps.push({
                ...stepBefore,
                operatorStackAfter: [...operatorStack],
                outputAfter: [...output]
            });
        }

        // Pop remaining operators
        while (operatorStack.length > 0) {
            output.push(operatorStack.pop());
        }

        return output;
    }

    // Evaluate postfix expression
    evaluatePostfix(postfixTokens) {
        const stack = [];
        this.evaluationSteps = [];

        for (const token of postfixTokens) {
            const stepBefore = {
                token: token,
                stack: [...stack]
            };

            if (token.type === 'number') {
                stack.push(token.value);
            } else if (token.type === 'operator') {
                const b = stack.pop();
                const a = stack.pop();
                const result = this.operators[token.value].fn(a, b);
                stack.push(result);
                
                this.evaluationSteps.push({
                    ...stepBefore,
                    calculation: `${a} ${token.value} ${b} = ${result}`,
                    stackAfter: [...stack]
                });
            } else if (token.type === 'function') {
                const a = stack.pop();
                const result = this.functions[token.value](a);
                stack.push(result);
                
                this.evaluationSteps.push({
                    ...stepBefore,
                    calculation: `${token.value}(${a}) = ${result}`,
                    stackAfter: [...stack]
                });
            }

            if (token.type === 'number') {
                this.evaluationSteps.push({
                    ...stepBefore,
                    calculation: null,
                    stackAfter: [...stack]
                });
            }
        }

        return stack[0];
    }

    evaluate(expression) {
        try {
            const tokens = this.tokenize(expression);
            const postfix = this.infixToPostfix(tokens);
            const result = this.evaluatePostfix(postfix);

            return {
                success: true,
                result: result,
                infix: expression,
                postfix: postfix.map(t => t.type === 'number' ? t.value : t.value).join(' '),
                conversionSteps: this.conversionSteps,
                evaluationSteps: this.evaluationSteps
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// ===================================
// Calculator UI
// ===================================

class CalculatorUI {
    constructor() {
        this.evaluator = new ExpressionEvaluator();
        this.currentExpression = '';
        this.lastResult = null;

        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Display
        this.expressionDisplay = document.getElementById('expressionDisplay');
        this.resultDisplay = document.getElementById('resultDisplay');

        // Buttons
        this.numberButtons = document.querySelectorAll('.btn-number');
        this.operatorButtons = document.querySelectorAll('.btn-operator');
        this.functionButtons = document.querySelectorAll('.btn-function');
        this.clearBtn = document.getElementById('clearBtn');
        this.backspaceBtn = document.getElementById('backspaceBtn');
        this.equalsBtn = document.getElementById('equalsBtn');
        this.exampleButtons = document.querySelectorAll('.example-btn');

        // Tabs
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Visualization containers
        this.stepsContainer = document.getElementById('stepsContainer');
        this.stacksContainer = document.getElementById('stacksContainer');
        this.infixDisplay = document.getElementById('infixDisplay');
        this.postfixDisplay = document.getElementById('postfixDisplay');
    }

    attachEventListeners() {
        // Number buttons
        this.numberButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.appendToExpression(btn.dataset.value);
            });
        });

        // Operator buttons
        this.operatorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.appendToExpression(btn.dataset.value);
            });
        });

        // Function buttons
        this.functionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                if (value === 'pi' || value === 'e') {
                    this.appendToExpression(value);
                } else if (value === '(' || value === ')') {
                    this.appendToExpression(value);
                } else {
                    this.appendToExpression(value + '(');
                }
            });
        });

        // Clear button
        this.clearBtn.addEventListener('click', () => this.clear());

        // Backspace
        this.backspaceBtn.addEventListener('click', () => this.backspace());

        // Equals
        this.equalsBtn.addEventListener('click', () => this.evaluate());

        // Enter key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.evaluate();
            } else if (e.key === 'Backspace') {
                this.backspace();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (/[0-9+\-*/^().]/.test(e.key)) {
                this.appendToExpression(e.key);
            }
        });

        // Example buttons
        this.exampleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentExpression = btn.dataset.expr;
                this.updateDisplay();
                this.evaluate();
            });
        });

        // Tabs
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    appendToExpression(value) {
        this.currentExpression += value;
        this.updateDisplay();
    }

    backspace() {
        this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateDisplay();
    }

    clear() {
        this.currentExpression = '';
        this.lastResult = null;
        this.updateDisplay();
        this.clearVisualization();
    }

    updateDisplay() {
        this.expressionDisplay.textContent = this.currentExpression || '0';
        if (this.lastResult !== null) {
            this.resultDisplay.textContent = `= ${this.lastResult}`;
        } else {
            this.resultDisplay.textContent = '';
        }
    }

    evaluate() {
        if (!this.currentExpression) return;

        const result = this.evaluator.evaluate(this.currentExpression);

        if (result.success) {
            this.lastResult = result.result.toFixed(6).replace(/\.?0+$/, '');
            this.updateDisplay();
            this.visualizeResult(result);
        } else {
            this.resultDisplay.textContent = 'Error: ' + result.error;
        }
    }

    visualizeResult(result) {
        this.renderEvaluationSteps(result);
        this.renderStackStates(result);
        this.renderConversion(result);
    }

    renderEvaluationSteps(result) {
        this.stepsContainer.innerHTML = '';

        if (result.evaluationSteps.length === 0) {
            this.stepsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🧮</div>
                    <h3>No Steps to Show</h3>
                    <p>The expression was too simple!</p>
                </div>
            `;
            return;
        }

        result.evaluationSteps.forEach((step, index) => {
            const tokenDisplay = step.token.type === 'number' ? 
                step.token.value : step.token.value;
            
            const action = step.calculation ? 
                `Compute: ${step.calculation}` : 
                `Push ${tokenDisplay} to stack`;

            const card = document.createElement('div');
            card.className = 'step-card';
            card.innerHTML = `
                <div class="step-header">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-title">Token: ${tokenDisplay}</div>
                </div>
                <div class="step-content">
                    ${action}<br>
                    Stack: [${step.stackAfter.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ')}]
                </div>
            `;
            this.stepsContainer.appendChild(card);
        });
    }

    renderStackStates(result) {
        this.stacksContainer.innerHTML = '';

        if (result.conversionSteps.length === 0) {
            this.stacksContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No Data Yet</h3>
                    <p>Evaluate an expression to see the stack states!</p>
                </div>
            `;
            return;
        }

        result.conversionSteps.forEach((step, index) => {
            const tokenDisplay = step.token.type === 'number' ? 
                step.token.value : step.token.value;

            const state = document.createElement('div');
            state.className = 'stack-state';
            state.innerHTML = `
                <div class="state-header">
                    Step ${index + 1}: Processing "${tokenDisplay}"
                </div>
                <div class="stack-visual">
                    <div class="stack-column">
                        <h5>Operator Stack</h5>
                        <div class="stack-items">
                            ${step.operatorStackAfter.map(t => 
                                `<div class="stack-item">${t.value}</div>`
                            ).join('') || '<div style="color: #a0aec0; font-size: 0.85rem;">empty</div>'}
                        </div>
                    </div>
                    <div class="stack-column">
                        <h5>Output Queue</h5>
                        <div class="stack-items">
                            ${step.outputAfter.map(t => 
                                `<div class="stack-item">${t.type === 'number' ? t.value : t.value}</div>`
                            ).join('') || '<div style="color: #a0aec0; font-size: 0.85rem;">empty</div>'}
                        </div>
                    </div>
                </div>
            `;
            this.stacksContainer.appendChild(state);
        });
    }

    renderConversion(result) {
        this.infixDisplay.textContent = result.infix;
        this.postfixDisplay.textContent = result.postfix;
    }

    clearVisualization() {
        this.stepsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🧮</div>
                <h3>Enter an Expression</h3>
                <p>Type a math expression and press = to see how it's evaluated!</p>
            </div>
        `;

        this.stacksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>No Data Yet</h3>
                <p>Evaluate an expression to see the stack states!</p>
            </div>
        `;

        this.infixDisplay.textContent = '-';
        this.postfixDisplay.textContent = '-';
    }

    switchTab(tabName) {
        // Update buttons
        this.tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update contents
        this.tabContents.forEach(content => {
            if (content.id === tabName) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
}

// ===================================
// Initialize Application
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new CalculatorUI();
    console.log('🚀 Expression Evaluator loaded!');
    console.log('💡 Try typing a math expression and press = !');
});

