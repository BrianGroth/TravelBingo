// script.js
// This script fetches configuration data from config.json to get the board name and words.
// It then generates the Bingo board, handles marking squares, checking for wins, and showing a modal on a win.

// DOM Elements
const boardElement = document.getElementById('bingoBoard');
const generateButton = document.getElementById('generate');
const resetButton = document.getElementById('reset');
const winModal = document.getElementById('winModal');
const closeModalBtn = document.getElementById('closeModal');
const gameNameDisplay = document.getElementById('gameNameDisplay');

let masterWordList = [];
let boardName = '';

// Fetch config from config.json hosted in the same repository
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('config.json');
    if (!response.ok) {
      throw new Error('Unable to fetch config.json');
    }
    const config = await response.json();

    // Extract board name and words from config
    boardName = config.boardName || "No Name Set";
    masterWordList = Array.isArray(config.words) && config.words.length >= 25 
                     ? config.words 
                     : ["Fallback", "Words", "If", "Not", "Found", "Please", "Update", "config.json", "With", "At", "Least", "25", "Words", "For", "A", "Valid", "Board", "Name", "And", "Words", "List", "Bingo", "Travel", "Game"];

    // Display the board name under the main title
    gameNameDisplay.textContent = "Game Name: " + boardName;

    loadState();
  } catch (error) {
    console.error('Error fetching config:', error);
    // If config can't be loaded, fallback to a default scenario
    boardName = "Default Game";
    masterWordList = [
      "Red Car", "Blue Truck", "Famous Landmark", "Street Musician", "Fountain",
      "Local Dish", "Train Station", "Strange Animal", "Mountain View", "River",
      "Graffiti Art", "Local Language Sign", "Park Bench", "Unusual Sign", "Person in a Hat",
      "Tourist with a Map", "Old Church", "Bridge", "Bike Rental", "Friendly Dog",
      "Market Stall", "Sunset View", "Tour Bus", "Public Artwork", "Black Cat"
    ];
    gameNameDisplay.textContent = "Game Name: " + boardName;
    loadState();
  }
});

// Utility to shuffle an array
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Generate a 5x5 board from masterWordList
function generateBoard() {
  const shuffled = shuffle([...masterWordList]);
  const selected = shuffled.slice(0, 25);

  boardElement.innerHTML = "";
  selected.forEach((item) => {
    const square = document.createElement('div');
    square.className = 'bingo-square';
    square.textContent = item;

    // Toggle marked class on click
    square.addEventListener('click', () => {
      square.classList.toggle('marked');
      saveState();
      checkForWin();
    });

    boardElement.appendChild(square);
  });

  saveState();
}

// Save the current board state (which squares are marked) to localStorage
function saveState() {
  const squares = Array.from(document.querySelectorAll('.bingo-square'));
  const state = squares.map(sq => ({
    text: sq.textContent,
    marked: sq.classList.contains('marked')
  }));
  localStorage.setItem('bingoState', JSON.stringify(state));
}

// Load the board state from localStorage, or generate a new one
function loadState() {
  const state = JSON.parse(localStorage.getItem('bingoState'));
  if (state && state.length === 25) {
    boardElement.innerHTML = "";
    state.forEach(item => {
      const square = document.createElement('div');
      square.className = 'bingo-square';
      square.textContent = item.text;
      if (item.marked) {
        square.classList.add('marked');
      }
      square.addEventListener('click', () => {
        square.classList.toggle('marked');
        saveState();
        checkForWin();
      });
      boardElement.appendChild(square);
    });
  } else {
    generateBoard();
  }
}

// Check for a winning line
function checkForWin() {
  const squares = Array.from(document.querySelectorAll('.bingo-square'));
  const size = 5;
  const grid = [];
  for (let i = 0; i < size; i++) {
    grid.push(squares.slice(i * size, i * size + size));
  }

  // Check rows
  for (let i = 0; i < size; i++) {
    if (grid[i].every(cell => cell.classList.contains('marked'))) {
      showWin();
      return;
    }
  }

  // Check columns
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
  let diag1Win = true;
  let diag2Win = true;
  for (let i = 0; i < size; i++) {
    if (!grid[i][i].classList.contains('marked')) {
      diag1Win = false;
    }
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

// Event listeners for buttons
generateButton.addEventListener('click', () => {
  generateBoard();
});

resetButton.addEventListener('click', () => {
  const squares = document.querySelectorAll('.bingo-square');
  squares.forEach(sq => sq.classList.remove('marked'));
  saveState();
});

closeModalBtn.addEventListener('click', () => {
  winModal.style.display = 'none';
});