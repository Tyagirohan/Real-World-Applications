// ===================================
// Huffman Coding Algorithm
// ===================================

class HuffmanNode {
    constructor(char, frequency) {
        this.char = char;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }

    isLeaf() {
        return this.left === null && this.right === null;
    }
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(node) {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].frequency >= this.heap[parentIndex].frequency) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length && 
                this.heap[leftChild].frequency < this.heap[smallest].frequency) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length && 
                this.heap[rightChild].frequency < this.heap[smallest].frequency) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    size() {
        return this.heap.length;
    }
}

class HuffmanCoding {
    constructor() {
        this.root = null;
        this.codes = new Map();
        this.frequencies = new Map();
    }

    // Count character frequencies
    buildFrequencyMap(data) {
        this.frequencies.clear();
        
        for (const char of data) {
            this.frequencies.set(char, (this.frequencies.get(char) || 0) + 1);
        }

        return this.frequencies;
    }

    // Build Huffman tree using greedy algorithm
    buildHuffmanTree() {
        const heap = new MinHeap();

        // Create leaf nodes
        for (const [char, freq] of this.frequencies) {
            heap.insert(new HuffmanNode(char, freq));
        }

        // Build tree by merging nodes
        while (heap.size() > 1) {
            const left = heap.extractMin();
            const right = heap.extractMin();

            const parent = new HuffmanNode(null, left.frequency + right.frequency);
            parent.left = left;
            parent.right = right;

            heap.insert(parent);
        }

        this.root = heap.extractMin();
        return this.root;
    }

    // Generate Huffman codes
    generateCodes(node = this.root, code = '') {
        if (!node) return;

        if (node.isLeaf()) {
            this.codes.set(node.char, code || '0');
            return;
        }

        this.generateCodes(node.left, code + '0');
        this.generateCodes(node.right, code + '1');
    }

    // Encode data
    encode(data) {
        let encoded = '';
        for (const char of data) {
            encoded += this.codes.get(char);
        }
        return encoded;
    }

    // Decode data
    decode(encoded) {
        let decoded = '';
        let current = this.root;

        for (const bit of encoded) {
            current = bit === '0' ? current.left : current.right;

            if (current.isLeaf()) {
                decoded += current.char;
                current = this.root;
            }
        }

        return decoded;
    }

    // Compress data
    compress(data) {
        if (!data || data.length === 0) {
            return {
                success: false,
                error: 'No data to compress'
            };
        }

        // Build frequency map
        this.buildFrequencyMap(data);

        // Build Huffman tree
        this.buildHuffmanTree();

        // Generate codes
        this.codes.clear();
        this.generateCodes();

        // Encode data
        const encoded = this.encode(data);

        // Calculate statistics
        const originalBits = data.length * 8; // ASCII = 8 bits per char
        const compressedBits = encoded.length;
        const compressionRatio = ((originalBits - compressedBits) / originalBits * 100).toFixed(2);

        return {
            success: true,
            original: data,
            encoded: encoded,
            originalBits: originalBits,
            compressedBits: compressedBits,
            compressionRatio: compressionRatio,
            spaceSaved: compressionRatio,
            frequencies: new Map(this.frequencies),
            codes: new Map(this.codes),
            tree: this.root
        };
    }
}

// ===================================
// UI Controller
// ===================================

