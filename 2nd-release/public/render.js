function createGameRender (game)
{
    const screen = document.getElementById("screen");
    const context = screen.getContext('2d');
    let isRunning = false;
    const pixelSize = screen.width / game.state.size;

    function drawRect (rect)
    {
        context.fillStyle = rect.color;
        context.fillRect(rect.x*pixelSize, rect.y*pixelSize, pixelSize, pixelSize);
    }

    function renderizeGame ()
    {
        if(!isRunning) return;
        requestAnimationFrame(renderizeGame);

        context.clearRect(0, 0, screen.width, screen.height);
        
        for(const objId in game.state.objects)
        {
            const obj = game.state.objects[objId];
            //console.log(obj);
            drawRect(obj);
        }
    }
    
    function start ()
    {
        if(isRunning) return;
        isRunning = true;
        requestAnimationFrame(renderizeGame);
        
        console.log("Start rendering");
    }

    function stop ()
    {
        if(!isRunning) return;
        isRunning = false;

        console.log("Stop rendering");
    }

    return {
        start,
        stop
    }
}

export default createGameRender;