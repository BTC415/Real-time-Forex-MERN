# Real-time-Forex-MERN
A real-time collaborative workspace application for forex trading, built with the MERN stack and Socket.io.

## Features

- 🔐 JWT-based Authentication
- 💬 Real-time Chat Channels
- 📊 Live Forex Price Updates
- 👥 Role-based Access Control
- 🔔 Real-time Notifications
- 📱 Responsive Design

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BTC415/Real-time-Forex-MERN.git
cd Real-time-Forex-MERN
```

2. Install dependencies:
```
cd server && npm install
cd ../src && npm install
```

3. Set up environment variables:
```
VITE_API_URL=http://localhost:3001/
VITE_CLIENT_URL=http://localhost:5173/
MONGODB_URI=
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

### Running the Application

1. Start the backend server:
```
cd server && npm start
```

2. Start the frontend development server:
```
cd src && npm run dev
```

### API Endpoints

#### Authentication

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - User login
- **GET** `/api/auth/validate` - Validate JWT token
- **PUT** `/api/auth/update` - Update user profile

#### User Roles
- Admin: Full access, can manage channels
- Trader: Access to trading channels and chat
- Guest: Limited access to public channels

#### Available Currency Pairs
- EUR/USD
- GBP/USD
- USD/JPY
- USD/CHF

#### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Secure API endpoints

## Contributing
- Fork the repository
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## License
This project is licensed under the [LICENSE](https://github.com/BTC415/Real-time-Forex-MERN/blob/master/LICENSE) - see the LICENSE file for details.


