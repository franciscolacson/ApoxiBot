/**
 * Removes a game from the suggestion queue.
 * 
 * This function allows users to remove a game from the gameQueue either by providing its index or name.
 * Users can only remove their own suggested games unless they are the user with APOXITY_USER_ID.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue, APOXITY_USER_ID, and functions to save the state.
 * @param {string} state.APOXITY_USER_ID - The user ID of the privileged user who can delete any game suggestion.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions.
 * @param {Function} state.saveGameQueue - A function that saves the current state of the game queue.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function removeGame(interaction, state) {
  const { APOXITY_USER_ID, gameQueue, saveGameQueue } = state;
  const deleteArgument = interaction.options.getString('identifier').trim();
  let indexToDelete = -1;

  // Check if the provided argument is an index
  if (!isNaN(deleteArgument)) {
    indexToDelete = parseInt(deleteArgument) - 1;
    // Validate the provided index
    if (indexToDelete < 0 || indexToDelete >= gameQueue.length) {
      await interaction.reply('Invalid index provided.');
      return;
    }
  } else {
    // Find the index of the game by its name
    indexToDelete = gameQueue.findIndex(entry => entry[0].toLowerCase() === deleteArgument.toLowerCase());
    // Validate if the game exists
    if (indexToDelete === -1) {
      await interaction.reply(`The game "${deleteArgument}" was not suggested.`);
      return;
    }
  }

  const gameToDelete = gameQueue[indexToDelete];
  // Check if the user is authorized to delete the game
  if (interaction.user.id !== gameToDelete[1] && interaction.user.id !== APOXITY_USER_ID) {
    await interaction.reply(`You can only delete games suggested by yourself! (Unless you're <@${APOXITY_USER_ID}>).`);
    return;
  }

  // Remove the game from the queue and save the updated queue
  const removedGame = gameQueue.splice(indexToDelete, 1)[0];
  saveGameQueue(gameQueue);

  // Inform the user about the removed game
  await interaction.reply(`Removed game: ${removedGame[0]}, which was suggested by <@${removedGame[1]}>.`);
}

module.exports = { removeGame };
