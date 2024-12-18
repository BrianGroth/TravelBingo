// admin.js
// This script handles the admin panel functionality. It allows the admin
// to set a board name and a list of words, which are stored in localStorage
// for use by the player page.

// Get references to DOM elements in the admin page
const saveButton = document.getElementById('saveWords');
const wordListArea = document.getElementById('wordList');
const boardNameInput = document.getElementById('boardName');
const statusMsg = document.getElementById('statusMsg');

// On page load, load any existing settings from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
  const storedWords = localStorage.getItem('bingoWords');
  const storedName = localStorage.getItem('bingoBoardName');

  // If we have saved words, put them into the text area
  if (storedWords) {
    const words = JSON.parse(storedWords);
    wordListArea.value = words.join('\n');
  }

  // If we have a saved board name, set it in the input field
  if (storedName) {
    boardNameInput.value = storedName;
  }
});

// When the admin clicks the save button
saveButton.addEventListener('click', () => {
  const text = wordListArea.value.trim();
  const boardName = boardNameInput.value.trim();

  // Validate the words
  if (!text) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "No words provided.";
    return;
  }

  // Split words by newlines or commas, trim them, and remove duplicates
  let words = text.split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
  words = Array.from(new Set(words));

  // Ensure there are at least 25 words
  if (words.length < 25) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "You must provide at least 25 words.";
    return;
  }

  // Save the words and board name to localStorage
  localStorage.setItem('bingoWords', JSON.stringify(words));
  localStorage.setItem('bingoBoardName', boardName);

  statusMsg.style.color = 'green';
  statusMsg.textContent = "Words and board name saved successfully!";
});