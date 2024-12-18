// admin.js
// This script helps the admin generate a JSON config for the bingo game.
// Steps:
// 1. Admin enters a board name.
// 2. Admin enters at least 25 words.
// 3. Admin clicks "Generate Config".
// 4. The script validates inputs and, if valid, displays the JSON in jsonOutput.
// 5. Admin copies the JSON and updates config.json in the repository.

const generateButton = document.getElementById('generateConfig');
const wordListArea = document.getElementById('wordList');
const boardNameInput = document.getElementById('boardName');
const statusMsg = document.getElementById('statusMsg');
const jsonOutput = document.getElementById('jsonOutput');

// Add an event listener to the generate button
generateButton.addEventListener('click', () => {
  console.log("Generate Config button clicked.");

  const text = wordListArea.value.trim();
  const boardName = boardNameInput.value.trim();

  // Validate board name
  if (!boardName) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "Error: Please provide a board name.";
    jsonOutput.textContent = "";
    return;
  }

  // Validate words
  if (!text) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "Error: No words provided.";
    jsonOutput.textContent = "";
    return;
  }

  // Split words by newline or comma
  let words = text.split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
  words = Array.from(new Set(words)); // Remove duplicates

  if (words.length < 25) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "Error: You must provide at least 25 words.";
    jsonOutput.textContent = "";
    return;
  }

  // Create the config object
  const config = {
    boardName: boardName,
    words: words
  };

  // Convert config to JSON
  const configJSON = JSON.stringify(config, null, 2);

  // Display the JSON for the admin to copy
  statusMsg.style.color = 'green';
  statusMsg.textContent = "Success! Copy the JSON below and update config.json in your repository.";
  jsonOutput.textContent = configJSON;

  console.log("JSON generated:", configJSON);
});