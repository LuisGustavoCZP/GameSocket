function createKeyboardListener() 
{
    const state = {
        observers:[],
        playerId: null,
    };

    function registerPlayerId(playerId)
    {
        state.playerId = playerId;
    }

    function subscribe (observerFunction)
    {
        state.observers.push(observerFunction);
    }

    function clear ()
    {
        state.observers = [];
    }

    function notifyAll (command)
    {
        //console.log(`Notifying ${state.observers.length} observers`)

        for(const observerFunction of state.observers)
        {
            observerFunction(command);
        }
    }

    document.addEventListener('keydown', handleKeydown);
    function handleKeydown (event)
    {
        const command = {
            type:'move-player',
            id:state.playerId,
            keyPressed:event.key
        }

        notifyAll(command);
    }

    return {
        subscribe,
        clear,
        registerPlayerId
    }
}

export default createKeyboardListener();