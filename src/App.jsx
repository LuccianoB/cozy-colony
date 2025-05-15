import HexGrid from './components/HexGrid';

function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6faaed'
      }}
    >
      <HexGrid />
    </div>
  );
}

export default App;
