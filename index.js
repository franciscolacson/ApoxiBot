const { Client, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { setActivity, setBotOnline } = require('./utils/setActivity');
const { loadGameQueue, saveGameQueue, loadGameHistory, saveGameHistory } = require('./utils/fileOperations');

const logFilePath = path.join(__dirname, 'bot.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
  console.log(logMessage);
}

function logError(error) {
  const timestamp = new Date().toISOString();
  const errorMessage = `${timestamp} - ERROR: ${error.stack || error}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
  console.error(errorMessage);
}

/**
 * Initialize the Discord client with the required intents.
 */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize state variables
let gameQueue = [];
let lastWheelSpun = null;
let currentGame = null;
let gameChosenTime = null;
let vetoList = [];
let gamesHistory = [];

// Load environment variables
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;
const APOXITY_USER_ID = process.env.APOXITY_USER_ID;

if (!DISCORD_BOT_TOKEN || !APPLICATION_ID) {
  console.error('DISCORD_BOT_TOKEN or APPLICATION_ID is not set in the environment variables.');
  process.exit(1);
}

// Define the commands for the bot
const commands = [
  {
    name: 'gh',
    description: 'GameHop commands',
    options: [
      {
        name: 'suggest',
        description: 'Suggest a new game',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'game',
            type: 3, // STRING
            description: 'The game to suggest',
            required: true,
          },
        ],
      },
      {
        name: 'remove',
        description: 'Delete a game by index or name',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'identifier',
            type: 3, // STRING
            description: 'The index or name of the game to delete',
            required: true,
          },
        ],
      },
      {
        name: 'suggestions',
        description: 'See what games were suggested',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'suggestedby',
        description: 'See who suggested a specific game',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'identifier',
            type: 3, // STRING
            description: 'The index or name of the game',
            required: true,
          },
        ],
      },
      {
        name: 'wheel',
        description: 'Spin the wheel to choose a game',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'wheellastspun',
        description: 'When was the wheel last spun in minutes and seconds',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'removegamesbyuser',
        description: 'Remove all games suggested by a specific user',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'user',
            type: 6, // USER
            description: 'The user whose games to remove',
            required: true,
          },
        ],
      },
      {
        name: 'suggestedbyuser',
        description: 'Retrieve all games suggested by a specific user',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'user',
            type: 6, // USER
            description: 'The user whose games to retrieve',
            required: true,
          },
        ],
      },
      {
        name: 'chosengame',
        description: 'Set the chosen game (Apoxity only)',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'game',
            type: 3, // STRING
            description: 'The game chosen',
            required: true,
          },
        ],
      },
      {
        name: 'currentgame',
        description: 'Get the current game and how long ago the wheel was last spun',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'veto',
        description: 'Veto the current game',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'vetos',
        description: 'See the list of users who vetoed the current game and the veto count',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'gameshistory',
        description: 'See the history of chosen games',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'vetoed',
        description: 'Veto the current game (Apoxity only)',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'clear',
        description: 'Clear gameQueue and gamesHistory (Apoxity only)',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'help',
        description: 'Display the help message',
        type: 1, // SUB_COMMAND
      },
    ],
  },
];

// Initialize REST API client for Discord
const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

// Register the commands with Discord
(async () => {
  try {
    log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(APPLICATION_ID), { body: commands });
    log('Successfully reloaded application (/) commands.');
  } catch (error) {
    logError(error);
  }
})();

// Event handler for when the client is ready
client.on('ready', () => {
  log(`Logged in as ${client.user.tag}!`);
  gameQueue = loadGameQueue();
  gamesHistory = loadGameHistory();
  setActivity(client);
  setBotOnline(client);
});

// Event handler for command interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  // Define the state object to pass to command handlers
  const state = {
    gameQueue,
    lastWheelSpun,
    currentGame,
    gameChosenTime,
    vetoList,
    gamesHistory,
    saveGameQueue,
    saveGameHistory,
    APOXITY_USER_ID,
  };

  const gamehop_dir = './commands/gamehop/';

  // Define the command handlers by mapping subcommands to their respective functions
  const commandHandlers = {
    suggest: require(`${gamehop_dir}addGame`).addGame,
    remove: require(`${gamehop_dir}removeGame`).removeGame,
    suggestions: require(`${gamehop_dir}getGameSuggestions`).getGameSuggestions,
    suggestedby: require(`${gamehop_dir}getGameSuggestedByUser`).getGameSuggestedByUser,
    wheel: require(`${gamehop_dir}getWheel`).getWheel,
    wheellastspun: require(`${gamehop_dir}getWheelLastSpun`).getWheelLastSpun,
    removegamesbyuser: require(`${gamehop_dir}removeGamesSuggestedByUser`).removeGamesSuggestedByUser,
    suggestedbyuser: require(`${gamehop_dir}getGamesSuggestedByUser`).getGamesSuggestedByUser,
    chosengame: require(`${gamehop_dir}setChosenGame`).setChosenGame,
    currentgame: require(`${gamehop_dir}getCurrentGame`).getCurrentGame,
    veto: require(`${gamehop_dir}addVetoGame`).addVetoGame,
    vetos: require(`${gamehop_dir}getVetoes`).getVetoes,
    gameshistory: require(`${gamehop_dir}getGamesHistory`).getGamesHistory,
    vetoed: require(`${gamehop_dir}setGameVetoed`).setGameVetoed,
    clear: require(`${gamehop_dir}resetGamehop`).resetGamehop,
    help: require(`${gamehop_dir}help`).handleHelp,
  };

  // Check if the command is 'gh'
  if (commandName === 'gh') {
    // Get the subcommand from the interaction options
    const subCommand = options.getSubcommand();
    // Get the handler function for the subcommand
    const handler = commandHandlers[subCommand];

    if (handler) {
      try {
        log(`Executing command: ${subCommand}`);
        // Execute the handler function
        await handler(interaction, state);

        // update global state after command execution
        gameQueue = state.gameQueue;
        lastWheelSpun = state.lastWheelSpun;
        currentGame = state.currentGame;
        gameChosenTime = state.gameChosenTime;
        vetoList = state.vetoList;
        gamesHistory = state.gamesHistory;
      } catch (error) {
        logError(error);
        await interaction.reply('There was an error executing that command.');
      }
    } else {
      // Reply with 'Command not found' if the subcommand is not recognized
      await interaction.reply('Command not found.');
    }
  }
});

// Log the bot in using the token
client.login(DISCORD_BOT_TOKEN).then(() => {
  log('Bot logged in successfully');
}).catch(logError);
