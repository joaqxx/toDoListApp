"use client"

import { useState, useEffect, useRef } from "react"
import { Timer, Play, Pause, RotateCcw } from "lucide-react"
import "./PomodoroTimer.css"

const WORK_DURATION = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK_DURATION = 5 * 60 // 5 minutes in seconds
const LONG_BREAK_DURATION = 15 * 60 // 15 minutes in seconds

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState("work") // 'work', 'short-break', 'long-break'
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [currentSession, setCurrentSession] = useState(1)
  const [notification, setNotification] = useState("")
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [sessionTitle, setSessionTitle] = useState("")
  const [currentSessionTitle, setCurrentSessionTitle] = useState("")

  const intervalRef = useRef(null)
  const notificationTimeoutRef = useRef(null)

  // Get duration based on current mode
  const getCurrentDuration = () => {
    switch (mode) {
      case "work":
        return WORK_DURATION
      case "short-break":
        return SHORT_BREAK_DURATION
      case "long-break":
        return LONG_BREAK_DURATION
      default:
        return WORK_DURATION
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Show notification
  const showNotification = (message) => {
    setNotification(message)
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification("")
    }, 4000)
  }

  // Handle session completion and transition
  const handleSessionComplete = () => {
    if (mode === "work") {
      const newSessionsCompleted = sessionsCompleted + 1
      setSessionsCompleted(newSessionsCompleted)

      if (newSessionsCompleted % 4 === 0) {
        // Time for long break
        setMode("long-break")
        setTimeLeft(LONG_BREAK_DURATION)
        setCurrentSessionTitle("Time to recharge and reflect")
        showNotification("Great work! Time for a long break!")
        setCurrentSession(1) // Reset session counter after long break
      } else {
        // Time for short break
        setMode("short-break")
        setTimeLeft(SHORT_BREAK_DURATION)
        setCurrentSessionTitle("Take a breather")
        showNotification("Work session complete! Time for a short break!")
        setCurrentSession(currentSession + 1)
      }
    } else {
      // Break is over, back to work
      setMode("work")
      setTimeLeft(WORK_DURATION)
      setCurrentSessionTitle("") // Clear title so user can set new one
      showNotification("Break's over! Ready to focus?")
      // Show title modal for next work session
      setShowTitleModal(true)
    }
    setIsRunning(false) // Pause after each session
  }

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  const handleStart = () => {
    if (mode === "work" && !currentSessionTitle) {
      // Show title modal before starting work session
      setShowTitleModal(true)
    } else {
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(getCurrentDuration())
    if (mode === "work") {
      setCurrentSessionTitle("")
    }
  }

  const handleTitleSubmit = () => {
    const title = sessionTitle.trim() || "Untitled Session"
    setCurrentSessionTitle(title)
    setSessionTitle("")
    setShowTitleModal(false)
    setIsRunning(true)
  }

  const handleTitleSkip = () => {
    setCurrentSessionTitle("Untitled Session")
    setSessionTitle("")
    setShowTitleModal(false)
    setIsRunning(true)
  }

  const handleTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTitleSubmit()
    }
  }

  // Calculate progress for the ring
  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Get mode display text
  const getModeText = () => {
    switch (mode) {
      case "work":
        return "Focus Time"
      case "short-break":
        return "Short Break"
      case "long-break":
        return "Long Break"
      default:
        return "Focus Time"
    }
  }

  // Get current cycle info
  const getCurrentCycleInfo = () => {
    if (mode === "work") {
      return `Session ${currentSession} of 4`
    } else if (mode === "long-break") {
      return "Long Break - Cycle Complete!"
    } else {
      return `Break after Session ${currentSession - 1}`
    }
  }

  // Get session title display
  const getSessionTitleDisplay = () => {
    if (mode === "work") {
      return currentSessionTitle
    } else {
      return currentSessionTitle
    }
  }

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-card">
        <div className="pomodoro-left-panel">
          <div className="pomodoro-title">
            <Timer size={32} />
            Pomodoro Timer
          </div>
          <div className="session-info">{getCurrentCycleInfo()}</div>
          <div className={`session-mode ${mode}`}>{getModeText()}</div>
          
          <div className="progress-ring">
            <svg>
              <circle className="progress-ring-background" cx="100" cy="100" r="90" />
              <circle
                className={`progress-ring-progress ${mode}`}
                cx="100"
                cy="100"
                r="90"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="timer-display">{formatTime(timeLeft)}</div>
          </div>
        </div>

        <div className="pomodoro-right-panel">
          <div className="timer-controls">
            {!isRunning ? (
              <button className="control-button start" onClick={handleStart}>
                <Play size={17} />
                Start
              </button>
            ) : (
              <button className="control-button pause" onClick={handlePause}>
                <Pause size={16} />
                Pause
              </button>
            )}
            <button className="control-button reset" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="session-counter">
            <h3>Work Sessions Progress</h3>
            <div className="session-progress">
              {[1, 2, 3, 4].map((session) => (
                <div
                  key={session}
                  className={`session-dot ${
                    session <= sessionsCompleted % 4 || (sessionsCompleted % 4 === 0 && sessionsCompleted > 0)
                      ? "completed"
                      : session === currentSession && mode === "work"
                        ? "current"
                        : ""
                  }`}
                />
              ))}
            </div>
            <div className="cycle-info">
              Completed Sessions: {sessionsCompleted} | Cycles: {Math.floor(sessionsCompleted / 4)}
            </div>
          </div>
        </div>
      </div>

      {/* Title Input Modal */}
      {showTitleModal && (
        <div className="title-modal-overlay">
          <div className="title-modal">
            <h3>What will you focus on?</h3>
            <p>Enter a title for this work session to stay motivated and focused on your goal.</p>
            <input
              type="text"
              className="title-input"
              placeholder="e.g., Write blog draft, Study React hooks, Review code..."
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              onKeyPress={handleTitleKeyPress}
              autoFocus
              maxLength={100}
            />
            <div className="title-modal-buttons">
              <button className="title-modal-button primary" onClick={handleTitleSubmit}>
                Start Session
              </button>
              <button className="title-modal-button secondary" onClick={handleTitleSkip}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  )
}
