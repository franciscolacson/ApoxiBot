/**
 * Provides information about the last time the wheel was spun.
 * 
 * This function responds with the time elapsed since the wheel was last spun. If the wheel has not been spun yet,
 * it informs the user accordingly.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * @param {Object} state - The state object that includes the time when the wheel was last spun.
 * @param {Date} state.gameChosenTime - The time when the wheel was last spun.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function getWheelLastSpun(interaction, state) {
  // Check if the wheel has been spun yet
  if (!state.gameChosenTime) {
    await interaction.reply('The wheel has not been spun yet.');
    return;
  }

  // Calculate the time difference between now and when the wheel was last spun
  const now = new Date();
  const diff = Math.floor((now - state.gameChosenTime) / 1000);
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  // Reply with the time elapsed since the wheel was last spun
  await interaction.reply(`The wheel was last spun ${minutes}m ${seconds}s ago.`);
}

module.exports = { getWheelLastSpun };
