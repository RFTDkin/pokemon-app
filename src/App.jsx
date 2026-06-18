// src/App.jsx
import { useState, useEffect, memo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import './App.css';

const typeTranslations = {
  normal: 'ノーマル', fire: 'ほのお', water: 'みず', electric: 'でんき',
  grass: 'くさ', ice: 'こおり', fighting: 'かくとう', poison: 'どく',
  ground: 'じめん', flying: 'ひこう', psychic: 'エスパー', bug: 'むし',
  rock: 'いわ', ghost: 'ゴースト', dragon: 'ドラゴン', dark: 'あく',
  steel: 'はがね', fairy: 'フェアリー'
};

const statTranslations = {
  hp: 'HP',
  attack: '攻撃',
  defense: '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  speed: '素早さ'
};

// =====================================================================
// 【修正】isSpinning を props として受け取るように変更
// =====================================================================
const PokemonCard = memo(({ pokemon, isSpinning }) => {
  console.log('🌟 PokemonCard がレンダリングされました！');

  const chartData = pokemon.stats.map(s => ({
    subject: statTranslations[s.stat.name] || s.stat.name,
    value: s.base_stat
  }));

  return (
    <div
      className="card"
      style={{
        border: '1px solid #ccc', padding: '20px', borderRadius: '15px',
        maxWidth: '400px', margin: '20px auto 0', backgroundColor: '#fff',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)', color: '#333'
      }}
    >
      <h2 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: '#2c3e50' }}>
        No. {pokemon.id} - {pokemon.jpName}
      </h2>
      
      <img
        src={pokemon.sprites.front_default}
        alt={`${pokemon.jpName}の画像`}
        style={{ width: '160px', height: '160px', backgroundColor: '#f8f8f8', borderRadius: '50%', padding: '10px', border: '3px solid #e9ecef' }}
      />
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>
          <strong>タイプ:</strong>{' '}
          {pokemon.types.map(t => typeTranslations[t.type.name] || t.type.name).join('、')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          <p style={{ margin: 0 }}><strong>高さ:</strong> {pokemon.height / 10} m</p>
          <p style={{ margin: 0 }}><strong>重さ:</strong> {pokemon.weight / 10} kg</p>
        </div>
      </div>

      <div style={{ width: '100%', height: '250px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 13, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            
            {/* =====================================================================
                【修正点】isAnimationActive を追加
                ガチャ演出中（isSpinning が true）はアニメーションをオフにすることで、
                グラフが毎フレーム（80ms）遅延なくリアルタイムにカチャカチャ動くようになります！
            ===================================================================== */}
            <Radar 
              name="種族値" 
              dataKey="value" 
              stroke="#4caf50" 
              fill="#4caf50" 
              fillOpacity={0.5} 
              isAnimationActive={!isSpinning} // ガチャ中はアニメーションを無効化
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
});

PokemonCard.displayName = 'PokemonCard';

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchId, setSearchId] = useState('1'); 
  const [cache, setCache] = useState({});
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!searchId) return;
    if (cache[searchId]) {
      setPokemon(cache[searchId]);
      setError(null);
      return; 
    }

    setLoading(true);
    setError(null);

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchId.toLowerCase()}`)
      .then(res => {
        if (!res.ok) throw new Error('ポケモンが見つかりませんでした。');
        return res.json();
      })
      .then(baseData => {
        fetch(baseData.species.url)
          .then(res => res.json())
          .then(speciesData => {
            const jpNameObj = speciesData.names.find(n => n.language.name === 'ja');
            const newPokemonData = { ...baseData, jpName: jpNameObj ? jpNameObj.name : baseData.name };
            
            setPokemon(newPokemonData);
            setCache(prev => ({ ...prev, [searchId.toLowerCase()]: newPokemonData }));
            setLoading(false);
          })
          .catch(() => {
            const fallbackData = { ...baseData, jpName: baseData.name };
            setPokemon(fallbackData);
            setCache(prev => ({ ...prev, [searchId.toLowerCase()]: fallbackData }));
            setLoading(false);
          });
      })
      .catch(err => {
        setError(err.message);
        setPokemon(null);
        setLoading(false);
      });
  }, [searchId, cache]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '' && !isSpinning) {
      setSearchId(inputValue.trim());
    }
  };

  const handleRandomGacha = () => {
    if (isSpinning) return; 
    setIsSpinning(true); 
    setError(null);

    const spinInterval = setInterval(() => {
      const tempNum = Math.floor(Math.random() * 1025) + 1;
      setInputValue(String(tempNum)); 

      setPokemon({
        id: tempNum,
        jpName: '？？？',
        sprites: { front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${tempNum}.png` },
        types: [{ type: { name: 'normal' } }],
        height: 0,
        weight: 0,
        stats: [
          { base_stat: Math.random() * 130 + 20, stat: { name: 'hp' } },
          { base_stat: Math.random() * 130 + 20, stat: { name: 'attack' } },
          { base_stat: Math.random() * 130 + 20, stat: { name: 'defense' } },
          { base_stat: Math.random() * 130 + 20, stat: { name: 'special-attack' } },
          { base_stat: Math.random() * 130 + 20, stat: { name: 'special-defense' } },
          { base_stat: Math.random() * 130 + 20, stat: { name: 'speed' } }
        ]
      });
    }, 80);

    setTimeout(() => {
      clearInterval(spinInterval); 
      const finalNum = Math.floor(Math.random() * 1025) + 1;
      setInputValue(String(finalNum));
      setSearchId(String(finalNum)); 
      setIsSpinning(false); 
    }, 2000);
  };

  return (
    <div className="App" style={{ minHeight: '100vh', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
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

      {error && !isSpinning && <div style={{ color: 'red', marginTop: '20px', fontWeight: 'bold' }}>{error}</div>}
      {loading && !isSpinning && <div style={{ marginTop: '20px', color: '#666' }}>本物のデータを取得中...</div>}

      {!error && pokemon && (
        <div style={{ 
          opacity: isSpinning ? 0.8 : 1, 
          transform: isSpinning ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.1s' 
        }}>
          {/* 【修正】PokemonCard に isSpinning 状態をバケツリレーで渡す */}
          <PokemonCard pokemon={pokemon} isSpinning={isSpinning} />
        </div>
      )}
    </div>
  );
}

export default App;