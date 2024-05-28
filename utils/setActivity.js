const { ActivityType } = require('discord.js');

/**
 * Sets the bot's activity status to "Playing GameHop".
 * 
 * This function sets the bot's activity to show that it is playing GameHop.
 * 
 * @param {Client} client - The Discord client instance.
 */
function setActivity(client) {
  client.user.setActivity('GameHop', { type: ActivityType.Playing });
}

/**
 * Sets the bot's status to online and activity to "Playing GameHop".
 * 
 * This function sets the bot's presence to online and updates its activity
 * to show that it is playing GameHop.
 * 
 * @param {Client} client - The Discord client instance.
 */
function setBotOnline(client) {
  client.user.setPresence({
    status: 'online',
    activities: [{ name: 'GameHop', type: ActivityType.Playing }],
  });
}

module.exports = {
  setActivity,
  setBotOnline,
};
