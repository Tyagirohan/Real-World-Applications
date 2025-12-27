# 🧮 Expression Evaluator

> **Day 4 of Real-World Applications** | Scientific calculator powered by Shunting Yard algorithm!

## 🎯 Project Overview

A fully functional scientific calculator that uses the **Shunting Yard algorithm** to parse and evaluate mathematical expressions. Watch step-by-step how expressions are converted from infix to postfix notation and evaluated!

**[🚀 Live Demo](#)** | **[📖 View Code](https://github.com/Tyagirohan/Real-World-Applications/tree/main/day04-expression-evaluator)**

## ✨ Features

### 🔢 Scientific Calculator
- Basic operations: +, −, ×, ÷
- Advanced operations: Powers (x²)
- Trigonometric functions: sin, cos, tan
- Other functions: √ (square root), log
- Constants: π (pi), e (Euler's number)
- Parentheses for grouping

### 🧠 Algorithm Visualization
**Three interactive tabs:**

1. **📝 Step-by-Step Evaluation**
   - See each step of postfix evaluation
   - Watch stack operations in action
   - Follow token processing

2. **📚 Stack Visualization**
   - Shunting Yard algorithm states
   - Operator stack changes
   - Output queue building

3. **🔄 Infix ↔ Postfix Conversion**
   - Side-by-side notation comparison
   - Operator precedence table
   - See the transformation!

### ⌨️ User-Friendly Interface
- ✅ **Button-based input** - Click to build expressions
- ✅ **Keyboard support** - Type naturally
- ✅ **Quick examples** - Try preset expressions
- ✅ **Real-time display** - See your input and result
- ✅ **Error handling** - Clear error messages

## 🧠 Algorithm Deep Dive

### Shunting Yard Algorithm

Invented by **Edsger Dijkstra** in 1961! Named after railroad shunting yards where trains are reorganized.

**Purpose:** Convert **infix notation** (human-readable) to **postfix notation** (computer-friendly)

### Infix vs Postfix

| Notation | Example | Description |
|----------|---------|-------------|
| **Infix** | 2 + 3 × 4 | Operators between operands (human-readable) |
| **Postfix (RPN)** | 2 3 4 × + | Operators after operands (no parentheses needed!) |

### Why Postfix?

**Postfix is easier for computers:**
- No parentheses needed
- No operator precedence ambiguity
- Can be evaluated in **one left-to-right pass** with a stack
- Simple and efficient!

### Algorithm Steps

**Converting Infix → Postfix:**

```javascript
1. Read token from infix expression
2. If number → add to output queue
3. If operator → 
   - Pop operators with higher/equal precedence from stack
   - Push to output
   - Push current operator to stack
4. If ( → push to stack
5. If ) → pop until (, output all operators
6. End → pop all remaining operators to output
```

**Evaluating Postfix:**

```javascript
1. Create empty stack
2. Read token left-to-right
3. If number → push to stack
4. If operator → 
   - Pop 2 values
   - Apply operator
   - Push result
5. Final stack value = result
```

### Example: (2 + 3) × 4

**Step 1: Infix → Postfix**

| Token | Stack | Output | Action |
|-------|-------|--------|--------|
| ( | ( | | Push to stack |
| 2 | ( | 2 | To output |
| + | ( + | 2 | Push operator |
| 3 | ( + | 2 3 | To output |
| ) | | 2 3 + | Pop until ( |
| × | × | 2 3 + | Push operator |
| 4 | × | 2 3 + 4 | To output |
| END | | 2 3 + 4 × | Pop all |

**Result:** `2 3 + 4 ×` (postfix)

**Step 2: Evaluate Postfix**

| Token | Stack | Calculation |
|-------|-------|-------------|
| 2 | [2] | - |
| 3 | [2, 3] | - |
| + | [5] | 2 + 3 = 5 |
| 4 | [5, 4] | - |
| × | [20] | 5 × 4 = 20 |

**Final Result:** **20** ✅

### Operator Precedence

| Operator | Precedence | Associativity | Example |
|----------|------------|---------------|---------|
| ( ) | Highest | - | (2 + 3) |
| ^ | 4 | Right | 2 ^ 3 |
| * / | 3 | Left | 3 × 4 |
| + - | 2 | Left | 2 + 3 |

## 🌟 Real-World Applications

This algorithm powers:

- **🖥️ Compilers** - Parse expressions in C, Java, Python, etc.
- **🧮 Calculators** - Every scientific calculator uses this!
- **📊 Spreadsheets** - Excel, Google Sheets formula evaluation
- **🔧 Config Parsers** - Evaluate math in JSON, YAML
- **🎮 Game Engines** - Damage calculations, physics
- **🤖 Interpreters** - JavaScript, Python expression parsing

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No frameworks!
- **HTML5 & CSS3** - Beautiful UI
- **Stack Data Structure** - Core algorithm
- **Shunting Yard Algorithm** - Infix to postfix conversion

## 📖 Key Learnings

### Data Structures
- ✅ Stack (LIFO) - Operator stack
- ✅ Queue (FIFO) - Output queue
- ✅ Token parsing

### Algorithms
- ✅ Shunting Yard algorithm
- ✅ Postfix evaluation
- ✅ Operator precedence handling
- ✅ Expression parsing

### Concepts
- ✅ Infix, Prefix, Postfix notations
- ✅ Operator associativity (left/right)
- ✅ Function call handling
- ✅ Tokenization

## 🎮 How to Use

### Using the Calculator

1. **Click buttons** or **type** to enter expression
2. **Press =** (or Enter key) to evaluate
3. **See result** appear instantly
4. **View visualization** in tabs

### Try These Examples

Click the quick example buttons:
- `2 + 3 × 4` = 14 (precedence demo)
- `(2 + 3) × 4` = 20 (parentheses demo)
- `2³ + 5` = 13 (power demo)
- `sin(45) + cos(45)` ≈ 1.41 (trig demo)
- `√16 × 3` = 12 (function demo)

### Keyboard Shortcuts

- **Enter** - Evaluate expression
- **Backspace** - Delete last character
- **Escape** - Clear all
- **0-9, +, -, *, /, ^, (, ), .** - Type directly

### Explore Tabs

- **📝 Step-by-Step** - See evaluation process
- **📚 Stack Visualization** - Watch Shunting Yard work
- **🔄 Infix → Postfix** - See notation conversion

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Tyagirohan/Real-World-Applications.git

# Navigate to project
cd Real-World-Applications/day04-expression-evaluator

# Open in browser
# Just open index.html - no build needed!
```

## 🎨 UI Highlights

- **Orange/Pink gradient theme** (calculator-inspired)
- **Dark display** like real calculators
- **Responsive button grid**
- **Animated tab switching**
- **Detailed step visualization**

## 💡 Fun Facts

### 🚂 Why "Shunting Yard"?
Dijkstra named it after railroad shunting yards! Just like trains are reorganized by moving between tracks, operators move between stacks to create the correct order.

### 🧮 HP Calculators
HP's famous RPN calculators use postfix directly! Power users love it because:
- Faster to use (no = key!)
- No ambiguity
- Natural for complex calculations

### ⚡ One Pass
The Shunting Yard algorithm converts infix to postfix in **one single pass** (O(n) time). No need to look ahead or backtrack!

### 🏆 Dijkstra's Legacy
The same Dijkstra who created:
- Dijkstra's shortest path algorithm
- Semaphores
- Structured programming concepts

## 🧮 Supported Operations

### Basic Operators
- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `^` Power (exponentiation)

### Functions
- `sin(x)` Sine (degrees)
- `cos(x)` Cosine (degrees)
- `tan(x)` Tangent (degrees)
- `sqrt(x)` Square root
- `log(x)` Logarithm base 10

### Constants
- `pi` (π) ≈ 3.14159...
- `e` (Euler's number) ≈ 2.71828...

## 💡 Future Enhancements

Possible additions:
- More functions (sinh, cosh, factorial, etc.)
- Variables support (x, y, z)
- Derivative calculator
- Graph plotting
- History/memory functions

## 🤝 Contributing

Found a bug or want to add features? PRs welcome!

## 📄 License

MIT License - feel free to use for learning!

---

**Built with ❤️ by [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)**

*Part of the #RealWorldApplications series - Building practical projects with algorithms!*

[← Day 3: Maze Solver](../day03-maze-solver) | [Day 5: Image Compressor →](#)

