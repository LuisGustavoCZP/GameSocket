function QuadNode (x = 0, y = 0)
{
    return {
        pos:{ x:0, y:0 },
        objects: {},
        childrens: []
    };
}

function QuadTree () 
{
    const root = QuadNode();

    function add(obj)
    {
        if(!obj.x || !obj.y) throw Error("The object need to be 2D!")
        
    }
}

export default QuadTree;