class HuffmanUI {
    constructor() {
        this.huffman = new HuffmanCoding();
        this.currentMode = 'text';
        this.currentResult = null;

        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Mode buttons
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.textMode = document.getElementById('textMode');
        this.imageMode = document.getElementById('imageMode');

        // Inputs
        this.textInput = document.getElementById('textInput');
        this.imageInput = document.getElementById('imageInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.imageCanvas = document.getElementById('imageCanvas');
        this.imagePreview = document.getElementById('imagePreview');

        // Compression options
        this.compressionOptions = document.getElementById('compressionOptions');
        this.useTargetSizeCheckbox = document.getElementById('useTargetSize');
        this.targetSizeInput = document.getElementById('targetSizeInput');
        this.targetSizeKB = document.getElementById('targetSizeKB');
        this.autoCompressBtn = document.getElementById('autoCompressBtn');
        this.manualControls = document.getElementById('manualControls');
        this.imageScaleSlider = document.getElementById('imageScale');
        this.scaleValue = document.getElementById('scaleValue');
        this.colorDepthSlider = document.getElementById('colorDepth');
        this.colorDepthValue = document.getElementById('colorDepthValue');

        // Buttons
        this.compressBtn = document.getElementById('compressBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.exampleButtons = document.querySelectorAll('.example-btn');

        // Image data
        this.originalImage = null;
        this.compressedImageData = null;

        // Stats
        this.originalSize = document.getElementById('originalSize');
        this.compressedSize = document.getElementById('compressedSize');
        this.compressionRatio = document.getElementById('compressionRatio');
        this.spaceSaved = document.getElementById('spaceSaved');
        this.fileSizeKB = document.getElementById('fileSizeKB');

        // Tabs
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Visualization containers
        this.frequencyContainer = document.getElementById('frequencyContainer');
        this.treeContainer = document.getElementById('treeContainer');
        this.encodingContainer = document.getElementById('encodingContainer');
        this.originalData = document.getElementById('originalData');
        this.compressedData = document.getElementById('compressedData');
        this.demoContent = document.getElementById('demoContent');
    }

    attachEventListeners() {
        // Mode switching
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });

        // Upload button
        this.uploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });

        // Image input
        this.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Compression option sliders
        this.imageScaleSlider.addEventListener('input', (e) => {
            this.scaleValue.textContent = e.target.value + '%';
            if (this.originalImage) {
                this.processImage(this.originalImage);
            }
        });

        this.colorDepthSlider.addEventListener('input', (e) => {
            const colors = Math.pow(2, parseInt(e.target.value));
            this.colorDepthValue.textContent = colors + ' colors';
            if (this.originalImage) {
                this.processImage(this.originalImage);
            }
        });

        // Target size toggle
        this.useTargetSizeCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.targetSizeInput.classList.add('active');
                this.manualControls.classList.add('disabled');
            } else {
                this.targetSizeInput.classList.remove('active');
                this.manualControls.classList.remove('disabled');
            }
        });

        // Auto compress button
        this.autoCompressBtn.addEventListener('click', () => this.autoCompressToTarget());

        // Compress button
        this.compressBtn.addEventListener('click', () => this.compress());

        // Download button
        this.downloadBtn.addEventListener('click', () => this.download());

        // Clear button
        this.clearBtn.addEventListener('click', () => this.clear());

        // Example buttons
        this.exampleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                this.textInput.value = text;
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

    switchMode(mode) {
        this.currentMode = mode;

        // Update buttons
        this.modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update display
        if (mode === 'text') {
            this.textMode.classList.add('active');
            this.imageMode.classList.remove('active');
            this.compressionOptions.style.display = 'none';
        } else {
            this.textMode.classList.remove('active');
            this.imageMode.classList.add('active');
            this.compressionOptions.style.display = 'block';
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.processImage(img);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    processImage(img) {
        // Get user settings
        const scale = parseInt(this.imageScaleSlider.value) / 100;
        const colorDepthBits = parseInt(this.colorDepthSlider.value);
        
        // Calculate dimensions
        const maxWidth = 300;
        const scaledWidth = Math.min(maxWidth, img.width * scale);
        const scaledHeight = (img.height / img.width) * scaledWidth;

        // Draw on canvas
        const ctx = this.imageCanvas.getContext('2d');
        this.imageCanvas.width = scaledWidth;
        this.imageCanvas.height = scaledHeight;
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

        // Get and reduce image data
        const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
        const reducedData = this.reduceColorDepth(imageData, colorDepthBits);
        
        // Put reduced data back
        ctx.putImageData(reducedData, 0, 0);
        
        // Convert to string for compression
        this.imageDataString = Array.from(reducedData.data).join(',');
        this.compressedImageData = reducedData;
    }

    reduceColorDepth(imageData, bits) {
        const data = imageData.data;
        const levels = Math.pow(2, bits);
        const step = 256 / levels;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.floor(data[i] / step) * step;     // R
            data[i + 1] = Math.floor(data[i + 1] / step) * step; // G
            data[i + 2] = Math.floor(data[i + 2] / step) * step; // B
            // Keep alpha as is
        }

        return imageData;
    }

    compress() {
        let data;

        if (this.currentMode === 'text') {
            data = this.textInput.value.trim();
            if (!data) {
                alert('⚠️ Please enter some text to compress!');
                return;
            }
        } else {
            if (!this.imageDataString) {
                alert('⚠️ Please upload an image first!');
                return;
            }
            data = this.imageDataString.substring(0, 1000); // Limit for performance
        }

        const result = this.huffman.compress(data);

        if (result.success) {
            this.currentResult = result;
            this.updateStats(result);
            this.visualizeResult(result);
            
            // Enable download button
            this.downloadBtn.disabled = false;
        } else {
            alert('Error: ' + result.error);
        }
    }

    download() {
        if (!this.currentResult) return;

        if (this.currentMode === 'text') {
            // Download compressed text data
            const data = {
                originalText: this.currentResult.original,
                encoded: this.currentResult.encoded,
                codes: Object.fromEntries(this.currentResult.codes),
                compressionRatio: this.currentResult.compressionRatio
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'huffman-compressed.json';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            // Download compressed image
            this.imageCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'compressed-image.png';
                a.click();
                URL.revokeObjectURL(url);
            }, 'image/png');
        }
    }

    updateStats(result) {
        // Calculate sizes in KB
        const originalBytes = result.originalBits / 8;
        const compressedBytes = result.compressedBits / 8;
        const originalKB = (originalBytes / 1024).toFixed(2);
        const compressedKB = (compressedBytes / 1024).toFixed(2);

        // For images, get actual canvas size
        if (this.currentMode === 'image' && this.imageCanvas.width > 0) {
            this.imageCanvas.toBlob((blob) => {
                const actualKB = (blob.size / 1024).toFixed(2);
                this.fileSizeKB.textContent = `${actualKB} KB`;
            }, 'image/png');
        } else {
            this.fileSizeKB.textContent = `${compressedKB} KB`;
        }

        this.originalSize.textContent = `${result.originalBits} bits (${originalKB} KB)`;
        this.compressedSize.textContent = `${result.compressedBits} bits (${compressedKB} KB)`;
        this.compressionRatio.textContent = `${(result.compressedBits / result.originalBits * 100).toFixed(2)}%`;
        this.spaceSaved.textContent = `${result.spaceSaved}% saved`;
    }

    autoCompressToTarget() {
        if (!this.originalImage) {
            alert('⚠️ Please upload an image first!');
            return;
        }

        const targetKB = parseInt(this.targetSizeKB.value);
        if (!targetKB || targetKB < 1) {
            alert('⚠️ Please enter a valid target size!');
            return;
        }

        // Binary search for optimal settings
        let bestScale = 50;
        let bestDepth = 5;
        let iterations = 0;
        const maxIterations = 20;

        const tryCompress = (scale, depth) => {
            this.imageScaleSlider.value = scale;
            this.colorDepthSlider.value = depth;
            this.scaleValue.textContent = scale + '%';
            this.colorDepthValue.textContent = Math.pow(2, depth) + ' colors';
            this.processImage(this.originalImage);

            return new Promise((resolve) => {
                this.imageCanvas.toBlob((blob) => {
                    const sizeKB = blob.size / 1024;
                    resolve(sizeKB);
                }, 'image/png');
            });
        };

        // Start optimization
        const optimize = async () => {
            // Try different combinations
            for (let scale = 100; scale >= 10; scale -= 10) {
                for (let depth = 8; depth >= 2; depth--) {
                    const sizeKB = await tryCompress(scale, depth);
                    
                    if (sizeKB <= targetKB) {
                        // Found a good match!
                        alert(`✅ Reached ${sizeKB.toFixed(2)} KB (target: ${targetKB} KB)\n\nSettings:\n- Scale: ${scale}%\n- Colors: ${Math.pow(2, depth)}`);
                        this.compress();
                        return;
                    }

                    iterations++;
                    if (iterations >= maxIterations) break;
                }
                if (iterations >= maxIterations) break;
            }

            // If we get here, use smallest possible
            await tryCompress(10, 2);
            this.compress();
            alert('⚠️ Target size very small! Using minimum settings.');
        };

        optimize();
    }

    visualizeResult(result) {
        this.renderFrequencyChart(result.frequencies);
        this.renderHuffmanTree(result.tree);
        this.renderEncodingTable(result.codes);
        this.renderComparison(result);
    }

    renderFrequencyChart(frequencies) {
        const sorted = Array.from(frequencies.entries())
            .sort((a, b) => b[1] - a[1]);

        const maxFreq = Math.max(...frequencies.values());

        this.frequencyContainer.innerHTML = '';

        const chart = document.createElement('div');
        chart.className = 'frequency-chart';

        sorted.forEach(([char, freq]) => {
            const percentage = (freq / maxFreq * 100);
            const displayChar = char === ' ' ? 'SPACE' : char === '\n' ? 'NEWLINE' : char;

            const bar = document.createElement('div');
            bar.className = 'frequency-bar';
            bar.innerHTML = `
                <div class="frequency-header">
                    <span class="char-display">'${displayChar}'</span>
                    <span class="freq-count">${freq}</span>
                </div>
                <div class="frequency-bar-fill" style="width: ${percentage}%"></div>
            `;

            chart.appendChild(bar);
        });

        this.frequencyContainer.appendChild(chart);
    }

    renderHuffmanTree(root) {
        if (!root) return;

        this.treeContainer.innerHTML = '';

        // Create visual tree representation
        const treeDiv = document.createElement('div');
        treeDiv.style.padding = '20px';
        treeDiv.style.overflow = 'auto';

        const renderNode = (node, depth = 0, prefix = '', isLeft = true) => {
            if (!node) return '';

            let html = '';
            const indent = '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(depth);
            const connector = depth === 0 ? '' : (isLeft ? '└─ 0: ' : '└─ 1: ');
            
            if (node.isLeaf()) {
                const displayChar = node.char === ' ' ? 'SPACE' : 
                                  node.char === '\n' ? 'NEWLINE' : node.char;
                html += `<div style="margin: 5px 0; font-family: 'Courier New', monospace;">
                    ${indent}${connector}<strong style="color: #11998e;">'${displayChar}'</strong> (${node.frequency})
                </div>`;
            } else {
                html += `<div style="margin: 5px 0; font-family: 'Courier New', monospace;">
                    ${indent}${connector}Node (${node.frequency})
                </div>`;
                if (node.left) html += renderNode(node.left, depth + 1, prefix + '0', true);
                if (node.right) html += renderNode(node.right, depth + 1, prefix + '1', false);
            }

            return html;
        };

        treeDiv.innerHTML = renderNode(root);
        this.treeContainer.appendChild(treeDiv);
    }

    renderEncodingTable(codes) {
        const sorted = Array.from(codes.entries())
            .sort((a, b) => a[1].length - b[1].length);

        this.encodingContainer.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'encoding-table';

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Character</th>
                    <th>Huffman Code</th>
                    <th>Code Length</th>
                    <th>ASCII (Fixed)</th>
                </tr>
            </thead>
            <tbody>
                ${sorted.map(([char, code]) => {
                    const displayChar = char === ' ' ? 'SPACE' : 
                                      char === '\n' ? 'NEWLINE' : char;
                    const ascii = char.charCodeAt(0).toString(2).padStart(8, '0');
                    return `
                        <tr>
                            <td><strong>'${displayChar}'</strong></td>
                            <td style="color: #11998e; font-weight: 600;">${code}</td>
                            <td>${code.length} bits</td>
                            <td style="color: #718096;">${ascii} (8 bits)</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;

        this.encodingContainer.appendChild(table);
    }

    renderComparison(result) {
        // Original ASCII representation
        const originalPreview = result.original.substring(0, 100);
        const originalBinary = Array.from(originalPreview)
            .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
            .join(' ');

        this.originalData.textContent = originalBinary;

        // Compressed Huffman representation
        const compressedPreview = result.encoded.substring(0, 400);
        this.compressedData.textContent = compressedPreview + 
            (result.encoded.length > 400 ? '...' : '');

        // Character-by-character encoding demo
        this.demoContent.innerHTML = '';
        const demoChars = result.original.substring(0, 20);

        for (const char of demoChars) {
            const code = result.codes.get(char);
            const displayChar = char === ' ' ? 'SPACE' : 
                              char === '\n' ? 'NEWLINE' : char;

            const charDiv = document.createElement('div');
            charDiv.className = 'demo-char';
            charDiv.innerHTML = `
                <div class="char">'${displayChar}'</div>
                <div class="code">${code}</div>
            `;
            this.demoContent.appendChild(charDiv);
        }

        if (result.original.length > 20) {
            const more = document.createElement('div');
            more.style.padding = '10px';
            more.style.color = '#718096';
            more.textContent = `... and ${result.original.length - 20} more characters`;
            this.demoContent.appendChild(more);
        }
    }

    clear() {
        this.textInput.value = '';
        this.currentResult = null;
        this.imageDataString = null;
        this.compressedImageData = null;
        this.originalImage = null;
        
        // Clear canvas
        const ctx = this.imageCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
        
        this.originalSize.textContent = '-';
        this.compressedSize.textContent = '-';
        this.compressionRatio.textContent = '-';
        this.spaceSaved.textContent = '-';
        this.fileSizeKB.textContent = '-';

        // Disable download button
        this.downloadBtn.disabled = true;

        this.clearVisualization();
    }

    clearVisualization() {
        this.frequencyContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <h3>No Data Yet</h3>
                <p>Enter text or upload an image and click Compress!</p>
            </div>
        `;

        this.treeContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🌳</div>
                <h3>No Tree Yet</h3>
                <p>Compress data to see the Huffman tree!</p>
            </div>
        `;

        this.encodingContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💾</div>
                <h3>No Encoding Yet</h3>
                <p>Compress data to see the encoding table!</p>
            </div>
        `;

        this.originalData.textContent = '-';
        this.compressedData.textContent = '-';
        this.demoContent.innerHTML = '';
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
    app = new HuffmanUI();
    console.log('🚀 Huffman Compressor loaded!');
    console.log('💡 Try compressing some text to see Huffman coding in action!');
});

