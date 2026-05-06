/**
 * Neon Arena — Tic-Tac-Toe
 * Modern ES2023 + Minimax AI + Confetti + Animations
 */

'use strict';

/* =====================================================================
   CONSTANTS & WINNING PATTERNS
   ===================================================================== */
const WIN_PATTERNS = [
  [0,1,2], [3,4,5], [6,7,8],   // rows
  [0,3,6], [1,4,7], [2,5,8],   // cols
  [0,4,8], [2,4,6],             // diagonals
];

// SVG line coords [x1,y1,x2,y2] in a 3×3 grid coordinate space (centre of cells)
const WIN_LINE_COORDS = {
  '0,1,2': [0.5, 0.5, 2.5, 0.5],
  '3,4,5': [0.5, 1.5, 2.5, 1.5],
  '6,7,8': [0.5, 2.5, 2.5, 2.5],
  '0,3,6': [0.5, 0.5, 0.5, 2.5],
  '1,4,7': [1.5, 0.5, 1.5, 2.5],
  '2,5,8': [2.5, 0.5, 2.5, 2.5],
  '0,4,8': [0.5, 0.5, 2.5, 2.5],
  '2,4,6': [2.5, 0.5, 0.5, 2.5],
};

const QUOTES_WIN  = ['Brilliant play! 🔥', 'Unstoppable! ⚡', 'Nailed it! 💥', 'Legendary! 👑', 'Too good! 🎯'];
const QUOTES_DRAW = ['So close! 🤝', 'Perfectly balanced ⚖️', 'Great minds think alike 🧠', 'Stalemate! 🕹️'];

/* =====================================================================
   STATE
   ===================================================================== */
const state = {
  mode:           'pvp',   // 'pvp' | 'pva'
  difficulty:     'hard',  // 'easy' | 'medium' | 'hard'
  board:          Array(9).fill(null),
  current:        'X',
  startingPlayer: 'X',    // alternates X→O→X→O each new round
  scores:         { X: 0, O: 0, draw: 0 },
  gameOver:       false,
  aiThinking:     false,
};

/* =====================================================================
   DOM REFS
   ===================================================================== */
const $ = id => document.getElementById(id);

const dom = {
  screenMode:    $('screenMode'),
  screenGame:    $('screenGame'),
  btnPvP:        $('btnPvP'),
  btnPvAI:       $('btnPvAI'),
  diffRow:       $('difficultyRow'),
  diffBtns:      document.querySelectorAll('.diff-btn'),
  btnStart:      $('btnStartGame'),
  board:         $('board'),
  statusText:    $('statusText'),
  statusBanner:  document.querySelector('.status-banner'),
  scoreValX:     $('scoreValX'),
  scoreValO:     $('scoreValO'),
  drawCount:     $('drawCount'),
  nameO:         $('nameO'),
  scoreCardX:    $('scoreX'),
  scoreCardO:    $('scoreO'),
  btnMenu:       $('btnMenu'),
  btnReset:      $('btnReset'),
  btnResetScore: $('btnResetScore'),
  resultOverlay: $('resultOverlay'),
  resultEmoji:   $('resultEmoji'),
  resultTitle:   $('resultTitle'),
  resultSub:     $('resultSub'),
  btnPlayAgain:  $('btnPlayAgain'),
  btnMainMenu:   $('btnMainMenu'),
  winLine:       $('winLine'),
  confettiCanvas:$('confettiCanvas'),
};

/* =====================================================================
   SCREEN MANAGEMENT
   ===================================================================== */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });
  const target = $(id);
  target.style.display = 'flex';
  // Force reflow for animation
  void target.offsetWidth;
  target.classList.add('active');
}

/* =====================================================================
   BOARD SETUP
   ===================================================================== */
