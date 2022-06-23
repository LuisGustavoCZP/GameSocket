import fs from 'fs';
const tilemaps = {};
const tilesets = {};

function loadMap (name)
{
    const fileName = name.replaceAll("../", "").replace(".tmj", "");
    if(tilemaps[fileName]) return tilemaps[fileName];

    const map = JSON.parse(fs.readFileSync(`maps/tilemaps/${fileName}.tmj`));
    const sets = map.tilesets.map(setPath => 
    {
        //console.log(setPath);
        const setname = setPath.source.replace(".tsj", "");
        if(tilesets[setname]) return tilesets[setname];
        const set = JSON.parse(fs.readFileSync(`maps/tilesets/${setname}.tsj`));
        set.image = "data:image/png;base64," + fs.readFileSync(`maps/images/${set.image}`, {encoding: 'base64'});
        tilesets[setname] = set;
        return set;
    });
    tilemaps[fileName] = map;
    return { map, sets };
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

export default {tilemaps, tilesets};