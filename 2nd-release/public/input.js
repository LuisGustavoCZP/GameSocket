function createInputManager ()
{
    let isPaused = true;
    let timeWait = 10;
    const listeners = {};
    const map = {};

    const keydown = function(e)
    {
        e = e || event; // to deal with IE
        if(e.key == undefined) return;
        map[e.key] = e.type == 'keydown';
    }

    const keyup = function(e)
    {
        e = e || event; // to deal with IE
        if(e.key == undefined) return;
        delete map[e.key];
    }

    function register (action)
    {
        listeners[action.name] = action;
        //console.log(listeners);
    }

    function unregister (action)
    {
        //console.log(action)
        delete listeners[action.name];
    }

    function start ()
    {
        if(!isPaused) return;
        isPaused = false;
        execute ();
    }
    
    function stop ()
    {
        if(isPaused) return;
        isPaused = true;
    }

    function execute ()
    {
        if(isPaused) return;

        if(Object.keys(map).length > 0)
        {
            for(const listener in listeners)
            {
                listeners[listener](map); //JSON.parse(JSON.stringify(map))
            }
        }

        window.setTimeout(execute, timeWait);
    }
    
    window.onkeydown = keydown;
    window.onkeyup = keyup;

    return {
        register,
        unregister,
        start,
        stop
    }
}

export default createInputManager;