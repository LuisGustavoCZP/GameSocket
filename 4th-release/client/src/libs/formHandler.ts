import { Request } from '../services';

function FormHandler (url : string, setMessages : any)
{
	async function submit (e: React.MouseEvent<HTMLButtonElement>)
	{
		e.preventDefault();

		const username = (document.getElementById('username') as HTMLInputElement).value;
		const password = (document.getElementById('password') as HTMLInputElement).value;
		const resp = await Request.post(url, { username, password });
		
		if(resp.messages.length > 0)
		{
			setMessages(resp.messages);
			console.log(`Resp: ${resp.messages}`);
		}
		else 
		{
			goBack(e);
		}
	}

	async function goBack(e: React.MouseEvent<HTMLButtonElement>) 
	{
		window.location.reload();
	}

	return {
		submit,
		goBack
	};
}

export default FormHandler;