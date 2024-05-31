/**
 * Resets the GameHop state.
 * 
 * This function allows the privileged user (identified by APOXITY_USER_ID) to reset the GameHop state,
 * clearing the game queue, game history, current game, and veto list. Only the privileged user can 
 * execute this command.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue, game history, APOXITY_USER_ID, and functions to save the state.
 * @param {string} state.APOXITY_USER_ID - The user ID of the privileged user who can execute the reset command.
 * @param {Array} state.saveGameQueue - A function that saves the current state of the game queue.
 * @param {Array} state.saveGameHistory - A function that saves the current state of the game history.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function resetGamehop(interaction, state) {
  const { APOXITY_USER_ID, saveGameQueue, saveGameHistory } = state;

  // Check if the user is authorized to reset the state
  if (interaction.user.id !== APOXITY_USER_ID) {
    await interaction.reply('You do not have permission to use this command.');
    return;
  }

  // Reset the game state
  state.gameQueue = [];
  state.gamesHistory = [];
  state.currentGame = null;
  state.gameChosenTime = null;
  state.vetoList = [];

  // Save the reset state
  saveGameQueue(state.gameQueue);
  saveGameHistory(state.gamesHistory);

  // Inform the user about the reset
  await interaction.reply('The gameQueue and gamesHistory have been cleared.');
}

module.exports = { resetGamehop };
