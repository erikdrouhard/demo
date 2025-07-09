'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type Player = 'X' | 'O' | null
type Board = Player[]

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<Player | 'tie' | null>(null)
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 })

  const checkWinner = (squares: Board): Player | 'tie' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    return squares.every(square => square !== null) ? 'tie' : null
  }

  const handleClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      setScore(prev => ({
        ...prev,
        [gameWinner === 'tie' ? 'ties' : gameWinner]: prev[gameWinner === 'tie' ? 'ties' : gameWinner] + 1
      }))
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
  }

  const resetScore = () => {
    setScore({ X: 0, O: 0, ties: 0 })
    resetGame()
  }

  const getWinnerMessage = () => {
    if (winner === 'tie') return "It's a tie! 🤝"
    if (winner) return `${winner} wins! 🎉`
    return `${currentPlayer}'s turn`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Tic-Tac-Toe</CardTitle>
          <CardDescription>{getWinnerMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-3 gap-2 w-64 h-64">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className="w-20 h-20 border-2 border-border rounded-lg bg-card hover:bg-accent transition-colors flex items-center justify-center text-3xl font-bold disabled:cursor-not-allowed"
                disabled={!!cell || !!winner}
              >
                {cell}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={resetGame} variant="outline" size="sm">
              New Game
            </Button>
            <Button onClick={resetScore} variant="ghost" size="sm">
              Reset Score
            </Button>
          </div>
          
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>X: {score.X}</span>
            <span>O: {score.O}</span>
            <span>Ties: {score.ties}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Oops! That page decided to play hide and seek...
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            While you&apos;re here, why not challenge a friend to a game of tic-tac-toe? 
            It&apos;s way more fun than staring at error messages! 🎮
          </p>
        </div>
        
        <TicTacToe />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              Take Me Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/kanban">
              Check Out Kanban
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}