import React from 'react';
import './styles/global.css';
//import logo from './logo.svg';
import './App.css';
import { Main } from './components/Main';
//document.cookie

function App() 
{
	return (
		<div className="App">
			<header className="App-header">
				<h1 className='text-blue-300'>Bomberminion</h1>
			</header>
			<Main></Main>
		</div>
	);
}

export default App;
