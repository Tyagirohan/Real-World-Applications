// ===================================
// Consistent Hashing Implementation
// ===================================

class ConsistentHash {
    constructor(virtualNodes = 3) {
        this.virtualNodes = virtualNodes;
        this.ring = new Map(); // hash -> server
        this.servers = new Set();
        this.sortedHashes = [];
    }

    // Hash function (simple for demo - real systems use MD5/SHA)
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) - hash) + key.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash) % 360; // 0-360 degrees
    }

    addServer(server) {
        this.servers.add(server);
        
        // Add virtual nodes
        for (let i = 0; i < this.virtualNodes; i++) {
            const virtualKey = `${server}-vn${i}`;
            const hashValue = this.hash(virtualKey);
            this.ring.set(hashValue, server);
        }

        // Keep sorted for binary search
        this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
    }

    removeServer(server) {
        this.servers.delete(server);
        
        // Remove all virtual nodes
        const toDelete = [];
        for (const [hash, srv] of this.ring.entries()) {
            if (srv === server) {
                toDelete.push(hash);
            }
        }

        toDelete.forEach(hash => this.ring.delete(hash));
        this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
    }

    getServer(key) {
        if (this.sortedHashes.length === 0) return null;

        const hashValue = this.hash(key);
        
        // Binary search for next server (clockwise)
        let left = 0;
        let right = this.sortedHashes.length - 1;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.sortedHashes[mid] < hashValue) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // If we're past all servers, wrap around
        if (this.sortedHashes[left] < hashValue) {
            return this.ring.get(this.sortedHashes[0]);
        }

        return this.ring.get(this.sortedHashes[left]);
    }

    getDistribution(requests) {
        const distribution = new Map();
        
        this.servers.forEach(server => {
            distribution.set(server, 0);
        });

        requests.forEach(req => {
            const server = this.getServer(req);
            if (server) {
                distribution.set(server, distribution.get(server) + 1);
            }
        });

        return distribution;
    }

    getAllNodes() {
        const nodes = [];
        for (const [hash, server] of this.ring.entries()) {
            nodes.push({ hash, server });
        }
        return nodes.sort((a, b) => a.hash - b.hash);
    }
}

// ===================================
// Load Balancer UI
// ===================================

class LoadBalancerUI {
    constructor() {
        this.consistentHash = new ConsistentHash(3);
        this.servers = [];
        this.requests = [];
        this.currentStrategy = 'consistent';

        this.initializeElements();
        this.attachEventListeners();
        this.initializeCanvas();
    }

