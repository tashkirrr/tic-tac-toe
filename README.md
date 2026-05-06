# Unbeatable Tic-Tac-Toe — Glassmorphism Edition

> **A perfect implementation of the classic game, powered by a depth-weighted Minimax algorithm and a stunning modern UI.**

This repository features two versions of the classic Tic-Tac-Toe game: a **high-performance Python CLI** and a **premium Glassmorphism Web App**. Both versions share a common brain: an unbeatable AI that calculates every possible move to ensure it never loses.

![Tic-Tac-Toe Web Preview](https://raw.githubusercontent.com/tashkirrr/tic-tac-toe/main/preview.png) *(Note: Placeholder for your project screenshot)*

---

## 🎮 The Experience

### 💎 Web Version (Modern & Fluid)
Built with pure Vanilla JavaScript and CSS, the web version focuses on aesthetics and "juice":
-   **Glassmorphism UI**: High-end translucent cards, blurred backgrounds, and neon glow effects.
-   **Micro-Animations**: Cell placement pops, win-line drawing animations, and floating background orbs.
-   **Smart Opponent**: Select your difficulty from "Chill" (Random) to "God-Mode" (Unbeatable).
-   **Responsive Design**: Plays perfectly on mobile, tablet, and desktop.

### 🐍 Python Version (Robust & Logical)
A clean, object-oriented implementation of the game logic:
-   **Modular Design**: Decoupled `Player` and `Game` classes for easy extensibility.
-   **Minimax Core**: The engine that powers the AI, optimizing for the fastest win or the longest survival.

---

## 🧠 The Brain: Minimax Algorithm

The "Smart" player uses the Minimax algorithm—a decision-making process used in game theory.
-   **Victory**: AI assigns $+1$ point (minus moves taken) to prioritize faster wins.
-   **Defeat**: AI assigns $-1$ point (plus moves taken) to delay the inevitable.
-   **Draw**: $0$ points.

By recursively simulating the game tree, the AI can see the end of the game before you've even made your second move. Against the "God-Mode" AI, the best you can hope for is a draw.

---

## 🚀 Quick Start

### Play in the Browser (Web)
Simply open `index.html` in any modern browser. 
No build steps, no dependencies, no installation required.

### Play in the Terminal (Python)
1.  Ensure you have Python installed.
2.  Run the game:
    ```bash
    python game.py
    ```

---

## 🛠 Technical Stack

-   **Frontend**: JavaScript (ES6), HTML5, CSS3 (Custom Glassmorphism System).
-   **Backend/Logic**: Python 3.x.
-   **Algorithms**: Minimax with Alpha-Beta Pruning.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## ⚖ License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Handcrafted with precision by [Tashkir](https://github.com/tashkirrr).*