function buildBoard() {
  dom.board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${i + 1}`);
    cell.dataset.index = i;
    cell.addEventListener('click', onCellClick);
    cell.addEventListener('mouseenter', onCellHover);
    cell.addEventListener('mouseleave', onCellLeave);
    dom.board.appendChild(cell);
  }
}

function getCells() {
  return Array.from(dom.board.querySelectorAll('.cell'));
}

/* =====================================================================
   GAME LOGIC
   ===================================================================== */
function onCellClick(e) {
  const idx = parseInt(e.currentTarget.dataset.index);
  if (state.board[idx] || state.gameOver || state.aiThinking) return;
  makeMove(idx, state.current);
}

function onCellHover(e) {
  const cell = e.currentTarget;
  const idx = parseInt(cell.dataset.index);
  if (state.board[idx] || state.gameOver || state.aiThinking) return;
  cell.classList.add(state.current === 'X' ? 'preview-x' : 'preview-o');
  cell.textContent = state.current;
  cell.style.opacity = '0.3';
}

function onCellLeave(e) {
  const cell = e.currentTarget;
  const idx = parseInt(cell.dataset.index);
  if (state.board[idx]) return;
  cell.classList.remove('preview-x', 'preview-o');
  cell.textContent = '';
  cell.style.opacity = '';
}

function makeMove(idx, player) {
  state.board[idx] = player;
  renderCell(idx, player);
  const result = checkResult(state.board);
  if (result) {
    endGame(result);
    return;
  }
  state.current = state.current === 'X' ? 'O' : 'X';
  updateTurnUI();

  if (state.mode === 'pva' && state.current === 'O' && !state.gameOver) {
    scheduleAI();
  }
}

function renderCell(idx, player) {
  const cells = getCells();
  const cell = cells[idx];
  cell.textContent = player;
  cell.classList.add(player.toLowerCase(), 'taken', 'pop');
  cell.removeEventListener('mouseenter', onCellHover);
  cell.removeEventListener('mouseleave', onCellLeave);
  cell.style.opacity = '';
  cell.setAttribute('aria-label', `Cell ${idx + 1}: ${player}`);
}

function updateTurnUI() {
  const isX = state.current === 'X';
  dom.scoreCardX.classList.toggle('active-turn', isX);
  dom.scoreCardO.classList.toggle('active-turn', !isX);

  if (state.mode === 'pva' && state.current === 'O') {
    dom.statusText.innerHTML = 'AI is thinking<span class="thinking-dots"><span></span><span></span><span></span></span>';
  } else {
    // Determine the name to display based on mode and player
    let playerName;
    if (state.mode === 'pva') {
      playerName = state.current === 'X' ? 'Player 1' : 'AI';
    } else {
      playerName = state.current === 'X' ? 'Player 1' : 'Player 2';
    }
    dom.statusText.textContent = `${playerName}'s turn`;
  }
}

/* =====================================================================
   WIN / DRAW DETECTION
   ===================================================================== */
function checkResult(board) {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], pattern };
    }
  }
  if (board.every(Boolean)) return { winner: null, pattern: null };
  return null;
}

/* =====================================================================
   END GAME
   ===================================================================== */
function endGame(result) {
  state.gameOver = true;
  const { winner, pattern } = result;

  if (winner) {
    drawWinLine(pattern);
    highlightWinCells(pattern);
    state.scores[winner]++;
    updateScoreDisplay(winner);
    const quote = QUOTES_WIN[Math.floor(Math.random() * QUOTES_WIN.length)];
    const name  = winner === 'X' ? 'Player 1' : (state.mode === 'pva' ? 'AI' : 'Player 2');
    dom.statusText.textContent = `${winner} wins! 🎉`;
    showResult(`Player ${winner} Wins!`, quote, winner === 'X' ? '🏆' : (state.mode === 'pva' ? '🤖' : '🏆'));
    launchConfetti(winner);
  } else {
    state.scores.draw++;
    animateBump(dom.drawCount);
    dom.drawCount.textContent = state.scores.draw;
    const quote = QUOTES_DRAW[Math.floor(Math.random() * QUOTES_DRAW.length)];
    dom.statusText.textContent = "It's a draw!";
    showResult("It's a Draw!", quote, '🤝');
  }
}

