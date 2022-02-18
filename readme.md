I am using this guide as reference -> so you will likely see some config and code from here

so the way the clioent side rendering was done was have a time offset from the server. Use that offset when getting the next update by comparing timings. then to get the update you look to see if base update is the last update avaialble - if so just use it. Otherwise iterpolate between the current base update and the next update available. - this allows for higher refresh rate than the game updates from the server.


itll be smart to limit the game update send rate of the server to something like 30 per sec to not overload the internet (any faster is probably unecessary)

also it seems that input is captured in client and sent to server - server calcukates everthing and client just renders things.