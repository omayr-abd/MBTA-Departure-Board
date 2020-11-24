import './App.css';
import Board from './components/Board.js';

function App() {
  return (
    <div className="App">
      <Board station={"South Station"}/>
      <Board station={"North Station"}/>
    </div>
  );
}

export default App;
