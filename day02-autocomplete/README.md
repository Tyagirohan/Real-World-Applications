# 🔍 Autocomplete Engine

> **Day 2 of Real-World Applications** | Real-time search suggestions powered by Trie!

## 🎯 Project Overview

A lightning-fast autocomplete engine that provides instant search suggestions as you type, just like Google Search! Built from scratch using the **Trie (Prefix Tree)** data structure for O(k) lookup time.

**[🚀 Live Demo](#)** | **[📖 View Code](https://github.com/Tyagirohan/Real-World-Applications/tree/main/day02-autocomplete)**

## ✨ Features

### ⚡ Real-Time Suggestions
- Type and see instant suggestions appear
- O(k) search time - independent of dictionary size!
- Supports millions of words with same speed

### 🎨 Smart Features
- ✅ **Frequency-based ranking** - Popular words appear first
- ✅ **Case sensitivity toggle** - Flexible matching
- ✅ **Configurable max suggestions** - Control result count
- ✅ **Performance tracking** - See search speed in real-time

### 📚 Dictionary Management
- Add custom words with frequency
- Pre-loaded datasets:
  - Programming Languages
  - Algorithms & Data Structures
  - World Cities
  - Tech Companies
- Export dictionary as JSON
- Clear and rebuild dictionary

### 🌳 Three Visualization Modes
1. **Trie Structure** - See the prefix tree visualization
2. **Word List** - Browse all dictionary words
3. **Performance Metrics** - Track speed and efficiency

### 📊 Performance Analytics
- **Average Search Time** - Real-time speed tracking
- **Memory Efficiency** - Prefix sharing savings
- **Hit Rate** - Successful match percentage
- **Trie vs Array Comparison** - See the difference!

## 🧠 Algorithm Deep Dive

### Trie (Prefix Tree)

A tree where each path from root to a node represents a word prefix. Common prefixes share nodes!

```javascript
class TrieNode {
    constructor(char = '') {
        this.char = char;
        this.children = new Map();
        this.isEndOfWord = false;
        this.frequency = 0;
        this.word = '';
    }
}

class Trie {
    insert(word, frequency = 1) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode(char));
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
        node.frequency += frequency;
        node.word = word;
    }
    
    search(prefix) {
        let node = this.root;
        // Navigate to prefix (O(k))
        for (const char of prefix) {
            if (!node.children.has(char)) return [];
            node = node.children.get(char);
        }
        
        // Collect all words from here (DFS)
        const results = [];
        this.dfs(node, results);
        
        // Sort by frequency
        results.sort((a, b) => b.frequency - a.frequency);
        return results;
    }
}
```

### How It Works

1. **Build the Trie**: Insert all dictionary words. Each character becomes a node.
2. **Navigate to Prefix**: User types "alg" → traverse 'a' → 'l' → 'g' (O(3) time!)
3. **Collect Words**: DFS from prefix node to find all matching words
4. **Rank Results**: Sort by frequency, return top N

### Complexity Analysis

| Operation | Trie | Array (Linear) | Winner |
|-----------|------|----------------|--------|
| Search | **O(k)** | O(n × k) | 🏆 Trie |
| Prefix Match | **O(k + m)** | O(n × k) | 🏆 Trie |
| Insert | **O(k)** | O(1) | 🏆 Trie* |
| Space | O(ALPHABET × N × k) | **O(N × k)** | 🏆 Array |

**k** = word length, **n** = dictionary size, **m** = matches found

*Trie excels at prefix searches, making it ideal for autocomplete!*

## 🌟 Real-World Applications

This exact algorithm powers:

- **🔍 Google Search** - Instant search suggestions
- **💻 IDE Autocomplete** - VS Code, IntelliJ variable suggestions
- **📱 Phone Contacts** - Quick name lookup
- **🗺️ Google Maps** - Address autocomplete
- **🛒 Amazon/eBay** - Product search suggestions
- **📧 Gmail** - Recipient name suggestions

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No frameworks!
- **HTML5 & CSS3** - Modern UI
- **Trie Data Structure** - O(k) lookups
- **DFS Algorithm** - Word collection

## 📖 Key Learnings

### Data Structures
- ✅ Trie (Prefix Tree) implementation
- ✅ Tree traversal (DFS)
- ✅ Map/HashMap for children storage
- ✅ Node-based data structures

### Algorithms
- ✅ Prefix matching in O(k) time
- ✅ DFS for word collection
- ✅ Frequency-based ranking
- ✅ Memory optimization via prefix sharing

### Software Engineering
- ✅ Real-time search implementation
- ✅ Performance tracking
- ✅ Event-driven UI
- ✅ Data export/import

## 🎮 How to Use

### Try the Search
1. **Start typing** in the search box (e.g., "java")
2. **See instant suggestions** appear
3. **Click a suggestion** or press Enter
4. **Check the search time** - milliseconds!

### Add Custom Words
1. Type a word in "Add Words" section
2. Set frequency (how popular it is)
3. Click "Add Word"
4. Search for it!

### Explore Visualizations
- **Trie Structure tab**: See how words share prefixes
- **Word List tab**: Browse all dictionary words
- **Performance tab**: Track speed and efficiency

### Load Preset Dictionaries
- Click any "Quick Load" button
- Dictionary loads instantly
- Start searching!

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Tyagirohan/Real-World-Applications.git

# Navigate to project
cd Real-World-Applications/day02-autocomplete

# Open in browser
# Just open index.html - no build needed!
```

## 🎨 UI Highlights

- **Purple gradient theme** (Google-inspired colors)
- **Real-time suggestions dropdown** with smooth animations
- **Performance badges** showing live stats
- **3-tab visualization** system
- **Responsive design** for all devices

## 💡 Why Trie?

**Example**: Search "algorithm" in 1 million words

- **Array approach**: Check all 1M words → O(1M × 9) = **9M operations** 😱
- **Trie approach**: Follow 9 characters → O(9) = **9 operations** ⚡

**That's 1 million times faster!**

## 📊 Memory Efficiency

Tries save memory through **prefix sharing**:

- Words: `["algorithm", "algebra", "alpha"]`
- **Array storage**: 9 + 7 + 5 = **21 characters**
- **Trie storage**: Common prefix "al" shared = **15 characters**
- **Savings**: 28.5%!

## 💡 Future Enhancements

Possible additions:
- Fuzzy matching (typo tolerance)
- Multi-language support
- Voice input integration
- History tracking
- Cache for frequent searches

## 🤝 Contributing

Found a bug or want to add features? PRs welcome!

## 📄 License

MIT License - feel free to use for learning!

---

**Built with ❤️ by [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)**

*Part of the #RealWorldApplications series - Building practical projects with algorithms!*

[← Day 1: Code Diff](../day01-code-diff) | [Day 3: Maze Solver →](#)

