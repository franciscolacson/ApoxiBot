/**
 * Provides the list of all current game suggestions.
 * 
 * This function responds with the list of all game suggestions along with the user who suggested each game.
 * If the list is too long, it splits the message into multiple chunks to ensure it can be sent via the Discord API.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions, each entry being a tuple with the game name and the user ID who suggested it.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

const { splitMessage } = require('../../utils/splitMessage');

async function getGameSuggestions(interaction, state) {
  const { gameQueue } = state;

  // Check if there are any game suggestions
  if (gameQueue.length === 0) {
    await interaction.reply('No games have been suggested.');
    return;
  }

  // Create a formatted list of the game suggestions
  const suggestionsList = gameQueue.map((entry, index) => `${index + 1}. ${entry[0]} (suggested by <@${entry[1]}>)`).join('\n');
  const messageChunks = splitMessage(`Current game suggestions:\n${suggestionsList}`);

  // Defer the reply to indicate the bot is processing
  await interaction.deferReply();

  // Use editReply for the first chunk of the message
  await interaction.editReply(messageChunks[0]);

  // Use followUp for any subsequent chunks of the message
  for (let i = 1; i < messageChunks.length; i++) {
    await interaction.followUp(messageChunks[i]);
  }
}

module.exports = { getGameSuggestions };
