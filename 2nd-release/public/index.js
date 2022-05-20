import createGameRender from "./render.js";
import createInputManager from './input.js';

window.game = {};
window.inputManager = createInputManager();
window.gameRender = createGameRender(game);

async function Start ()
{   
    const auth = await fetch("/auth", {
        method: "POST"
    }).then(resp => resp.json()).catch(err => {return undefined});

    if(auth)
    {
        console.log(`Autorização: ${auth}`);
       // StartNetwork(auth);
    } else {
        Open();
    }
}

const forms = [
    {
        title:"LOGIN", submitText:"ENTER", requestType:"/login", submitAction: (r) => 
        {
            if(r == -1) {formType = 1; Open();}
        }
    },
    {
        title:"REGISTER", submitText:"CONFIRM", requestType:"/register", submitAction: (r) => 
        {
            if(r == -1) {formType = 0; Open();}
        }
    }
];
let formType = 0;

function Open ()
{
    const currentForm = forms[formType];
    const form = document.getElementById("form");
    form.classList.remove('hidden');

    const formTitle = document.getElementById("user-title");
    formTitle.innerText = currentForm.title;

    const formSubmit = document.getElementById("user-submit");
    formSubmit.innerText = currentForm.submitText;
    formSubmit.onclick = Submit;
}

async function Submit ()
{
    const username = document.getElementById("user-name").value;
    const userpass = document.getElementById("user-pass").value;
    const currentForm = forms[formType];

    const auth = await fetch(currentForm.requestType, {
        method: "POST",
        body: JSON.stringify({ username, userpass }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(resp => { return resp; })
    .catch(err => { return undefined; });

    console.log(`Resp: ${auth}`);
    currentForm.submitAction(auth);
}

function StartNetwork (token) 
{
    const socket = io();

    function actionTest (e) 
    {
        //console.log(e);
        socket.emit('player-move', e);
    }
    inputManager.register(actionTest);

    socket.on('connect', ()=>
    {
        const playerId = socket.id;
        console.log(`Player connected on Client with id: ${playerId}`);
        socket.emit('auth', token);
    });

    socket.on('setup', (state)=>
    {
        const playerId = socket.id;
        console.log(`Player setup for Client with id: ${playerId}`, state);
        game.state = state;
        gameRender.start();
        inputManager.start();
    });

    socket.on('game-update', (changes)=>
    {
        const playerId = socket.id;
        //console.log(`Game update`, changes);
        for(const pid in changes)
        {
            const p = changes[pid];
            game.state.objects[pid] = p;
        }
        //
    });

    socket.on('disconnect', ()=>
    {
        const playerId = socket.id;
        console.log(`Player disconnected on Client with id: ${playerId}`);
        gameRender.stop();
        inputManager.stop();
    });
}

Start ();