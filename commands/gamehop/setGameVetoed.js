/**
 * Marks the current game as vetoed and updates the game history accordingly.
 * 
 * This function allows the privileged user (identified by APOXITY_USER_ID) to veto the current game.
 * The game is marked as vetoed in the game history, and the current game state is reset. 
 * Only the privileged user can execute this command.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game, game history, APOXITY_USER_ID, and functions to save the state.
 * @param {string} state.APOXITY_USER_ID - The user ID of the privileged user who can veto the current game.
 * @param {string} state.currentGame - The name of the current game being played.
 * @param {Array} state.gamesHistory - An array that holds the history of chosen games.
 * @param {Function} state.saveGameHistory - A function that saves the current state of the game history.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function setGameVetoed(interaction, state) {
  const { APOXITY_USER_ID, currentGame, gamesHistory, saveGameHistory } = state;

  // Check if the user is authorized to veto the game
  if (interaction.user.id !== APOXITY_USER_ID) {
    await interaction.reply('You do not have permission to use this command.');
    return;
  }

  // Check if there is a current game being played
  if (!currentGame) {
    await interaction.reply('No game is currently being played.');
    return;
  }

  // Mark the current game as vetoed in the game history
  const lastIndex = gamesHistory.lastIndexOf(currentGame);
  if (lastIndex !== -1) {
    gamesHistory[lastIndex] = `${currentGame} [VETOED]`;
  } else {
    gamesHistory.push(`${currentGame} [VETOED]`);
  }

  saveGameHistory(gamesHistory);

  // Reset the current game state
  state.currentGame = null;
  state.gameChosenTime = null;
  state.vetoList = [];

  // Inform the user that the game has been vetoed
  await interaction.reply(`The current game has been vetoed and added to the history with [VETOED] tag.`);
}

module.exports = { setGameVetoed };
