import React, { useState } from 'react';

const TicTacToe = () => {
  const [boxes, setBoxes] = useState(Array(9).fill(''));
  const [turnO, setTurnO] = useState(true);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

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

  const resetGame = () => {
    setBoxes(Array(9).fill(''));
    setTurnO(true);
    setMessage('');
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-custom-bg min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-white">Tic Tac Toe</h1>
      <div className=" flex justify-center items-center h-4/5">
        <div className="grid grid-cols-3  max-w-md mx-auto justify-center items-center gap-6 w-60vmin h-60vmin">
          {boxes.map((box, index) => (
            <button
              key={index}
              className=" w-18vmin h-18vmin bg-custom-box-bg text-custom-box-text text-8vmin font-bold flex items-center justify-center rounded-1rem shadow-custom"
              onClick={() => handleBoxClick(index)}
              disabled={gameOver || box}
            >
              {box}
            </button>
          ))}
        </div>
      </div>
      {message && (
        <div className=" flex flex-col justify-center items-center gap-16 absolute inset-0 bg-custom-bg bg-opacity-75">
          <p className="text-5vmin w-96 font-semibold bg-custom-box-bg text-custom-btn-bg rounded-xl">{message}</p>
          <button className="bg-custom-btn-bg font-bold text-black px-4 py-2 rounded-1rem" onClick={resetGame}>New Game</button>
        </div>
      )}
      <button className="mt-20 bg-custom-btn-bg font-bold text-black px-4 py-2 rounded-1rem" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default TicTacToe;
