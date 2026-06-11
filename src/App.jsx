// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'

// タイプの日本語翻訳辞書
const typeTranslations = {
  normal: 'ノーマル', fire: 'ほのお', water: 'みず', electric: 'でんき',
  grass: 'くさ', ice: 'こおり', fighting: 'かくとう', poison: 'どく',
  ground: 'じめん', flying: 'ひこう', psychic: 'エスパー', bug: 'むし',
  rock: 'いわ', ghost: 'ゴースト', dragon: 'ドラゴン', dark: 'あく',
  steel: 'はがね', fairy: 'フェアリー'
};

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // エラーメッセージを管理するステート
  const [error, setError] = useState(null);

  // 入力欄の値（検索キーワード）を管理するステート
  const [inputValue, setInputValue] = useState(null);
  // 実際にAPIで検索するIDを管理するステート（初期値はジャローダ）
  const [searchId, setSearchId] = useState('1');

  useEffect(() => {
    // 検索IDが空の場合は処理を中断する
    if (!searchId) return;

    setLoading(true);
    setError(null);

    // ステップ1: 入力されたID（または英語名）でポケモンの基本データを取得する
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchId.toLowerCase()}`)
      .then(res => {
        if (!res.ok) throw new Error('ポケモンが見つかりませんでした。IDを確認してください。');
        return res.json();
      })
      .then(baseData => {
        // ステップ2: 品種データ（species）を取得して日本語名を探す
        fetch(baseData.species.url)
          .then(res => res.json())
          .then(speciesData => {
            // 日本語名（'ja'）を検索する
            const jpNameObj = speciesData.names.find(n => n.language.name === 'ja');

            // 基本データと日本語名を合わせてステートに保存する
            setPokemon({
              ...baseData,
              jpName: jpNameObj ? jpNameObj.name : baseData.name
            });
            setLoading(false);
          })
          .catch(() => {
            // 品種データの取得に失敗した場合でも、基本データだけは表示する
            setPokemon({ ...baseData, jpName: baseData.name });
            setLoading(false);
          });
      })
      .catch(err => {
        console.error("データの取得に失敗しました", err);
        setError(err.message);
        setPokemon(null);
        setLoading(false);
      });
  }, [searchId]); // searchIdが変更されるたびに、このuseEffectが再実行される

  // 検索フォームが送信されたときの処理
  const handleSearch = (e) => {
    e.preventDefault(); // ページの再読み込み（デフォルトの挙動）を防ぐ
    if (inputValue.trim() !== '') {
      setSearchId(inputValue.trim()); // 検索IDを更新し、useEffectをトリガーする
    }
  };

  return (
    // 画面全体をコンテナとし、相対位置（relative）に設定して検索ボックスを配置しやすくする
    <div className="App" style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>

      {/* 右上の検索ボックス：絶対位置（absolute）で配置 */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ID (例: 25)"
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '120px' }}
          />
          <button type="submit" style={{ padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            検索
          </button>
        </form>
      </div>

      <h1>ポケモン図鑑</h1>

      {/* ローディング中、またはエラー発生時のメッセージ表示 */}
      {loading && <div style={{ marginTop: '50px' }}>読み込み中...</div>}
      {error && <div style={{ color: 'red', marginTop: '50px', fontWeight: 'bold' }}>{error}</div>}

      {/* ポケモンのデータが存在し、かつローディング中でない場合に図鑑カードを表示 */}
      {!loading && !error && pokemon && (
        <div
          className="card"
          style={{
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '350px',
            margin: '40px auto 0', // カードを中央に配置する
            backgroundColor: '#f8f9fa',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            color: '#333'
          }}
        >
          {/* ポケモンのIDと名前を表示 */}
          <h2 style={{ margin: '0 0 10px 0' }}>No. {pokemon.id} - {pokemon.jpName}</h2>
          
          <img
            src={pokemon.sprites.front_default}
            alt={`${pokemon.jpName}の画像`}
            style={{ width: '150px', backgroundColor: '#fff', borderRadius: '50%', padding: '10px', border: '2px solid #eee' }}
          />
          
          <div style={{ marginTop: '15px', textAlign: 'left', display: 'inline-block' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>タイプ:</strong>{' '}
              {pokemon.types
                .map(t => typeTranslations[t.type.name] || t.type.name)
                .join('、')}
            </p>
            <p style={{ margin: '5px 0' }}><strong>高さ:</strong> {pokemon.height / 10} m</p>
            <p style={{ margin: '5px 0' }}><strong>重さ:</strong> {pokemon.weight / 10} kg</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;