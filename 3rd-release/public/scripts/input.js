function createInputManager ()
{
    let isPaused = true;
    let timeWait = 10;
    const listeners = {};
    const map = {};

    function isMobile() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }

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
    
    if(isMobile())
    {
        
    } 
    else 
    {
        window.onkeydown = keydown;
        window.onkeyup = keyup;
    }

    window.addEventListener("contextmenu", (e) => 
    {
        if(e.button == 2) 
        {
            for(const l in map)
            {
                delete map[l];
            }
        }
    });

    return {
        register,
        unregister,
        start,
        stop
    }
}

export default createInputManager;