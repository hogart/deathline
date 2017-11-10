# deathline

Deathline is Telegram bot seed to create Lifeline-like games, written in TypeScript. Games are authored in JSON format. 
It's still in very early stages, but should work.

## Features

1) **Multimedia and rich messages** Cue can have embedded image or audio. You can also use Telegram subset of HTML/Markdown for formatting
1) **Delayed cues** Game can show response after predefined delay, in seconds or in human-readable format (`'15min'` or `'0.5h'`)
1) **Auto-transition** Game can show next cue automatically (with given delay to avoid bombarding user with info)
1) **Stateful game** Game has variables which can be set and changed by `setter` property
1) **Templating** Each message goes through `_.template` using current game state
1) **Conditional transitions** Choice can be hidden or shown depending on game state
1) **CSV importer** Author or draft game in any spreadsheet app, export as CSV and convert to deathline format
1) **Game file validation** Game is validated (for well-formedness) on loading using JSON schema

### Roadmap

- [ ] Extended game correctness validation
- [ ] Cues inheritance
- [ ] Procedural generation integration (Improv and/or Tracery)
- [ ] User input
- [ ] HTML5 minigames

## 🕸️ Requirements

- Node.js >= 8.x with npm

## 🚀 Running

* Clone project or download project
* Run `npm install` in project dir
* Get bot token from [@BotFather](https://telegram.me/botfather)
* Create file named `.env` containing `BOT_TOKEN = <place your token here (no angle brackets)>`
* Run `npm start`

## 🎮 Creating games

Test game is located in `games/test_game.json`, it shows examples of game state, templating, markup and conditional transitions. Also take a look at `lib/deathline.ts`, it contains interfaces and types for game.

Place your game at `games/your_game.json` and run it by adding `GAME_NAME = your_game` to `.env` file.

There's no documentation at the moment, but you can take a look at `./schema.json`.

## ⌨️ Contributing

Feature requests and bug reports are welcome, as well as sample games. 
As for code, please make sure your code follows `.editorconfig`, passes `npm run lint` (`npm run lint:fix` if needed) and is compiling. Tests are appreciated. Also be nice:)

## MIT License

Copyright 2017 Konstantin Kitmanov.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
