<div id="top"></div>

# Minesweeper

This Minesweeper game is built following the requirements of [Rocket's Academy Project 3: Full-Stack Game](https://bootcamp.rocketacademy.co/projects/project-3-full-stack-game). It comes with 2 modes: Practice (Single Player) Mode, or 2-Player Mode. 

**This Minesweeper project is deployed and can be viewed on [this website](https://arcane-cove-70222.herokuapp.com/).**

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#game-rules">Game Rules</a>
      <ol>
        <li>
          <a href="#traditional-minesweeper">Traditional Minesweeper</a>
        </li>
        <li>
          <a href="#2-player-mode">2-Player Mode</a>
        </li>
        <li>
          <a href="#practice-single-player-mode">Practice (Single-Player) Mode</a>
        </li>
      </ol>
    </li>
    <li>
      <a href="#motivation">Motivation</a>
    </li>
    <li>
      <a href="#tech">Tech</a>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ol>
        <li>
          <a href="#usage-practice-single-player-mode">Practice (Single-Player) Mode</a>
        </li>
        <li>
          <a href="#usage-2-player-mode">2-Player Mode</a>
        </li>
      </ol>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#retrospective">Retrospective</a></li>
	 <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- GAME RULES -->

## Game Rules

<!-- TRADITIONAL MINESWEEPER -->

### Traditional Minesweeper

The objective of a traditional single-player Minesweeper game is to clear a rectangular board containing hidden mines without detonating them. The clues to the mines' location are given by opening (clicking on) non-mine tiles, which will display a number indicating the number of mines adjacent to said opened tile(s).

The rules, as summarised from [this Wikipedia article](https://en.wikipedia.org/wiki/Minesweeper_(video_game)), are as follows:

* When the game loads, a rectangular board (A x B number of tiles) is generated with mines scattered randomly across the tiles.
* All tiles have three states: (1) unopened, (2) opened, (3) flagged
* Unopened tiles can be opened by left-clicking on them: opened tiles will display nothing (no adjacent mines), a number (indicating number of adjacent mines), or a mine.
* When an unopened tile opens to reveal a mine, the game is over because the mine is "detonated".
* Right-clicking a mine flags it, causing a flag to appear on it. Players flag a tile to indicate a potential mine location.
* To win the game, players must open all non-mine cells. Flagging all the mined cells is not required.

However, this Minesweeper project is built to support a 2-player game. Thus, its rules also differ, including the ones for its Practice (Single Player) Mode. The differences in the rules will be articulated in the sections below.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- 2 PLAYER MODE -->

### 2-Player Mode

| | Traditional Minesweeper  | 2-Player Mode (This Project) |
| ------------- | ------------- | ------------- |
| **Number of Players** | Single player only  | Two players  |
| **Is there a timer for tracking time to win?**| Yes  | No  |
| **Win Condition**| All non-mine cells are opened. Timer will be stopped at this point.  | First player to flag 26 mines (out of a total of 51) wins.  |
| **Loss Condition**| Player opens a tile to reveal a mine, "detonating" it. Timer will be stopped at this point.  | When a player flags 26 mines, the other player loses.  |
| **Left-Click Mechanic**| Opens a tile. Opening a tile should reveal (1) nothing (no adjacent mines), a number (indicating number of adjacent mines), or a mine.  | Opens a tile if there isn't a hidden mine. If there is a hidden mine, it automatically flags it.  |
| **Right-Click Mechanic**| Flags a tile. Player flags a tile to indicate a potential mine location.  | No right-click mechanic.  |

Thereafter, the Practice (Single-Player) Mode is also based off the new rules from this 2-player interpretation of traditional Minesweeper. The rules for Practice Mode, compared to the other modes, are in the next section.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- PRACTICE SINGLE PLAYER MODE -->

### Practice (Single-Player) Mode

| | Traditional Minesweeper  | 2-Player Mode (This Project) | Practice Mode (This Project) |
| ------------- | ------------- | ------------- | ------------- |
| **Number of Players** | Single player only  | Two players  | Single player only |
| **Time- or Turn-Based**| Time-based | Turn-based | Turn-based |
| **Is there a timer for tracking time to win?**| Yes  | No  | No |
| **Is there a indicator tracking number of turns to win?**| No  | Yes  | Yes |
| **Win Condition**| All non-mine cells are opened. Timer will be stopped at this point.  | First player to flag 26 mines (out of a total of 51) wins.  | Flag 26 mines (out of a total of 51) to win. The number of turns taken to flag 26 mines will be recorded. |
| **Loss Condition**| Player opens a tile to reveal a mine, "detonating" it. Timer will be stopped at this point.  | When a player flags 26 mines, the other player loses.  | No loss condition. Player is encouraged to flag 26 mines in as few turns as possible. |
| **Left-Click Mechanic**| Opens a tile. Opening a tile should reveal (1) nothing (no adjacent mines), a number (indicating number of adjacent mines), or a mine.  | Opens a tile if there isn't a hidden mine. If there is a hidden mine, it automatically flags it.  | Opens a tile if there isn't a hidden mine. If there is a hidden mine, it automatically flags it. |
| **Right-Click Mechanic**| Flags a tile. Player flags a tile to indicate a potential mine location.  | No right-click mechanic.  | No right-click mechanic. |

Given that there isn't really a loss condition for Practice Mode (Single-Player) Mode, the mode is aptly named as such. Players select that mode if they are not looking for a partner to play with, and they want to practice finishing flagging mines in as few turns as possible.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MOTIVATION -->

## Motivation

I am a Minesweeper nerd, and try my best to complete a traditional game daily. My mind wanders a lot, and Minesweeper keeps it (fruitfully) active.

Back in high school (early-2000s), I looked forward to ending class, so I can be at home playing a couple of 2-player Minesweeper games on MSN Messenger with friends. A gameplay video (not mine) of MSN Messenger's 2-player Minesweeper game can be found [here](https://www.youtube.com/watch?v=oVNN25dYQtM).

Since the discontinuation of MSN Messenger (and its games), I couldn't find a good 2-player alternative to Minesweeper online. Thus (and for nostalgia's sake), I decided to build my own.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- TECH -->

## Tech

##### Frontend

- HTML
- [SCSS](https://sass-lang.com/)
- JavaScript

##### Styling

- [Bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/)

##### Backend

- [Express](https://expressjs.com/)
- [Sequelize/PostgreSQL](https://sequelize.org/v7/)

##### Module Bundler

- [Webpack](https://webpack.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE -->

## Usage

You can visit the project's website [here](https://arcane-cove-70222.herokuapp.com/).

<img width="1420" alt="Screenshot 2022-03-07 at 3 29 49 AM" src="https://user-images.githubusercontent.com/7672836/156939022-9e7e4f7a-64cd-4a9e-8bed-06b0caa414e0.png">

1. Go to the project's [website](https://arcane-cove-70222.herokuapp.com/). You should be able to see a simple page with all the currently running games just like the screenshot above. Without an account yet, you can only spectate other players' games. Click on the green Log In button on the top navigational bar to begin joining or creating games.

<img width="1419" alt="Screenshot 2022-03-07 at 3 31 12 AM" src="https://user-images.githubusercontent.com/7672836/156939078-f96472e4-9867-4a3f-b5ae-0dc8a65c99f2.png">

2. Log in with your username, or sign up for an account if you haven't already got one.

<img width="1419" alt="Screenshot 2022-03-07 at 3 38 40 AM" src="https://user-images.githubusercontent.com/7672836/156939297-06b98afd-d360-4824-a076-ca716be7fbbe.png">

3. Once logged in, the "Create a New Game" button should be displayed on the main page. Click on it, and you will be brought to a page to select the game mode.

<img width="1420" alt="Screenshot 2022-03-07 at 3 38 19 AM" src="https://user-images.githubusercontent.com/7672836/156939331-4ebe60db-1a4d-4b3b-8715-e5174a4163f4.png">

4. The game creation page will provide you with 2 game modes to select. Clicking on the blue (?) button will open a popup summarising the Minesweeper rules. In the next sub-section we will explain the interface in the Practice Mode.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE PRACTICE SINGLE PLAYER MODE -->

### Practice (Single-Player) Mode

<img width="1420" alt="Screenshot 2022-03-07 at 3 42 52 AM" src="https://user-images.githubusercontent.com/7672836/156939438-34fe4615-ef47-48d5-843e-3536ccdc97b5.png">

5. Creating a Practice Mode game will bring you to the game, just like the screenshot above. Every game, Practice Mode or 2-Player, has a red Forfeit button in the top-right hand corner of the page for players to end the game. In a 2-player game, this counts as a loss. Just like the game creation page, there's a blue (?) button that opens a popup summarising the Minesweeper rules.

<img width="583" alt="Screenshot 2022-03-07 at 3 46 07 AM" src="https://user-images.githubusercontent.com/7672836/156939554-3d6ea01c-0676-4e53-9455-cdb7a7ee2574.png">

6. The left-hand corner of every game screen contains the profiles of the player(s) and their progress in the current game. In a Practice (Single-Player) Mode game, there is only 1 player profile present - the player who created the game. In the screenshot above, there is a green bordered table with 2 icons as labels. The first row indicates the number of mines the player has flagged, and the second row indicates the number of turns elapsed. In the bottom of this profile section, there is a red label with the number "51", just like the screenshot above. This refers to the number of mines left unflagged on the board.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Migration to Socket.io for 2-player turn tracking purposes (from `setInterval`)
- [ ] Once-a-game area-of-effect tile opening and flagging mechanic (see [this video at 0:32](https://www.youtube.com/watch?v=_PM9X4y_3R0&t=32s))
- [ ] Resolve bug where UI says a vistor can join a game (as a second player) which already has 2 players playing.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- RETROSPECTIVE -->

## Retrospective

#### Depth-First Graph Traversal and Recursion

How are depth-first search and recursion related to Minesweeper? In Minesweeper, clicking to open a tile which does not have a hidden mine will reveal a number indicating the number of adjacent mines. In the case of opening an empty tile (no adjacent mines), adjacent tiles will continue (recursively) opening until a tile is opened with a number.

In a depth-first search, you explore in one direction (of a tree, graph etc) as far as possible, before backtracking and exploring in another. Assuming a 3x3 block of tiles, and the player chooses to click on the middle tile to open it to reveal nothing (no adjacent mines), there are `(9 - 1)` different directions the tiles can continue opening.

Given the structure of a Minesweeper game board as a 2D grid, [it can be reimagined as a graph data structure](https://mathworld.wolfram.com/GridGraph.html).

Putting the above together, a simplistic pseudocode algorithm for (recursively) opening tiles upon clicking to open the first empty tile is:

```
// definition of openTile function:
  // base cases:
  // (1) row and/or column indices exceed bounds, OR
  // (2) tile has already been opened
    // `return` or stop function execution if so
	
  // if opening tile reveals a mine, or number:
    // open tile
    // `return` or stop function execution
  
  // all other cases, ie just opening empty unopened tiles:
    // recursively open tile in all 8 directions
    // openTile(top)
    // openTile(topLeft)
    // openTile(topRight)
    // openTile(left)
    // openTile(right)
    // openTile(bottom)
    // openTile(bottomLeft)
    // openTile(bottomRight)
```

The actual code for this tile opening algorithm, together with other game logic included to track flags, mines and player turn, can be found [here](https://github.com/leechuanxin/p3-minesweeper/blob/main/controllers/games.mjs#L175-L227).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[Chuan Xin](https://github.com/leechuanxin) - chuanxin.lee@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

MIT

<p align="right">(<a href="#top">back to top</a>)</p>
