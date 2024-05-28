/**
 * Provides the history of all games that have been chosen.
 * 
 * This function responds with a list of all previously chosen games. If the list is too long,
 * it splits the message into multiple chunks to ensure it can be sent via the Discord API.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the history of chosen games.
 * @param {Array} state.gamesHistory - An array that holds the history of all chosen games.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

const { splitMessage } = require('../utils/splitMessage');

async function getGamesHistory(interaction, state) {
  const { gamesHistory } = state;

  // Check if there is any game history
  if (gamesHistory.length === 0) {
    await interaction.reply('No games have been chosen yet.');
    return;
  }

  // Create a formatted list of the game history
  const historyList = gamesHistory.map((entry, index) => `${index + 1}. ${entry}`).join('\n');
  const messageChunks = splitMessage(`Games History:\n${historyList}`);

  // Defer the reply to indicate the bot is processing
  await interaction.deferReply();

  // Use editReply for the first chunk of the message
  await interaction.editReply(messageChunks[0]);

  // Use followUp for any subsequent chunks of the message
  for (let i = 1; i < messageChunks.length; i++) {
    await interaction.followUp(messageChunks[i]);
  }
}

module.exports = { getGamesHistory };
