// ===================================
// Data Structures & Algorithm Classes
// ===================================

class LCSAlgorithm {
    constructor() {
        this.dpTable = [];
        this.lcs = [];
    }

    // Compute LCS using Dynamic Programming
    computeLCS(arr1, arr2) {
        const m = arr1.length;
        const n = arr2.length;
        this.dpTable = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

        // Build DP table
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (arr1[i - 1] === arr2[j - 1]) {
                    this.dpTable[i][j] = this.dpTable[i - 1][j - 1] + 1;
                } else {
                    this.dpTable[i][j] = Math.max(
                        this.dpTable[i - 1][j],
                        this.dpTable[i][j - 1]
                    );
                }
            }
        }

        // Backtrack to find actual LCS
        this.lcs = [];
        let i = m, j = n;
        while (i > 0 && j > 0) {
            if (arr1[i - 1] === arr2[j - 1]) {
                this.lcs.unshift({ line: arr1[i - 1], i: i - 1, j: j - 1 });
                i--;
                j--;
            } else if (this.dpTable[i - 1][j] > this.dpTable[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        return {
            lcs: this.lcs,
            dpTable: this.dpTable,
            length: this.dpTable[m][n]
        };
    }

    // Calculate edit distance (Levenshtein distance)
    calculateEditDistance(arr1, arr2) {
        const m = arr1.length;
        const n = arr2.length;
        
        // Edit distance = deletions + insertions
        const lcsLength = this.dpTable[m][n];
        const deletions = m - lcsLength;
        const insertions = n - lcsLength;
        
        return deletions + insertions;
    }

    // Calculate similarity percentage
    calculateSimilarity(arr1, arr2) {
        if (arr1.length === 0 && arr2.length === 0) return 100;
        if (arr1.length === 0 || arr2.length === 0) return 0;
        
        const lcsLength = this.dpTable[arr1.length][arr2.length];
        const maxLength = Math.max(arr1.length, arr2.length);
        
        return ((lcsLength / maxLength) * 100).toFixed(1);
    }
}

class DiffGenerator {
    constructor(lcsAlgorithm) {
        this.lcs = lcsAlgorithm;
        this.ignoreWhitespace = false;
        this.ignoreCase = false;
    }

    setOptions(options) {
        this.ignoreWhitespace = options.ignoreWhitespace || false;
        this.ignoreCase = options.ignoreCase || false;
    }

    processLine(line) {
        let processed = line;
        if (this.ignoreWhitespace) {
            processed = processed.trim();
        }
        if (this.ignoreCase) {
            processed = processed.toLowerCase();
        }
        return processed;
    }

    generateDiff(original, modified) {
        // Split into lines
        const originalLines = original.split('\n').map(line => line);
        const modifiedLines = modified.split('\n').map(line => line);

        // Process lines for comparison
        const processedOriginal = originalLines.map(line => this.processLine(line));
        const processedModified = modifiedLines.map(line => this.processLine(line));

        // Compute LCS
        const lcsResult = this.lcs.computeLCS(processedOriginal, processedModified);
        
        // Create LCS set for quick lookup
        const lcsSet = new Set(lcsResult.lcs.map(item => item.line));

        // Generate diff
        const diffOriginal = [];
        const diffModified = [];
        const unified = [];

        let origIdx = 0;
        let modIdx = 0;

        // Track line numbers
        let origLineNum = 1;
        let modLineNum = 1;

        while (origIdx < originalLines.length || modIdx < modifiedLines.length) {
            const origLine = origIdx < originalLines.length ? processedOriginal[origIdx] : null;
            const modLine = modIdx < modifiedLines.length ? processedModified[modIdx] : null;

            if (origLine !== null && modLine !== null && origLine === modLine) {
                // Unchanged line (both lines match)
                diffOriginal.push({
                    type: 'unchanged',
                    content: originalLines[origIdx],
                    lineNum: origLineNum
                });
                diffModified.push({
                    type: 'unchanged',
                    content: modifiedLines[modIdx],
                    lineNum: modLineNum
                });
                unified.push({
                    type: 'unchanged',
                    content: originalLines[origIdx],
                    origLineNum: origLineNum,
                    modLineNum: modLineNum
                });
                origIdx++;
                modIdx++;
                origLineNum++;
                modLineNum++;
            } else if (origLine !== null && (modLine === null || !lcsSet.has(origLine))) {
                // Deletion (or end of modified)
                diffOriginal.push({
                    type: 'deletion',
                    content: originalLines[origIdx],
                    lineNum: origLineNum
                });
                diffModified.push({
                    type: 'empty',
                    content: '',
                    lineNum: null
                });
                unified.push({
                    type: 'deletion',
                    content: originalLines[origIdx],
                    origLineNum: origLineNum,
                    modLineNum: null
                });
                origIdx++;
                origLineNum++;
            } else if (modLine !== null) {
                // Addition (or line doesn't match)
                diffOriginal.push({
                    type: 'empty',
                    content: '',
                    lineNum: null
                });
                diffModified.push({
                    type: 'addition',
                    content: modifiedLines[modIdx],
                    lineNum: modLineNum
                });
                unified.push({
                    type: 'addition',
                    content: modifiedLines[modIdx],
                    origLineNum: null,
                    modLineNum: modLineNum
                });
                modIdx++;
                modLineNum++;
            } else {
                // Safety fallback - should never reach here, but prevents infinite loop
                break;
            }
        }

        // Calculate statistics
        const additions = diffModified.filter(d => d.type === 'addition').length;
        const deletions = diffOriginal.filter(d => d.type === 'deletion').length;
        const changes = Math.min(additions, deletions);

        return {
            original: diffOriginal,
            modified: diffModified,
            unified: unified,
            stats: {
                additions: additions,
                deletions: deletions,
                changes: changes,
                similarity: this.lcs.calculateSimilarity(processedOriginal, processedModified),
                editDistance: this.lcs.calculateEditDistance(processedOriginal, processedModified)
            },
            lcsResult: lcsResult
        };
    }
}

// ===================================
// UI Controller
// ===================================

class DiffVisualizerUI {
    constructor() {
        this.lcsAlgorithm = new LCSAlgorithm();
        this.diffGenerator = new DiffGenerator(this.lcsAlgorithm);
        this.currentMode = 'side-by-side';
        this.currentDiff = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadExamples();
    }

    initializeElements() {
        // Editors
        this.originalCodeEditor = document.getElementById('originalCode');
        this.modifiedCodeEditor = document.getElementById('modifiedCode');
        
        // Containers
        this.editorsContainer = document.getElementById('editorsContainer');
        this.diffOutput = document.getElementById('diffOutput');
        
        // Views
        this.sideBySideView = document.getElementById('sideBySideView');
        this.unifiedView = document.getElementById('unifiedView');
        this.lcsTableView = document.getElementById('lcsTableView');
        
        // Diff content
        this.originalDiff = document.getElementById('originalDiff');
        this.modifiedDiff = document.getElementById('modifiedDiff');
        this.unifiedDiff = document.getElementById('unifiedDiff');
        this.lcsTableContainer = document.getElementById('lcsTableContainer');
        
        // Buttons
        this.compareBtn = document.getElementById('compareBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.backToEditBtn = document.getElementById('backToEditBtn');
        
        // Options
        this.ignoreWhitespace = document.getElementById('ignoreWhitespace');
        this.ignoreCase = document.getElementById('ignoreCase');
        this.showLineNumbers = document.getElementById('showLineNumbers');
        
        // Stats
        this.additionsCount = document.getElementById('additionsCount');
        this.deletionsCount = document.getElementById('deletionsCount');
        this.changesCount = document.getElementById('changesCount');
        this.similarityPercent = document.getElementById('similarityPercent');
        this.editDistance = document.getElementById('editDistance');
        
        // Mode buttons
        this.modeButtons = document.querySelectorAll('.mode-btn');
    }

    attachEventListeners() {
        // Compare button
        this.compareBtn.addEventListener('click', () => this.compareCode());
        
        // Clear button
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // Swap button
        this.swapBtn.addEventListener('click', () => this.swapCode());
        
        // Back to edit button
        this.backToEditBtn.addEventListener('click', () => this.backToEdit());
        
        // Mode buttons
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const example = e.currentTarget.dataset.example;
                this.loadExample(example);
            });
        });
        
        // Options change - auto-recompare if diff is shown
        [this.ignoreWhitespace, this.ignoreCase].forEach(option => {
            option.addEventListener('change', () => {
                if (this.currentDiff) {
                    this.compareCode();
                }
            });
        });
        
        // Show line numbers toggle
        this.showLineNumbers.addEventListener('change', () => {
            if (this.currentDiff) {
                this.renderDiff(this.currentDiff);
            }
        });
    }

    loadExamples() {
        this.examples = {
            function: {
                original: `function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}`,
                modified: `function calculateTotal(items, taxRate = 0) {
    let subtotal = 0;
    for (const item of items) {
        subtotal += item.price * item.quantity;
    }
    const tax = subtotal * taxRate;
    return subtotal + tax;
}`
            },
            html: {
                original: `<div class="header">
    <h1>Welcome</h1>
    <p>Hello World</p>
</div>`,
                modified: `<header class="site-header">
    <h1>Welcome to Our Site</h1>
    <p>Hello World!</p>
    <nav>
        <a href="/">Home</a>
    </nav>
</header>`
            },
            json: {
                original: `{
    "name": "myapp",
    "version": "1.0.0",
    "dependencies": {
        "react": "^17.0.0",
        "lodash": "^4.17.0"
    }
}`,
                modified: `{
    "name": "myapp",
    "version": "2.0.0",
    "description": "My awesome app",
    "dependencies": {
        "react": "^18.0.0",
        "axios": "^1.0.0"
    }
}`
            },
            css: {
                original: `.button {
    padding: 10px;
    background: blue;
    color: white;
}`,
                modified: `.btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn:hover {
    transform: translateY(-2px);
}`
            }
        };
    }

    loadExample(exampleName) {
        const example = this.examples[exampleName];
        if (example) {
            this.originalCodeEditor.value = example.original;
            this.modifiedCodeEditor.value = example.modified;
            
            // Auto-compare after loading example
            setTimeout(() => this.compareCode(), 100);
        }
    }

    compareCode() {
        const original = this.originalCodeEditor.value;
        const modified = this.modifiedCodeEditor.value;
        
        if (!original.trim() && !modified.trim()) {
            alert('⚠️ Please enter some code to compare!');
            return;
        }
        
        // Set options
        this.diffGenerator.setOptions({
            ignoreWhitespace: this.ignoreWhitespace.checked,
            ignoreCase: this.ignoreCase.checked
        });
        
        // Generate diff
        this.currentDiff = this.diffGenerator.generateDiff(original, modified);
        
        // Update UI
        this.renderDiff(this.currentDiff);
        this.updateStats(this.currentDiff.stats);
        
        // Show diff output
        this.editorsContainer.classList.add('hidden');
        this.diffOutput.classList.remove('hidden');
    }

    renderDiff(diff) {
        this.renderSideBySide(diff);
        this.renderUnified(diff);
        this.renderLCSTable(diff.lcsResult);
    }

    renderSideBySide(diff) {
        const showLineNumbers = this.showLineNumbers.checked;
        
        this.originalDiff.innerHTML = diff.original.map(line => {
            const lineNum = showLineNumbers && line.lineNum ? 
                `<span class="line-number">${line.lineNum}</span>` : '';
            const content = this.escapeHtml(line.content) || '&nbsp;';
            return `<div class="diff-line ${line.type}">
                ${lineNum}
                <span class="line-content">${content}</span>
            </div>`;
        }).join('');
        
        this.modifiedDiff.innerHTML = diff.modified.map(line => {
            const lineNum = showLineNumbers && line.lineNum ? 
                `<span class="line-number">${line.lineNum}</span>` : '';
            const content = this.escapeHtml(line.content) || '&nbsp;';
            return `<div class="diff-line ${line.type}">
                ${lineNum}
                <span class="line-content">${content}</span>
            </div>`;
        }).join('');
    }

    renderUnified(diff) {
        const showLineNumbers = this.showLineNumbers.checked;
        
        this.unifiedDiff.innerHTML = diff.unified.map(line => {
            let lineNum = '';
            if (showLineNumbers) {
                const origNum = line.origLineNum || ' ';
                const modNum = line.modLineNum || ' ';
                lineNum = `<span class="line-number">${origNum}|${modNum}</span>`;
            }
            
            let prefix = ' ';
            if (line.type === 'deletion') prefix = '-';
            if (line.type === 'addition') prefix = '+';
            
            const content = this.escapeHtml(line.content) || '&nbsp;';
            return `<div class="diff-line ${line.type}">
                ${lineNum}
                <span class="line-content">${prefix} ${content}</span>
            </div>`;
        }).join('');
    }

    renderLCSTable(lcsResult) {
        const { dpTable, lcs } = lcsResult;
        
        if (!dpTable || dpTable.length === 0) {
            this.lcsTableContainer.innerHTML = '<p>No LCS table to display.</p>';
            return;
        }
        
        // Create LCS path set for highlighting
        const lcsPath = new Set();
        lcs.forEach(item => {
            lcsPath.add(`${item.i + 1},${item.j + 1}`);
        });
        
        // Build table
        let tableHTML = '<table class="lcs-table">';
        
        // Header row
        tableHTML += '<tr><td class="header"></td><td class="header">∅</td>';
        for (let j = 1; j < dpTable[0].length; j++) {
            tableHTML += `<td class="header">${j}</td>`;
        }
        tableHTML += '</tr>';
        
        // Data rows
        for (let i = 0; i < dpTable.length; i++) {
            tableHTML += '<tr>';
            tableHTML += `<td class="header">${i === 0 ? '∅' : i}</td>`;
            for (let j = 0; j < dpTable[i].length; j++) {
                const isPath = lcsPath.has(`${i},${j}`);
                const className = isPath ? 'lcs-path' : '';
                tableHTML += `<td class="${className}">${dpTable[i][j]}</td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table>';
        
        this.lcsTableContainer.innerHTML = tableHTML;
    }

    updateStats(stats) {
        this.additionsCount.textContent = stats.additions;
        this.deletionsCount.textContent = stats.deletions;
        this.changesCount.textContent = stats.changes;
        this.similarityPercent.textContent = stats.similarity + '%';
        this.editDistance.textContent = stats.editDistance;
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active button
        this.modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show appropriate view
        this.sideBySideView.classList.add('hidden');
        this.unifiedView.classList.add('hidden');
        this.lcsTableView.classList.add('hidden');
        
        switch (mode) {
            case 'side-by-side':
                this.sideBySideView.classList.remove('hidden');
                break;
            case 'unified':
                this.unifiedView.classList.remove('hidden');
                break;
            case 'lcs-table':
                this.lcsTableView.classList.remove('hidden');
                break;
        }
    }

    backToEdit() {
        this.editorsContainer.classList.remove('hidden');
        this.diffOutput.classList.add('hidden');
    }

    swapCode() {
        const temp = this.originalCodeEditor.value;
        this.originalCodeEditor.value = this.modifiedCodeEditor.value;
        this.modifiedCodeEditor.value = temp;
        
        // If diff is shown, recompare
        if (this.currentDiff) {
            this.compareCode();
        }
    }

    clearAll() {
        this.originalCodeEditor.value = '';
        this.modifiedCodeEditor.value = '';
        this.currentDiff = null;
        
        this.additionsCount.textContent = '0';
        this.deletionsCount.textContent = '0';
        this.changesCount.textContent = '0';
        this.similarityPercent.textContent = '0%';
        this.editDistance.textContent = '0';
        
        this.backToEdit();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ===================================
// Initialize Application
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new DiffVisualizerUI();
    console.log('🚀 Code Diff Visualizer loaded!');
    console.log('💡 Try loading a Quick Example to see how it works!');
});

