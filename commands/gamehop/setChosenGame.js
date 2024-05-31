/**
 * Sets the chosen game and updates the game state accordingly.
 * 
 * This function allows the privileged user (identified by APOXITY_USER_ID) to set the current game from the game queue.
 * The chosen game is removed from the game queue, added to the game history, and the veto list is reset. 
 * Only the privileged user can execute this command.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue, game history, APOXITY_USER_ID, and functions to save the state.
 * @param {string} state.APOXITY_USER_ID - The user ID of the privileged user who can set the chosen game.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions.
 * @param {Array} state.gamesHistory - An array that holds the history of chosen games.
 * @param {Function} state.saveGameQueue - A function that saves the current state of the game queue.
 * @param {Function} state.saveGameHistory - A function that saves the current state of the game history.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function setChosenGame(interaction, state) {
  const { APOXITY_USER_ID, gameQueue, gamesHistory, saveGameQueue, saveGameHistory } = state;
  
  // Check if the user is authorized to set the chosen game
  if (interaction.user.id !== APOXITY_USER_ID) {
    await interaction.reply('You do not have permission to use this command.');
    return;
  }

  const chosenGame = interaction.options.getString('game').trim();
  let gameIndex = -1;

  // Determine if the input is an index or game name
  if (!isNaN(chosenGame)) {
    gameIndex = parseInt(chosenGame) - 1;
    if (gameIndex < 0 || gameIndex >= gameQueue.length) {
      await interaction.reply('Invalid index provided.');
      return;
    }
  } else {
    gameIndex = gameQueue.findIndex(entry => entry[0].toLowerCase() === chosenGame.toLowerCase());
    if (gameIndex === -1) {
      await interaction.reply(`The game "${chosenGame}" is not in the suggestions list.`);
      return;
    }
  }

  // Set the chosen game and update the state
  const [chosenGameName] = gameQueue.splice(gameIndex, 1);
  state.currentGame = chosenGameName[0];
  state.gameChosenTime = new Date();
  gamesHistory.push(state.currentGame);
  saveGameHistory(gamesHistory);
  saveGameQueue(gameQueue);
  state.vetoList = [];

  // Inform the user about the chosen game
  await interaction.reply(`The game "${state.currentGame}" has been chosen and is now being played.`);
}

module.exports = { setChosenGame };
