const saveButton = document.getElementById('saveWords');
const wordListArea = document.getElementById('wordList');
const statusMsg = document.getElementById('statusMsg');

// Load existing words from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
  const storedWords = localStorage.getItem('bingoWords');
  if (storedWords) {
    wordListArea.value = JSON.parse(storedWords).join('\n');
  }
});

saveButton.addEventListener('click', () => {
  const text = wordListArea.value.trim();
  if (!text) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "No words provided.";
    return;
  }

  // Split by new lines or commas
  let words = text.split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
  // Remove duplicates
  words = Array.from(new Set(words));

  if (words.length < 25) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = "You must provide at least 25 words.";
    return;
  }

  // Save to localStorage
  localStorage.setItem('bingoWords', JSON.stringify(words));

  statusMsg.style.color = 'green';
  statusMsg.textContent = "Words saved successfully!";
});