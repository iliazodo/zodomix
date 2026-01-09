# [Zodomix](https://zodomix.com/)

**Zodomix** is an anonymous group chat app where users can message without signup. Users get random usernames but can sign up for permanent IDs and extra features like creating private/public groups and controlling anonymity.
LINK ➡️ [https://zodomix.com](https://zodomix.com)

## Features

- Anonymous chatting with random usernames  
- Multiple group categories to switch between  
- Signup option for permanent human-like IDs and profile pictures  
- Create one group per user (private with password or public)  
- Control username visibility in groups  
- Free business promotion in ADS group  
- Unique theme design  
- Group AI chat powered by OpenRouter API  

## Tech Stack

- MongoDB  
- Express.js  
- React (Vite)  
- Node.js  
- OpenRouter API for AI chat
- Socket.io

## Installation

1. Clone the repo:  
   ```bash
   git clone https://github.com/iliazodo/zodomix.git
   ```
2. Install dependencies:
    ```ini
    npm install
    cd frontend
    npm install
    ```
3. Create a .env file in the root with the following variables:
    ```bash
    PORT=your_port
    MONGO_DB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    SENDGRID_API_KEY=your_sendgrid_key (optional)
    TELEGRAM_BOT_TOKEN=your_telegram_token (optional)
    TELEGRAM_CHAT_ID=your_telegram_chat_id (optional)
    OPENROUTER_API_KEY=your_openrouter_key
    ```
4. Run backend server:
    ```bash
    npm run server
    ```
5. Run frontend:
    ```bash
    cd frontend
    npm run dev
    ```
6. Open http://localhost:5173 in your browser

## License
MIT License — code is protected; copying not allowed.

## Author
Zodo
