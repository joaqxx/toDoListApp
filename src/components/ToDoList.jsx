import TodoCard from "./ToDoCard.jsx"
import TimeFilter from "./TimeFilter.jsx"
import { isThisWeek, isThisMonth, isSameDay, parseISO } from "date-fns"
import { ListTodo, Inbox } from "lucide-react"
import "./ToDoList.css"

export default function TodoList(props) {
  const { todos, handleEditTodo, selectedDate, timeFilter, setTimeFilter, setSelectedDate } = props

  const filterTodos = (todos) => {
    let filtered = todos

    if (selectedDate) {
      filtered = filtered.filter((todo) => todo.dueDate && isSameDay(parseISO(todo.dueDate), selectedDate))
    } else {
      if (timeFilter === "week") {
        filtered = filtered.filter((todo) => todo.dueDate && isThisWeek(parseISO(todo.dueDate), { weekStartsOn: 1 }))
      } else if (timeFilter === "month") {
        filtered = filtered.filter((todo) => todo.dueDate && isThisMonth(parseISO(todo.dueDate)))
      }
    }

    return filtered
  }

  const filteredTodos = filterTodos(todos)

  return (
    <div className="tasks-section">
      <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} setSelectedDate={setSelectedDate} />

      <div className="tasks-header">
        <div className="tasks-title">
          <ListTodo size={18} />
          Your Tasks
        </div>
        <div className="tasks-count">{filteredTodos.length}</div>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="no-tasks">
            <div className="no-tasks-icon">
              <Inbox size={40} />
            </div>
            <p>No tasks found</p>
            <p style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.4rem" }}>
              {selectedDate ? "No tasks for the selected date" : "Add a new task to get started"}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => <TodoCard key={todo.id} todo={todo} {...props} />)
        )}
      </div>
    </div>
  )
}
