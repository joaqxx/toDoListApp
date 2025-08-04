"use client"

import { Filter } from "lucide-react"
import "./TaskFilter.css"

export default function TaskFilter({ timeFilter, setTimeFilter, setSelectedDate }) {
  const handleFilterChange = (e) => {
    setTimeFilter(e.target.value)
    setSelectedDate(null) // Clear selected date when time filter changes
  }

  return (
    <div className="filter-section">
      <div className="filter-container">
        <div className="filter-label">
          <Filter size={16} />
          Filter by:
        </div>
        <select className="filter-select" value={timeFilter} onChange={handleFilterChange}>
          <option value="all">All Tasks</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="today">Today</option>
        </select>
      </div>
    </div>
  )
}
