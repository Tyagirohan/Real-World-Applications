// ===================================
// Maze Data Structure & Algorithms
// ===================================

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.visited = false;
        this.walls = { top: true, right: true, bottom: true, left: true };
    }
}

class Maze {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.start = { row: 0, col: 0 };
        this.end = { row: rows - 1, col: cols - 1 };
        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = new Cell(row, col);
            }
        }
    }

    getCell(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return null;
        }
        return this.grid[row][col];
    }

    getUnvisitedNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;

        const top = this.getCell(row - 1, col);
        const right = this.getCell(row, col + 1);
        const bottom = this.getCell(row + 1, col);
        const left = this.getCell(row, col - 1);

        if (top && !top.visited) neighbors.push({ cell: top, direction: 'top' });
        if (right && !right.visited) neighbors.push({ cell: right, direction: 'right' });
        if (bottom && !bottom.visited) neighbors.push({ cell: bottom, direction: 'bottom' });
        if (left && !left.visited) neighbors.push({ cell: left, direction: 'left' });

        return neighbors;
    }

    removeWallBetween(cell1, cell2) {
        const dx = cell2.col - cell1.col;
        const dy = cell2.row - cell1.row;

        if (dx === 1) {
            cell1.walls.right = false;
            cell2.walls.left = false;
        } else if (dx === -1) {
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else if (dy === 1) {
            cell1.walls.bottom = false;
            cell2.walls.top = false;
        } else if (dy === -1) {
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        }
    }

    hasWallBetween(cell1, cell2) {
        const dx = cell2.col - cell1.col;
        const dy = cell2.row - cell1.row;

        if (dx === 1) return cell1.walls.right;
        if (dx === -1) return cell1.walls.left;
        if (dy === 1) return cell1.walls.bottom;
        if (dy === -1) return cell1.walls.top;

        return true;
    }

    getWalkableNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;

        const directions = [
            { cell: this.getCell(row - 1, col), dir: 'top' },
            { cell: this.getCell(row, col + 1), dir: 'right' },
            { cell: this.getCell(row + 1, col), dir: 'bottom' },
            { cell: this.getCell(row, col - 1), dir: 'left' }
        ];

        for (const { cell: neighbor, dir } of directions) {
            if (neighbor && !cell.walls[dir]) {
                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    // Generate maze using DFS (Recursive Backtracking)
    generate() {
        this.initializeGrid();
        const stack = [];
        const startCell = this.grid[0][0];
        startCell.visited = true;
        stack.push(startCell);

        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current);

            if (neighbors.length > 0) {
                // Choose random neighbor
                const { cell: next } = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Remove wall between current and next
                this.removeWallBetween(current, next);
                
                // Mark next as visited and push to stack
                next.visited = true;
                stack.push(next);
            } else {
                // Backtrack
                stack.pop();
            }
        }

        // Reset visited flags for solving
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col].visited = false;
            }
        }
    }

    reset() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col].visited = false;
            }
        }
    }
}

// ===================================
// Pathfinding Algorithms
// ===================================

class PathfindingAlgorithm {
    constructor(maze) {
        this.maze = maze;
        this.visitedCells = [];
        this.path = [];
    }

    manhattanDistance(cell1, cell2) {
        return Math.abs(cell1.row - cell2.row) + Math.abs(cell1.col - cell2.col);
    }
}

class DFSSolver extends PathfindingAlgorithm {
    solve() {
        this.maze.reset();
        this.visitedCells = [];
        this.path = [];

        const stack = [];
        const parent = new Map();
        const startKey = `${this.maze.start.row},${this.maze.start.col}`;
        const endKey = `${this.maze.end.row},${this.maze.end.col}`;

        const startCell = this.maze.getCell(this.maze.start.row, this.maze.start.col);
        stack.push(startCell);
        startCell.visited = true;

        while (stack.length > 0) {
            const current = stack.pop();
            const currentKey = `${current.row},${current.col}`;
            this.visitedCells.push(current);

            if (currentKey === endKey) {
                // Reconstruct path
                this.reconstructPath(parent, current);
                return { visited: this.visitedCells, path: this.path };
            }

            const neighbors = this.maze.getWalkableNeighbors(current);
            for (const neighbor of neighbors) {
                if (!neighbor.visited) {
                    neighbor.visited = true;
                    stack.push(neighbor);
                    parent.set(`${neighbor.row},${neighbor.col}`, current);
                }
            }
        }

        return { visited: this.visitedCells, path: [] };
    }

    reconstructPath(parent, endCell) {
        this.path = [];
        let current = endCell;
        const startKey = `${this.maze.start.row},${this.maze.start.col}`;

        while (current) {
            this.path.unshift(current);
            const currentKey = `${current.row},${current.col}`;
            if (currentKey === startKey) break;
            current = parent.get(currentKey);
        }
    }
}

