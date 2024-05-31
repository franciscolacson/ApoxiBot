/**
 * Generates a wheel URL to randomly choose a game from the suggestions and sends it to the user.
 * 
 * This function creates a URL for a wheel spinner with the current game suggestions and shortens the URL for easy sharing.
 * If there are no game suggestions, it informs the user accordingly.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the current game queue and functions to save the state.
 * @param {Array} state.gameQueue - An array that holds the list of game suggestions.
 * @param {Function} state.saveGameQueue - A function that saves the current state of the game queue.
 * @param {Function} state.shortenUrl - A function that shortens a given URL.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

const { shortenUrl } = require('../../utils/shortenUrl');

async function getWheel(interaction, state) {
  const { gameQueue, saveGameQueue } = state;

  // Log the request to spin the wheel
  console.log(`<@${interaction.user.id}> spun the wheel!`);

  // Check if there are any game suggestions
  if (gameQueue.length === 0) {
    await interaction.reply('There are no game suggestions to choose from.');
    return;
  }

  // Construct the URL for the wheel with the current game suggestions
  const wheelUrl = 'https://wheeldecide.com/index.php?';
  const queryParams = gameQueue.map((entry, index) => `c${index + 1}=${encodeURIComponent(entry[0])}`).join('&');
  const fullWheelUrl = `${wheelUrl}${queryParams}&t=GameHop!%21&time=10`;

  // Shorten the URL
  const shortenedWheelUrl = await shortenUrl(fullWheelUrl);

  // Update the state with the last time the wheel was spun
  state.lastWheelSpun = new Date();

  // Reply with the shortened URL for the wheel
  await interaction.reply(`Spin the wheel to decide: ${shortenedWheelUrl}`);
}

module.exports = { getWheel };
