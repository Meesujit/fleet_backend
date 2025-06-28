# 🚚 FleetLink - Backend

FleetLink is a logistics vehicle booking system built for B2B clients. This backend service powers the vehicle management, availability checking, and booking logic.

---

## 🔧 Tech Stack

- **Node.js** + **Express** - REST API backend
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Jest** - Unit testing
- **Docker** + **Docker Compose** - Containerization and orchestration

---

## 📦 Features

- Add new logistics vehicles with capacity and tyre details.
- Search available vehicles based on route, capacity, and start time.
- Book vehicles while preventing overlapping bookings.
- Ride duration based on pincode difference logic.
- Containerized with Docker for easy deployment.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fleetlink-backend.git
cd fleetlink-backend
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Create a .env File
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/fleetlink
```
### 4. Run the Server
```bash
npm run dev
# The API will be running on: http://localhost:5000
```
### 🧪 Running Tests
```bash
npm test
```
### 🐳 Docker Setup
1. Build and Start with Docker Compose
```bash
docker-compose up --build
# This will start the backend service and MongoDB container together.
```
### 2. Access the API
```bash
http://localhost:5000/api/...
```
