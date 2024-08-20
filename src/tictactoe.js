
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { motion } from 'framer-motion';
import FullPageTextSpinnerLoader from './FullPageTextSpinnerLoader.js';


const TicTacToe = () => {
  const [loading, setLoading] = useState(true);

  const [boxes, setBoxes] = useState(Array(9).fill(''));
  const [turnO, setTurnO] = useState(true);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [modeSelected, setModeSelected] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(false);

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
        return newBoxes[a];
      }
    }
    if (newBoxes.every(box => box)) {
      setMessage('Game was a Draw.');
      setGameOver(true);
      return 'draw';
    }
    return null;
  };

  const handleBoxClick = (index) => {
    if (!modeSelected) {
      setMessage('Please select mode');
      return;
    }

    if (mode === 'robot' && !difficultySelected) {
      setMessage('Please select difficulty');
      return;
    }

    if (gameOver || boxes[index]) return;

    const newBoxes = [...boxes];
    newBoxes[index] = turnO ? 'O' : 'X';
    setBoxes(newBoxes);

    const winner = checkWinner(newBoxes);
    if (!winner) {
      setTurnO(!turnO);
    }
  };

  const aiMove = () => {
    const newBoxes = [...boxes];
    const index = difficulty === 'easy' ? easyMove(newBoxes) : hardMove(newBoxes);
    handleBoxClick(index);
  };

  const easyMove = (newBoxes) => {
    // Easy mode logic
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

  const hardMove = (newBoxes) => {
    // Hard mode logic using Minimax
    const bestMove = findBestMove(newBoxes);
    return bestMove;
  };

  const findBestMove = (newBoxes) => {
    let bestVal = -1000;
    let bestMove = -1;
    for (let i = 0; i < newBoxes.length; i++) {
      if (newBoxes[i] === '') {
        newBoxes[i] = 'X';
        const moveVal = minimax(newBoxes, 0, false);
        newBoxes[i] = '';
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  };

  const minimax = (newBoxes, depth, isMax) => {
    const score = evaluate(newBoxes);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (newBoxes.every(box => box)) return 0;

    if (isMax) {
      let best = -1000;
      for (let i = 0; i < newBoxes.length; i++) {
        if (newBoxes[i] === '') {
          newBoxes[i] = 'X';
          best = Math.max(best, minimax(newBoxes, depth + 1, !isMax));
          newBoxes[i] = '';
        }
      }
      return best;
    } else {
      let best = 1000;
      for (let i = 0; i < newBoxes.length; i++) {
        if (newBoxes[i] === '') {
          newBoxes[i] = 'O';
          best = Math.min(best, minimax(newBoxes, depth + 1, !isMax));
          newBoxes[i] = '';
        }
      }
      return best;
    }
  };

  const evaluate = (newBoxes) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoxes[a] === 'X' && newBoxes[b] === 'X' && newBoxes[c] === 'X') return 10;
      if (newBoxes[a] === 'O' && newBoxes[b] === 'O' && newBoxes[c] === 'O') return -10;
    }
    return 0;
  };

  useEffect(() => {
    let timer;
    if (!turnO && !gameOver && mode === 'robot') {
      timer = setTimeout(() => {
        aiMove();
      }, 1000); 
    }
    return () => clearTimeout(timer); 
  }, [turnO, mode, difficulty]);

  const resetGame = () => {
    setBoxes(Array(9).fill(''));
    setTurnO(true);
    setMessage('');
    setGameOver(false);
   
  };
  const changemode = () => {
    setLoading(true); 
      setTimeout(() => {
      setBoxes(Array(9).fill(''));
      setTurnO(true);
      setMessage('');
      setGameOver(false);
      setMode(null);
      setDifficulty(null);
      setModeSelected(false);
      setDifficultySelected(false);
      setLoading(false); 
    }, 2000); 
  };

  const handleModeChange = (value) => {
    setMode(value);
    setModeSelected(true);
    setDifficulty(null);
    setDifficultySelected(false);
    setMessage(''); // Clear the message when mode is selected
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    setDifficultySelected(true);
  };

  const portvarient = {
    hidden: {
      opacity: 0,
      scale: 0.50
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const tic = {
    hidden: {
      opacity: 0,
      x: -100
    },
    visible: {
      opacity: 1,
      x: 0
    },
  };

  useEffect(() => {
    // Simulate loading time (e.g., fetching data, initializing game state)
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as needed
  }, []);


  if (loading) {
    return <FullPageTextSpinnerLoader />;
  }

  return (
    <div className="flex flex-col items-center p-5 bg-custom-bg min-h-screen">
      <motion.h1
        variants={tic}
        initial="hidden"
        whileInView="visible"
        transition={{
          type: 'spring',
          stiffness: 30,
          delay: 0.2,
          duration: 1
        }}
        className="text-4xl font-playwrite font-extrabold mb-6 text-white"
      >
        Tic Tac Toe
      </motion.h1>

      {(!mode || !modeSelected || (mode === 'robot' && !difficultySelected)) && (
        <div className="flex flex-col font-signature justify-center items-center py-20 mx-50 my-40">
          {!mode && (
            <motion.div
              variants={portvarient}
              initial="hidden"
              whileInView="visible"
              transition={{
                type: 'spring',
                stiffness: 30,
                delay: 0.2,
                duration: 1
              }}
            >
              <Select.Root
                className="flex flex-col items-center justify-center w-full max-w-md p-4"
                onValueChange={handleModeChange}
              >
                <Select.Trigger className="w-[300px] h-[60px] bg-custom-box-bg cursor-pointer text-white text-xl rounded-md">
                  <Select.Value placeholder="Select Mode">
                    {mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "Select Mode"}
                  </Select.Value>
                </Select.Trigger>
                <Select.Content className=' text-white ' position="fixed" align="end">
                  <Select.Item value="multiplayer" className='border-2 py-3 w-[200px] transition-transform duration-300 ease-in-out transform hover:scale-110 hover:bg-custom-bg bg-custom-box-bg cursor-pointer text-xl rounded-md'>Multiplayer</Select.Item>
                  <Select.Item value="robot" className='border-2 py-3 w-[200px] transition-transform duration-300 ease-in-out transform hover:scale-110 hover:bg-custom-bg bg-custom-box-bg cursor-pointer text-xl rounded-md'>Robot</Select.Item>
                </Select.Content>
              </Select.Root>
            </motion.div>
          )}
          {mode === 'robot' && modeSelected && !difficultySelected && (
            <motion.div
              variants={portvarient}
              initial="hidden"
              whileInView="visible"
              transition={{
                type: 'spring',
                stiffness: 30,
                delay: 0.2,
                duration: 1
              }}
            >
              <Select.Root
                className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4"
                onValueChange={handleDifficultyChange}
              >
                <Select.Trigger className="w-[300px] h-[60px] bg-custom-box-bg cursor-pointer text-white text-xl rounded-md">
                  <Select.Value placeholder="Select Difficulty">
                    {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Select Difficulty"}
                  </Select.Value>
                </Select.Trigger>
                <Select.Content className='bg-custom-box-bg text-white ' position="fixed" align="end">
                  <Select.Item value="easy" className='border-2 cursor-pointer py-3 w-[200px] transition-transform duration-300 ease-in-out transform hover:scale-110 hover:bg-custom-bg text-xl rounded-md'>Easy</Select.Item>
                  <Select.Item value="hard" className='border-2 cursor-pointer py-3 w-[200px] transition-transform duration-300 ease-in-out transform hover:scale-110 hover:bg-custom-bg text-xl rounded-md'>Hard</Select.Item>
                </Select.Content>
              </Select.Root>
            </motion.div>
          )}
        </div>
      )}

      {mode && modeSelected && (mode !== 'robot' || (mode === 'robot' && difficultySelected)) && (
        <div className="flex flex-col items-center">
          <div className="mb-4 text-white text-xl">
            <p>Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</p>
            {mode === 'robot' && difficulty && (
              <p>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
            )}
          </div>
          <div className="flex justify-center items-center h-4/5 mt-6">
            <div className="grid grid-cols-3 max-w-md mx-auto justify-center items-center gap-6 w-60vmin h-60vmin">
              {boxes.map((box, index) => (
                <motion.button
                  variants={portvarient}
                  initial="hidden"
                  whileInView="visible"
                  transition={{
                    type: 'spring',
                    stiffness: 30,
                    delay: index * 0.2,
                    duration: 1
                  }}
                  key={index}
                  className="w-18vmin h-18vmin bg-custom-box-bg text-custom-box-text text-8vmin font-bold flex items-center justify-center rounded-1rem shadow-custom"
                  onClick={() => handleBoxClick(index)}
                  disabled={gameOver || box}
                >
                  {box}
                </motion.button>
              ))}
            </div>
          </div>
          {mode && modeSelected && (
            <div className='flex flex-row font-signature gap-5'>
            <button
              className="mt-20 transition-transform duration-300 ease-in-out transform hover:scale-110 bg-custom-btn-bg font-bold text-black px-4 py-2 rounded-1rem"
              onClick={resetGame}
            >
              Reset Game
            </button>
            <button
              className="mt-20 transition-transform duration-300 ease-in-out transform hover:scale-110 bg-custom-btn-bg font-bold text-black px-4 py-2 rounded-1rem"
              onClick={changemode}
            >
              Change Mode 
            </button>
            </div>

          )}
          

        </div>
      )}

      {message && (
        <motion.div
          variants={portvarient}
          initial="hidden"
          whileInView="visible"
          transition={{
            type: 'spring',
            stiffness: 30,
            delay: 0.2,
            duration: 1
          }}
          className="flex flex-col justify-center items-center font-roboto gap-16 absolute inset-0 bg-custom-bg bg-opacity-75"
        >
          <p className="text-5vmin w-96 font-semibold bg-custom-box-bg text-custom-btn-bg rounded-xl">{message}</p>
          <button
            className="bg-custom-btn-bg font-bold text-black px-4 py-2 rounded-1rem"
            onClick={resetGame}
          >
            New Game
          </button>
          
        </motion.div>
      )}
    </div>
  );
};

export default TicTacToe;
