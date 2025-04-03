import React from 'react';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  isGameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, onUndo, isGameOver }) => {
  return (
    <div className="mt-4 flex gap-3 justify-center">
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg
                 transition-colors duration-200 flex items-center shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
          />
        </svg>
        New Game
      </button>

      <button
        onClick={onUndo}
        disabled={isGameOver}
        className={`px-4 py-2 bg-blue-500 text-white font-medium rounded-lg
                 transition-colors duration-200 flex items-center shadow-md
                 ${isGameOver
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-600'}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Undo Move
      </button>
    </div>
  );
};

export default GameControls;
