import { Router } from "express";
import maps from "../maps/index.js";

const router = new Router();

router.get('/:name', async (req, res) => 
{
    const {name:mapname} = req.params;
    //console.log(mapname);
    const map = maps.tilemaps[mapname];
    //console.log(map);
    const sets = map.tilesets.map(setPath => 
    {
        const setname = setPath.source.replace(".tsj", "");
        if(maps.tilesets[setname]) return maps.tilesets[setname];
    });

    const blockers = maps.blockers[mapname];

    res.json({map, sets, blockers});
});

export default router;