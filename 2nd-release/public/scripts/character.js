function createCharMenu ()
{
    let next, back;
    let lastSession = undefined;
    const creationMenu = createCharCreationMenu();
    const selectionMenu = createSelectionMenu();

    function selectCharacter ()
    {
        close ();
        next(lastSession);
    }

    function createSelectionMenu ()
    {
        let selectedCharacter = undefined;

        async function start ()
        {
            const response = await fetch("/characters", {
                method: "GET"
            }).then(resp => resp.json()).catch(err => {return undefined});
    
            if(response)
            {
                console.log(`Characters: ${response}`);
                if(response.length == 0) {
                    creationMenu.start();
                }
                else 
                {
                    open ();
                    createSelector(response);
                }
            }
            else 
            {
                back();
            }
        }

        function close ()
        {
            const form = document.getElementById("selector");
            form.parentElement.classList.add('hidden');
            form.classList.add('hidden');

            const formTitle = document.getElementById("selector-title");
            formTitle.innerText = "";

            const formSubmit = document.getElementById("selector-submit");
            formSubmit.innerText = "";
            formSubmit.onclick = undefined;
        }

        function open ()
        {
            const form = document.getElementById("selector");
            form.parentElement.classList.remove('hidden');
            form.classList.remove('hidden');

            const formTitle = document.getElementById("selector-title");
            formTitle.innerText = "Character Selection";

            const formSubmit = document.getElementById("selector-submit");
            formSubmit.innerText = "Select";
            formSubmit.onclick = select;

            const formCreate = document.getElementById("selector-create");
            formCreate.innerText = "Create";
            formCreate.onclick = () => 
            {
                close();
                creationMenu.start(lastSession);
            };
        }

        function createCharacterOption (character)
        {
            const li = document.createElement("li");
            li.innerText = character.name;
            li.id = `${character.id}`;
            li.onclick = () => 
            {
                if(selectedCharacter) selectedCharacter.classList.remove("selected");
                selectedCharacter = li;
                if(selectedCharacter) selectedCharacter.classList.add("selected");
            };
            return li;
        }

        function createSelector(characters) 
        {
            const formList = document.getElementById("selector-list");
            formList.innerHTML = '';
            if(characters)
            {
                characters.forEach((character) => 
                {
                    formList.append(createCharacterOption(character));    
                });
            }
        }

        async function select () 
        {
            const response = await fetch("/character", {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "id_character":selectedCharacter.id }),
            }).then(resp => resp.json()).catch(err => {return undefined});

            if(response)
            {
                console.log("Selected for", lastSession);
                
                close ();
                next(lastSession);
            }
        }

        return {
            start,
            close,
            open,
            createCharacterOption,
            createSelector
        }
    }

    function createCharCreationMenu ()
    {
        function start ()
        {
            open ();
            console.log(lastSession);
        }

        function close ()
        {
            const form = document.getElementById("character");
            form.parentElement.classList.add('hidden');
            form.classList.add('hidden');

            const formTitle = document.getElementById("selector-title");
            formTitle.innerText = "";

            const formSubmit = document.getElementById("selector-submit");
            formSubmit.innerText = "";
            formSubmit.onclick = undefined;
        }

        function open ()
        {
            const form = document.getElementById("character");
            form.parentElement.classList.remove('hidden');
            form.classList.remove('hidden');

            const formTitle = document.getElementById("character-title");
            formTitle.innerText = "Character Creation";

            const formSubmit = document.getElementById("character-submit");
            formSubmit.innerText = "Confirm";
            formSubmit.onclick = confirm;
        }

        async function confirm () 
        {
            const charname = document.getElementById("character-name").value;

            const response = await fetch("/addcharacter", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ charname }),
            }).then(resp => resp.json()).catch(err => {return undefined});

            console.log("Creation ", response);

            if(response.sucess) {
                close ();
                selectionMenu.start();
            }
            
        }

        return {
            start,
        };
    }

    async function apply (session)
    {
        if(session.id_character) { next(session); return; }
        console.log(session);
        lastSession = session;
        selectionMenu.start();
    }

    async function start (nextCallback=()=>{}, backCallback=()=>{})
    {   
        next = nextCallback; 
        back = backCallback;
    }

    return {
        start,
        apply
    }
}

export default createCharMenu;