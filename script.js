// Default fallback words if admin hasn't set any
const defaultWords = [
  "Red Car", "Blue Truck", "Famous Landmark", "Street Musician", "Fountain",
  "Local Dish", "Train Station", "Strange Animal", "Mountain View", "River",
  "Graffiti Art", "Local Language Sign", "Park Bench", "Unusual Sign", "Person in a Hat",
  "Tourist with a Map", "Old Church", "Bridge", "Bike Rental", "Friendly Dog",
  "Market Stall", "Sunset View", "Tour Bus", "Public Artwork", "Black Cat",
  "White Horse", "Colorful Mural", "Chimney Smoke", "Farm Animal", "Historic Monument"
];

let masterWordList = [];

// DOM Elements
const boardElement = document.getElementById('bingoBoard');
const generateButton = document.getElementById('generate');
const resetButton = document.getElementById('reset');
const winModal = document.getElementById('winModal');
const closeModalBtn = document.getElementById('closeModal');

// Load the words from localStorage or fallback
document.addEventListener('DOMContentLoaded', () => {
  const storedWords = localStorage.getItem('bingoWords');
  masterWordList = storedWords ? JSON.parse(storedWords) : defaultWords;

  loadState();
});

// Shuffle utility
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function generateBoard() {
  // Select 25 unique words at random from the masterWordList
  const shuffled = shuffle([...masterWordList]);
  const selected = shuffled.slice(0, 25);

  boardElement.innerHTML = "";
  selected.forEach((item, idx) => {
    const square = document.createElement('div');
    square.className = 'bingo-square';
    square.textContent = item;
    square.addEventListener('click', () => {
      square.classList.toggle('marked');
      saveState();
      checkForWin();
    });
    boardElement.appendChild(square);
  });

  saveState();
}

function saveState() {
  const squares = Array.from(document.querySelectorAll('.bingo-square'));
  const state = squares.map(sq => ({
    text: sq.textContent,
    marked: sq.classList.contains('marked')
  }));
  localStorage.setItem('bingoState', JSON.stringify(state));
}

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

function checkForWin() {
  const squares = Array.from(document.querySelectorAll('.bingo-square'));
  const size = 5;

  // Convert to a 2D array
  const grid = [];
  for (let i = 0; i < size; i++) {
    grid.push(squares.slice(i*size, i*size + size));
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

function showWin() {
  winModal.style.display = 'flex';
}

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