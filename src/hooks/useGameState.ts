'use client'

import { useState, useCallback } from 'react'
import { GameState, Stakes, Position, Card, Street, PlayerAction } from '@/types/poker'

const DEFAULT_STAKES: Stakes = { smallBlind: 1, bigBlind: 2, label: '$1/$2' }
const DEFAULT_POSITION: Position = 'BTN'
const DEFAULT_STACK = 100
const DEFAULT_PLAYER_COUNT = 9

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    stakes: DEFAULT_STAKES,
    myPosition: DEFAULT_POSITION,
    holeCards: [],
    street: 'preflop',
    boardCards: [],
    potSize: 1.5, // SB + BB
    effectiveStack: DEFAULT_STACK,
    actions: []
  })

  const [playerCount, setPlayerCount] = useState(DEFAULT_PLAYER_COUNT)

  const setStakes = useCallback((stakes: Stakes) => {
    setGameState(prev => ({ ...prev, stakes }))
  }, [])

  const setPosition = useCallback((myPosition: Position) => {
    setGameState(prev => ({
      ...prev,
      myPosition,
      // Clear actions when position changes since they may no longer be valid
      actions: []
    }))
  }, [])

  const setHoleCards = useCallback((cards: Card[]) => {
    setGameState(prev => ({
      ...prev,
      holeCards: cards as GameState['holeCards']
    }))
  }, [])

  const setStreet = useCallback((street: Street) => {
    setGameState(prev => {
      // Keep board cards up to the appropriate count for the street
      let boardCards = prev.boardCards
      if (street === 'preflop') {
        boardCards = []
      } else if (street === 'flop' && boardCards.length > 3) {
        boardCards = boardCards.slice(0, 3)
      } else if (street === 'turn' && boardCards.length > 4) {
        boardCards = boardCards.slice(0, 4)
      }

      return { ...prev, street, boardCards }
    })
  }, [])

  const setBoardCards = useCallback((boardCards: Card[]) => {
    setGameState(prev => ({ ...prev, boardCards }))
  }, [])

  const setPotSize = useCallback((potSize: number) => {
    setGameState(prev => ({ ...prev, potSize }))
  }, [])

  const setEffectiveStack = useCallback((effectiveStack: number) => {
    setGameState(prev => ({ ...prev, effectiveStack }))
  }, [])

  const setActions = useCallback((actions: PlayerAction[]) => {
    setGameState(prev => ({ ...prev, actions }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      stakes: DEFAULT_STAKES,
      myPosition: DEFAULT_POSITION,
      holeCards: [],
      street: 'preflop',
      boardCards: [],
      potSize: 1.5,
      effectiveStack: DEFAULT_STACK,
      actions: []
    })
    setPlayerCount(DEFAULT_PLAYER_COUNT)
  }, [])

  return {
    gameState,
    playerCount,
    setStakes,
    setPosition,
    setHoleCards,
    setStreet,
    setBoardCards,
    setPotSize,
    setEffectiveStack,
    setActions,
    setPlayerCount,
    resetGame
  }
}
