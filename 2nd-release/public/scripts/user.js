function createUserMenu ()
{
    let next;

    async function apply ()
    {
        const token = await fetch("/auth", {
            method: "POST"
        }).then(resp => resp.json()).catch(err => {return undefined});

        if(token)
        {
            console.log(`Autorização: ${token}`);
            auth(token);
        } else {
            open();
        }
    }

    async function start (nextCallback=()=>{})
    {   
        next = nextCallback;
        apply();
    }

    const forms = [
        {
            title:"LOGIN", submitText:"ENTER", requestType:"/login", submitAction: (token) => 
            {
                //console.log(token);
                if(!token) 
                {
                    formType = 1; 
                    open();
                }
                else 
                {
                    auth(token);
                }
            }
        },
        {
            title:"REGISTER", submitText:"CONFIRM", requestType:"/register", submitAction: (token) => 
            {
                //console.log(token);
                if(!token) 
                {
                    formType = 0; 
                    open();
                }
                else 
                {
                    auth(token);
                }
            }
        }
    ];
    let formType = 0;

    function auth (token)
    {
        close ();
        next(token)
    }

    function close ()
    {
        const form = document.getElementById("user");
        form.parentElement.classList.add('hidden');
        form.classList.add('hidden');

        const formTitle = document.getElementById("user-title");
        formTitle.innerText = "";

        const formSubmit = document.getElementById("user-submit");
        formSubmit.innerText = "";
        formSubmit.onclick = undefined;
    }

    function open ()
    {
        const currentForm = forms[formType];
        const form = document.getElementById("user");
        form.parentElement.classList.remove('hidden');
        form.classList.remove('hidden');

        const formTitle = document.getElementById("user-title");
        formTitle.innerText = currentForm.title;

        const formSubmit = document.getElementById("user-submit");
        formSubmit.innerText = currentForm.submitText;
        formSubmit.onclick = submit;
    }

    async function submit ()
    {
        const username = document.getElementById("user-name").value;
        const userpass = document.getElementById("user-pass").value;
        const currentForm = forms[formType];

        const token = await fetch(currentForm.requestType, {
            method: "POST",
            body: JSON.stringify({ username, userpass }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(resp => resp.json())
        .catch(err => { return undefined; });

        console.log(`Resp: ${token}`);
        currentForm.submitAction(token);
    }

    return {
        start,
        apply,
        auth,
        close,
        open,
        submit
    }
} 

export default createUserMenu;