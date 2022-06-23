import createGameRender from "./render.js";
import createInputManager from './input.js';
import createUserMenu from './user.js';
import createCharMenu from './character.js';
import startNetwork from './network.js';

window.game = { owner:undefined };
window.inputManager = createInputManager();
window.gameRender = createGameRender(game);

const userMenu = createUserMenu();
const charMenu = createCharMenu();

charMenu.start (startNetwork, userMenu.open);
userMenu.start (charMenu.apply);