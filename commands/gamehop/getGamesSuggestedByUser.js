/**
 * Provides the list of games suggested by a specific user.
 * 
 * This function responds with the games suggested by a specified user. If the list is too long,
 * it splits the message into multiple chunks to ensure it can be sent via the Discord API.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions, each entry being a tuple with the game name and the user ID who suggested it.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

const { splitMessage } = require('../../utils/splitMessage');

async function getGamesSuggestedByUser(interaction, state) {
  const { gameQueue } = state;
  const user = interaction.options.getUser('user');

  // Filter the game suggestions to find those made by the specified user
  const userSuggestions = gameQueue.filter(entry => entry[1] === user.id);

  // Check if the user has suggested any games
  if (userSuggestions.length === 0) {
    await interaction.reply(`<@${user.id}> has not suggested any games.`);
    return;
  }

  // Create a formatted list of the user's game suggestions
  const suggestionsList = userSuggestions.map(entry => entry[0]).join('\n');
  const messageChunks = splitMessage(`Games suggested by <@${user.id}>:\n${suggestionsList}\n\nTotal: ${userSuggestions.length} games`);

  // Defer the reply to indicate the bot is processing
  await interaction.deferReply();

  // Use editReply for the first chunk of the message
  await interaction.editReply(messageChunks[0]);

  // Use followUp for any subsequent chunks of the message
  for (let i = 1; i < messageChunks.length; i++) {
    await interaction.followUp(messageChunks[i]);
  }
}

module.exports = { getGamesSuggestedByUser };
