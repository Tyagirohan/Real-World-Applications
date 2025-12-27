# 🖼️ Image Compressor

> **Day 5 of Real-World Applications** | See how Huffman Coding compresses data!

## 🎯 Project Overview

An interactive data compressor that visualizes the **Huffman Coding algorithm** - the compression technique that powers ZIP, JPEG, MP3, and more! Watch how variable-length encoding reduces file sizes.

**[🚀 Live Demo](#)** | **[📖 View Code](https://github.com/Tyagirohan/Real-World-Applications/tree/main/day05-image-compressor)**

## ✨ Features

### 📝 Text & Image Compression
- **Text Mode**: Compress any text input
- **Image Mode**: Upload and compress images (pixel data)
- **Quick Examples**: Pre-loaded text samples
- Real-time compression statistics

### 🧠 Algorithm Visualization
**Four interactive tabs:**

1. **📊 Frequency Analysis**
   - Visual bar chart of character frequencies
   - See which characters appear most often

2. **🌳 Huffman Tree**
   - Binary tree structure
   - See how nodes merge (greedy algorithm!)

3. **💾 Encoding Table**
   - Variable-length codes for each character
   - Compare with fixed-length ASCII (8 bits)

4. **⚖️ Before vs After**
   - Side-by-side comparison
   - Character-by-character encoding demo

### 📊 Compression Stats
- Original size (bits)
- Compressed size (bits)
- Compression ratio
- Space saved percentage

## 🧠 Algorithm Deep Dive

### Huffman Coding

Invented by **David Huffman** in 1952 as a term paper!

**Key Concepts:**
- **Variable-Length Encoding**: Frequent characters get short codes
- **Prefix-Free**: No code is a prefix of another
- **Greedy Algorithm**: Always merge two least frequent nodes
- **Optimal**: Provably best for character-by-character compression

### How It Works

**Example: "AABBBCCCC"**

**Step 1: Count Frequencies**
- A: 2 (22.2%)
- B: 3 (33.3%)
- C: 4 (44.4%)

**Step 2: Build Tree (Greedy)**
1. Create leaf nodes: [A:2, B:3, C:4]
2. Merge smallest two (A+B): [AB:5, C:4]
3. Merge remaining: [ABC:9]
4. Done! Tree complete.

**Step 3: Assign Codes**
- C (most frequent): `0` (1 bit)
- B: `10` (2 bits)
- A (least frequent): `11` (2 bits)

**Step 4: Encode**
- Original: "AABBBCCCC" = 9 × 8 = 72 bits
- Huffman: "11 11 10 10 10 0 0 0 0" = 14 bits
- **Saved: 80.6%!** 🎉

## 🌟 Real-World Applications

Huffman coding powers:

- **📦 ZIP Files** - DEFLATE algorithm
- **📷 JPEG** - Compresses DCT coefficients
- **🎵 MP3** - Part of audio compression
- **📡 Fax Machines** - CCITT standards
- **📺 Video** - H.264, MPEG entropy coding
- **🌐 GZIP** - Web content compression

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No frameworks!
- **HTML5 Canvas** - Image handling
- **Huffman Coding** - Greedy algorithm
- **Min Heap** - Priority queue for tree building

## 📖 Key Learnings

### Data Structures
- ✅ Binary Tree (Huffman tree)
- ✅ Min Heap (priority queue)
- ✅ HashMap (frequency counting)

### Algorithms
- ✅ Huffman Coding (greedy)
- ✅ Tree traversal (code generation)
- ✅ Bit manipulation

### Concepts
- ✅ Lossless compression
- ✅ Entropy encoding
- ✅ Prefix-free codes
- ✅ Variable-length encoding

## 🎮 How to Use

1. **Choose Mode**: Text or Image
2. **Enter/Upload Data**: Type text or upload image
3. **Click "Compress"**: Watch magic happen!
4. **Explore Tabs**: See frequency, tree, encoding, comparison
5. **Check Stats**: See compression ratio!

### Try These Examples

- `AABBBCCCC` - Simple demo (80%+ compression!)
- `HELLO WORLD` - Common text
- `MISSISSIPPI RIVER` - Repeated letters
- Pangram - Diverse characters

## 🚀 Running Locally

```bash
git clone https://github.com/Tyagirohan/Real-World-Applications.git
cd Real-World-Applications/day05-image-compressor
# Open index.html!
```

## 💡 Fun Facts

### 🎓 MIT Term Paper
David Huffman invented this as a **term paper** for his MIT PhD in 1952! He got an A+ and revolutionized data compression forever.

### 📜 Fax Revolution
Huffman coding made fax machines practical! Before: 6 minutes per page. After: under 1 minute!

### ⚡ Provably Optimal
Huffman proved his algorithm **always produces optimal prefix-free codes**! You can't beat it for symbol-by-symbol compression.

## 🧮 Complexity Analysis

- **Build Tree**: O(n log n) - heap operations
- **Encode**: O(n) - linear scan
- **Decode**: O(n) - tree traversal
- **Space**: O(n) - tree storage

## 💡 Future Enhancements

- Adaptive Huffman coding
- Arithmetic coding comparison
- File download
- LZ77 + Huffman (DEFLATE)
- Real JPEG compression

## 🤝 Contributing

Found a bug? PRs welcome!

## 📄 License

MIT License - use for learning!

---

**Built with ❤️ by [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)**

*Part of #RealWorldApplications series!*

[← Day 4: Expression Evaluator](../day04-expression-evaluator) | [Day 6: Load Balancer →](#)

