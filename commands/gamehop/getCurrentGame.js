/**
 * Provides information about the current game being played.
 * 
 * This function responds with the name of the current game and the duration since it was chosen. 
 * If no game is currently being played, it informs the user accordingly.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes information about the current game and the time it was chosen.
 * @param {string} state.currentGame - The name of the current game being played.
 * @param {Date} state.gameChosenTime - The time when the current game was chosen.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function getCurrentGame(interaction, state) {
  // Check if there is a current game being played
  if (!state.currentGame) {
    await interaction.reply('No game is currently being played.');
    return;
  }

  // Calculate the time difference between now and when the game was chosen
  const now = new Date();
  const diff = Math.floor((now - state.gameChosenTime) / 1000);
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  // Respond with the current game and the time elapsed since it was chosen
  await interaction.reply(`The current game is "${state.currentGame}", chosen ${minutes}m${seconds}s ago.`);
}

module.exports = { getCurrentGame };
