
# What even is this?

This is a fun little project I made in order to try out making an io game. I followed some guides and ended up making a proof of concept / MVP of a tron light bike game. 

Basically, you control an ever moving circle that leaves a trail behind them. if you crash into your own trail or someon elses trail you loose. The winner is the last one alive.

# Guides

I used the following guides:
https://dev.to/kenzan100/make-an-original-io-game-in-5-days-3c0g
https://victorzhou.com/blog/build-an-io-game-part-1/ (primarily this one)

# Conclusion

Overall I quite happy with how this turned out. At the end this became more of a hackatho project since I stopped caring about quiality of code or efficieny - I just wanted to get something that worked. And, I think I have that (to a degree XD).

# To run on local

- clone the repo
- run `npm install`
- run `tsc`
- run `npm dev run`
- then go to localhost:3000 and it should be ready to go.

# Issues

There are probably quite a few bugs in this - its just an MVP and I made it as fast as I could.

- There is one bug I know about where in the game-manager.ts the line that gets position: `const position = { x: player.x, y: player.y };` for some reason fails sometimes because player is undefined (I'm not sure how that's possible). Thus I have added a condition there to just return if player is undefined.

- There is only one lobby for everyone, which is not great.
- There is no validation on the usernames
- leaving the game (refreshing the page) and joining back is not well test behavior and would not recommend doing that.

# Screen Shots
![alt text](https://github.com/nickhachmer/io-game/tree/master/screenshots/lobby.png?raw=true)
![alt text](https://github.com/nickhachmer/io-game/tree/master/screenshots/game.png?raw=true)