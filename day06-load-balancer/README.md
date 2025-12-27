# ⚖️ Load Balancer Simulator

> **Day 6 of Real-World Applications** | See how Consistent Hashing distributes traffic!

## 🎯 Project Overview

An interactive load balancer simulator that visualizes **Consistent Hashing** - the algorithm that powers AWS, CDNs, Redis, and distributed systems worldwide! Watch how traffic distributes across servers with minimal rebalancing.

**[🚀 Live Demo](#)** | **[📖 View Code](https://github.com/Tyagirohan/Real-World-Applications/tree/main/day06-load-balancer)**

## ✨ Features

### 🖥️ Server Management
- Add/remove servers dynamically
- See real-time load distribution
- Visual server list with request counts

### 📊 Traffic Simulation
- Simulate 10-1000 requests
- Adjustable virtual nodes (1-10)
- See distribution instantly

### 🔄 Hash Ring Visualization
- Interactive circular ring (0-360°)
- Server positions marked
- Virtual nodes displayed
- Request routing visualization

### ⚖️ Two Strategies
- **Consistent Hashing** - Minimal rebalancing
- **Naive Modulo** - For comparison

### 📊 Real-Time Statistics
- Total servers/requests
- Average load per server
- Load variance
- Max load tracking

## 🧠 Consistent Hashing Deep Dive

### The Problem
**Naive approach (hash % n):**
- Add/remove server → ALL keys rehash!
- 100% of traffic moves
- Cache invalidation disaster

**Consistent Hashing solution:**
- Add/remove server → only ~1/n keys move!
- Minimal disruption
- Perfect for distributed systems

### How It Works
1. **Hash Ring**: Circular space (0-360°)
2. **Hash Servers**: Map each server to ring positions
3. **Hash Requests**: Map each request to a position
4. **Route Clockwise**: Request goes to next server clockwise
5. **Virtual Nodes**: Each server appears multiple times for even distribution

### Example
3 servers (A, B, C), 100 requests:
- Add server D → Only ~25 requests move!
- Remove server B → Only ~33 requests move!
- With naive: ALL 100 would move!

## 🌟 Real-World Uses

- **AWS/Cloud**: Load balancers, auto-scaling
- **CDNs**: CloudFlare, Akamai edge routing
- **Databases**: Cassandra, DynamoDB sharding
- **Caches**: Redis/Memcached clusters
- **Streaming**: Netflix, YouTube servers

## 🎮 How to Use

1. **Add Servers**: Enter names, click "➕ Add Server"
2. **Adjust Settings**: Virtual nodes slider (more = better distribution)
3. **Simulate Traffic**: Set request count, click "🚀 Simulate"
4. **View Tabs**:
   - Ring: See hash ring visualization
   - Distribution: Bar chart of loads
   - Comparison: vs Naive modulo

### Try the Demos
- **Add Server Demo**: See rebalancing when adding
- **Remove Server Demo**: See rebalancing when removing

## 🚀 Running Locally

```bash
git clone https://github.com/Tyagirohan/Real-World-Applications.git
cd Real-World-Applications/day06-load-balancer
# Open index.html!
```

## 💡 Fun Facts

**🎓 MIT 1997**: Invented at MIT for web caching!

**🔥 Amazon Dynamo (2007)**: Popularized the technique. Now industry standard!

**⚡ Virtual Nodes**: Solves uneven distribution. Each server gets 100-200 positions!

## 📄 License

MIT License

---

**Built with ❤️ by [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)**

*Part of #RealWorldApplications series!*

[← Day 5: Image Compressor](../day05-image-compressor) | [Week 4 →](#)

