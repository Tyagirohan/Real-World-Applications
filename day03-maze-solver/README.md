# 🎮 Maze Generator & Solver

> **Day 3 of Real-World Applications** | Watch DFS, BFS, and A* algorithms race to find the exit!

## 🎯 Project Overview

An interactive maze generator and pathfinding visualizer that creates perfect mazes using DFS and then lets you watch three different algorithms race to solve them! See how DFS, BFS, and A* compare in real-time.

**[🚀 Live Demo](#)** | **[📖 View Code](https://github.com/Tyagirohan/Real-World-Applications/tree/main/day03-maze-solver)**

## ✨ Features

### 🏗️ Maze Generation
- **DFS (Recursive Backtracking)** for perfect maze generation
- Creates mazes with exactly one solution path
- Adjustable maze size (10×10 to 50×50)
- Generate new random mazes instantly

### 🚀 Three Solving Algorithms
1. **🔵 DFS (Depth-First Search)**
   - Stack-based exploration
   - Goes deep, backtracks when stuck
   - Memory-efficient

2. **🟢 BFS (Breadth-First Search)**
   - Queue-based exploration
   - Explores level by level
   - **Guarantees shortest path!**

3. **🟡 A* (A-Star Search)**
   - Heuristic-guided search
   - Uses Manhattan distance
   - **Most efficient pathfinding!**

### 🏁 Algorithm Race Mode
- Run all three algorithms simultaneously
- Compare performance side-by-side
- See which finds the shortest path
- Track efficiency metrics

### 🎨 Visual Features
- ✅ **Animated solving** - Watch algorithms in action!
- ✅ **Speed control** - Very Slow to Very Fast
- ✅ **Color-coded visualization**:
  - 🟢 Green = Start
  - 🔴 Red = End
  - 🔵 Blue = Visited cells
  - 🟡 Gold = Solution path
- ✅ **Interactive canvas** - Click to draw walls

### 📊 Real-Time Statistics
- Algorithm name
- Path length (solution)
- Cells visited (exploration)
- Time taken (milliseconds)
- Efficiency percentage

## 🧠 Algorithm Deep Dive

### Maze Generation: DFS (Recursive Backtracking)

Creates "perfect mazes" - exactly one path between any two points!

**How it works:**
1. Start at random cell
2. Mark as visited, choose random unvisited neighbor
3. Remove wall between current and neighbor
4. Move to neighbor, repeat
5. Backtrack when stuck

**Complexity:** O(V + E) where V = cells, E = edges

### DFS Solving (Depth-First Search)

```javascript
class DFSSolver {
    solve() {
        const stack = [startCell];
        
        while (stack.length > 0) {
            const current = stack.pop(); // LIFO
            
            if (current === endCell) {
                return path;
            }
            
            for (const neighbor of getNeighbors(current)) {
                if (!visited[neighbor]) {
                    stack.push(neighbor);
                }
            }
        }
    }
}
```

**Pros:** Memory efficient (O(h) space)  
**Cons:** Doesn't guarantee shortest path

### BFS Solving (Breadth-First Search)

```javascript
class BFSSolver {
    solve() {
        const queue = [startCell];
        
        while (queue.length > 0) {
            const current = queue.shift(); // FIFO
            
            if (current === endCell) {
                return path; // Guaranteed shortest!
            }
            
            for (const neighbor of getNeighbors(current)) {
                if (!visited[neighbor]) {
                    queue.push(neighbor);
                }
            }
        }
    }
}
```

**Pros:** Guarantees shortest path in unweighted graphs  
**Cons:** Higher memory usage (O(w) space)

### A* Solving (Heuristic Search)

```javascript
class AStarSolver {
    solve() {
        // f(n) = g(n) + h(n)
        // g(n) = actual distance from start
        // h(n) = heuristic (Manhattan distance to goal)
        
        while (openSet.length > 0) {
            const current = getLowestFScore(openSet);
            
            if (current === endCell) {
                return path; // Optimal!
            }
            
            for (const neighbor of getNeighbors(current)) {
                const tentativeG = gScore[current] + 1;
                
                if (tentativeG < gScore[neighbor]) {
                    gScore[neighbor] = tentativeG;
                    fScore[neighbor] = tentativeG + heuristic(neighbor, end);
                }
            }
        }
    }
}
```

**Pros:** Most efficient, optimal pathfinding  
**Cons:** Requires good heuristic function

## ⚔️ Algorithm Comparison

| Algorithm | Time | Space | Shortest Path? | Best For |
|-----------|------|-------|----------------|----------|
| **🔵 DFS** | O(V+E) | O(h) | ❌ No | Memory-efficient exploration |
| **🟢 BFS** | O(V+E) | O(w) | ✅ Yes | Unweighted shortest path |
| **🟡 A*** | O(b^d) | O(b^d) | ✅ Yes | Optimal pathfinding |

**h** = height, **w** = width, **b** = branching factor, **d** = depth

## 🌟 Real-World Applications

These algorithms power:

- **🎮 Game AI** - Pac-Man ghosts, NPC pathfinding, RTS games
- **🤖 Robotics** - Warehouse robots, self-driving cars, drones
- **🗺️ GPS Navigation** - Google Maps, Waze optimal routing
- **🧩 Puzzle Solving** - Rubik's cube, Sudoku solvers
- **🌐 Network Routing** - Internet packet routing
- **🏗️ Level Design** - Procedural dungeon generation

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No frameworks!
- **HTML5 Canvas** - Smooth rendering
- **CSS3** - Beautiful animations
- **Algorithms**: DFS, BFS, A*, Recursive Backtracking

## 📖 Key Learnings

### Algorithms
- ✅ DFS (Depth-First Search) - Stack-based
- ✅ BFS (Breadth-First Search) - Queue-based
- ✅ A* (A-Star) - Priority queue with heuristics
- ✅ Recursive Backtracking - Maze generation

### Data Structures
- ✅ Stack (DFS)
- ✅ Queue (BFS)
- ✅ Priority Queue (A*)
- ✅ Graph representation (grid as graph)

### Concepts
- ✅ Pathfinding algorithms
- ✅ Heuristic functions (Manhattan distance)
- ✅ Graph traversal
- ✅ Animation and visualization

## 🎮 How to Use

### Generate Maze
1. Adjust **Maze Size** slider (10×10 to 50×50)
2. Click **"🎲 Generate New Maze"**
3. Watch DFS carve the paths!

### Solve Maze
1. Choose an algorithm:
   - **🔵 DFS** - Fast but not optimal
   - **🟢 BFS** - Guaranteed shortest path
   - **🟡 A*** - Most efficient
2. Watch the animation!
3. Check the stats

### Race Mode
1. Click **"🏁 Race All Algorithms!"**
2. All three run sequentially
3. See comparison results
4. Winner gets 🏆 trophy!

### Drawing Mode
1. Enable **"✏️ Draw Mode"**
2. Click cells to add/remove walls
3. Create custom mazes!

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Tyagirohan/Real-World-Applications.git

# Navigate to project
cd Real-World-Applications/day03-maze-solver

# Open in browser
# Just open index.html - no build needed!
```

## 🎨 UI Highlights

- **Pink/Red gradient theme** (game-inspired)
- **Canvas-based rendering** for smooth animations
- **Speed control** (5 levels)
- **Real-time stats** display
- **Race results modal** with winner highlight

## 💡 Fun Facts

### 🎮 Pac-Man Ghosts
Each ghost uses different AI:
- **Blinky** (Red): Uses A* to chase you
- **Pinky** (Pink): Predicts your moves 4 tiles ahead
- **Inky** (Cyan): Uses complex vector math
- **Clyde** (Orange): Random pathfinding!

### 🧩 Perfect Mazes
A "perfect maze" has:
- Exactly **one path** between any two points
- **No loops** or isolated sections
- **All cells connected**

Our DFS generator creates perfect mazes!

### ⚡ A* in Action
Google Maps uses A* (and variants) to find routes among **billions** of road segments in **milliseconds**!

## 💡 Future Enhancements

Possible additions:
- More algorithms (Dijkstra, Greedy Best-First)
- Different maze generation algorithms (Prim's, Kruskal's)
- Diagonal movement
- Weighted cells (terrain costs)
- Save/load mazes

## 🤝 Contributing

Found a bug or want to add features? PRs welcome!

## 📄 License

MIT License - feel free to use for learning!

---

**Built with ❤️ by [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)**

*Part of the #RealWorldApplications series - Building practical projects with algorithms!*

[← Day 2: Autocomplete](../day02-autocomplete) | [Day 4: Expression Evaluator →](#)

