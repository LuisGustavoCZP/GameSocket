/* eslint-disable react/react-in-jsx-scope */
function Searching ()
{
	return (
		<span className='flex flex-row px-4 h-fit justify-center items-center'>
			<svg className="animate-spin -ml-1 mr-3 text-blue-300 w-full aspect-square" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
				<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<h2 className='ml-1 text-blue-300 text-8xl'>Procurando<span className='animation-blink'>.</span><span className='animation-blink animation-delay-0s5'>.</span><span className='animation-blink animation-delay-1s'>.</span></h2>
		</span>
	);
}

export default Searching;