function highlightWinCells(pattern) {
  const cells = getCells();
  pattern.forEach(i => cells[i].classList.add('win-cell'));
}

function drawWinLine(pattern) {
  const key = pattern.join(',');
  const coords = WIN_LINE_COORDS[key];
  if (!coords) return;
  const [x1, y1, x2, y2] = coords;
  dom.winLine.setAttribute('x1', x1);
  dom.winLine.setAttribute('y1', y1);
  dom.winLine.setAttribute('x2', x2);
  dom.winLine.setAttribute('y2', y2);

  // Animate dash
  requestAnimationFrame(() => {
    dom.winLine.classList.add('draw');
  });
}

function clearWinLine() {
  dom.winLine.classList.remove('draw');
  dom.winLine.setAttribute('x1', 0); dom.winLine.setAttribute('y1', 0);
  dom.winLine.setAttribute('x2', 0); dom.winLine.setAttribute('y2', 0);
}

/* =====================================================================
   SCORE DISPLAY
   ===================================================================== */
function updateScoreDisplay(winner) {
  if (winner === 'X') {
    dom.scoreValX.textContent = state.scores.X;
    animateBump(dom.scoreValX);
  } else {
    dom.scoreValO.textContent = state.scores.O;
    animateBump(dom.scoreValO);
  }
}

function animateBump(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
  el.addEventListener('transitionend', () => el.classList.remove('bump'), { once: true });
}

/* =====================================================================
   RESULT OVERLAY
   ===================================================================== */
function showResult(title, sub, emoji) {
  dom.resultEmoji.textContent  = emoji;
  dom.resultTitle.textContent  = title;
  dom.resultSub.textContent    = sub;
  dom.resultOverlay.classList.remove('hidden');
}

function hideResult() {
  dom.resultOverlay.classList.add('hidden');
  // clear confetti
  confettiState.active = false;
  const ctx = dom.confettiCanvas.getContext('2d');
  ctx.clearRect(0, 0, dom.confettiCanvas.width, dom.confettiCanvas.height);
}

/* =====================================================================
   RESET
   ===================================================================== */
function resetRound(keepScores = true) {
  state.board      = Array(9).fill(null);
  state.gameOver   = false;
  state.aiThinking = false;

  if (!keepScores) {
    // Full restart — scores cleared, X always goes first
    state.scores         = { X: 0, O: 0, draw: 0 };
    state.startingPlayer = 'X';
    dom.scoreValX.textContent = '0';
    dom.scoreValO.textContent = '0';
    dom.drawCount.textContent = '0';
  } else {
    // New round — flip who goes first: X→O→X→O…
    state.startingPlayer = state.startingPlayer === 'X' ? 'O' : 'X';
  }

  state.current = state.startingPlayer;

  hideResult();
  clearWinLine();
  buildBoard();
  updateTurnUI();

  // Highlight the active-turn score card
  dom.scoreCardX.classList.toggle('active-turn', state.current === 'X');
  dom.scoreCardO.classList.toggle('active-turn', state.current === 'O');

  // In PvA mode, if AI (O) is the starting player, fire immediately
  if (state.mode === 'pva' && state.current === 'O') {
    scheduleAI();
  }
}

/* =====================================================================
   AI — UNBEATABLE MINIMAX ENGINE
   Depth-weighted scores   → AI always wins/draws as fast as possible
   Strategic move ordering → center first, then corners, then edges
   Alpha-beta pruning      → fast even on move 1
   ===================================================================== */

// Strategic cell priority: center > corners > edges
const MOVE_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];

function scheduleAI() {
  state.aiThinking = true;
  const delay = state.difficulty === 'easy' ? 350 : state.difficulty === 'medium' ? 550 : 650;
  setTimeout(() => {
    if (!state.gameOver) {
      const idx = getAIMove([...state.board], state.difficulty);
      state.aiThinking = false;
      makeMove(idx, 'O');
    }
  }, delay);
}

