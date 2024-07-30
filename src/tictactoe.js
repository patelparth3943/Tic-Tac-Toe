/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';

const TicTacToe = () => {
  const [boxes, setBoxes] = useState(Array(9).fill(''));
  const [turnO, setTurnO] = useState(true);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState(null);
  const [modeSelected, setModeSelected] = useState(false);

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const checkWinner = (newBoxes) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoxes[a] && newBoxes[a] === newBoxes[b] && newBoxes[a] === newBoxes[c]) {
        setMessage(`Congratulations, Winner is ${newBoxes[a]}`);
        setGameOver(true);
        return true;
      }
    }
    return false;
  };

  const handleBoxClick = (index) => {
    if (!modeSelected) {
      setMessage('Please select mode');
      return;
    }

    if (gameOver || boxes[index]) return;

    const newBoxes = [...boxes];
    newBoxes[index] = turnO ? 'O' : 'X';
    setBoxes(newBoxes);

    const isWinner = checkWinner(newBoxes);
    if (!isWinner && newBoxes.every(box => box)) {
      setMessage('Game was a Draw.');
      setGameOver(true);
    } else {
      setTurnO(!turnO);
    }
  };

  const aiMove = () => {
    const newBoxes = [...boxes];

    // Try to win
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoxes[a] === 'X' && newBoxes[b] === 'X' && !newBoxes[c]) return c;
      if (newBoxes[a] === 'X' && newBoxes[c] === 'X' && !newBoxes[b]) return b;
      if (newBoxes[b] === 'X' && newBoxes[c] === 'X' && !newBoxes[a]) return a;
    }

    // Try to block O from winning
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoxes[a] === 'O' && newBoxes[b] === 'O' && !newBoxes[c]) return c;
      if (newBoxes[a] === 'O' && newBoxes[c] === 'O' && !newBoxes[b]) return b;
      if (newBoxes[b] === 'O' && newBoxes[c] === 'O' && !newBoxes[a]) return a;
    }

    // Make a random move
    const emptyIndexes = newBoxes.map((box, idx) => box === '' ? idx : null).filter(idx => idx !== null);
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  };

  useEffect(() => {
    if (!turnO && !gameOver && mode === 'robot') {
      const index = aiMove();
      handleBoxClick(index);
    }
  }, [turnO, mode]);

  const resetGame = () => {
    setBoxes(Array(9).fill(''));
    setTurnO(true);
    setMessage('');
    setGameOver(false);
    // Do not reset mode and modeSelected
  };

  const handleModeChange = (value) => {
    setMode(value);
    setModeSelected(true);
    setMessage(''); // Clear the message when mode is selected
  };

  return (
    <div className="flex flex-col items-center p-4 bg-custom-bg min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-white">Tic Tac Toe</h1>
      
      <div className="flex justify-center items-center w-full px-10">
        <Select.Root onValueChange={handleModeChange}>
          <Select.Trigger className="w-[180px] bg-custom-box-bg cursor-pointer text-white rounded-md">
            <Select.Value placeholder="Select Mode">
              {mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "Select Mode"}
            </Select.Value>
          </Select.Trigger>
          <Select.Content className='bg-custom-box-bg text-white rounded-md' position="popper" align="end">
            <Select.Item value="multiplayer" className='border-2 cursor-pointer'>Multiplayer</Select.Item>
            <Select.Item value="robot" className='border-2 cursor-pointer'>Robot</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      
      <div className="flex justify-center items-center h-4/5 mt-6">
        <div className="grid grid-cols-3 max-w-md mx-auto justify-center items-center gap-6 w-60vmin h-60vmin">
          {boxes.map((box, index) => (
            <button
              key={index}
              className="w-18vmin h-18vmin bg-custom-box-bg text-custom-box-text text-8vmin font-bold flex items-center justify-center rounded-1rem shadow-custom"
              onClick={() => handleBoxClick(index)}
              disabled={gameOver || box}
            >
              {box}
            </button>
          ))}
        </div>
      </div>
      
      {message && (
        <div className="flex flex-col justify-center items-center gap-16 absolute inset-0 bg-custom-bg bg-opacity-75">
          <p className="text-5vmin w-96 font-semibold bg-custom-box-bg text-custom-btn-bg rounded-xl">{message}</p>
          <button className="bg-custom-btn-bg font-bold text-black px-4 py-2 rounded-1rem" onClick={resetGame}>New Game</button>
        </div>
      )}
      <button className="mt-20 bg-custom-btn-bg font-bold text-black px-4 py-2 rounded-1rem" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default TicTacToe;