class BFSSolver extends PathfindingAlgorithm {
    solve() {
        this.maze.reset();
        this.visitedCells = [];
        this.path = [];

        const queue = [];
        const parent = new Map();
        const startKey = `${this.maze.start.row},${this.maze.start.col}`;
        const endKey = `${this.maze.end.row},${this.maze.end.col}`;

        const startCell = this.maze.getCell(this.maze.start.row, this.maze.start.col);
        queue.push(startCell);
        startCell.visited = true;

        while (queue.length > 0) {
            const current = queue.shift();
            const currentKey = `${current.row},${current.col}`;
            this.visitedCells.push(current);

            if (currentKey === endKey) {
                // Reconstruct path
                this.reconstructPath(parent, current);
                return { visited: this.visitedCells, path: this.path };
            }

            const neighbors = this.maze.getWalkableNeighbors(current);
            for (const neighbor of neighbors) {
                if (!neighbor.visited) {
                    neighbor.visited = true;
                    queue.push(neighbor);
                    parent.set(`${neighbor.row},${neighbor.col}`, current);
                }
            }
        }

        return { visited: this.visitedCells, path: [] };
    }

    reconstructPath(parent, endCell) {
        this.path = [];
        let current = endCell;
        const startKey = `${this.maze.start.row},${this.maze.start.col}`;

        while (current) {
            this.path.unshift(current);
            const currentKey = `${current.row},${current.col}`;
            if (currentKey === startKey) break;
            current = parent.get(currentKey);
        }
    }
}

