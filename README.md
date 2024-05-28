# ApoxiBot - GameHop Automation

This repository contains a personal project that automates the GameHop live stream series on the Apoxity YouTube channel. ApoxiBot, built with Discord.js, handles game suggestions, a decision wheel, vetoes, and game history management. It supports commands for suggesting, viewing, removing games, and more, providing an efficient game selection process.

## Features

- **Game Suggestions**: Users can suggest new games to be played.
- **Decision Wheel**: A wheel to randomly choose a game from the suggestions.
- **Veto System**: Users can veto the current game.
- **Game History**: Maintains a history of all chosen games.
- **Command Handling**: Supports various commands for managing game suggestions and selections.

## Commands

Here are the available commands that ApoxiBot supports:

- `/gh suggest <game>` - Suggest a new game.
- `/gh remove <index|game>` - Delete a game by index or name (Must be the one who suggested it).
- `/gh suggestions` - See what games were suggested.
- `/gh suggestedby <index|game>` - See who suggested a specific game.
- `/gh wheel` - Spin the wheel to choose a game.
- `/gh wheellastspun` - When was the wheel last spun in minutes and seconds.
- `/gh removegamesbyuser <user>` - Remove all games suggested by a specific user.
- `/gh suggestedbyuser <user>` - Retrieve all games suggested by a specific user.
- `/gh chosengame <game|index>` - Set the chosen game (Apoxity only).
- `/gh currentgame` - Get the current game and how long ago the wheel was last spun.
- `/gh veto` - Veto the current game.
- `/gh vetos` - See the list of users who vetoed the current game and the veto count.
- `/gh vetoed` - Veto the current game (Apoxity only).
- `/gh gameshistory` - See the history of chosen games.
- `/gh help` - Display this help message.
- `/gh clear` - Clear gameQueue and gamesHistory (Apoxity only).

## Suggestions

Suggestions for improvements are welcome! If you have any ideas or feedback, feel free to open an issue or submit a pull request.

