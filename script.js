const items = [
  "Red Car", "Blue Truck", "Famous Landmark", "Street Musician", "Fountain",
  "Local Dish", "Train Station", "Strange Animal", "Mountain View", "River",
  "Graffiti Art", "Local Language Sign", "Park Bench", "Unusual Sign", "Person in a Hat",
  "Tourist with a Map", "Old Church", "Bridge", "Bike Rental", "Friendly Dog",
  "Market Stall", "Sunset View", "Tour Bus", "Public Artwork", "Black Cat"
];

// Shuffle array utility function
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const boardElement = document.getElementById('bingoBoard');
const generateButton = document.getElementById('generate');
const resetButton = document.getElementById('reset');

function generateBoard() {
  const shuffled = shuffle([...items]);
  const selected = shuffled.slice(0, 25);
  boardElement.innerHTML = "";
  selected.forEach((item, idx) => {
    const square = document.createElement('div');
    square.className = 'bingo-square';
    square.textContent = item;
    square.addEventListener('click', () => {
      square.classList.toggle('marked');
      saveState();
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
      });
      boardElement.appendChild(square);
    });
  } else {
    generateBoard();
  }
}

generateButton.addEventListener('click', generateBoard);
resetButton.addEventListener('click', () => {
  const squares = document.querySelectorAll('.bingo-square');
  squares.forEach(sq => sq.classList.remove('marked'));
  saveState();
});

document.addEventListener('DOMContentLoaded', loadState);