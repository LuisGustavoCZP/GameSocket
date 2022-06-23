import { Router } from "express";

const router = new Router();

router.get('/:name', async (req, res) => {
    
    const file = req.params["name"].replaceAll("../", "");
    const map = JSON.parse(fs.readFileSync(`maps/${file}.tmj`));
    const sets = map.tilesets.map(setPath => 
    {
        const set = JSON.parse(fs.readFileSync(`maps/${setPath.source}`));
        set.image = "data:image/png;base64," + fs.readFileSync(`maps/${set.image}`, {encoding: 'base64'});
        return set;
    });
    res.json({map, sets});
});

export default router;