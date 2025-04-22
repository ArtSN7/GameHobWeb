# GameHob

Welcome to the **GameHob**, a modern, interactive gaming platform built with **React**, **Vite**, and **Tailwind CSS**, with robust backend integration via **Supabase**.



---

## 📂 Project Structure

```
frontend/
├── server.js              # Development server
├── public/                # Static assets
└── src/                   # Source code
    ├── index.css          # Global styles
    ├── main.jsx           # Application entry point
    ├── components/        # Reusable components
    │   ├── App.jsx        # Main application component
    │   ├── ErrorBoundary.jsx
    │   ├── ui/            # UI components
    ├── context/           # React context
    │   └── UserContext.jsx
    ├── lib/               # Utility libraries
    │   ├── supabase.js    # Supabase integration
    │   └── utils.js       # Utility functions
    ├── navigation/        # Navigation-related code
    │   └── routes.jsx
    └── pages/             # Application pages
        ├── Auth/          # Authentication pages
        ├── Blackjack/     # Blackjack game
        ├── HomePage/      # Home page
        ├── Plinko/        # Plinko game
        ├── Slots/         # Slots game
        └── Scratch/       # Scratch card game
```

---

## ✨ Features

- **React**: Component-based architecture for dynamic, reusable UI.
- **Vite**: Lightning-fast development server and optimized build tool.
- **Tailwind CSS**: Utility-first CSS framework for rapid, customizable styling.
- **Supabase**: Backend integration for authentication, real-time database, and storage.
- **Error Boundaries**: Robust error handling with `ErrorBoundary` for a stable UX.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
- **Interactive Games**: Engaging games including Blackjack, Plinko, Slots, and Scratch Cards.

---
## 🕹️ Games Overview

### Blackjack
- **Objective**: Beat the dealer by getting a hand closer to 21 without going over.
- **Features**: Split, Double Down, Insurance, and intuitive gameplay.

### Plinko
- **Objective**: Drop a ball to land in a multiplier slot for payouts.
- **Features**: Realistic physics, dynamic animations, and exciting rewards.

### Slots
- **Objective**: Spin the reels to align symbols for winnings.
- **Features**: High-value symbols, special combinations, and vibrant visuals.

### Scratch Cards
- **Objective**: Reveal safe cells while avoiding bombs to win.
- **Features**: Cash-out options and multiplier-based rewards.


## 📜 License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for details.
