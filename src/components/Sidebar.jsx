import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard & Analytics' },
  { id: 'batches', icon: '👥', label: 'Batches' },
  { id: 'students', icon: '🎓', label: 'Student Registry' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'exams', icon: '❓', label: 'AI Exams' },
  { id: 'messages', icon: '💬', label: 'Broadcast Messages' },
]

export default function Sidebar({ currentPage, onNavigate, onSignOut, userEmail, theme, onToggleTheme }) {
  const [isEyeCare, setIsEyeCare] = useState(false)

  const toggleEyeCareMode = () => {
    setIsEyeCare(!isEyeCare)
    if (!isEyeCare) {
      document.body.classList.add('eyecare-theme')
    } else {
      document.body.classList.remove('eyecare-theme')
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div>
          <h2>MCA</h2>
          <span className="sidebar-subtitle">ADMIN PORTAL</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className={`nav-item ${currentPage === item.id ? 'active' : ''} ${item.label === 'AI Exams' ? 'dashed-highlight' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>



      <div className="sidebar-footer">
        <div className="sidebar-nav-footer">
          <div className="nav-item-sub" onClick={() => alert('Manisha Computer Academy Help Center & Documentation active.')}>
            <span className="nav-icon">❓</span> Help Center
          </div>
          {onSignOut && (
            <div className="nav-item-sub logout dashed" onClick={onSignOut}>
              <span className="nav-icon">&rarr;</span> Logout
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
