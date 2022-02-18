import { webpack } from "webpack";
import { Server, Socket } from 'socket.io';
import webpackDevMiddleware from 'webpack-dev-middleware';
import express from 'express';

import webpackConfig from '../../webpack.dev.js';
import { GameManager } from "./game-manager";
import { Input } from "../shared/model.js";

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    // Setup Webpack for development
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
} else {
    // Static serve the dist/ folder in production
    app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);


// Setup socket.io
const io = new Server(server);

const gm = new GameManager();

// Listen for socket.io connections
io.on('connection', (socket: Socket) => {
    console.log('Player connected!', socket.id);
    gm.addPlayer(socket);

    io.on('disconnect', () => {
        gm.removePlayer(this);
    });

    io.on('handleInputs', (input: Input) => {
        gm.handleInput(input);
    });
});

