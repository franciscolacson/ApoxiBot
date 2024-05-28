/**
 * Removes all games suggested by a specific user from the suggestion queue.
 * 
 * This function allows users to remove all game suggestions made by a specified user. Users can only remove
 * their own suggested games unless they are the user with APOXITY_USER_ID. The function responds with a 
 * list of removed games or informs the user if no games were suggested by the specified user.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue, APOXITY_USER_ID, and functions to save the state.
 * @param {string} state.APOXITY_USER_ID - The user ID of the privileged user who can delete any game suggestion.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions.
 * @param {Function} state.saveGameQueue - A function that saves the current state of the game queue.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

const { splitMessage } = require('../utils/splitMessage');

async function removeGamesSuggestedByUser(interaction, state) {
  const { APOXITY_USER_ID, gameQueue, saveGameQueue } = state;
  const user = interaction.options.getUser('user');

  // Check if the user is authorized to remove the games
  if (user.id !== interaction.user.id && interaction.user.id !== APOXITY_USER_ID) {
    await interaction.reply("You can only remove games suggested by yourself or if you are Apoxity.");
    return;
  }

  // Filter out the games suggested by the specified user
  const removedGames = gameQueue.filter(entry => entry[1] === user.id);
  state.gameQueue = gameQueue.filter(entry => entry[1] !== user.id);
  saveGameQueue(state.gameQueue);

  // Check if any games were removed
  if (removedGames.length === 0) {
    await interaction.reply(`<@${user.id}> has not suggested any games.`);
    return;
  }

  // Create a formatted list of removed games
  const removedGamesList = removedGames.map(entry => entry[0]).join('\n');
  const messageChunks = splitMessage(`Removed the following games suggested by <@${user.id}>:\n${removedGamesList}\n\nTotal: ${removedGames.length} games`);

  // Defer the reply to indicate the bot is processing
  await interaction.deferReply();
  await interaction.editReply(messageChunks[0]);

  // Send follow-up messages for any additional chunks
  for (let i = 1; i < messageChunks.length; i++) {
    await interaction.followUp(messageChunks[i]);
  }
}

module.exports = { removeGamesSuggestedByUser };
