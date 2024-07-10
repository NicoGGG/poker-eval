# Poker Eval in typescript

An equivalent to [Poker Eval](https://github.com/atinm/poker-eval) in typescript.

For now only support Texas Hold'em.

## Features

When the game is over and the hand is at the river, pokerEval will give the winner of the hand.
If there are draws, all drawn players are considered winners.

When the game is not over (hand is preflop, flop or turn), pokerEval will simulate all possible outcomes and give
the number of times each player wins, effectively giving their percentage chance of winning the hand.

> [!NOTE]
> Preflop, only simulate 10k random outcomes, so there might be slight variations from a simulation to another.

## Usage

```typescript
import pokerEval from "poker-eval";

const handPlayer1 = ["Ah", "Ks"];
const handPlayer2 = ["8d", "8s"];
const board1 = [];
const board2 = ["Ad", "Kc", "Th", "4c", "5c"];
const result1 = pokerEval([handPlayer1, handPlayer2], board1);
const result2 = pokerEval([handPlayer1, handPlayer2], board2);
console.log(result1); // [4641, 5398]
console.log(result2); // [1, 0]
```

The example above shows how to use the pokerEval function.

It returns an array of the number of wins for the same indexed player on all tested scenarios.

Note that a preflop eval will only test 10000 random possible outcomes, while flop and turn test all possible outcomes.
River eval will give the actual result of the hand.

If there is a draw, pokerEval considers that both players won.
The client has the responsibility to decide how to handle draws.

> [!IMPORTANT]
> Current implementation can lead to a sum of all wins to be > 100% of all possible outcomes.
> Client needs to calculate a percentage from the total number of wins in the returned array to stay == 100%.
