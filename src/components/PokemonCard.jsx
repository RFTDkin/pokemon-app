import { memo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { typeTranslations, statTranslations } from '../constants/translations';

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
            <Radar 
              name="種族値" 
              dataKey="value" 
              stroke="#4caf50" 
              fill="#4caf50" 
              fillOpacity={0.5} 
              isAnimationActive={!isSpinning}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;
