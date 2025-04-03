import { useState, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import GameInfo from './GameInfo';
import MoveHistory from './MoveHistory';
import GameControls from './GameControls';
import { useWindowSize } from '../hooks/useWindowSize';

// Define types for chess moves
interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
  color: string;
  flags: string;
  piece: string;
  san: string;
  captured?: string;
}

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, { backgroundColor?: string }>>({});
  const [moveSquares, setMoveSquares] = useState<Record<string, { backgroundColor?: string }>>({});
  const [optionSquares, setOptionSquares] = useState<Record<string, { background?: string; borderRadius?: string }>>({});
  const [gameOver, setGameOver] = useState<{ isOver: boolean; result: string } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'w' | 'b'>('w');

  // Use the custom window size hook
  const windowSize = useWindowSize();
  const boardWidth = windowSize.width ? Math.min(Math.max(windowSize.width < 1024 ? windowSize.width - 40 : 600, 300), 600) : 500;

  // Check if the game is over after each move
  useEffect(() => {
    if (game.isGameOver()) {
      let result = '';
      if (game.isCheckmate()) {
        result = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
      } else if (game.isDraw()) {
        if (game.isStalemate()) {
          result = 'Draw by stalemate';
        } else if (game.isThreefoldRepetition()) {
          result = 'Draw by threefold repetition';
        } else if (game.isInsufficientMaterial()) {
          result = 'Draw by insufficient material';
        } else {
          result = 'Draw by 50-move rule';
        }
      }
      setGameOver({ isOver: true, result });
    } else {
      setCurrentPlayer(game.turn());
    }
  }, [game]);

  // Get all possible moves for a square
  function getSquarePossibleMoves(square: string) {
    const moves = game.moves({
      square: square as Square,
      verbose: true
    }) as unknown as ChessMove[];

    if (moves.length === 0) {
      return;
    }

    const newSquares: Record<string, { background?: string; borderRadius?: string }> = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to as Square) && game.get(move.to as Square)?.color !== game.get(square as Square)?.color
            ? 'radial-gradient(circle, rgba(255,0,0,.5) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    });

    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };

    setOptionSquares(newSquares);
  }

  // Handle right-click to mark squares
  function onSquareRightClick(square: string) {
    const colour = "rgba(0, 0, 255, 0.4)";
    const newSquares: Record<string, { backgroundColor?: string }> = { ...rightClickedSquares };

    if (newSquares[square] && newSquares[square].backgroundColor === colour) {
      newSquares[square] = { backgroundColor: undefined };
    } else {
      newSquares[square] = { backgroundColor: colour };
    }

    setRightClickedSquares(newSquares);
  }

  // Make a move on the board
  const makeAMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        setMoveSquares({
          [move.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
          [move.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
        });
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }, [game]);

  // Handle square click when moving pieces
  function onSquareClick(square: string) {
    if (gameOver?.isOver) return;

    setRightClickedSquares({});

    // If we already have a piece selected
    if (moveFrom) {
      const move = {
        from: moveFrom,
        to: square,
        promotion: 'q' // always promote to queen for simplicity
      };

      const result = makeAMove(move);

      if (result) {
        setMoveFrom('');
        setOptionSquares({});
        return;
      }
    }

    // We don't have a piece selected or the move was invalid
    const piece = game.get(square as Square);
    if (piece && piece.color === game.turn()) {
      setMoveFrom(square);
      getSquarePossibleMoves(square);
    }
  }

  // Handle piece drag
  function onPieceDragBegin(_piece: string, sourceSquare: string) {
    if (gameOver?.isOver) return;
    getSquarePossibleMoves(sourceSquare);
  }

  // Handle piece drop
  function onDrop(sourceSquare: string, targetSquare: string) {
    if (gameOver?.isOver) return false;

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    };

    const result = makeAMove(move);
    if (result) {
      setOptionSquares({});
      return true;
    }

    return false;
  }

  // Reset the game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveFrom('');
    setRightClickedSquares({});
    setMoveSquares({});
    setOptionSquares({});
    setGameOver(null);
    setCurrentPlayer('w');
  };

  // Undo the last move
  const undoLastMove = () => {
    try {
      const gameCopy = new Chess(game.fen());
      gameCopy.undo();
      setGame(gameCopy);
      setMoveSquares({});
      setOptionSquares({});
      setGameOver(null);
    } catch (error) {
      console.error("Can't undo move:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-slate-700 bg-opacity-70 p-6 rounded-xl shadow-xl">
      <div className="lg:order-1 order-2 w-full lg:w-auto">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Chessboard
            position={game.fen()}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onPieceDragBegin={onPieceDragBegin}
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
            }}
            customDarkSquareStyle={{ backgroundColor: '#779952' }}
            customLightSquareStyle={{ backgroundColor: '#edeed1' }}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
              ...rightClickedSquares
            }}
            boardWidth={boardWidth}
            areArrowsAllowed={true}
          />
        </div>
        <GameControls
          onReset={resetGame}
          onUndo={undoLastMove}
          isGameOver={gameOver?.isOver || false}
        />
      </div>
      <div className="lg:order-2 order-1 w-full lg:w-80">
        <GameInfo
          currentPlayer={currentPlayer}
          gameOver={gameOver}
        />
        <MoveHistory history={game.history({ verbose: true }) as ChessMove[]} />
      </div>
    </div>
  );
}