class AStarSolver extends PathfindingAlgorithm {
    solve() {
        this.maze.reset();
        this.visitedCells = [];
        this.path = [];

        const openSet = [];
        const closedSet = new Set();
        const gScore = new Map();
        const fScore = new Map();
        const parent = new Map();

        const startKey = `${this.maze.start.row},${this.maze.start.col}`;
        const endKey = `${this.maze.end.row},${this.maze.end.col}`;
        const startCell = this.maze.getCell(this.maze.start.row, this.maze.start.col);
        const endCell = this.maze.getCell(this.maze.end.row, this.maze.end.col);

        gScore.set(startKey, 0);
        fScore.set(startKey, this.manhattanDistance(startCell, endCell));
        openSet.push(startCell);

        while (openSet.length > 0) {
            // Find cell with lowest fScore
            openSet.sort((a, b) => {
                const aKey = `${a.row},${a.col}`;
                const bKey = `${b.row},${b.col}`;
                return (fScore.get(aKey) || Infinity) - (fScore.get(bKey) || Infinity);
            });

            const current = openSet.shift();
            const currentKey = `${current.row},${current.col}`;
            
            if (!current.visited) {
                current.visited = true;
                this.visitedCells.push(current);
            }

            if (currentKey === endKey) {
                this.reconstructPath(parent, current);
                return { visited: this.visitedCells, path: this.path };
            }

            closedSet.add(currentKey);

            const neighbors = this.maze.getWalkableNeighbors(current);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.row},${neighbor.col}`;
                
                if (closedSet.has(neighborKey)) continue;

                const tentativeGScore = (gScore.get(currentKey) || 0) + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
                    continue;
                }

                parent.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + this.manhattanDistance(neighbor, endCell));
            }
        }

        return { visited: this.visitedCells, path: [] };
    }

    reconstructPath(parent, endCell) {
        this.path = [];
        let current = endCell;
        const startKey = `${this.maze.start.row},${this.maze.start.col}`;

        while (current) {
            this.path.unshift(current);
            const currentKey = `${current.row},${current.col}`;
            if (currentKey === startKey) break;
            current = parent.get(currentKey);
        }
    }
}

// ===================================
// Maze Visualizer UI
// ===================================

class MazeVisualizerUI {
    constructor() {
        this.maze = null;
        this.canvas = document.getElementById('mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 20;
        this.mazeSize = 20;
        this.animationSpeed = 3;
        this.drawMode = false;
        this.isAnimating = false;

        this.initializeElements();
        this.attachEventListeners();
        this.generateNewMaze();
    }

    initializeElements() {
        // Controls
        this.mazeSizeSlider = document.getElementById('mazeSize');
        this.mazeSizeValue = document.getElementById('mazeSizeValue');
        this.animationSpeedSlider = document.getElementById('animationSpeed');
        this.speedValue = document.getElementById('speedValue');
        this.drawModeCheckbox = document.getElementById('drawMode');

        // Buttons
        this.generateBtn = document.getElementById('generateBtn');
        this.solveDFSBtn = document.getElementById('solveDFS');
        this.solveBFSBtn = document.getElementById('solveBFS');
        this.solveAStarBtn = document.getElementById('solveAStar');
        this.solveAllBtn = document.getElementById('solveAll');
        this.clearPathBtn = document.getElementById('clearPathBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Stats
        this.currentAlgo = document.getElementById('currentAlgo');
        this.pathLength = document.getElementById('pathLength');
        this.cellsVisited = document.getElementById('cellsVisited');
        this.timeTaken = document.getElementById('timeTaken');
        this.efficiency = document.getElementById('efficiency');
        this.statusBadge = document.getElementById('statusBadge');

        // Race results
        this.raceResults = document.getElementById('raceResults');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.closeResultsBtn = document.getElementById('closeResultsBtn');
    }

    attachEventListeners() {
        // Maze size
        this.mazeSizeSlider.addEventListener('input', (e) => {
            this.mazeSize = parseInt(e.target.value);
            this.mazeSizeValue.textContent = `${this.mazeSize}×${this.mazeSize}`;
        });

        // Animation speed
        this.animationSpeedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            const speeds = ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
            this.speedValue.textContent = speeds[this.animationSpeed - 1];
        });

        // Draw mode
        this.drawModeCheckbox.addEventListener('change', (e) => {
            this.drawMode = e.target.checked;
        });

        // Generate
        this.generateBtn.addEventListener('click', () => this.generateNewMaze());

        // Solve buttons
        this.solveDFSBtn.addEventListener('click', () => this.solveMaze('dfs'));
        this.solveBFSBtn.addEventListener('click', () => this.solveMaze('bfs'));
        this.solveAStarBtn.addEventListener('click', () => this.solveMaze('astar'));
        this.solveAllBtn.addEventListener('click', () => this.raceAlgorithms());

        // Clear/Reset
        this.clearPathBtn.addEventListener('click', () => this.clearPath());
        this.resetBtn.addEventListener('click', () => this.resetMaze());

        // Canvas click for drawing
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Close race results
        this.closeResultsBtn.addEventListener('click', () => {
            this.raceResults.classList.add('hidden');
        });
    }

    generateNewMaze() {
        if (this.isAnimating) return;
        
        this.maze = new Maze(this.mazeSize, this.mazeSize);
        this.maze.generate();
        this.resizeCanvas();
        this.drawMaze();
        this.clearStats();
        this.statusBadge.textContent = 'Ready';
        this.raceResults.classList.add('hidden');
    }

    resizeCanvas() {
        this.cellSize = Math.min(20, Math.floor(600 / this.mazeSize));
        this.canvas.width = this.mazeSize * this.cellSize;
        this.canvas.height = this.mazeSize * this.cellSize;
    }

    drawMaze() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.maze.rows; row++) {
            for (let col = 0; col < this.maze.cols; col++) {
                const cell = this.maze.grid[row][col];
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                // Draw cell background
                if (row === this.maze.start.row && col === this.maze.start.col) {
                    this.ctx.fillStyle = '#48bb78';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (row === this.maze.end.row && col === this.maze.end.col) {
                    this.ctx.fillStyle = '#f56565';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }

                // Draw walls
                this.ctx.strokeStyle = '#2d3748';
                this.ctx.lineWidth = 2;

                if (cell.walls.top) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x + this.cellSize, y);
                    this.ctx.stroke();
                }
                if (cell.walls.right) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + this.cellSize, y);
                    this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
                    this.ctx.stroke();
                }
                if (cell.walls.bottom) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y + this.cellSize);
                    this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
                    this.ctx.stroke();
                }
                if (cell.walls.left) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x, y + this.cellSize);
                    this.ctx.stroke();
                }
            }
        }
    }

    async solveMaze(algorithm) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.disableButtons();
        this.clearPath();
        
        let solver;
        let algoName;
        
        switch (algorithm) {
            case 'dfs':
                solver = new DFSSolver(this.maze);
                algoName = 'DFS (Depth-First)';
                break;
            case 'bfs':
                solver = new BFSSolver(this.maze);
                algoName = 'BFS (Breadth-First)';
                break;
            case 'astar':
                solver = new AStarSolver(this.maze);
                algoName = 'A* (Heuristic)';
                break;
        }

        this.statusBadge.textContent = `Solving with ${algoName}...`;
        const startTime = performance.now();
        
        const result = solver.solve();
        
        await this.animateSolution(result.visited, result.path);
        
        const endTime = performance.now();
        const timeTaken = (endTime - startTime).toFixed(2);
        
        this.updateStats(algoName, result.path.length, result.visited.length, timeTaken);
        this.statusBadge.textContent = 'Solved!';
        this.isAnimating = false;
        this.enableButtons();
    }

    async animateSolution(visited, path) {
        const delay = [50, 30, 15, 5, 1][this.animationSpeed - 1];

        // Animate visited cells
        for (const cell of visited) {
            if (cell.row === this.maze.start.row && cell.col === this.maze.start.col) continue;
            if (cell.row === this.maze.end.row && cell.col === this.maze.end.col) continue;
            
            this.drawCell(cell, '#bee3f8');
            await this.sleep(delay);
        }

        // Animate path
        for (const cell of path) {
            if (cell.row === this.maze.start.row && cell.col === this.maze.start.col) continue;
            if (cell.row === this.maze.end.row && cell.col === this.maze.end.col) continue;
            
            this.drawCell(cell, '#ffd700');
            await this.sleep(delay * 2);
        }
    }

    drawCell(cell, color) {
        const x = cell.col * this.cellSize;
        const y = cell.row * this.cellSize;
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
    }

    async raceAlgorithms() {
        if (this.isAnimating) return;

        this.raceResults.classList.add('hidden');
        const results = [];

        for (const algo of ['dfs', 'bfs', 'astar']) {
            this.clearPath();
            
            let solver;
            let algoName;
            
            switch (algo) {
                case 'dfs':
                    solver = new DFSSolver(this.maze);
                    algoName = 'DFS';
                    break;
                case 'bfs':
                    solver = new BFSSolver(this.maze);
                    algoName = 'BFS';
                    break;
                case 'astar':
                    solver = new AStarSolver(this.maze);
                    algoName = 'A*';
                    break;
            }

            const startTime = performance.now();
            const result = solver.solve();
            const endTime = performance.now();

            results.push({
                name: algoName,
                pathLength: result.path.length,
                cellsVisited: result.visited.length,
                timeTaken: (endTime - startTime).toFixed(2),
                efficiency: result.path.length > 0 ? 
                    ((result.path.length / result.visited.length) * 100).toFixed(1) : 0
            });
        }

        this.showRaceResults(results);
    }

    showRaceResults(results) {
        // Find winner (shortest path)
        const winner = results.reduce((prev, curr) => 
            curr.pathLength < prev.pathLength ? curr : prev
        );

        this.resultsGrid.innerHTML = results.map(result => `
            <div class="result-card ${result.name === winner.name ? 'winner' : ''}">
                <h3>${result.name}</h3>
                <div class="result-stat">
                    <strong>Path Length:</strong>
                    <span>${result.pathLength} cells</span>
                </div>
                <div class="result-stat">
                    <strong>Cells Visited:</strong>
                    <span>${result.cellsVisited}</span>
                </div>
                <div class="result-stat">
                    <strong>Time:</strong>
                    <span>${result.timeTaken}ms</span>
                </div>
                <div class="result-stat">
                    <strong>Efficiency:</strong>
                    <span>${result.efficiency}%</span>
                </div>
            </div>
        `).join('');

        this.raceResults.classList.remove('hidden');
    }

    clearPath() {
        this.maze.reset();
        this.drawMaze();
        this.clearStats();
    }

    resetMaze() {
        this.generateNewMaze();
    }

    clearStats() {
        this.currentAlgo.textContent = '-';
        this.pathLength.textContent = '-';
        this.cellsVisited.textContent = '-';
        this.timeTaken.textContent = '-';
        this.efficiency.textContent = '-';
    }

    updateStats(algoName, pathLen, visited, time) {
        this.currentAlgo.textContent = algoName;
        this.pathLength.textContent = pathLen + ' cells';
        this.cellsVisited.textContent = visited;
        this.timeTaken.textContent = time + 'ms';
        const eff = pathLen > 0 ? ((pathLen / visited) * 100).toFixed(1) : 0;
        this.efficiency.textContent = eff + '%';
    }

    handleCanvasClick(e) {
        if (!this.drawMode || this.isAnimating) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        if (row >= 0 && row < this.maze.rows && col >= 0 && col < this.maze.cols) {
            const cell = this.maze.grid[row][col];
            
            // Toggle walls (simple implementation - toggle all walls)
            const hasWalls = cell.walls.top || cell.walls.right || 
                           cell.walls.bottom || cell.walls.left;
            
            cell.walls.top = !hasWalls;
            cell.walls.right = !hasWalls;
            cell.walls.bottom = !hasWalls;
            cell.walls.left = !hasWalls;

            this.drawMaze();
        }
    }

    disableButtons() {
        this.generateBtn.disabled = true;
        this.solveDFSBtn.disabled = true;
        this.solveBFSBtn.disabled = true;
        this.solveAStarBtn.disabled = true;
        this.solveAllBtn.disabled = true;
    }

    enableButtons() {
        this.generateBtn.disabled = false;
        this.solveDFSBtn.disabled = false;
        this.solveBFSBtn.disabled = false;
        this.solveAStarBtn.disabled = false;
        this.solveAllBtn.disabled = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===================================
// Initialize Application
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new MazeVisualizerUI();
    console.log('🚀 Maze Generator & Solver loaded!');
    console.log('💡 Generate a maze and watch the algorithms race!');
});

