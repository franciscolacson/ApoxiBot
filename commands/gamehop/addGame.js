/**
 * Adds a game suggestion to the game queue.
 * 
 * This function handles adding a game suggestion to a queue, ensuring the suggestion is not a duplicate 
 * and the queue does not exceed a maximum limit. It responds to the user based on the outcome of their suggestion.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue and the saveGameQueue function for persisting changes.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions.
 * @param {Function} state.saveGameQueue - A function that saves the current state of the game queue.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

const MAX_GAME_SUGGESTIONS = 100;
const MAX_USER_SUGGESTIONS = 10;

const { saveGameQueue } = require('../../utils/fileOperations');

async function addGame(interaction, state) {
  const { gameQueue, saveGameQueue } = state;

  // Check if the game queue has reached its maximum capacity
  if (gameQueue.length >= MAX_GAME_SUGGESTIONS) {
    await interaction.reply('Sorry, the maximum number of game suggestions (100) has been reached.');
    return;
  }

  // Get the game suggestion from the interaction and trim any extra spaces
  const gameSuggestion = interaction.options.getString('game').trim();
  const gameSuggestionLower = gameSuggestion.toLowerCase();

  // Check if the game suggestion already exists in the queue
  const isDuplicate = gameQueue.some(entry => entry[0].toLowerCase() === gameSuggestionLower);

  if (isDuplicate) {
    // If it's a duplicate, inform the user
    await interaction.reply(`The game "${gameSuggestion}" has already been suggested.`);
  } else {
    // Count the number of suggestions by this user
    const userSuggestionsCount = gameQueue.filter(entry => entry[1] === interaction.user.id).length;

    if (userSuggestionsCount >= MAX_USER_SUGGESTIONS) {
      // If the user has reached their suggestion limit, inform them
      await interaction.reply(`You, <@${interaction.user.id}>, have reached the maximum number of suggestions (${MAX_USER_SUGGESTIONS}).`);
      return;
    } else {
      gameQueue.push([gameSuggestion, interaction.user.id]);
      saveGameQueue(gameQueue);

      // Respond to the user confirming their suggestion
      await interaction.reply(`Game suggested! ${gameSuggestion}, suggested by <@${interaction.user.id}>.`);
      }
  }
}

module.exports = { addGame };
