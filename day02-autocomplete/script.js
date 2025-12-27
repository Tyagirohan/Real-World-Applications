// ===================================
// Trie Data Structure
// ===================================

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
    constructor() {
        this.root = new TrieNode();
        this.wordCount = 0;
        this.nodeCount = 1; // Root node
    }

    insert(word, frequency = 1) {
        if (!word || word.trim() === '') return false;

        let node = this.root;
        const processedWord = word.trim();

        for (const char of processedWord) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode(char));
                this.nodeCount++;
            }
            node = node.children.get(char);
        }

        if (!node.isEndOfWord) {
            this.wordCount++;
        }

        node.isEndOfWord = true;
        node.frequency += frequency;
        node.word = processedWord;

        return true;
    }

    search(prefix) {
        if (!prefix || prefix.trim() === '') return [];

        let node = this.root;
        const processedPrefix = prefix.trim();

        // Navigate to the prefix node
        for (const char of processedPrefix) {
            if (!node.children.has(char)) {
                return [];
            }
            node = node.children.get(char);
        }

        // Collect all words with this prefix
        const results = [];
        this.dfs(node, results);

        return results;
    }

    dfs(node, results) {
        if (node.isEndOfWord) {
            results.push({
                word: node.word,
                frequency: node.frequency
            });
        }

        for (const child of node.children.values()) {
            this.dfs(child, results);
        }
    }

    getAllWords() {
        const results = [];
        this.dfs(this.root, results);
        return results;
    }

    clear() {
        this.root = new TrieNode();
        this.wordCount = 0;
        this.nodeCount = 1;
    }

    // Calculate memory efficiency (prefix sharing)
    calculateMemoryEfficiency() {
        const words = this.getAllWords();
        if (words.length === 0) return 0;

        // Total characters if stored separately
        const totalCharsNaive = words.reduce((sum, w) => sum + w.word.length, 0);
        
        // Characters in trie (nodes)
        const charsInTrie = this.nodeCount - 1; // Exclude root

        if (totalCharsNaive === 0) return 0;

        const saved = ((totalCharsNaive - charsInTrie) / totalCharsNaive) * 100;
        return Math.max(0, saved).toFixed(1);
    }

    // Export as JSON
    exportToJSON() {
        const words = this.getAllWords();
        return JSON.stringify(words, null, 2);
    }
}

// ===================================
// Autocomplete Engine UI
// ===================================

class AutocompleteUI {
    constructor() {
        this.trie = new Trie();
        this.caseSensitive = false;
        this.showFrequency = true;
        this.sortByFrequency = true;
        this.maxSuggestions = 10;
        
        // Performance tracking
        this.searchCount = 0;
        this.totalSearchTime = 0;
        this.successfulSearches = 0;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadPresets();
        this.loadDefaultDictionary();
    }

    initializeElements() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');
        this.suggestionsDropdown = document.getElementById('suggestionsDropdown');
        this.suggestionsList = document.getElementById('suggestionsList');
        this.searchTime = document.getElementById('searchTime');

        // Dictionary management
        this.wordInput = document.getElementById('wordInput');
        this.frequencyInput = document.getElementById('frequencyInput');
        this.addWordBtn = document.getElementById('addWordBtn');
        this.clearDictionaryBtn = document.getElementById('clearDictionaryBtn');
        this.exportBtn = document.getElementById('exportBtn');

        // Options
        this.caseSensitiveCheckbox = document.getElementById('caseSensitive');
        this.showFrequencyCheckbox = document.getElementById('showFrequency');
        this.sortByFrequencyCheckbox = document.getElementById('sortByFrequency');
        this.maxSuggestionsSlider = document.getElementById('maxSuggestions');
        this.maxSuggestionsValue = document.getElementById('maxSuggestionsValue');

        // Stats
        this.totalWordsDisplay = document.getElementById('totalWords');
        this.trieNodesDisplay = document.getElementById('trieNodes');
        this.memorySavedDisplay = document.getElementById('memorySaved');

        // Tabs
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Visualization
        this.trieContainer = document.getElementById('trieContainer');
        this.wordsContainer = document.getElementById('wordsContainer');
        this.filterInput = document.getElementById('filterInput');
        this.expandAllBtn = document.getElementById('expandAllBtn');
        this.collapseAllBtn = document.getElementById('collapseAllBtn');

