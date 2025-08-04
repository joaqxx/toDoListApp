"use client"

import { useState, useEffect } from "react"
import WeeklyProgress from "./components/WeeklyProgress.jsx"
import TaskInput from "./components/TaskInput.jsx"
import TaskFilter from "./components/TaskFilter.jsx"
import TaskList from "./components/TaskList.jsx"
import PomodoroTimer from "./components/PomodoroTimer.jsx"
import Calendar from "react-calendar" // Import Calendar
import "react-calendar/dist/Calendar.css" // Default calendar styles
import "./components/Calendar.css" // Custom calendar styles
import { parseISO, isThisWeek, isToday, isYesterday } from "date-fns"
import { FlameIcon as Fire, Timer } from "lucide-react" // Import Fire and Timer icons
import "./App.css"

function App() {
  const [todos, setTodos] = useState([])
  const [todoValue, setTodoValue] = useState("")
  const [selectedDate, setSelectedDate] = useState(null) // State for calendar selected date
  const [timeFilter, setTimeFilter] = useState("all")
  const [streak, setStreak] = useState(0) // New state for streak
  const [activeTab, setActiveTab] = useState("tasks") // New state for tab management

  function persistData(newList) {
    localStorage.setItem("todos", JSON.stringify({ todos: newList }))
  }

  function handleAddTodos(newTodo) {
    const todoWithId = {
      id: Date.now(),
      text: newTodo.text,
      dueDate: newTodo.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    const newTodoList = [...todos, todoWithId]
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleDeleteTodo(id) {
    const newTodoList = todos.filter((todo) => todo.id !== id)
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleEditTodo(id, newValue) {
    const newTodoList = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newValue }
      }
      return todo
    })
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleToggleComplete(id) {
    const newTodoList = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  // Calculate weekly stats
  const weeklyTasks = todos.filter((todo) => {
    const hasDueDate = !!todo.dueDate // Ensure it's a boolean
    let isDueThisWeek = false
    if (hasDueDate) {
      const parsedDate = parseISO(todo.dueDate)
      // Check if parsedDate is a valid date before calling isThisWeek
      if (!isNaN(parsedDate.getTime())) {
        isDueThisWeek = isThisWeek(parsedDate, { weekStartsOn: 1 })
      }
    }
    return hasDueDate && isDueThisWeek
  })

  const completedWeekly = weeklyTasks.filter((todo) => todo.completed).length
  const remainingWeekly = weeklyTasks.length - completedWeekly
  const completionRate = weeklyTasks.length > 0 ? Math.round((completedWeekly / weeklyTasks.length) * 100) : 0

  // Streak logic
  useEffect(() => {
    const today = new Date()
    const storedStreak = localStorage.getItem("appStreak")
    const lastOpened = localStorage.getItem("lastOpenedDate")

    let currentStreak = 0
    if (storedStreak) {
      currentStreak = Number.parseInt(storedStreak, 10)
    }

    if (lastOpened) {
      const lastOpenedDate = parseISO(lastOpened)
      if (isToday(lastOpenedDate)) {
        // App opened today, streak continues
      } else if (isYesterday(lastOpenedDate)) {
        // App opened yesterday, increment streak
        currentStreak += 1
      } else {
        // App not opened yesterday, reset streak
        currentStreak = 1
      }
    } else {
      // First time opening the app
      currentStreak = 1
    }

    setStreak(currentStreak)
    localStorage.setItem("appStreak", currentStreak.toString())
    localStorage.setItem("lastOpenedDate", today.toISOString())
  }, [todos]) // Re-run streak and weekly progress calculation when todos change

  // Load todos from localStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos")
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos).todos)
    }
  }, [])

  const handleCalendarChange = (date) => {
    setSelectedDate(date)
    setTimeFilter("all") // Reset time filter when a date is selected
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1>Dailist</h1>
        </div>
        <div className="header-right">
          <button
            className={`tab-button ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={`tab-button ${activeTab === "pomodoro" ? "active" : ""}`}
            onClick={() => setActiveTab("pomodoro")}
          >
            <Timer size={16} />
            Pomodoro
          </button>
          <div className="streak-counter">
            <Fire size={16} />
            <span>{streak}</span>
          </div>
        </div>
      </header>

      {activeTab === "tasks" ? (
        <div className="main-content">
          <div className="left-sidebar">
            <WeeklyProgress completed={completedWeekly} remaining={remainingWeekly} completionRate={completionRate} />
            <Calendar onChange={handleCalendarChange} value={selectedDate} />
          </div>

          <div className="right-content">
            <TaskInput todoValue={todoValue} setTodoValue={setTodoValue} handleAddTodos={handleAddTodos} />
            <TaskFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} setSelectedDate={setSelectedDate} />
            <TaskList
              todos={todos}
              selectedDate={selectedDate}
              timeFilter={timeFilter}
              handleEditTodo={handleEditTodo}
              handleDeleteTodo={handleDeleteTodo}
              handleToggleComplete={handleToggleComplete}
              setSelectedDate={setSelectedDate} // Pass setSelectedDate to TaskList
            />
          </div>
        </div>
      ) : (
        <PomodoroTimer />
      )}
    </div>
  )
}

export default App
