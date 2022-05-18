export default function createGameRender (game)
{
    const screen = document.getElementById("screen");
    const context = screen.getContext('2d');
    requestAnimationFrame(renderScreen);
    function renderScreen () 
    {
        context.clearRect(0, 0, screen.width, screen.height);

        const pixelSize = screen.width / game.state.size;

        function drawRect (rect)
        {
            context.fillStyle = rect.color;
            context.fillRect(rect.x*pixelSize, rect.y*pixelSize, pixelSize, pixelSize);
        }

        for(const pid in game.state.players){
            const player = game.state.players[pid];
            drawRect({...player, color:pid===game.current?'yellow':'black'})
        }

        for(const fid in game.state.fruits){
            const player = game.state.fruits[fid];
            drawRect({...player, color:'green'})
        }

        const playerPoints = document.getElementById("points");
        const currentPlayer = game.state.players[game.current];
        if(currentPlayer) playerPoints.innerText = currentPlayer.points;

        requestAnimationFrame(renderScreen);
    }
}