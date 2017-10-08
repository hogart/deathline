# deathline

Deathline is TG bot seed to create Lifeline-like games, written in TypeScript. Games are described in JSON format. 
It's still in very early stages, but should work.

## 🕸️ Requirements

- Node.js >= 8.x with npm

## 🚀 Running

* Clone project or download project
* Run `npm install` in project dir
* Get bot token from [@BotFather](https://telegram.me/botfather)
* Create file named `.env` containing `BOT_TOKEN = <place your token here (no angle brackets)>`
* Run `npm start`

## 🎮 Creating games

Test game is located in `games/pushkin.json` (Russian only at the moment). Also take a look at `lib/deathline.ts`, it contains interfaces and types for game.

Place your game at `games/your_game.json` and run it by adding `GAME_NAME = your_game` to `.env` file.

There's no documentation at the moment, but you can take a look at `./schema.json`.

## ⌨️ Contributing

Feature requests and bug reports are welcome, as well as sample games. 
As for code, please make sure your code follows `.editorconfig`, passes `npm run lint` (`npm run lint:fix` if needed) and is compiling. Also be nice:)

## MIT License

Copyright 2017 Konstantin Kitmanov.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
