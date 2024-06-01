/**
 * Adds a veto from a user for the current game.
 * 
 * This function handles adding a user's veto for the current game, ensuring the user has not already vetoed 
 * and a game is currently being played. It responds to the user based on the outcome of their veto action.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game, veto list, and the saveVetoList function for persisting changes.
 * @param {string} state.currentGame - The name of the current game being played.
 * @param {Array} state.vetoList - An array that holds the list of user IDs who have vetoed the current game.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function addVetoGame(interaction, state) {
  const { currentGame, vetoList } = state;

  // Check if there is a current game being played
  if (!currentGame) {
    await interaction.reply('No game is currently being played.');
    return;
  }

  // Check if the user has already vetoed the current game
  if (vetoList.includes(interaction.user.id)) {
    await interaction.reply('You have already vetoed this game.');
    return;
  }

  // Add the user's ID to the veto list and save the updated list
  vetoList.push(interaction.user.id);

  // Respond to the user confirming their veto
  await interaction.reply(`<@${interaction.user.id}> has vetoed the current game "${currentGame}".`);
}

module.exports = { addVetoGame };