function getAIMove(board, difficulty) {
  const empty = MOVE_ORDER.filter(i => board[i] === null);

  // EASY — pure random, always
  if (difficulty === 'easy') {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // MEDIUM — one-step lookahead only: win > block > random
  if (difficulty === 'medium') {
    const win   = findImmediateMove(board, 'O');
    if (win   !== -1) return win;
    const block = findImmediateMove(board, 'X');
    if (block !== -1) return block;
    // No win/block available → pick a strategic random cell
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // HARD — perfect minimax (unbeatable, guaranteed win or draw)
  return getBestMove(board);
}

/**
 * Scans every winning pattern for an immediate win/block opportunity.
 * Returns the cell index to play, or -1 if none found.
 */
function findImmediateMove(board, player) {
  for (const [a, b, c] of WIN_PATTERNS) {
    const line = [board[a], board[b], board[c]];
    const playerCount = line.filter(v => v === player).length;
    const emptyCount  = line.filter(v => v === null).length;
    if (playerCount === 2 && emptyCount === 1) {
      // Return the empty cell in this pattern
      const emptyPos = [a, b, c][line.indexOf(null)];
      return emptyPos;
    }
  }
  return -1;
}

/**
 * Entry point for Hard AI: iterates top-level moves in strategic order
 * and picks the one with the highest minimax score.
 */
function getBestMove(board) {
  const candidates = MOVE_ORDER.filter(i => board[i] === null);
  let bestScore = -Infinity;
  let bestIndex = candidates[0]; // fallback (should always be overwritten)

  for (const idx of candidates) {
    board[idx] = 'O';
    // After AI places O, it's the human's (X) turn → minimising
    const score = minimaxScore(board, false, 0, -Infinity, Infinity);
    board[idx] = null;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = idx;
      // Perfect win found — no need to look further
      if (bestScore === 10) break;
    }
  }
  return bestIndex;
}

/**
 * Recursive minimax with:
 *   - Depth weighting: prefer faster wins, resist faster losses
 *     AI   win  → +10 − depth   (sooner win = higher score)
 *     Human win → −10 + depth   (sooner loss = lower score)
 *     Draw      →  0
 *   - Alpha-beta pruning to skip provably irrelevant branches
 *   - MOVE_ORDER to evaluate strongest moves first (more pruning)
 *
 * @param {Array}   board       - current 9-cell board state
 * @param {boolean} isMaximising - true when it's AI (O)'s turn
 * @param {number}  depth       - current recursion depth
 * @param {number}  alpha       - best score maximiser can guarantee
 * @param {number}  beta        - best score minimiser can guarantee
 * @returns {number} heuristic score of this board state
 */
function minimaxScore(board, isMaximising, depth, alpha, beta) {
  const result = checkResult(board);

  // Terminal states — scored relative to depth so AI acts decisively
  if (result !== null) {
    if (result.winner === 'O') return 10 - depth;   // AI wins fast
    if (result.winner === 'X') return depth - 10;   // Resist player wins
    return 0;                                        // Draw
  }

  const moves = MOVE_ORDER.filter(i => board[i] === null);

  if (isMaximising) {
    // AI (O) wants to maximise score
    let best = -Infinity;
    for (const idx of moves) {
      board[idx] = 'O';
      best = Math.max(best, minimaxScore(board, false, depth + 1, alpha, beta));
      board[idx] = null;
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // β-cutoff — minimiser won't allow this
    }
    return best;
  } else {
    // Human (X) wants to minimise score
    let best = Infinity;
    for (const idx of moves) {
      board[idx] = 'X';
      best = Math.min(best, minimaxScore(board, true, depth + 1, alpha, beta));
      board[idx] = null;
      beta = Math.min(beta, best);
      if (beta <= alpha) break; // α-cutoff — maximiser won't allow this
    }
    return best;
  }
}

/* =====================================================================
   CONFETTI
   ===================================================================== */
const confettiState = { active: false, particles: [] };

const CONFETTI_COLORS_X = ['#a78bfa','#7c3aed','#ddd6fe','#ede9fe','#f5f3ff'];
const CONFETTI_COLORS_O = ['#38bdf8','#0284c7','#bae6fd','#e0f2fe','#7dd3fc'];
const CONFETTI_DRAW     = ['#f472b6','#fbbf24','#34d399','#a78bfa','#38bdf8'];

function launchConfetti(winner) {
  const canvas  = dom.confettiCanvas;
  const overlay = dom.resultOverlay;
  canvas.width  = overlay.offsetWidth;
  canvas.height = overlay.offsetHeight;

  const colors = winner === 'X' ? CONFETTI_COLORS_X : CONFETTI_COLORS_O;
  confettiState.particles = Array.from({ length: 120 }, () => createParticle(canvas.width, colors));
  confettiState.active = true;
  requestAnimationFrame(animateConfetti);
}

function createParticle(width, colors) {
  return {
    x:    Math.random() * width,
    y:    Math.random() * -200,
    w:    Math.random() * 10 + 5,
    h:    Math.random() * 5  + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy:   Math.random() * 3 + 2,
    vx:   (Math.random() - 0.5) * 3,
    rot:  Math.random() * 360,
    rotV: (Math.random() - 0.5) * 8,
    opacity: 1,
  };
}

function animateConfetti() {
  if (!confettiState.active) return;
  const canvas = dom.confettiCanvas;
  const ctx    = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiState.particles.forEach(p => {
    p.y   += p.vy;
    p.x   += p.vx;
    p.rot += p.rotV;
    if (p.y > canvas.height * 0.6) p.opacity = Math.max(0, p.opacity - 0.02);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    // Reset if off screen
    if (p.y > canvas.height || p.opacity <= 0) {
      p.y = Math.random() * -100;
      p.x = Math.random() * canvas.width;
      p.opacity = 1;
    }
  });
  requestAnimationFrame(animateConfetti);
}

/* =====================================================================
   EVENT LISTENERS — MODE SCREEN
   ===================================================================== */
let selectedMode = 'pvp';

dom.btnPvP.addEventListener('click', () => {
  selectedMode = 'pvp';
  dom.btnPvP.classList.add('selected');
  dom.btnPvAI.classList.remove('selected');
  dom.diffRow.classList.add('hidden');
});

dom.btnPvAI.addEventListener('click', () => {
  selectedMode = 'pva';
  dom.btnPvAI.classList.add('selected');
  dom.btnPvP.classList.remove('selected');
  dom.diffRow.classList.remove('hidden');
});

dom.diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    dom.diffBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.difficulty = btn.dataset.diff;
  });
});

dom.btnStart.addEventListener('click', startGame);

/* =====================================================================
   START GAME
   ===================================================================== */
function startGame() {
  state.mode = selectedMode;
  dom.nameO.textContent = state.mode === 'pva' ? 'AI' : 'Player 2';
  resetRound(false);
  showScreen('screenGame');
}

/* =====================================================================
   EVENT LISTENERS — GAME SCREEN
   ===================================================================== */
dom.btnMenu.addEventListener('click', () => {
  state.aiThinking = false;
  state.gameOver   = true;
  hideResult();
  showScreen('screenMode');
});

dom.btnReset.addEventListener('click',      () => resetRound(true));
dom.btnResetScore.addEventListener('click', () => resetRound(false));
dom.btnPlayAgain.addEventListener('click',  () => resetRound(true));
dom.btnMainMenu.addEventListener('click',   () => {
  state.aiThinking = false;
  state.gameOver   = true;
  hideResult();
  showScreen('screenMode');
});

/* =====================================================================
   INIT
   ===================================================================== */
(function init() {
  showScreen('screenMode');
  // default mode button style
  dom.btnPvP.classList.add('selected');
})();
