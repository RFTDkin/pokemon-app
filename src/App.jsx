import './App.css';
import PokemonCard from './components/PokemonCard';
import Header from './components/Header';
import { usePokemon } from './hooks/usePokemon';

function App() {
  const {
    pokemon,
    loading,
    error,
    inputValue,
    setInputValue,
    isSpinning,
    handleSearch,
    handleRandomGacha
  } = usePokemon();

  return (
    <div className="App" style={{ minHeight: '100vh', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <Header 
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
        handleRandomGacha={handleRandomGacha}
        isSpinning={isSpinning}
      />

      {error && !isSpinning && <div style={{ color: 'red', marginTop: '20px', fontWeight: 'bold' }}>{error}</div>}
      {loading && !isSpinning && <div style={{ marginTop: '20px', color: '#666' }}>本物のデータを取得中...</div>}

      {!error && pokemon && (
        <div style={{ 
          opacity: isSpinning ? 0.8 : 1, 
          transform: isSpinning ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.1s' 
        }}>
          <PokemonCard pokemon={pokemon} isSpinning={isSpinning} />
        </div>
      )}
    </div>
  );
}

export default App;