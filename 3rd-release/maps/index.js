import fs from 'fs';
const tilemaps = {};
const tilesets = {};
const blockers = {};

const folderRemover = (path) => path.replace(/\*+[/]/, "");
const mapNameParser = (path) => path.replaceAll("../", "").replace(".tmj", "")
const setNameParser = (path) => folderRemover(path.source.replace(".tsj", ""))

function loadMap (name)
{
    const fileName = mapNameParser(name);
    if(tilemaps[fileName]) return tilemaps[fileName];

    const map = JSON.parse(fs.readFileSync(`maps/tilemaps/${fileName}.tmj`));
    const sets = map.tilesets.map(setPath => 
    {
        //console.log(setPath);
        const setname = setNameParser(setPath);
        if(tilesets[setname]) return tilesets[setname];
        const set = JSON.parse(fs.readFileSync(`maps/tilesets/${setname}.tsj`));
        set.image = "data:image/png;base64," + fs.readFileSync(`maps/images/${folderRemover(set.image)}`, {encoding: 'base64'});
        
        const tiles = {}; 
        set.tiles.forEach(tile => 
        {
            tiles[tile.id] = tile;
        });
        set.tiles = tiles;

        tilesets[setname] = set;

        return set;
    });
    
    const mapblockers = {}
    let x, y;
    for (const layer of map.layers)
    {
        for (const chunk of layer.chunks)
        {
            x = 0;
            y = 0;
            //console.log("Chunk:", chunks);
            for (const tileid of chunk.data)
            {
                //console.log("Tile:", tileid);
                if(tileid != 0) 
                {
                    const imgid = tileid-1;
                    
                    const block = sets[0].tiles[imgid];
                    if(block) 
                    {
                        const dx = (x + (chunk.x + 16))*16;
                        const dy = (y + (chunk.y + 16))*16;

                        const blocker = {
                            x:dx,
                            y:dy,
                            blockers:block.objectgroup.objects
                        };
                        mapblockers[`(${dx}, ${dy})`] = blocker;
                    }
                }
                x++;
                if(x >= chunk.width) {
                    x = 0;
                    y++;
                }
            }
        }
    }
    blockers[fileName] = mapblockers;

    tilemaps[fileName] = map;
    return { map, sets, mapblockers };
}

function collision (colisor, x, y)
{
    for(const mbKey in  blockers)
    {
        const blocker = blockers[mbKey];
        const pos = `(${x*16}, ${y*16})`;
        //console.log(blocker, pos);
        if(blocker[pos])
        {
            return true;
        }
    }
    return false;
}

function start ()
{
    console.log("Running Map Loading!!!")
    const fileMaps = fs.readdirSync("maps/tilemaps/");
    fileMaps.forEach(fileMap => 
    {
        loadMap(fileMap);
    });
}

start ();

export default { tilemaps, tilesets, blockers, collision };