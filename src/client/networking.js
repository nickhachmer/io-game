import io from 'socket.io-client';
import { processUpdate } from './state';

const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = (onGameOver) => {
    connectedPromise.then(() => {
        console.log('Connected to server');

        socket.on('serverUpdate', processUpdate);

        socket.on('onGameOver', onGameOver);

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        })
    });
}

export const sendInput = (inputData) => {
  socket.emit('handleInput', inputData)
}