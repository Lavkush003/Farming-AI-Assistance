# FarmingHub - Digital Agriculture Platform 🌾🐝
FarmingHub is a modern digital marketplace designed to connect farmers with quality agricultural inputs, tools, and buyers. It simplifies the supply chain with a transparent, technology-driven ecosystem.
## 🚀 Features
### 🛒 User Features
*   **Authentication**: Secure Login and Registration system.
*   **Product Discovery**: Browse a wide range of agricultural products (Seeds, Tools, etc.).
*   **Shopping Cart**: Add items to cart and view purchase summary.
*   **Dark/Light Mode**: Full theme support for comfortable viewing in any lighting.
*   **AI Assistant (Bee Bot 🐝)**: A persistent chatbot to help with navigation, selling, and account queries.
### 💼 Seller Features
*   **Seller Dashboard**: Dedicated panel for sellers to manage inventory.
*   **Product Management**: Add new products with details, pricing, and categories.
*   **Image Upload**: Upload product images directly (Base64 support).
*   **Real-time Updates**: Instant visualization of new products in the inventory grid.
*   **Inventory Control**: Delete old or out-of-stock products.
## 🛠️ Tech Stack
*   **Frontend**: React (Vite), Context API (Auth & Theme), Bootstrap 5.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose).
*   **Styling**: Custom CSS, Glassmorphism design elements.
## 📂 Project Structure
```text
FarmingHub/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/         # Images, Videos, Icons
│   │   ├── components/
│   │   │   ├── chatbot/    # AI Assistant Component
│   │   │   ├── footer/     # Application Footer
│   │   │   ├── navbar/     # Navigation & User Profile
│   │   │   └── pages/      # Home, Products, Cart, Login, SellerDashboard
│   │   ├── context/        # Global State (Auth, Theme, Cart)
│   │   ├── App.jsx         # Main Component Routing
│   │   └── main.jsx        # Entry Point
│   └── index.html          # HTML Template
│
└── server/                 # Backend (Node + Express)
    ├── config/             # Database Configuration
    ├── controllers/        # Logic for Products & Auth
    ├── models/             # Mongoose Schemas (User, Product)
    ├── routes/             # API Endpoints
    └── server.js           # Server Entry Point
```

## ⚙️ Installation & Usage

### Prerequisites
*   Node.js installed
*   MongoDB running locally or cloud URI

### 1. Setup Backend
```bash
cd server
npm install
# Configure your MongoDB URI in config/db.js or .env
npm start
# Server runs on http://localhost:5000
```
    
### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

## 📝 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login user |
| **GET** | `/api/products` | Get all products |
| **POST** | `/api/products` | Create a new product |
| **GET** | `/api/products/my-products/:id` | Get seller's inventory |
| **DELETE** | `/api/products/:id` | Delete a product |

---
*Built with ❤️ for the Farming Community*
