/**
 * Sends a help message to the user with the list of available commands for GameHop.
 * 
 * This function responds with a detailed help message that includes all the commands that users can use
 * to interact with the GameHop bot. It helps users understand how to use the bot's various features.
 * 
 * @param {Object} interaction - The interaction object from the Discord API, which includes details about the user's input and interaction context.
 * 
 * @returns {Promise<void>} - This function does not return any value but sends a response to the user.
 */

async function handleHelp(interaction) {
  // Create the help message
  const helpMessage = `
Hey <@${interaction.user.id}>, welcome to **GameHop**!
**Here are the available commands:**
\`\`\`
/gh suggest <game>            - Suggest a new game.
/gh remove <index|game>       - Delete a game by index or name (Must be the one who suggested it).
/gh suggestions               - See what games were suggested.
/gh suggestedby <index|game>  - See who suggested a specific game.
/gh wheel                     - Spin the wheel to choose a game.
/gh wheellastspun             - When was the wheel last spun in minutes and seconds.
/gh removegamesbyuser <user>  - Remove all games suggested by a specific user.
/gh suggestedbyuser <user>    - Retrieve all games suggested by a specific user.
/gh chosengame <game|index>   - Set the chosen game (Apoxity only).
/gh currentgame               - Get the current game and how long ago the wheel was last spun.
/gh veto                      - Veto the current game.
/gh vetos                     - See the list of users who vetoed the current game and the veto count.
/gh vetoed                    - Veto the current game (Apoxity only).
/gh gameshistory              - See the history of chosen games.
/gh help                      - Display this help message.
/gh clear                     - Clear gameQueue and gamesHistory (Apoxity only).
\`\`\`

Enjoy your time with GameHop!
  `;

  // Reply with the help message
  await interaction.reply(helpMessage);
}

module.exports = { handleHelp };
