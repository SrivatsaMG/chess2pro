import ChessGame from './components/ChessGame';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-2">React Chess</h1>
        <p className="text-slate-300 max-w-md mx-auto">A fully functional chess game with drag and drop pieces, move history, and game analysis</p>
      </header>

      <DndProvider backend={HTML5Backend}>
        <ChessGame />
      </DndProvider>

      <footer className="mt-10 text-center text-slate-400 text-sm">
        <p>Built with React, TypeScript, and chess.js</p>
        <p className="mt-1">Drag pieces or click to move. Right-click to mark squares.</p>
      </footer>
    </div>
  );
}

export default App;
