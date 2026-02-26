import { useState, useEffect, useCallback } from 'react'
import './App.css'

const TOTAL_SECONDS = 25 * 60 // 25 分钟

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)

  const reset = useCallback(() => {
    setIsRunning(false)
    setSecondsLeft(TOTAL_SECONDS)
    setShowEndModal(false)
  }, [])

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setShowEndModal(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, secondsLeft])

  return (
    <div className="app">
      <h1 className="title">番茄钟</h1>
      <div className="timer" aria-live="polite">
        {formatTime(secondsLeft)}
      </div>
      <div className="actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsRunning(true)}
          disabled={isRunning || secondsLeft === 0}
        >
          开始
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={reset}
        >
          重置
        </button>
      </div>

      {showEndModal && (
        <div className="modal-overlay" onClick={() => setShowEndModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">时间到！</p>
            <p className="modal-desc">本个番茄钟已结束，休息一下吧。</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowEndModal(false)}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
