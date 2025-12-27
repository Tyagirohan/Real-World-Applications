# 📝 Code Diff Visualizer

> **Day 1 of Real-World Applications** | See code changes like Git - powered by LCS Algorithm!

## 🎯 Project Overview

A powerful code difference visualizer that shows exactly what changed between two versions of code, just like Git diff! Built from scratch using the **Longest Common Subsequence (LCS)** algorithm and **Dynamic Programming**.

**[🚀 Live Demo](https://tyagirohan.github.io/Real-World-Applications/day01-code-diff/)** | **[📖 View Code](https://github.com/Tyagirohan/Real-World-Applications/tree/main/day01-code-diff)**

## ✨ Features

### 🔍 Three Viewing Modes
- **Side-by-Side View**: Compare code versions next to each other
- **Unified View**: Git-style unified diff with +/- indicators
- **LCS Algorithm View**: See the DP table and algorithm in action

### 🎨 Smart Diff Detection
- ✅ **Additions** highlighted in green
- ✅ **Deletions** highlighted in red
- ✅ **Unchanged** lines shown in white
- ✅ Line-by-line comparison

### ⚙️ Customization Options
- Ignore whitespace differences
- Case-insensitive comparison
- Toggle line numbers on/off
- Swap versions instantly

### 📊 Diff Statistics
- **Additions Count**: Lines added
- **Deletions Count**: Lines removed
- **Changes Count**: Modified lines
- **Similarity %**: How similar are the files
- **Edit Distance**: Minimum edits needed

### 📚 Quick Examples
Pre-loaded examples for:
- Function refactoring (JavaScript)
- HTML structure changes
- JSON configuration updates
- CSS styling modifications

## 🧠 Algorithm Deep Dive

### Longest Common Subsequence (LCS)

The core algorithm that makes diff possible:

```javascript
function computeLCS(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill(0)
        .map(() => Array(n + 1).fill(0));
    
    // Build DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (arr1[i-1] === arr2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // Backtrack to find LCS...
    return { lcs, dp };
}
```

### How It Works

1. **Split Into Lines**: Break both code versions into line arrays
2. **Build DP Table**: Compute LCS length for all prefixes
3. **Backtrack**: Find actual common lines
4. **Generate Diff**: Lines not in LCS = additions or deletions

### Complexity Analysis

- **Time Complexity**: O(m × n) where m, n = number of lines
- **Space Complexity**: O(m × n) for DP table
- **Optimization**: Can be reduced to O(min(m,n)) space

## 🌟 Real-World Applications

This exact algorithm is used in:

- **🐙 Git/SVN/Mercurial** - Version control systems
- **📝 Google Docs/Notion** - Collaborative editing
- **🔍 GitHub/GitLab** - Pull request reviews
- **📚 Legal/Academic** - Document comparison
- **🧬 Bioinformatics** - DNA sequence alignment
- **🗣️ Plagiarism Detection** - Content similarity

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No frameworks!
- **HTML5 & CSS3** - Modern, responsive UI
- **Dynamic Programming** - LCS algorithm
- **Canvas-free** - Pure DOM manipulation

## 📖 Key Learnings

### Data Structures & Algorithms
- ✅ Longest Common Subsequence (LCS)
- ✅ Edit Distance (Levenshtein)
- ✅ Dynamic Programming tables
- ✅ Backtracking through DP solutions

### Software Engineering
- ✅ Class-based architecture
- ✅ Separation of concerns (Algorithm vs UI)
- ✅ Event-driven programming
- ✅ Real-time diff computation

### Problem Solving
- ✅ String comparison algorithms
- ✅ Efficient change detection
- ✅ Multiple view rendering
- ✅ User experience optimization

## 🎮 How to Use

1. **Load an Example**: Click a "Quick Example" button
2. **Or Paste Your Code**: Enter original and modified code
3. **Compare**: Click "🔍 Compare Code"
4. **Explore Views**: Switch between Side-by-Side, Unified, and LCS Table
5. **Customize**: Toggle options like "Ignore Whitespace"
6. **Analyze**: Check diff statistics

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Tyagirohan/Real-World-Applications.git

# Navigate to project
cd Real-World-Applications/day01-code-diff

# Open in browser
# Just open index.html - no build needed!
```

## 🎨 UI Highlights

- **Dark code editor theme** for comfortable viewing
- **Smooth animations** on all interactions
- **Gradient accents** (green theme)
- **Responsive grid layout** for all screen sizes
- **Syntax-aware** line rendering

## 💡 Future Enhancements

Possible additions:
- Syntax highlighting per language
- Word-level diff (not just line-level)
- Export diff as patch file
- Integration with GitHub API
- Merge conflict resolution UI

## 🤝 Contributing

Found a bug or want to add features? PRs welcome!

## 📄 License

MIT License - feel free to use for learning!

---

**Built with ❤️ by [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)**

*Part of the #RealWorldApplications series - Building practical projects with algorithms!*

[← Previous Series](https://github.com/Tyagirohan/Algorithms-in-Action) | [Next Project →](#)

