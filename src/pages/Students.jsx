import { useState, useRef } from 'react'

// Generate roll number deterministically
function generateRollNumber(batchCode, index) {
  return `DC-${batchCode}-${String(index).padStart(3, '0')}`
}

// Generate detailed GitHub-style attendance history from the joining month
function generateDetailedHistory(joiningMonthName, name) {
  const now = new Date()
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const parts = (joiningMonthName || 'March 2026').split(' ')
  const monthIdx = months.indexOf(parts[0]) !== -1 ? months.indexOf(parts[0]) : 2 // default to March
  const year = parseInt(parts[1]) || 2026

  const startDate = new Date(year, monthIdx, 1)
  const data = []
  
  // Loop day-by-day until today
  const loopDate = new Date(startDate)
  // Safety guard to avoid infinite loops
  let limit = 0
  while (loopDate <= now && limit < 150) {
    limit++
    if (loopDate.getDay() !== 0) { // Skip Sundays to make it look clean
      const seed = name.charCodeAt(0) * 7 + loopDate.getDate() * 13 + loopDate.getMonth() * 3
      const present = seed % 5 !== 0
      const level = present ? (3 + (seed % 2)) : 0 // level 0 or level 3/4
      data.push({
        date: loopDate.toISOString().split('T')[0],
        present,
        level,
        day: loopDate.getDate(),
      })
    }
    loopDate.setDate(loopDate.getDate() + 1)
  }
  return data
}

