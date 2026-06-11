// src/App.test.jsx
import { render, screen } from '@testing-library/react'
import App from './App'
import { describe, it, expect } from 'vitest'

describe('Appコンポーネントのテスト', () => {
  it('タイトルと検索機能が正しく表示されること', () => {
    render(<App />)
    
    // 1. タイトルが存在するかチェック（元のテスト）
    expect(screen.getByText('ポケモン図鑑')).toBeInTheDocument()

    // 2. 検索入力ボックスが存在するかチェック（追加した機能のテスト）
    // placeholder（入力欄のヒントテキスト）を使って要素を見つける
    expect(screen.getByPlaceholderText('ID (例: 25)')).toBeInTheDocument()

    // 3. 検索ボタンが存在するかチェック
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument()
  })
})