        // Performance
        this.avgSearchTime = document.getElementById('avgSearchTime');
        this.memoryEfficiency = document.getElementById('memoryEfficiency');
        this.totalSearchesDisplay = document.getElementById('totalSearches');
        this.hitRateDisplay = document.getElementById('hitRate');
    }

    attachEventListeners() {
        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstSuggestion = this.suggestionsList.querySelector('.suggestion-item');
                if (firstSuggestion) {
                    firstSuggestion.click();
                }
            }
        });

        this.clearSearchBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.clearSearchBtn.classList.add('hidden');
            this.suggestionsDropdown.classList.add('hidden');
        });

        // Add word
        this.addWordBtn.addEventListener('click', () => this.addWord());
        this.wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addWord();
        });

        // Clear dictionary
        this.clearDictionaryBtn.addEventListener('click', () => this.clearDictionary());

        // Export
        this.exportBtn.addEventListener('click', () => this.exportDictionary());

        // Options
        this.caseSensitiveCheckbox.addEventListener('change', (e) => {
            this.caseSensitive = e.target.checked;
        });

        this.showFrequencyCheckbox.addEventListener('change', (e) => {
            this.showFrequency = e.target.checked;
            if (this.searchInput.value) {
                this.handleSearch(this.searchInput.value);
            }
        });

        this.sortByFrequencyCheckbox.addEventListener('change', (e) => {
            this.sortByFrequency = e.target.checked;
            if (this.searchInput.value) {
                this.handleSearch(this.searchInput.value);
            }
        });

        this.maxSuggestionsSlider.addEventListener('input', (e) => {
            this.maxSuggestions = parseInt(e.target.value);
            this.maxSuggestionsValue.textContent = this.maxSuggestions;
            if (this.searchInput.value) {
                this.handleSearch(this.searchInput.value);
            }
        });

        // Tabs
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.loadPreset(preset);
            });
        });

        // Filter words
        this.filterInput.addEventListener('input', (e) => {
            this.renderWordsList(e.target.value);
        });

        // Expand/Collapse trie
        this.expandAllBtn.addEventListener('click', () => this.expandAllNodes());
        this.collapseAllBtn.addEventListener('click', () => this.collapseAllNodes());

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.suggestionsDropdown.classList.add('hidden');
            }
        });
    }

    loadPresets() {
        this.presets = {
            programming: [
                { word: 'javascript', freq: 150 },
                { word: 'java', freq: 140 },
                { word: 'python', freq: 200 },
                { word: 'php', freq: 80 },
                { word: 'typescript', freq: 120 },
                { word: 'c++', freq: 100 },
                { word: 'c#', freq: 90 },
                { word: 'ruby', freq: 70 },
                { word: 'rust', freq: 85 },
                { word: 'go', freq: 110 },
                { word: 'kotlin', freq: 75 },
                { word: 'swift', freq: 95 }
            ],
            algorithms: [
                { word: 'algorithm', freq: 100 },
                { word: 'binary search', freq: 90 },
                { word: 'bubble sort', freq: 60 },
                { word: 'merge sort', freq: 85 },
                { word: 'quick sort', freq: 95 },
                { word: 'heap sort', freq: 70 },
                { word: 'dynamic programming', freq: 120 },
                { word: 'dijkstra', freq: 80 },
                { word: 'depth first search', freq: 75 },
                { word: 'breadth first search', freq: 75 },
                { word: 'trie', freq: 65 },
                { word: 'hash table', freq: 110 },
                { word: 'linked list', freq: 90 },
                { word: 'binary tree', freq: 85 },
                { word: 'graph', freq: 100 }
            ],
            cities: [
                { word: 'new york', freq: 150 },
                { word: 'london', freq: 140 },
                { word: 'paris', freq: 130 },
                { word: 'tokyo', freq: 120 },
                { word: 'sydney', freq: 100 },
                { word: 'dubai', freq: 110 },
                { word: 'singapore', freq: 105 },
                { word: 'barcelona', freq: 95 },
                { word: 'amsterdam', freq: 90 },
                { word: 'berlin', freq: 85 },
                { word: 'rome', freq: 100 },
                { word: 'mumbai', freq: 80 },
                { word: 'delhi', freq: 75 }
            ],
            tech: [
                { word: 'google', freq: 200 },
                { word: 'microsoft', freq: 180 },
                { word: 'apple', freq: 190 },
                { word: 'amazon', freq: 170 },
                { word: 'facebook', freq: 160 },
                { word: 'netflix', freq: 140 },
                { word: 'tesla', freq: 150 },
                { word: 'twitter', freq: 130 },
                { word: 'uber', freq: 120 },
                { word: 'airbnb', freq: 110 },
                { word: 'spotify', freq: 105 },
                { word: 'adobe', freq: 100 }
            ]
        };
    }

    loadDefaultDictionary() {
        // Load programming languages by default
        this.loadPreset('programming');
    }

    loadPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        preset.forEach(({ word, freq }) => {
            this.trie.insert(word, freq);
        });

        this.updateStats();
        this.renderTrieVisualization();
        this.renderWordsList();
    }

    addWord() {
        const word = this.wordInput.value.trim();
        const frequency = parseInt(this.frequencyInput.value) || 1;

        if (!word) {
            alert('⚠️ Please enter a word!');
            return;
        }

        const processedWord = this.caseSensitive ? word : word.toLowerCase();
        this.trie.insert(processedWord, frequency);

        this.wordInput.value = '';
        this.frequencyInput.value = '1';
        
        this.updateStats();
        this.renderTrieVisualization();
        this.renderWordsList();
    }

    clearDictionary() {
        if (!confirm('Are you sure you want to clear the entire dictionary?')) {
            return;
        }

        this.trie.clear();
        this.searchCount = 0;
        this.totalSearchTime = 0;
        this.successfulSearches = 0;

        this.updateStats();
        this.renderTrieVisualization();
        this.renderWordsList();
        this.updatePerformanceMetrics();
    }

    exportDictionary() {
        const json = this.trie.exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dictionary.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    handleSearch(query) {
        // Show/hide clear button
        if (query) {
            this.clearSearchBtn.classList.remove('hidden');
        } else {
            this.clearSearchBtn.classList.add('hidden');
            this.suggestionsDropdown.classList.add('hidden');
            return;
        }

        // Process query
        const processedQuery = this.caseSensitive ? query : query.toLowerCase();

        // Measure search time
        const startTime = performance.now();
        let results = this.trie.search(processedQuery);
        const endTime = performance.now();
        const searchTime = endTime - startTime;

        // Update performance stats
        this.searchCount++;
        this.totalSearchTime += searchTime;
        if (results.length > 0) {
            this.successfulSearches++;
        }

        // Sort results
        if (this.sortByFrequency) {
            results.sort((a, b) => b.frequency - a.frequency);
        }

        // Limit results
        results = results.slice(0, this.maxSuggestions);

        // Display results
        this.displaySuggestions(results, searchTime);
        this.updatePerformanceMetrics();
    }

    displaySuggestions(results, searchTime) {
        this.searchTime.textContent = searchTime.toFixed(2) + 'ms';

        if (results.length === 0) {
            this.suggestionsDropdown.classList.add('hidden');
            return;
        }

        this.suggestionsList.innerHTML = results.map(result => `
            <div class="suggestion-item" data-word="${result.word}">
                <span class="suggestion-word">${result.word}</span>
                ${this.showFrequency ? `<span class="suggestion-frequency">${result.frequency}×</span>` : ''}
            </div>
        `).join('');

        // Add click handlers
        this.suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const word = e.currentTarget.dataset.word;
                this.searchInput.value = word;
                this.suggestionsDropdown.classList.add('hidden');
            });
        });

        this.suggestionsDropdown.classList.remove('hidden');
    }

    updateStats() {
        this.totalWordsDisplay.textContent = this.trie.wordCount;
        this.trieNodesDisplay.textContent = this.trie.nodeCount;
        this.memorySavedDisplay.textContent = this.trie.calculateMemoryEfficiency() + '%';
    }

    updatePerformanceMetrics() {
        const avgTime = this.searchCount > 0 ? 
            (this.totalSearchTime / this.searchCount).toFixed(2) : 0;
        this.avgSearchTime.textContent = avgTime + 'ms';

        const hitRate = this.searchCount > 0 ?
            ((this.successfulSearches / this.searchCount) * 100).toFixed(1) : 0;
        this.hitRateDisplay.textContent = hitRate + '%';

        this.memoryEfficiency.textContent = this.trie.calculateMemoryEfficiency() + '%';
        this.totalSearchesDisplay.textContent = this.searchCount;
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

        // Refresh visualizations
        if (tabName === 'trie-visual') {
            this.renderTrieVisualization();
        } else if (tabName === 'word-list') {
            this.renderWordsList();
        }
    }

    renderTrieVisualization() {
        if (this.trie.wordCount === 0) {
            this.trieContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🌱</div>
                    <h3>Trie is Empty</h3>
                    <p>Add words to see the trie structure!</p>
                </div>
            `;
            return;
        }

        this.trieContainer.innerHTML = this.renderTrieNode(this.trie.root, 'root');
    }

    renderTrieNode(node, label) {
        let html = '<div class="trie-node">';
        
        html += `<div class="node-content">`;
        html += `<span class="node-char">${label}</span>`;
        if (node.isEndOfWord) {
            html += `<span class="node-word">✓ ${node.word}</span>`;
            html += `<span class="node-freq">${node.frequency}×</span>`;
        }
        html += `</div>`;

        if (node.children.size > 0) {
            html += `<div class="node-children">`;
            for (const [char, childNode] of node.children) {
                html += this.renderTrieNode(childNode, char);
            }
            html += `</div>`;
        }

        html += '</div>';
        return html;
    }

    renderWordsList(filter = '') {
        const words = this.trie.getAllWords();
        
        if (words.length === 0) {
            this.wordsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📖</div>
                    <h3>No Words Yet</h3>
                    <p>Add words to your dictionary!</p>
                </div>
            `;
            return;
        }

        const filteredWords = filter ? 
            words.filter(w => w.word.includes(filter.toLowerCase())) : words;

        filteredWords.sort((a, b) => b.frequency - a.frequency);

        this.wordsContainer.innerHTML = filteredWords.map(w => `
            <div class="word-item">
                <span class="word-text">${w.word}</span>
                <span class="word-freq">${w.frequency}×</span>
            </div>
        `).join('');
    }

    expandAllNodes() {
        document.querySelectorAll('.node-children').forEach(node => {
            node.classList.add('expanded');
        });
    }

    collapseAllNodes() {
        document.querySelectorAll('.node-children').forEach(node => {
            node.classList.remove('expanded');
        });
    }
}

// ===================================
// Initialize Application
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new AutocompleteUI();
    console.log('🚀 Autocomplete Engine loaded!');
    console.log('💡 Try typing to see suggestions!');
});
