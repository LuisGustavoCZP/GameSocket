console.log("Map loading");
let map = {};
fetch ("map/teste")
.then(resp => resp.json())
.then(resp => {

    for(const set of resp.sets)//(set => 
    {
        const p = set.image;
        //console.log(set);
        const img = new Image();
        img.src = p;
        set.image = img;
    };

    map = resp;
    console.log("Map:", map);
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
        
        const set = map.sets[0];
        const mapimg = set.image;
        
        let x, y;
        for (const layer of map.map.layers)
        {
            //console.log("Layer:", layer, set);
            for (const chunk of layer.chunks)
            {
                x = 0;
                y = 0;
                //console.log("Chunk:", chunks);
                for (const tileid of chunk.data)
                {
                    //console.log("Tile:", tileid);
                    
                    const dx = tileid % set.columns, dy = (tileid - dx);
                    //context.drawImage(mapimg, x, y, 128, 128);
                    context.drawImage(mapimg, dx, dy, 16, 16, x*32, y*32, 32, 32);
                    x++;
                    if(x > chunk.width) {
                        x = 0;
                        y++;
                    }
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