import { useState, useEffect } from 'react';

export const usePokemon = () => {
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

  return {
    pokemon,
    loading,
    error,
    inputValue,
    setInputValue,
    isSpinning,
    handleSearch,
    handleRandomGacha
  };
};
