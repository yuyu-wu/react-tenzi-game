import './App.css';
import React from 'react';
import Die from './Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
	const [ dice, setDice ] = React.useState(allNewDice());
	const [ tenzies, setTenzies ] = React.useState(false);

  const [ time, setTime ] = React.useState(0);
	const [ timerOn, setTimerOn ] = React.useState(false);

	React.useEffect(
		() => {
			const allHeld = dice.every((die) => die.isHeld);
			const firstValue = dice[0].value;
			const allSameValue = dice.every((die) => die.value === firstValue);
			if (allHeld && allSameValue) {
				setTenzies(true);
        setTimerOn(false);
			}
		},
		[ dice ]
	);

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid()
		};
	}

	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie());
		}
		return newDice;
	}

	function rollDice() {
		if (!tenzies) {
      // setTime(0);
      setTimerOn(true);
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie();
				})
			);
		} else {
			setTenzies(false);
			setDice(allNewDice());
      setTime(0);
      setTimerOn(false);

		}
	}

	function holdDice(id) {
    if (!tenzies) {
      setTimerOn(true);
    }
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}

	const diceElements = dice.map((die) => (
		<Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
	));

	

	React.useEffect(
		() => {
			let interval = null;

			if (timerOn) {
				interval = setInterval(() => {
					setTime((prevTime) => prevTime + 10);
				}, 10);
			} else if (!timerOn) {
				clearInterval(interval);
			}

			return () => clearInterval(interval);
		},
		[ timerOn ]
	);

	return (
    <div className="container">
      <div className="Timer">
				<div id="display">
					<span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
					<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
					<span>{('0' + (time / 10) % 100).slice(-2)}</span>
          
				</div>
			</div>
		<main>
			{tenzies && <Confetti />}
			
			
			<h1 className="title">Tenzi</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
			</p>
			{/* <div className="dice-container">{tenzies ? {diceElements} : ''}</div> */}
      <div className="dice-container">{diceElements}</div>
			<button className="roll-dice" onClick={rollDice}>
				{tenzies ? 'New Game' : 'Roll Dice'}
			</button>
		</main>
    </div>
	);
}
