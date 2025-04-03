import React from 'react';

interface Move {
  color: string;
  from: string;
  to: string;
  piece: string;
  san: string;
  flags: string;
  captured?: string;
  promotion?: string;
}

interface MoveHistoryProps {
  history: Move[];
}

type MovesByPair = Array<{
  moveNumber: number;
  white: Move | null;
  black: Move | null;
}>;

const getPieceName = (piece: string): string => {
  const pieceMap: Record<string, string> = {
    p: 'Pawn',
    n: 'Knight',
    b: 'Bishop',
    r: 'Rook',
    q: 'Queen',
    k: 'King'
  };

  return pieceMap[piece.toLowerCase()] || piece;
};

const getMoveSummary = (move: Move): string => {
  let summary = `${getPieceName(move.piece)} ${move.from} → ${move.to}`;

  if (move.captured) {
    summary += ` (captures ${getPieceName(move.captured)})`;
  }

  if (move.promotion) {
    summary += ` (promotes to ${getPieceName(move.promotion)})`;
  }

  return summary;
};

const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  // Group moves by pairs (white and black)
  const movesByPair = history.reduce<MovesByPair>((pairs, move, index) => {
    const pairIndex = Math.floor(index / 2);

    if (!pairs[pairIndex]) {
      pairs[pairIndex] = { white: null, black: null, moveNumber: pairIndex + 1 };
    }

    if (index % 2 === 0) {
      pairs[pairIndex].white = move;
    } else {
      pairs[pairIndex].black = move;
    }

    return pairs;
  }, []);

  return (
    <div className="bg-slate-600 p-4 rounded-lg text-white shadow-md max-h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-2 border-b pb-2 border-slate-500 sticky top-0 bg-slate-600">
        Move History
      </h2>

      {movesByPair.length === 0 ? (
        <p className="text-gray-300 italic">No moves yet</p>
      ) : (
        <div className="space-y-2">
          {movesByPair.map((pair) => (
            <div key={pair.moveNumber} className="text-sm">
              <div className="font-bold text-yellow-300 mb-1">Move {pair.moveNumber}</div>
              {pair.white && (
                <div className="mb-1 pl-2 border-l-2 border-white">
                  <div className="font-semibold">White: {pair.white.san}</div>
                  <div className="text-gray-300">{getMoveSummary(pair.white)}</div>
                </div>
              )}
              {pair.black && (
                <div className="pl-2 border-l-2 border-gray-500">
                  <div className="font-semibold">Black: {pair.black.san}</div>
                  <div className="text-gray-300">{getMoveSummary(pair.black)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
