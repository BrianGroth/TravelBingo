// admin.js
// This script helps the admin generate a JSON config for the bingo game.
// It now also fetches the existing config.json on page load to display current settings.

// DOM elements
const generateButton = document.getElementById('generateConfig');
const wordListArea = document.getElementById('wordList');
const boardNameInput = document.getElementById('boardName');
const statusMsg = document.getElementById('statusMsg');
const jsonOutput = document.getElementById('jsonOutput');

// On page load, fetch the existing config.json to display current settings
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('config.json');
    if (!response.ok) {
      throw new Error('Could not load config.json');
    }

    const config = await response.json();
    // Populate the admin fields with existing config values
    if (config.boardName) {
      boardNameInput.value = config.boardName;
    }
    if (Array.isArray(config.words)) {
      // Join words with newlines for easy editing
      wordListArea.value = config.words.join('\n');
    }

    statusMsg.style.color = 'blue';
    statusMsg.textContent = "Loaded existing config. Make changes and click Generate Config.";
  } catch (error) {
    console.error("Error loading config:", error);
    statusMsg.style.color = 'red';
    statusMsg.textContent = "Unable to load existing config.json. You can still create a new one.";
  }
});

// When "Generate Config" is clicked
generateButton.addEventListener('click', () => {
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