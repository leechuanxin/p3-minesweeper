# Technical Review

### What went well? Please share a link to the specific code.

Implementing the "search algorithm" for [opening tiles](https://github.com/leechuanxin/p3-minesweeper/blob/main/controllers/games.mjs#L170).

I had a fear of recursive algorithms, because the biggest recursive function(s) I wrote before were only simple ones like n-th Fibonacci number, or factorials.

Fortunately, I came to expect having to code this algorithm when I was doing my planning docs. Thus, I was doing a lot of pen-and-paper or just running through the logic in my head (literally almost daily / almost hourly). This helped to solidify all possible edge cases (or base cases) way before I had to write the algorithm.

### What were the biggest challenges you faced? Please share a link to the specific code.

Mostly UI work. Partly, I shot myself in my foot by having perhaps too simplistic of an ERD. [The lines](https://github.com/leechuanxin/p3-minesweeper/blob/main/src/game_ui.js#L255) thereafter illustrate my problems: I tried accessing JSON data values from the database, and matching them (similarly to foreign keys) against keys from other tables.

I already had `created_user_id` and `player_user_id` in my database schema, and those suffice as substitutes to player1_id or player2_id in a 2-player game.

However, I also stored in the entire user information for player 1 and player 2 in my JSON data.

Player 2's user information, by default, will be `null` until a second player actually joins. This trips up a lot of my UI rendering logic, when I wanted to prepare feedback text for player 2 in advance. This leads to a lot of conditionals in JavaScript code just to check if `player2` exists, before trying to access specific data such as `player2.id`.

### What would you do differently next time?

Work less tilted? This mistake was made because I completely forgot I already had `created_user_id` and `player_user_id` as columns in my `games` table.

### Other questions?

```
const interval = setTimeout(handleRefresh(interval), 10000);

const handleRefresh = (someInterval) => () => {
	// some random logic here ...
	// after some logic, I would like to clear the interval,
	// and reset the interval itself (after clearing it)
	// through some conditionals.
	clearInterval(someInterval);
};
```

The lines above will causes errors, because technically you are trying to execute a function with the `interval` variable, before it properly holds a value.

How will you handle situations like this?



# Process Review

### What went well?

Unlike my peers, I am actually motivated for Project 3.

I liked that I actually planned for the game logic first, despite the fact that I was testing my recursive algorithms on the client-side first. That is because my project will make or break depending on whether I can figure out the board generation or tile opening algorithm!

### What could have been better?

I thought my process was perfect! If only life didn't get in the way so much.

If anything, I should have expected that I would have to plan my database schema better, given that we are dealing with non-relational and relational logic this time.

Also, I will remind myself to work less tilted. On hindsight, I was panicking for no reason most of the time for this project.

In fact, one of my most productive days was also my busiest (as in, outside of Bootcamp work). I was meeting Tonghuat and Tinaes for tea, but was doing work at home before meeting them. I was stuck in a problem for so long, yet I came to my solutions when I was on the bus to Tonghuat's house. Strange, huh?

Maybe sometimes what we need is to rest our eyes, look outside of the computer, and not be too uptight.

### What would you do differently next time?

We actually did our post-mortems by ourselves after today's presentations. We realised that we could have done more technical sharing ourselves even before presentations, just to know everyone's tips and tricks to tackling their own projects' problems.

This is because the problems another student from the same batch is facing will likely be the same problems you are having for your project.
