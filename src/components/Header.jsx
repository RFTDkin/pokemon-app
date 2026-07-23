const Header = ({ inputValue, setInputValue, handleSearch, handleRandomGacha, isSpinning }) => {
  return (
    <header style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      flexWrap: 'wrap', gap: '20px', marginBottom: '40px', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#333' }}>ポケモン図鑑</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ID (例: 25)"
          disabled={isSpinning} 
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '120px', backgroundColor: isSpinning ? '#e9ecef' : 'white' }}
        />
        <button 
          type="submit" 
          disabled={isSpinning} 
          style={{ padding: '10px 15px', borderRadius: '8px', cursor: isSpinning ? 'not-allowed' : 'pointer', backgroundColor: isSpinning ? '#ccc' : '#007bff', color: 'white', border: 'none', fontWeight: 'bold' }}
        >
          検索
        </button>
        <button 
          type="button" 
          onClick={handleRandomGacha}
          disabled={isSpinning} 
          style={{ 
            padding: '10px 20px', borderRadius: '8px', cursor: isSpinning ? 'not-allowed' : 'pointer', 
            backgroundColor: isSpinning ? '#ccc' : '#ff9800', color: 'white', border: 'none', fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(255, 152, 0, 0.3)'
          }}
        >
          {isSpinning ? '🔄 抽選中...' : '🎲 あなたの最初のポケモンは？'}
        </button>
      </form>
    </header>
  );
};

export default Header;
