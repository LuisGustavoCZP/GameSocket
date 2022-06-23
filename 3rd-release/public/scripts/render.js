console.log("Map loading");
let map = {};
fetch ("map/teste")
.then(resp => resp.json())
.then(resp => {
    console.log(resp);

    for(const set of resp.sets)//(set => 
    {
        const p = set.image;
        console.log(set);
        const img = new Image();
        img.src = p;
        set.image = img;
    };

    map = resp;
});

function createGameRender (game)
{
    const screen = document.getElementById("screen");
    const context = screen.getContext('2d');
    let isRunning = false;
    let pixelSize = screen.width / game.state?game.state.size:1;

    screen.classList.add("hidden");

    function drawRect (rect)
    {
        context.fillStyle = rect.id == game.owner ? 'blue' : rect.color;
        context.fillRect(rect.x*pixelSize, rect.y*pixelSize, pixelSize, pixelSize);
    }

    function renderizeGame ()
    {
        if(!isRunning) return;
        requestAnimationFrame(renderizeGame);

        context.clearRect(0, 0, screen.width, screen.height);
        
        const mapimg = map.sets[0].image;
        
        let x, y;
        for (const layer of map.map.layers)
        {
            for (const chunks of layer.chunks)
            {
                for (const tileid of chunks.data)
                {
                    x++;
                    if(x > chunks.data.width) {
                        x = 0;
                        y++;
                    }   
                    const dx = tileid % 32, dy = (tileid - dx);
                    context.drawImage(mapimg, x, y, 16, 16, dx, dy, 16, 16);
                }
            }
        }

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
        screen.classList.remove("hidden");
        pixelSize = screen.width / game.state.size;
        requestAnimationFrame(renderizeGame);
        console.log("Start rendering");
    }

    function stop ()
    {
        if(!isRunning) return;
        isRunning = false;
        screen.classList.add("hidden");
        console.log("Stop rendering");
    }

    return {
        start,
        stop
    }
}

export default createGameRender;