/**
 * Provides information about the current game vetoes.
 * 
 * This function responds with details about the current game being played, the time since it was chosen, 
 * the number of vetoes, and the users who have vetoed the game. If no game is currently being played, 
 * it informs the user accordingly.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game, the time it was chosen, and the list of vetoes.
 * @param {string} state.currentGame - The name of the current game being played.
 * @param {Date} state.gameChosenTime - The time when the current game was chosen.
 * @param {Array} state.vetoList - An array that holds the list of user IDs who have vetoed the current game.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function getVetoes(interaction, state) {
  const { currentGame, gameChosenTime, vetoList } = state;

  // Log the request for vetoes
  console.log(`<@${interaction.user.id}> requested the list of vetoes!`);

  // Check if there is a current game being played
  if (!currentGame) {
    await interaction.reply('No game is currently being played.');
    return;
  }

  // Calculate the time difference between now and when the game was chosen
  const now = new Date();
  const diff = Math.floor((now - gameChosenTime) / 1000);
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  const vetoUsers = vetoList.map(userId => `<@${userId}>`).join(', ') || 'None';

  // Create the message detailing the current game, time chosen, veto count, and users who vetoed
  const vetosMessage = `
**Current Game:** ${currentGame}
**Chosen:** ${minutes}m${seconds}s ago
**Veto Count:** ${vetoList.length}
**Users who vetoed:** ${vetoUsers}
  `;

  // Reply with the veto details
  try {
    await interaction.reply(vetosMessage);
  } catch (error) {
    if (error.code === 40060) {
      // Interaction has already been acknowledged, follow up instead
      await interaction.followUp(vetosMessage);
    } else {
      // Log the error for debugging
      console.error('Error sending interaction reply:', error);
    }
  }
}

module.exports = { getVetoes };