export default function Students({
  students = [],
  setStudents,
  batches = [],
  selectedBatchFilter = '',
  setSelectedBatchFilter,
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showOcrModal, setShowOcrModal] = useState(false)
  const [activeProfileStudent, setActiveProfileStudent] = useState(null)
  const [ocrResults, setOcrResults] = useState(null)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', batch: batches[0]?.code || '10A', email: '', rollNumber: '' })
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef(null)

  // Filter students by search query AND batch filter
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.batch.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBatch = selectedBatchFilter ? s.batch === selectedBatchFilter : true
    return matchesSearch && matchesBatch
  })

  const openAddModal = () => {
    const defaultBatch = batches[0]?.code || '10A'
    const batchStudents = students.filter(s => s.batch === defaultBatch)
    const nextIndex = batchStudents.length + 1
    setNewStudent({
      name: '',
      phone: '',
      batch: defaultBatch,
      email: '',
      rollNumber: generateRollNumber(defaultBatch, nextIndex)
    })
    setShowAddModal(true)
  }

  const handleAddNameChange = (name) => {
    const emailName = name.toLowerCase().trim().replace(/\s+/g, '.')
    const generatedEmail = emailName ? `${emailName}@gmail.com` : ''
    setNewStudent(prev => ({
      ...prev,
      name,
      email: generatedEmail
    }))
  }

  const handleAddBatchChange = (batch) => {
    const batchStudents = students.filter(s => s.batch === batch)
    const nextIndex = batchStudents.length + 1
    const generatedRoll = generateRollNumber(batch, nextIndex)
    setNewStudent(prev => ({
      ...prev,
      batch,
      rollNumber: generatedRoll
    }))
  }

  const handleManualAdd = () => {
    if (!newStudent.name.trim()) return
    const currentMonthYear = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })

    const maxId = students.reduce((max, s) => s.id > max ? s.id : max, 0)
    const student = {
      id: maxId + 1,
      name: newStudent.name,
      phone: newStudent.phone || 'Not provided',
      email: newStudent.email || `${newStudent.name.toLowerCase().trim().replace(/\s+/g, '.')}@gmail.com`,
      joiningMonth: currentMonthYear,
      avatar: '/src/assets/student_avatar.png',
      batch: newStudent.batch,
      rollNumber: newStudent.rollNumber,
      aiUsed: 0,
      aiTotal: 150,
    }
    setStudents([...students, student])
    setShowAddModal(false)
  }

  const openEditModal = (student) => {
    setEditingStudent({
      id: student.id,
      name: student.name,
      phone: student.phone,
      batch: student.batch,
      email: student.email,
      rollNumber: student.rollNumber,
      joiningMonth: student.joiningMonth,
      avatar: student.avatar,
      aiUsed: student.aiUsed,
      aiTotal: student.aiTotal
    })
    setShowEditModal(true)
    setActiveProfileStudent(null)
  }

  const handleEditNameChange = (name) => {
    const emailName = name.toLowerCase().trim().replace(/\s+/g, '.')
    const generatedEmail = emailName ? `${emailName}@gmail.com` : ''
    setEditingStudent(prev => ({
      ...prev,
      name,
      email: generatedEmail
    }))
  }

  const handleEditBatchChange = (batch) => {
    const batchStudents = students.filter(s => s.batch === batch)
    const nextIndex = batchStudents.length + 1
    const generatedRoll = generateRollNumber(batch, nextIndex)
    setEditingStudent(prev => ({
      ...prev,
      batch,
      rollNumber: generatedRoll
    }))
  }

  const handleSaveEdit = () => {
    if (!editingStudent.name.trim()) return
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s))
    setShowEditModal(false)
    setEditingStudent(null)
  }

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student from the registry?")) {
      setStudents(prev => prev.filter(s => s.id !== id))
      setShowEditModal(false)
      setEditingStudent(null)
    }
  }

  const handleOcrConfirm = () => {
    if (!ocrResults) return
    const batch = selectedBatchFilter || batches[0]?.code || '10A'
    const currentBatchCount = students.filter(s => s.batch === batch).length
    const currentMonthYear = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })

    const maxId = students.reduce((max, s) => s.id > max ? s.id : max, 0)
    const newStudents = ocrResults.map((r, i) => {
      const emailName = r.name.toLowerCase().trim().replace(/\s+/g, '.')
      return {
        id: maxId + i + 1,
        name: r.name,
        phone: r.phone,
        email: `${emailName}@gmail.com`,
        joiningMonth: currentMonthYear,
        avatar: '/src/assets/student_avatar.png',
        batch: batch,
        rollNumber: generateRollNumber(batch, currentBatchCount + i + 1),
        aiUsed: 0,
        aiTotal: 150,
      }
    })
    setStudents([...students, ...newStudents])
    setOcrResults(null)
    setShowOcrModal(false)
  }

  const handleOcrUpload = () => {
    setOcrProcessing(true)
    setTimeout(() => {
      const simulatedResults = [
        { name: 'Rahul Desai', phone: '+919812345678' },
        { name: 'Kavita Iyer', phone: '+919812345679' },
        { name: 'Amit Saxena', phone: '+919812345680' },
      ]
      setOcrResults(simulatedResults)
      setOcrProcessing(false)
    }, 1200)
  }

  const handleRechargeCredits = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updated = { ...s, aiTotal: s.aiTotal + 50 }
        if (activeProfileStudent && activeProfileStudent.id === studentId) {
          setActiveProfileStudent(updated)
        }
        return updated
      }
      return s
    }))
  }

  const getAiStatus = (s) => {
    const pct = (s.aiUsed / s.aiTotal) * 100
    if (pct >= 100) return { label: 'Exhausted', status: 'error' }
    if (pct >= 80) return { label: 'Low Balance', status: 'warning' }
    return { label: 'Available', status: 'success' }
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0 }}>{students.length} REGISTERED STUDENTS ACROSS ALL BATCHES</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => setShowOcrModal(true)}>
            📸 OCR INGEST
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            + ADD STUDENT
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          className="form-input"
          placeholder="🔍 SEARCH BY NAME, ROLL, OR BATCH..."
          style={{ width: '100%', maxWidth: '320px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {selectedBatchFilter && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(234, 88, 12, 0.05)',
            border: '1px solid rgba(234, 88, 12, 0.2)',
            padding: '6px 12px',
            fontSize: '0.75rem',
            color: 'var(--brand-accent)'
          }}>
            <span>FILTER: BATCH <strong>{selectedBatchFilter}</strong></span>
            <button
              onClick={() => setSelectedBatchFilter('')}
              style={{
                background: 'none', border: 'none', color: 'var(--brand-accent)',
                cursor: 'pointer', fontWeight: 'bold', marginLeft: '4px'
              }}
            >
              ✕ CLEAR
            </button>
          </div>
        )}
      </div>

      {/* Student Registry Table */}
      <div className="glass-card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Ref</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Batch</th>
              <th>Phone Number</th>
              <th>AI Tokens Used</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => {
                const aiInfo = getAiStatus(s)
                const initials = s.name.split(' ').map(w => w[0]).join('').slice(0, 2)
                return (
                  <tr key={s.id} onClick={() => setActiveProfileStudent(s)} title="Click to view student profile">
                    <td>
                      <div className="avatar-placeholder">{initials}</div>
                    </td>
                    <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>{s.name}</td>
                    <td className="monospace-data" style={{ color: 'var(--brand-accent)' }}>
                      {s.rollNumber}
                    </td>
                    <td>
                      <span className="badge badge-violet">{s.batch}</span>
                    </td>
                    <td className="monospace-data">{s.phone}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '80px', height: '4px',
                          backgroundColor: 'rgba(0,0,0,0.03)', overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(s.aiUsed / s.aiTotal) * 100}%`, height: '100%',
                            backgroundColor: s.aiUsed >= s.aiTotal ? 'var(--status-error)' :
                              s.aiUsed >= s.aiTotal * 0.8 ? 'var(--status-warning)' : 'var(--status-success)',
                          }} />
                        </div>
                        <span className="monospace-data" style={{ fontSize: '0.688rem', color: 'var(--text-muted)' }}>
                          {s.aiUsed}/{s.aiTotal}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-indicator ${aiInfo.status}`}>
                        {aiInfo.label}
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  NO STUDENTS FOUND IN THIS SELECTION
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student Profile Modal */}
      {activeProfileStudent && (
        <div className="modal-overlay" onClick={() => setActiveProfileStudent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <h3>STUDENT PROFILE DETAILS</h3>
              <button className="modal-close" onClick={() => setActiveProfileStudent(null)}>×</button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
              <div className="avatar-placeholder" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                {activeProfileStudent.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                  {activeProfileStudent.name.toUpperCase()}
                </h2>
                <span className="monospace-data" style={{ color: 'var(--brand-accent)', fontSize: '0.813rem', fontWeight: 600 }}>
                  {activeProfileStudent.rollNumber}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Batch details */}
              <div style={{ padding: '12px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-main)' }}>
                <h4 style={{ fontSize: '0.688rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  CLASS ACADEMIC DETAILS
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Batch:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {batches.find(b => b.code === activeProfileStudent.batch)?.name || `Batch ${activeProfileStudent.batch}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Class Code:</span>
                  <span className="monospace-data" style={{ fontWeight: 600, color: 'var(--status-violet)' }}>{activeProfileStudent.batch}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                  <span className="monospace-data" style={{ fontWeight: 600, color: 'var(--text-main)' }}>{activeProfileStudent.phone}</span>
                </div>
              </div>

              {/* Account Binding & Profile Photo */}
              <div style={{ padding: '12px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-main)' }}>
                <h4 style={{ fontSize: '0.688rem', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                  ACCOUNT IDENTITY & PROFILE BINDING
                </h4>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img
                    src={activeProfileStudent.avatar || '/src/assets/student_avatar.png'}
                    alt={`${activeProfileStudent.name} Avatar`}
                    style={{
                      width: '64px',
                      height: '64px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '0px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/src/assets/react.svg'
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.813rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.688rem', fontWeight: 600 }}>BINDED GMAIL ID</span>
                      <span className="monospace-data" style={{ fontWeight: 600, color: 'var(--text-main)', wordBreak: 'break-all' }}>
                        {activeProfileStudent.email}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.813rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.688rem', fontWeight: 600 }}>MONTH OF JOINING</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {activeProfileStudent.joiningMonth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Token Ledger details */}
              <div style={{ padding: '12px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-main)' }}>
                <h4 style={{ fontSize: '0.688rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  AI TOKEN LEDGER
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Usage Summary:</span>
                  <span className="monospace-data" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {activeProfileStudent.aiUsed} / {activeProfileStudent.aiTotal} Credits
                  </span>
                </div>
                <div style={{
                  width: '100%', height: '6px',
                  backgroundColor: 'rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '12px'
                }}>
                  <div style={{
                    width: `${(activeProfileStudent.aiUsed / activeProfileStudent.aiTotal) * 100}%`, height: '100%',
                    backgroundColor: activeProfileStudent.aiUsed >= activeProfileStudent.aiTotal ? 'var(--status-error)' :
                      activeProfileStudent.aiUsed >= activeProfileStudent.aiTotal * 0.8 ? 'var(--status-warning)' : 'var(--status-success)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`status-indicator ${getAiStatus(activeProfileStudent).status}`}>
                    {getAiStatus(activeProfileStudent).label}
                  </span>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.625rem', padding: '4px 8px' }}
                    onClick={() => handleRechargeCredits(activeProfileStudent.id)}
                  >
                    +50 AI Credits
                  </button>
                </div>
              </div>

              {/* GitHub-style Attendance Calendar from month of joining */}
              <div style={{ padding: '12px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-main)' }}>
                <h4 style={{ fontSize: '0.688rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  ATTENDANCE HISTORY (SINCE {activeProfileStudent.joiningMonth.toUpperCase()})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '8px' }}>
                  {generateDetailedHistory(activeProfileStudent.joiningMonth, activeProfileStudent.name).map((cell, i) => (
                    <div
                      key={i}
                      className={`contrib-cell ${cell.present ? 'level-4' : 'level-0'}`}
                      title={`${cell.date}: ${cell.present ? 'Present' : 'Absent'}`}
                      style={{ width: '12px', height: '12px' }}
                    />
                  ))}
                </div>
                <div className="contrib-legend" style={{ marginTop: '4px' }}>
                  <div className="contrib-cell level-0" style={{ width: '8px', height: '8px' }} /> Absent
                  <div style={{ width: '12px' }} />
                  <div className="contrib-cell level-4" style={{ width: '8px', height: '8px' }} /> Present
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => openEditModal(activeProfileStudent)}>✏️ Edit Profile</button>
              <button className="btn btn-secondary" onClick={() => setActiveProfileStudent(null)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Student</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Jatin Prakash Behera"
                  value={newStudent.name}
                  onChange={(e) => handleAddNameChange(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Assign to Batch</label>
                  <select
                    className="form-input"
                    value={newStudent.batch}
                    onChange={(e) => handleAddBatchChange(e.target.value)}
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.code}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Generated Roll Number</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Auto-generated"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Generated Gmail ID</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Auto-generated"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{
                padding: '12px',
                border: '1px solid var(--border-grid)',
                backgroundColor: 'rgba(0, 0, 0, 0.01)'
              }}>
                <p style={{ fontSize: '0.688rem', color: 'var(--text-muted)' }}>
                  * Roll number and Gmail ID are auto-generated as you type the name and batch. You can customize them if needed.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleManualAdd}>Add Student</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Student</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Jatin Prakash Behera"
                  value={editingStudent.name}
                  onChange={(e) => handleEditNameChange(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Assign to Batch</label>
                  <select
                    className="form-input"
                    value={editingStudent.batch}
                    onChange={(e) => handleEditBatchChange(e.target.value)}
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.code}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Roll Number"
                    value={editingStudent.rollNumber}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gmail ID</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Gmail ID"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{
                padding: '12px',
                border: '1px solid var(--border-grid)',
                backgroundColor: 'rgba(0, 0, 0, 0.01)'
              }}>
                <p style={{ fontSize: '0.688rem', color: 'var(--text-muted)' }}>
                  * Roll number and Gmail ID auto-regenerate when Name or Batch is changed, but can be customized manually.
                </p>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button className="btn btn-secondary" style={{ backgroundColor: 'var(--status-error)', color: 'white', border: 'none' }} onClick={() => handleDeleteStudent(editingStudent.id)}>
                Delete Student
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OCR Ingest Modal */}
      {showOcrModal && (
        <div className="modal-overlay" onClick={() => setShowOcrModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>OCR Ledger Ingestion</h3>
              <button className="modal-close" onClick={() => setShowOcrModal(false)}>×</button>
            </div>

            {!ocrResults && !ocrProcessing && (
              <>
                <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                  <p>Drop ledger image here or <span>browse files</span></p>
                  <p style={{ fontSize: '0.625rem', color: 'var(--text-disabled)', marginTop: '4px' }}>
                    SOURCE IMAGE WILL BE INSTANTLY DELETED TO SAVE STORAGE
                  </p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleOcrUpload} />
              </>
            )}

            {ocrProcessing && (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>RUNNING TRANSIENT CLOUD OCR...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                  Processing data points in memory
                </p>
              </div>
            )}

            {ocrResults && (
              <>
                <div style={{
                  marginBottom: '16px', padding: '10px',
                  border: '1px solid var(--border-grid)',
                  backgroundColor: 'rgba(21, 128, 61, 0.02)'
                }}>
                  <p style={{ fontSize: '0.688rem', color: 'var(--status-success)' }}>
                    ✓ Image processed and deleted. Found {ocrResults.length} student records.
                  </p>
                </div>

                <table className="data-table" style={{ marginBottom: '16px' }}>
                  <thead>
                    <tr><th>Name</th><th>Phone</th><th>Generated Roll</th></tr>
                  </thead>
                  <tbody>
                    {ocrResults.map((r, i) => {
                      const activeBatch = selectedBatchFilter || batches[0]?.code || '10A'
                      const batchCount = students.filter(s => s.batch === activeBatch).length
                      return (
                        <tr key={i}>
                          <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.name}</td>
                          <td className="monospace-data">{r.phone}</td>
                          <td className="monospace-data" style={{ color: 'var(--brand-accent)' }}>
                            {generateRollNumber(activeBatch, batchCount + i + 1)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => { setOcrResults(null); setShowOcrModal(false) }}>
                    Discard
                  </button>
                  <button className="btn btn-primary" onClick={handleOcrConfirm}>
                    Confirm and Ingest
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
