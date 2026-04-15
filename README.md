# tic-tac-toe
This repository presents a sophisticated Tic Tac Toe game developed in Python utilizing an object oriented approach to facilitate a seamless gaming experience

---

## Key Features

* **Diverse Player Modes:** The system incorporates three distinct player types, including a manual HumanPlayer a RandomComputerPlayer and a highly strategic SmartComputerPlayer
* **Unbeatable AI:** The implementation of the Minimax algorithm ensures that the computer opponent makes optimal decisions, effectively preventing the human player from winning
* **Modular Architecture:** By decoupling the game logic from the player mechanics the codebase remains organized and easily extensible
* **Interactive Console Display:** The game provides a clear text based visual representation of the board that updates dynamically after each move

---

 Installation & Usage

1.  **Clone the repository:**
    ```bash
    [git clone https://github.com/tashkirrr/tic-tac-toe.git]
    cd tic-tac-toe.git
    ```

2.  **Run the game:**
    ```bash
    python game.py
    ```

3.  **How to Play:**
    * The board is indexed **0-8** (top-left to bottom-right).
    * When prompted, enter the number of the square where you want to place your move.

---

## Technical Stack

* **Programming Language:** Python
* **Core Libraries:** math time and random
* **Algorithmic Foundation:** Minimax Algorithm for decision theory and state space search

## Algorithm Overview: Minimax Logic

The SmartComputerPlayer is designed to achieve a perfect score by evaluating every possible future state of the game. It assigns numerical values to terminal outcomes to guide its decision making process

* **Victory:** $+1$ adjusted by the number of remaining empty squares to prioritize faster wins
* **Defeat:** $-1$ adjusted to delay potential losses
* **Draw:** $0$

The algorithm recursively simulates every move to maximize the AI’s advantage while simultaneously minimizing the player's opportunities.
---
