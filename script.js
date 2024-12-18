// script.js
// This file runs the player page logic. It:
// 1. Loads the admin-defined words and board name (if available).
// 2. Generates a 5x5 Bingo board.
// 3. Allows marking squares and checks for winning lines.
// 4. Shows a modal when Bingo is achieved.

// Default fallback words if admin hasn't set any
const defaultWords = [
  "Red Car", "Blue Truck", "Famous Landmark", "Street Musician", "Fountain",
  "Local Dish", "Train Station", "Strange Animal", "Mountain View", "River",
  "Graffiti Art", "Local Language Sign", "Park Bench", "Unusual Sign", "Person in a Hat",
  "Tourist with a Map", "Old Church", "Bridge", "Bike Rental", "Friendly Dog",
  "Market Stall", "Sunset View", "Tour Bus", "Public Artwork", "Black Cat"
];

// DOM Elements from the player page
const boardElement = document.getElementById('bingoBoard');
const generateButton = document.getElementById('generate');
const resetButton = document.getElementById('reset');
const winModal = document.getElementById('winModal');
const closeModalBtn = document.getElementById('closeModal');
const gameNameDisplay = document.getElementById('gameNameDisplay');

// Variables to hold the word list and board name
let masterWordList = [];
let boardName = '';

// Load stored words and board name from localStorage or use defaults
document.addEventListener('DOMContentLoaded', () => {
  const storedWords = localStorage.getItem('bingoWords');
  const storedName = localStorage.getItem('bingoBoardName');

  if (storedWords) {
    // If admin set words, use them
    masterWordList = JSON.parse(storedWords);
  } else {
    // Otherwise, use the default words
    masterWordList = defaultWords;
  }

  if (storedName && storedName.trim().length > 0) {
    // If a board name was set, use it
    boardName = storedName.trim();
    gameNameDisplay.textContent = "Game Name: " + boardName;
  } else {
    // If no board name was provided, leave it blank or provide a default message
    gameNameDisplay.textContent = "Game Name: (No name set)";
  }

  // Load the board state from localStorage or generate a new one
  loadState();
});

// Utility function to shuffle an array
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // Swap it with the current element
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Generate a new board with 25 random words
function generateBoard() {
  // Shuffle a copy of the masterWordList and take the first 25
  const shuffled = shuffle([...masterWordList]);
  const selected = shuffled.slice(0, 25);

  // Clear the board
  boardElement.innerHTML = "";

  // Create 25 squares
  selected.forEach((item) => {
    const square = document.createElement('div');
    square.className = 'bingo-square';
    square.textContent = item;

    // When a square is clicked, toggle its marked state and check for a win
    square.addEventListener('click', () => {
      square.classList.toggle('marked');
      saveState();
      checkForWin();
    });

    boardElement.appendChild(square);
  });

  // Save the new board state
  saveState();
}

// Save current board state (words and which are marked) to localStorage
function saveState() {
  const squares = Array.from(document.querySelectorAll('.bingo-square'));
  const state = squares.map(sq => ({
    text: sq.textContent,
    marked: sq.classList.contains('marked')
  }));
  localStorage.setItem('bingoState', JSON.stringify(state));
}

// Load the board state from localStorage if available
function loadState() {
  const state = JSON.parse(localStorage.getItem('bingoState'));

  if (state && state.length === 25) {
    // If we have a saved state of 25 squares, rebuild the board
    boardElement.innerHTML = "";
    state.forEach(item => {
      const square = document.createElement('div');
      square.className = 'bingo-square';
      square.textContent = item.text;
      if (item.marked) {
        square.classList.add('marked');
      }

      // Toggle and check for win on click
      square.addEventListener('click', () => {
        square.classList.toggle('marked');
        saveState();
        checkForWin();
      });

      boardElement.appendChild(square);
    });
  } else {
    // If no saved state, generate a new board
    generateBoard();
  }
}

// Check for a win (full row, column, or diagonal marked)
function checkForWin() {
  const squares = Array.from(document.querySelectorAll('.bingo-square'));
  const size = 5;

  // Convert squares array into a 2D grid
  const grid = [];
  for (let i = 0; i < size; i++) {
    grid.push(squares.slice(i * size, i * size + size));
  }

  // Check all rows
  for (let i = 0; i < size; i++) {
    if (grid[i].every(cell => cell.classList.contains('marked'))) {
      showWin();
      return;
    }
  }

  // Check all columns
  for (let j = 0; j < size; j++) {
    let columnWin = true;
    for (let i = 0; i < size; i++) {
      if (!grid[i][j].classList.contains('marked')) {
        columnWin = false;
        break;
      }
    }
    if (columnWin) {
      showWin();
      return;
    }
  }

  // Check diagonals
  let diag1Win = true; // Left-to-right diagonal
  let diag2Win = true; // Right-to-left diagonal

  for (let i = 0; i < size; i++) {
    // Check left-to-right diagonal
    if (!grid[i][i].classList.contains('marked')) {
      diag1Win = false;
    }
    // Check right-to-left diagonal
    if (!grid[i][size - i - 1].classList.contains('marked')) {
      diag2Win = false;
    }
  }

  if (diag1Win || diag2Win) {
    showWin();
  }
}

// Show the win modal
function showWin() {
  winModal.style.display = 'flex';
}

// Event listener for the "Generate New Card" button
generateButton.addEventListener('click', () => {
  generateBoard();
});

// Event listener for the "Reset Marks" button to unmark all squares
resetButton.addEventListener('click', () => {
  const squares = document.querySelectorAll('.bingo-square');
  squares.forEach(sq => sq.classList.remove('marked'));
  saveState();
});

// Close the win modal on button click
closeModalBtn.addEventListener('click', () => {
  winModal.style.display = 'none';
});