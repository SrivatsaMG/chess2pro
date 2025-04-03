import React from 'react';

interface GameInfoProps {
  currentPlayer: 'w' | 'b';
  gameOver: { isOver: boolean; result: string } | null;
}

const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer, gameOver }) => {
  return (
    <div className="bg-slate-600 p-4 rounded-lg mb-4 text-white shadow-md">
      <h2 className="text-xl font-bold mb-2 border-b pb-2 border-slate-500">Game Info</h2>

      {gameOver?.isOver ? (
        <div className="mb-4">
          <div className="text-md font-semibold">Game Over</div>
          <div className="text-lg mt-1 font-bold text-yellow-300">{gameOver.result}</div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="text-md font-semibold">Current Player</div>
          <div className="flex items-center mt-1">
            <div
              className={`w-4 h-4 mr-2 rounded-full ${
                currentPlayer === 'w' ? 'bg-white' : 'bg-black'
              }`}
            />
            <span className="text-lg font-bold">
              {currentPlayer === 'w' ? 'White' : 'Black'}
            </span>
          </div>
        </div>
      )}

      <div className="text-sm">
        <p className="mb-1">
          <span className="font-semibold">Game Rules:</span>
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          <li>Click or drag pieces to move</li>
          <li>Right-click to mark squares</li>
          <li>Automatic queen promotion</li>
        </ul>
      </div>
    </div>
  );
};

export default GameInfo;
