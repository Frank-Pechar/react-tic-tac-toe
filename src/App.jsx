import { useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import GameOver from './components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';

//Note Must have a screen width of at least 530px

// Initial Player Names Object
const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// Switch player after play
function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

// Re-initialize gameBoard then populate it with turns
function deriveGameBoard(gameTurns) {
  // Create a deep copy of 'null' initialized array of arrays
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

// Check if winner
// Compare current gameBoard against all winning combinations
function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      // We have a Winner!
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function App() {
  // State Hooks
  // Re-render UI after player name change and also after game turn selection ('x' or 'o')
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  // Main Logic
  // Set next player
  const activePlayer = deriveActivePlayer(gameTurns);

  // Update working gameBoard array
  const gameBoard = deriveGameBoard(gameTurns);
  // Check if there is a winner
  const winner = deriveWinner(gameBoard, players);
  // Check if there is draw
  const hasDraw = gameTurns.length === 9 && !winner;

  // Updates State of gameTurns
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      // Get current player
      const currentPlayer = deriveActivePlayer(prevTurns);

      // Update game turns array with new game turn object
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  // To restart a new game just need to:
  // Reset STATE of gameTurns array to empty
  function handleRestart() {
    setGameTurns([]);
  }

  // Update useState player names object with new player name
  // Re-render UI with new player name
  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        {/* Render Player Names */}
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {/* If Game Over Render Winner or Draw */}
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        {/* Render Game Board */}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      {/* Render Log of Turns at bottom of page */}
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
