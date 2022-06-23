console.log("Map loading");

function createGameRender (game)
{
    const container = document.getElementById("screen");
    const screen = document.getElementById("game-screen");
    const context = screen.getContext('2d');
    const mapscreen = document.getElementById("map-screen");
    const mapcontext = mapscreen.getContext('2d');
    let isRunning = false;
    let pixelSize = screen.width / game.state?game.state.size:1;

    container.classList.add("hidden");
    //let map = {};
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

        //map = resp;
        console.log("Map:", resp);
        renderizeMap (resp);
    });

    function drawRect (rect)
    {
        context.fillStyle = rect.id == game.owner ? 'blue' : rect.color;
        context.fillRect(rect.x*pixelSize, rect.y*pixelSize, pixelSize, pixelSize);
    }

    function renderizeMap (map)
    {
        const set = map.sets[0];
        const mapimg = set.image;
        
        let x, y;
        for (const layer of map.map.layers)
        {
            //if(layer.name != "Camada de Tiles 1") continue;
            //console.log("Layer:", layer, set);
            for (const chunk of layer.chunks)
            {
                x = 0;
                y = 0;
                //console.log("Chunk:", chunks);
                for (const tileid of chunk.data)
                {
                    //console.log("Tile:", tileid);
                    const imgid = tileid-1;
                    const dx = imgid % set.columns, dy = (imgid - dx)/set.columns;
                    console.log(imgid, dx, dy);
                    //context.drawImage(mapimg, x, y, 128, 128);
                    mapcontext.drawImage(mapimg, (dx*17), (dy*17), 16, 16, (x + (chunk.x + 16))*16, (y + (chunk.y + 16))*16, 16, 16);
                    x++;
                    if(x >= chunk.width) {
                        x = 0;
                        y++;
                    }
                }
            }
        }

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
        container.classList.remove("hidden");
        pixelSize = screen.width / game.state.size;
        requestAnimationFrame(renderizeGame);
        console.log("Start rendering");
    }

    function stop ()
    {
        if(!isRunning) return;
        isRunning = false;
        container.classList.add("hidden");
        console.log("Stop rendering");
    }

    return {
        start,
        stop
    }
}

export default createGameRender;