const fs = require('fs');
const path = require('path');

const gameQueueFilePath = path.join(__dirname, '../data/gameQueue.json');
const gameHistoryFilePath = path.join(__dirname, '../data/gameHistoryQueue.json');

/**
 * Load the game queue from a file.
 * 
 * This function reads the game queue from a JSON file and returns it as an array.
 * If the file does not exist, it returns an empty array.
 * 
 * @returns {Array} - The game queue loaded from the file.
 */
const loadGameQueue = () => {
  if (fs.existsSync(gameQueueFilePath)) {
    const data = fs.readFileSync(gameQueueFilePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

/**
 * Save the game queue to a file.
 * 
 * This function writes the game queue to a JSON file, ensuring it is stored persistently.
 * 
 * @param {Array} gameQueue - The game queue to be saved.
 */
const saveGameQueue = (gameQueue) => {
  fs.writeFileSync(gameQueueFilePath, JSON.stringify(gameQueue, null, 2));
};

/**
 * Load the game history from a file.
 * 
 * This function reads the game history from a JSON file and returns it as an array.
 * If the file does not exist, it returns an empty array.
 * 
 * @returns {Array} - The game history loaded from the file.
 */
const loadGameHistory = () => {
  if (fs.existsSync(gameHistoryFilePath)) {
    const data = fs.readFileSync(gameHistoryFilePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

/**
 * Save the game history to a file.
 * 
 * This function writes the game history to a JSON file, ensuring it is stored persistently.
 * 
 * @param {Array} gamesHistory - The game history to be saved.
 */
const saveGameHistory = (gamesHistory) => {
  fs.writeFileSync(gameHistoryFilePath, JSON.stringify(gamesHistory, null, 2));
};

module.exports = {
  loadGameQueue,
  saveGameQueue,
  loadGameHistory,
  saveGameHistory,
};
