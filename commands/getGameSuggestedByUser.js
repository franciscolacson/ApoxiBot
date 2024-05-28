/**
 * Finds and provides information about a game suggested by a user based on an index or game name.
 * 
 * This function responds with the details of a game suggestion, either found by its position in the queue or by its name.
 * If the game is found, it replies with the game name and the user who suggested it. If not, it informs the user that no game was found.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions, each entry being a tuple with the game name and the user ID who suggested it.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function getGameSuggestedByUser(interaction, state) {
  const { gameQueue } = state;
  const lookupArgument = interaction.options.getString('identifier').trim();

  // Check if an identifier was provided
  if (!lookupArgument) {
    await interaction.reply('Please provide an index or game name.');
    return;
  }

  let foundEntry = null;

  // Check if the identifier is a number (index)
  if (!isNaN(lookupArgument)) {
    const index = parseInt(lookupArgument) - 1;
    // Validate the index and find the corresponding game suggestion
    if (index >= 0 && index < gameQueue.length) {
      foundEntry = gameQueue[index];
    }
  } else {
    // Find the game suggestion by name
    foundEntry = gameQueue.find(entry => entry[0].toLowerCase() === lookupArgument.toLowerCase());
  }

  // Respond with the details of the found game suggestion or inform that no game was found
  if (foundEntry) {
    await interaction.reply(`The game "${foundEntry[0]}" was suggested by <@${foundEntry[1]}>.`);
  } else {
    await interaction.reply('No game found with the provided index or name.');
  }
}

module.exports = { getGameSuggestedByUser };
