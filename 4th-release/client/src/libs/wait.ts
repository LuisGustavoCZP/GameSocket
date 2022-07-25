function waitFor (time : number) : Promise<boolean>
{
	return new Promise<boolean>((resolve, reject) => 
	{
		setTimeout(function() 
		{
			resolve(true);
		}, time);
	});
}

export {waitFor};