// admin.js
// This script helps the admin generate a JSON config that can be placed in config.json.
// It does not save to localStorage anymore. Instead, the admin manually updates config.json in the repository.

const generateButton = document.getElementById('generateConfig');
const wordListArea = document.getElementById('wordList');
const boardNameInput = document.getElementById('boardName');
const statusMsg = document.getElementById('statusMsg');
const jsonOutput = document.getElementById('jsonOutput');

generateButton.addEventListener('click', () => {
  const text = wordListArea.value.trim();
  const boardName = boardNameInput.value.trim();

  if (!boardName) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "Please provide a board name.";
    return;
  }

  if (!text) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "No words provided.";
    return;
  }

  // Split words by newlines or commas
  let words = text.split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
  words = Array.from(new Set(words)); // remove duplicates

  if (words.length < 25) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "You must provide at least 25 words.";
    return;
  }

  // Create a JSON config object
  const config = {
    boardName: boardName,
    words: words
  };

  // Display the JSON for the admin to copy
  statusMsg.style.color = 'green';
  statusMsg.textContent = "JSON generated below. Copy and paste into config.json in your repo.";
  jsonOutput.textContent = JSON.stringify(config, null, 2);
});