    initializeElements() {
        // Inputs
        this.serverNameInput = document.getElementById('serverName');
        this.requestCountSlider = document.getElementById('requestCount');
        this.requestCountValue = document.getElementById('requestCountValue');
        this.virtualNodesSlider = document.getElementById('virtualNodes');
        this.virtualNodesValue = document.getElementById('virtualNodesValue');

        // Buttons
        this.addServerBtn = document.getElementById('addServerBtn');
        this.simulateBtn = document.getElementById('simulateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.strategyButtons = document.querySelectorAll('.strategy-btn');
        this.demoAddBtn = document.getElementById('demoAddBtn');
        this.demoRemoveBtn = document.getElementById('demoRemoveBtn');

        // Displays
        this.serverList = document.getElementById('serverList');
        this.distributionContainer = document.getElementById('distributionContainer');
        this.demoResults = document.getElementById('demoResults');

        // Stats
        this.totalServersDisplay = document.getElementById('totalServers');
        this.totalRequestsDisplay = document.getElementById('totalRequests');
        this.avgLoadDisplay = document.getElementById('avgLoad');
        this.loadVarianceDisplay = document.getElementById('loadVariance');
        this.maxLoadDisplay = document.getElementById('maxLoad');

        // Canvas
        this.canvas = document.getElementById('ringCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Tabs
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
    }

    attachEventListeners() {
        // Add server
        this.addServerBtn.addEventListener('click', () => this.addServer());
        this.serverNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addServer();
        });

        // Sliders
        this.requestCountSlider.addEventListener('input', (e) => {
            this.requestCountValue.textContent = e.target.value;
        });

        this.virtualNodesSlider.addEventListener('input', (e) => {
            this.virtualNodesValue.textContent = e.target.value;
            this.consistentHash = new ConsistentHash(parseInt(e.target.value));
            this.servers.forEach(server => this.consistentHash.addServer(server));
            this.drawRing();
        });

        // Simulate
        this.simulateBtn.addEventListener('click', () => this.simulate());

        // Clear
        this.clearBtn.addEventListener('click', () => this.clear());

        // Strategy
        this.strategyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentStrategy = e.currentTarget.dataset.strategy;
                this.strategyButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Demo buttons
        this.demoAddBtn.addEventListener('click', () => this.demoAdd());
        this.demoRemoveBtn.addEventListener('click', () => this.demoRemove());

        // Tabs
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    initializeCanvas() {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 50;

        this.drawRing();
    }

    addServer() {
        const name = this.serverNameInput.value.trim();
        if (!name) {
            alert('⚠️ Please enter a server name!');
            return;
        }

        if (this.servers.includes(name)) {
            alert('⚠️ Server already exists!');
            return;
        }

        this.servers.push(name);
        this.consistentHash.addServer(name);
        this.serverNameInput.value = '';
        
        this.updateServerList();
        this.drawRing();
        this.updateStats();
    }

    removeServer(name) {
        this.servers = this.servers.filter(s => s !== name);
        this.consistentHash.removeServer(name);
        
        this.updateServerList();
        this.drawRing();
        this.updateStats();
    }

    updateServerList() {
        if (this.servers.length === 0) {
            this.serverList.innerHTML = '<p class="empty-note">No servers yet. Add one!</p>';
            return;
        }

        this.serverList.innerHTML = this.servers.map(server => `
            <div class="server-item">
                <span class="server-name">
                    🖥️ ${server}
                    <span class="server-load" id="load-${server}"></span>
                </span>
                <button class="remove-btn" onclick="app.removeServer('${server}')">✕</button>
            </div>
        `).join('');
    }

    simulate() {
        if (this.servers.length === 0) {
            alert('⚠️ Add at least one server first!');
            return;
        }

        const count = parseInt(this.requestCountSlider.value);
        this.requests = [];
        
        for (let i = 0; i < count; i++) {
            this.requests.push(`request-${i}`);
        }

        const distribution = this.consistentHash.getDistribution(this.requests);
        
        this.renderDistribution(distribution);
        this.updateStats(distribution);
        this.drawRing();
    }

    renderDistribution(distribution) {
        this.distributionContainer.innerHTML = '';

        const chart = document.createElement('div');
        chart.className = 'distribution-chart';

        const maxLoad = Math.max(...distribution.values());

        for (const [server, load] of distribution.entries()) {
            const percentage = maxLoad > 0 ? (load / maxLoad * 100) : 0;

            const bar = document.createElement('div');
            bar.className = 'distribution-bar';
            bar.innerHTML = `
                <div class="bar-header">
                    <span class="server-label">🖥️ ${server}</span>
                    <span class="load-count">${load} requests</span>
                </div>
                <div class="bar-fill" style="width: ${percentage}%"></div>
            `;

            chart.appendChild(bar);

            // Update server list
            const loadElement = document.getElementById(`load-${server}`);
            if (loadElement) {
                loadElement.textContent = `(${load} requests)`;
            }
        }

        this.distributionContainer.appendChild(chart);
    }

    updateStats(distribution = null) {
        this.totalServersDisplay.textContent = this.servers.length;
        this.totalRequestsDisplay.textContent = this.requests.length;

        if (!distribution || distribution.size === 0) {
            this.avgLoadDisplay.textContent = '0';
            this.loadVarianceDisplay.textContent = '0%';
            this.maxLoadDisplay.textContent = '0';
            return;
        }

        const loads = Array.from(distribution.values());
        const avg = loads.reduce((a, b) => a + b, 0) / loads.length;
        const max = Math.max(...loads);
        const min = Math.min(...loads);
        const variance = max > 0 ? ((max - min) / max * 100).toFixed(1) : 0;

        this.avgLoadDisplay.textContent = avg.toFixed(1);
        this.loadVarianceDisplay.textContent = variance + '%';
        this.maxLoadDisplay.textContent = max;
    }

    drawRing() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ring circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw degree markers
        for (let angle = 0; angle < 360; angle += 30) {
            const rad = (angle * Math.PI) / 180;
            const x1 = this.centerX + Math.cos(rad) * (this.radius - 10);
            const y1 = this.centerY + Math.sin(rad) * (this.radius - 10);
            const x2 = this.centerX + Math.cos(rad) * (this.radius + 10);
            const y2 = this.centerY + Math.sin(rad) * (this.radius + 10);

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = '#cbd5e0';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw degree text
            const textX = this.centerX + Math.cos(rad) * (this.radius + 30);
            const textY = this.centerY + Math.sin(rad) * (this.radius + 30);
            this.ctx.fillStyle = '#718096';
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${angle}°`, textX, textY);
        }

        // Draw server nodes
        const nodes = this.consistentHash.getAllNodes();
        const serverPositions = new Map();

        nodes.forEach(({ hash, server }) => {
            const angle = (hash * Math.PI) / 180;
            const x = this.centerX + Math.cos(angle) * this.radius;
            const y = this.centerY + Math.sin(angle) * this.radius;

            // Draw virtual node (smaller)
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#48bb78';
            this.ctx.fill();
            this.ctx.strokeStyle = '#22543d';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Store server position for label
            if (!serverPositions.has(server)) {
                serverPositions.set(server, { x, y, angle });
            }
        });

        // Draw server labels
        serverPositions.forEach((pos, server) => {
            const labelX = this.centerX + Math.cos(pos.angle) * (this.radius - 40);
            const labelY = this.centerY + Math.sin(pos.angle) * (this.radius - 40);

            // Draw server circle
            this.ctx.beginPath();
            this.ctx.arc(labelX, labelY, 15, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#667eea';
            this.ctx.fill();

            // Draw server name
            this.ctx.fillStyle = '#2d3748';
            this.ctx.font = 'bold 14px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(server, labelX, labelY - 30);
        });
    }

    demoAdd() {
        const beforeServers = this.servers.length;
        
        this.demoResults.innerHTML = `
            <strong>Demonstrating: Add Server</strong><br><br>
            Before: ${beforeServers} servers<br>
            Simulating 100 requests...<br><br>
        `;

        // Generate requests
        const requests = Array.from({ length: 100 }, (_, i) => `req-${i}`);
        const beforeMapping = new Map();
        
        requests.forEach(req => {
            beforeMapping.set(req, this.consistentHash.getServer(req));
        });

        // Add new server
        const newServer = `Server-${Date.now()}`;
        this.addServer();
        this.serverNameInput.value = newServer;
        this.addServer();

        // Check after
        let moved = 0;
        requests.forEach(req => {
            const after = this.consistentHash.getServer(req);
            if (beforeMapping.get(req) !== after) {
                moved++;
            }
        });

        this.demoResults.innerHTML += `
            After: ${this.servers.length} servers<br>
            <strong style="color: #48bb78;">
            ✅ Only ${moved}/100 requests moved (${(moved/100*100).toFixed(1)}%)!
            </strong><br><br>
            <em>With naive modulo, ALL 100 requests would move!</em>
        `;
    }

    demoRemove() {
        if (this.servers.length === 0) {
            alert('⚠️ Add servers first!');
            return;
        }

        const beforeServers = this.servers.length;
        
        this.demoResults.innerHTML = `
            <strong>Demonstrating: Remove Server</strong><br><br>
            Before: ${beforeServers} servers<br>
            Simulating 100 requests...<br><br>
        `;

        // Generate requests
        const requests = Array.from({ length: 100 }, (_, i) => `req-${i}`);
        const beforeMapping = new Map();
        
        requests.forEach(req => {
            beforeMapping.set(req, this.consistentHash.getServer(req));
        });

        // Remove first server
        const removed = this.servers[0];
        this.removeServer(removed);

        // Check after
        let moved = 0;
        requests.forEach(req => {
            const after = this.consistentHash.getServer(req);
            if (beforeMapping.get(req) !== after) {
                moved++;
            }
        });

        this.demoResults.innerHTML += `
            Removed: ${removed}<br>
            After: ${this.servers.length} servers<br>
            <strong style="color: #48bb78;">
            ✅ Only ${moved}/100 requests moved (${(moved/100*100).toFixed(1)}%)!
            </strong><br><br>
            <em>With naive modulo, ALL 100 requests would move!</em>
        `;
    }

    clear() {
        this.servers = [];
        this.requests = [];
        this.consistentHash = new ConsistentHash(parseInt(this.virtualNodesSlider.value));
        
        this.updateServerList();
        this.drawRing();
        this.updateStats();
        
        this.distributionContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <h3>No Data Yet</h3>
                <p>Add servers and simulate traffic!</p>
            </div>
        `;

        this.demoResults.innerHTML = '';
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
    app = new LoadBalancerUI();
    console.log('🚀 Load Balancer Simulator loaded!');
    console.log('💡 Add some servers and simulate traffic!');
});

