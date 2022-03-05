import { throttle } from 'throttle-debounce';
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

        socket.on('gameOver', onGameOver);

        socket.on('disconnect', () => {
          console.log('Disconnected from server');
        })
    });
}

// the use of throttle rate limits the sending of input updates so that it
// doesn't spam the socket. (I have set it to 20ms)
export const sendInput = throttle(20, (inputData) => {
  socket.emit('handleInput', inputData);
});