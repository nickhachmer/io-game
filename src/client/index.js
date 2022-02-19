import { startCapturingInput } from "./input";
import { connect } from "./networking";
import { startRendering } from "./render";

Promise.resolve(connect(onGameOver)).then(() => {
    startCapturingInput();
    startRendering();
})


function onGameOver() {
    console.log('Game Over :(');
}