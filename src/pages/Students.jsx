import { useState, useRef } from 'react'

// Generate roll number deterministically
function generateRollNumber(batchCode, index, allStudents = []) {
  if (batchCode && batchCode.startsWith('OSCIT')) {
    const oscitStudents = allStudents.filter(s => s && s.batch && s.batch.startsWith('OSCIT'))
    const nextSeq = oscitStudents.length > 0 ? oscitStudents.length + 1 : index
    return `MCA-${String(nextSeq).padStart(3, '0')}`
  }
  return `DC-${batchCode || 'GEN'}-${String(index).padStart(2, '0')}`
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
  const safeName = name || 'Student'
  
  // Loop day-by-day until today
  const loopDate = new Date(startDate)
  let limit = 0
  while (loopDate <= now && limit < 150) {
    limit++
    if (loopDate.getDay() !== 0) { // Skip Sundays
      const seed = safeName.charCodeAt(0) * 7 + loopDate.getDate() * 13 + loopDate.getMonth() * 3
      const present = seed % 5 !== 0
      const level = present ? (3 + (seed % 2)) : 0
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
  hasPasswordColumn = false,
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showOcrModal, setShowOcrModal] = useState(false)
  const [activeProfileStudent, setActiveProfileStudent] = useState(null)
  const [ocrResults, setOcrResults] = useState(null)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [showPlainPasswordMap, setShowPlainPasswordMap] = useState({})
  
  // Forms states
  const [newStudent, setNewStudent] = useState({
    name: '',
    phone: '',
    password: '',
    batch: batches[0]?.code || '10A',
    email: '',
    rollNumber: '',
  })
  
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef(null)

  // Filter students by search query AND batch filter
  const filteredStudents = students.filter(s => {
    if (!s) return false
    const nameVal = s.name || ''
    const rollVal = s.rollNumber || ''
    const batchVal = s.batch || ''
    
    const matchesSearch = nameVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rollVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batchVal.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBatch = selectedBatchFilter ? s.batch === selectedBatchFilter : true
    return matchesSearch && matchesBatch
  })

  const openAddModal = () => {
    const defaultBatch = batches[0]?.code || '10A'
    const batchStudents = students.filter(s => s && s.batch === defaultBatch)
    const nextIndex = batchStudents.length + 1
    setNewStudent({
      name: '',
      phone: '',
      password: '',
      batch: defaultBatch,
      email: '',
      rollNumber: generateRollNumber(defaultBatch, nextIndex, students),
    })
    setShowAddModal(true)
  }

  const handleAddNameChange = (name) => {
    const emailName = name.toLowerCase().trim().replace(/\s+/g, '.')
    const generatedEmail = emailName ? `${emailName}@gmail.com` : ''
    const firstName = name.trim().split(' ')[0] || 'MCA'
    const cleanBatch = newStudent.batch || '10A'
    const generatedPassword = `${firstName}@${cleanBatch}`
    
    setNewStudent(prev => ({
      ...prev,
      name,
      email: generatedEmail,
      password: generatedPassword,
    }))
  }

  const handleAddBatchChange = (batch) => {
    const batchStudents = students.filter(s => s && s.batch === batch)
    const nextIndex = batchStudents.length + 1
    const generatedRoll = generateRollNumber(batch, nextIndex, students)
    const firstName = newStudent.name.trim().split(' ')[0] || 'MCA'
    const generatedPassword = `${firstName}@${batch}`
    
    setNewStudent(prev => ({
      ...prev,
      batch,
      rollNumber: generatedRoll,
      password: newStudent.name ? generatedPassword : prev.password,
    }))
  }

  const handleManualAdd = () => {
    if (!newStudent.name.trim()) return
    const currentMonthYear = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })
    const maxId = students.reduce((max, s) => (s && s.id > max) ? s.id : max, 0)
    
    const student = {
      id: maxId + 1,
      name: newStudent.name,
      phone: newStudent.phone || 'Not provided',
      password: newStudent.password || `${newStudent.name.trim().split(' ')[0]}@123`,
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
    if (!student) return
    setEditingStudent({
      id: student.id,
      name: student.name || '',
      phone: student.phone || '',
      password: student.password || student.phone || '',
      batch: student.batch || '',
      email: student.email || '',
      rollNumber: student.rollNumber || '',
      joiningMonth: student.joiningMonth || 'July 2026',
      avatar: student.avatar || '/src/assets/student_avatar.png',
      aiUsed: student.aiUsed || 0,
      aiTotal: student.aiTotal || 150,
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
      email: generatedEmail,
    }))
  }

  const handleEditBatchChange = (batch) => {
    const batchStudents = students.filter(s => s && s.batch === batch)
    const nextIndex = batchStudents.length + 1
    const generatedRoll = generateRollNumber(batch, nextIndex, students)
    
    setEditingStudent(prev => ({
      ...prev,
      batch,
      rollNumber: generatedRoll,
    }))
  }

  const handleSaveEdit = () => {
    if (!editingStudent || !editingStudent.name.trim()) return
    setStudents(prev => prev.map(s => (s && s.id === editingStudent.id) ? editingStudent : s))
    setShowEditModal(false)
    setEditingStudent(null)
  }

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student from the registry?")) {
      setStudents(prev => prev.filter(s => s && s.id !== id))
      setShowEditModal(false)
      setEditingStudent(null)
    }
  }

  const handleOcrConfirm = () => {
    if (!ocrResults) return
    const batch = selectedBatchFilter || batches[0]?.code || '10A'
    const currentBatchCount = students.filter(s => s && s.batch === batch).length
    const currentMonthYear = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })
    const maxId = students.reduce((max, s) => (s && s.id > max) ? s.id : max, 0)
    
    let tempStudents = [...students]
    const newStudents = ocrResults.map((r, i) => {
      const emailName = r.name.toLowerCase().trim().replace(/\s+/g, '.')
      const generatedRoll = generateRollNumber(batch, currentBatchCount + i + 1, tempStudents)
      const firstName = r.name.trim().split(' ')[0] || 'MCA'
      
      const newStudentObj = {
        id: maxId + i + 1,
        name: r.name,
        phone: r.phone || '+91 98123 00000',
        password: `${firstName}@${batch}`,
        email: `${emailName}@gmail.com`,
        joiningMonth: currentMonthYear,
        avatar: '/src/assets/student_avatar.png',
        batch: batch,
        rollNumber: generatedRoll,
        aiUsed: 0,
        aiTotal: 150,
      }
      tempStudents.push(newStudentObj)
      return newStudentObj
    })
    setStudents([...students, ...newStudents])
    setOcrResults(null)
    setShowOcrModal(false)
  }

  const handleOcrUpload = () => {
    setOcrProcessing(true)
    setTimeout(() => {
      const simulatedResults = [
        { name: 'Rahul Desai', phone: '+91 98123 45678' },
        { name: 'Kavita Iyer', phone: '+91 98123 45679' },
        { name: 'Amit Saxena', phone: '+91 98123 45680' },
      ]
      setOcrResults(simulatedResults)
      setOcrProcessing(false)
    }, 1200)
  }

  const handleRechargeCredits = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s && s.id === studentId) {
        const updated = { ...s, aiTotal: (s.aiTotal || 150) + 50 }
        if (activeProfileStudent && activeProfileStudent.id === studentId) {
          setActiveProfileStudent(updated)
        }
        return updated
      }
      return s
    }))
  }

  const togglePasswordVisibility = (id) => {
    setShowPlainPasswordMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getAiStatus = (s) => {
    if (!s) return { label: 'Available', status: 'success' }
    const used = s.aiUsed || 0
    const total = s.aiTotal || 150
    const pct = (used / total) * 100
    if (pct >= 100) return { label: 'Exhausted', status: 'error' }
    if (pct >= 80) return { label: 'Low Balance', status: 'warning' }
    return { label: 'Available', status: 'success' }
  }

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            {students.length} REGISTERED STUDENTS ACROSS ALL BATCHES
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setShowOcrModal(true)}>
            📸 OCR INGEST
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            + ADD STUDENT
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          className="form-input"
          placeholder="🔍 SEARCH BY NAME, ROLL, OR BATCH..."
          style={{ width: '100%', maxWidth: '360px', background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {selectedBatchFilter && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'var(--brand-primary)'
          }}>
            <span>FILTER: BATCH <strong>{selectedBatchFilter}</strong></span>
            <button
              onClick={() => setSelectedBatchFilter('')}
              style={{
                background: 'none', border: 'none', color: 'var(--brand-primary)',
                cursor: 'pointer', fontWeight: 'bold', marginLeft: '4px'
              }}
            >
              ✕ CLEAR
            </button>
          </div>
        )}
      </div>

      {/* Student Registry Table */}
      <div className="glass-card" style={{ padding: 0, border: '1px solid var(--border-grid)', background: 'var(--bg-surface)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Ref</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Batch</th>
              <th>Phone Number</th>
              <th>Password Credential</th>
              <th>AI Tokens Used</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => {
                if (!s) return null
                const aiInfo = getAiStatus(s)
                const safeName = s.name || 'Student Name'
                const initials = safeName.split(' ').map(w => w[0]).join('').slice(0, 2)
                const pwd = s.password || s.phone || 'MCA@123'
                const isPlain = showPlainPasswordMap[s.id]
                
                return (
                  <tr key={s.id} onClick={() => setActiveProfileStudent(s)} title="Click to view student profile" style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="avatar-placeholder" style={{ background: 'var(--brand-gradient)', color: '#fff', fontWeight: 700 }}>
                        {initials.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>{safeName}</td>
                    <td className="monospace-data" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {s.rollNumber || 'DC-ROLL-00'}
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: 'var(--brand-primary)' }}>
                        {s.batch || '10A'}
                      </span>
                    </td>
                    <td className="monospace-data">{s.phone || 'Not provided'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <span className="monospace-data" style={{ color: 'var(--text-secondary)' }}>
                          {isPlain ? pwd : '••••••••'}
                        </span>
                        <button
                          style={{
                            background: 'none', border: 'none', color: 'var(--text-muted)',
                            cursor: 'pointer', fontSize: '0.9rem', padding: '2px 4px'
                          }}
                          onClick={() => togglePasswordVisibility(s.id)}
                          title={isPlain ? "Hide Password" : "Show Password"}
                        >
                          {isPlain ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '80px', height: '5px',
                          backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${Math.min(((s.aiUsed || 0) / (s.aiTotal || 150)) * 100, 100)}%`, height: '100%',
                            backgroundColor: (s.aiUsed || 0) >= (s.aiTotal || 150) ? 'var(--accent-rose)' :
                              (s.aiUsed || 0) >= (s.aiTotal || 150) * 0.8 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                          }} />
                        </div>
                        <span className="monospace-data" style={{ fontSize: '0.688rem', color: 'var(--text-muted)' }}>
                          {s.aiUsed || 0}/{s.aiTotal || 150}
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
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontWeight: 600 }}>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', width: '90%', border: '1px solid var(--glass-border)' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-grid)' }}>
              <h3 style={{ color: 'var(--text-main)', letterSpacing: '0.04em' }}>STUDENT PROFILE DETAILS</h3>
              <button className="modal-close-btn" onClick={() => setActiveProfileStudent(null)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header profile info */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="avatar-placeholder" style={{ width: '56px', height: '56px', fontSize: '1.35rem', background: 'var(--brand-gradient)', color: '#fff', fontWeight: 700 }}>
                  {(activeProfileStudent.name || 'S').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    {activeProfileStudent.name || 'STUDENT NAME'}
                  </h2>
                  <span className="monospace-data" style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
                    {activeProfileStudent.rollNumber || 'DC-ROLL-00'}
                  </span>
                </div>
              </div>

              {/* Grid content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Batch details */}
                <div style={{ padding: '16px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-darker)', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', marginBottom: '12px', letterSpacing: '0.08em', fontWeight: 800 }}>
                    CLASS ACADEMIC DETAILS
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Assigned Batch:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {batches.find(b => b.code === activeProfileStudent.batch)?.name || `Batch ${activeProfileStudent.batch || '10A'}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Class Code:</span>
                    <span className="monospace-data" style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{activeProfileStudent.batch || '10A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Academic Status:</span>
                    <span className="status-indicator success" style={{ fontWeight: 700 }}>ACTIVE ENROLLED</span>
                  </div>
                </div>

                {/* Account Binding & Profile Info */}
                <div style={{ padding: '16px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-darker)', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', marginBottom: '12px', letterSpacing: '0.08em', fontWeight: 800 }}>
                    ACCOUNT IDENTITY & CREDENTIAL BINDING
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <img
                      src={activeProfileStudent.avatar || '/src/assets/student_avatar.png'}
                      alt={`${activeProfileStudent.name || 'Student'} Avatar`}
                      style={{
                        width: '56px',
                        height: '56px',
                        border: '1px solid var(--border-grid)',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/src/assets/react.svg'
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>BINDED GMAIL ID</span>
                        <span className="monospace-data" style={{ fontWeight: 600, color: 'var(--text-main)', wordBreak: 'break-all' }}>
                          {activeProfileStudent.email || 'Not binded'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>MONTH OF JOINING</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {activeProfileStudent.joiningMonth || 'July 2026'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-grid)', paddingTop: '12px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Phone Number:</span>
                      <span className="monospace-data" style={{ fontWeight: 600, color: 'var(--text-main)' }}>{activeProfileStudent.phone || 'Not provided'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Login Password:</span>
                      <span className="monospace-data" style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{activeProfileStudent.password || activeProfileStudent.phone || 'MCA@123'}</span>
                    </div>
                  </div>
                </div>

                {/* AI Token Ledger details */}
                <div style={{ padding: '16px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-darker)', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.725rem', color: 'var(--accent-rose)', marginBottom: '12px', letterSpacing: '0.08em', fontWeight: 800 }}>
                    AI TOKEN LEDGER POOL
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Usage Summary:</span>
                    <span className="monospace-data" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {activeProfileStudent.aiUsed || 0} / {activeProfileStudent.aiTotal || 150} Credits
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: '6px',
                    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px'
                  }}>
                    <div style={{
                      width: `${Math.min(((activeProfileStudent.aiUsed || 0) / (activeProfileStudent.aiTotal || 150)) * 100, 100)}%`, height: '100%',
                      backgroundColor: (activeProfileStudent.aiUsed || 0) >= (activeProfileStudent.aiTotal || 150) ? 'var(--accent-rose)' :
                        (activeProfileStudent.aiUsed || 0) >= (activeProfileStudent.aiTotal || 150) * 0.8 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`status-indicator ${getAiStatus(activeProfileStudent).status}`} style={{ fontWeight: 700 }}>
                      {getAiStatus(activeProfileStudent).label}
                    </span>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      onClick={() => handleRechargeCredits(activeProfileStudent.id)}
                    >
                      ⚡ Recharge +50 Credits
                    </button>
                  </div>
                </div>

                {/* Attendance Calendar */}
                <div style={{ padding: '16px', border: '1px solid var(--border-grid)', backgroundColor: 'var(--bg-darker)', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.725rem', color: 'var(--accent-emerald)', marginBottom: '12px', letterSpacing: '0.08em', fontWeight: 800 }}>
                    ATTENDANCE CALENDAR (SINCE {(activeProfileStudent.joiningMonth || 'July 2026').toUpperCase()})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {generateDetailedHistory(activeProfileStudent.joiningMonth, activeProfileStudent.name).map((cell, i) => (
                      <div
                        key={i}
                        className={`contrib-cell ${cell.present ? 'level-4' : 'level-0'}`}
                        title={`${cell.date}: ${cell.present ? 'Present' : 'Absent'}`}
                        style={{ width: '13px', height: '13px', borderRadius: '2px' }}
                      />
                    ))}
                  </div>
                  <div className="contrib-legend" style={{ marginTop: '8px', borderTop: '1px solid var(--border-grid)', paddingTop: '8px' }}>
                    <div className="contrib-cell level-0" style={{ width: '8px', height: '8px', borderRadius: '1px' }} /> Absent
                    <div style={{ width: '16px' }} />
                    <div className="contrib-cell level-4" style={{ width: '8px', height: '8px', borderRadius: '1px' }} /> Present
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-grid)', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => openEditModal(activeProfileStudent)}>✏️ EDIT PROFILE</button>
              <button className="btn btn-primary" onClick={() => setActiveProfileStudent(null)}>CLOSE PROFILE</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', border: '1px solid var(--glass-border)' }}>
            <div className="modal-header">
              <h3>Create Student Profile</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Sweety Das"
                  value={newStudent.name}
                  onChange={(e) => handleAddNameChange(e.target.value)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. +91 98123 45678"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Login Password *</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Credential Password"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Assign to Batch</label>
                  <select
                    className="form-input"
                    value={newStudent.batch}
                    onChange={(e) => handleAddBatchChange(e.target.value)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)', color: 'var(--text-main)' }}
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.code}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gmail Address</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Auto-generated"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Roll Number</label>
                <input
                  className="form-input monospace-data"
                  placeholder="Auto-generated"
                  value={newStudent.rollNumber}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                />
              </div>

              <div style={{
                padding: '12px',
                border: '1px solid var(--border-grid)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  * Roll number, Email, and Password are auto-generated dynamically as you type the Name and Batch. You can modify them manually before saving.
                </p>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-grid)' }}>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleManualAdd}>Add Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', border: '1px solid var(--glass-border)' }}>
            <div className="modal-header">
              <h3>Edit Student Registry</h3>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Sweety Das"
                  value={editingStudent.name}
                  onChange={(e) => handleEditNameChange(e.target.value)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. +91 98123 45678"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Login Password *</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Credential Password"
                    value={editingStudent.password}
                    onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Assign to Batch</label>
                  <select
                    className="form-input"
                    value={editingStudent.batch}
                    onChange={(e) => handleEditBatchChange(e.target.value)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)', color: 'var(--text-main)' }}
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.code}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gmail Address</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Gmail Address"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    className="form-input monospace-data"
                    placeholder="Roll Number"
                    value={editingStudent.rollNumber}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Month of Joining</label>
                  <input
                    className="form-input"
                    placeholder="e.g. July 2026"
                    value={editingStudent.joiningMonth}
                    onChange={(e) => setEditingStudent({ ...editingStudent, joiningMonth: e.target.value })}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-grid)' }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-grid)', justifyContent: 'space-between' }}>
              <button
                className="btn btn-secondary"
                style={{ backgroundColor: 'var(--accent-rose)', color: 'white', borderColor: 'transparent' }}
                onClick={() => handleDeleteStudent(editingStudent.id)}
              >
                🗑️ Delete Student
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', width: '90%', border: '1px solid var(--glass-border)' }}>
            <div className="modal-header">
              <h3>OCR Ledger Ingestion</h3>
              <button className="modal-close-btn" onClick={() => setShowOcrModal(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ minHeight: '180px' }}>
              {!ocrResults && !ocrProcessing && (
                <>
                  <div className="upload-zone" onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed var(--border-grid)', padding: '40px 20px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.01)' }}>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Drop ledger image here or <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>browse files</span></p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      SOURCE IMAGE WILL BE INSTANTLY DELETED TO SAVE STORAGE
                    </p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleOcrUpload} />
                </>
              )}

              {ocrProcessing && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: 'var(--text-main)', fontWeight: 700, letterSpacing: '0.05em' }}>RUNNING TRANSIENT CLOUD OCR...</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px' }}>
                    Extracting structured student ledger rows directly to memory
                  </p>
                </div>
              )}

              {ocrResults && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    padding: '10px 14px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)'
                  }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', margin: 0, fontWeight: 600 }}>
                      ✓ Cloud image processed and discarded. Identified {ocrResults.length} new rosters.
                    </p>
                  </div>

                  <table className="data-table" style={{ width: '100%', marginBottom: '12px' }}>
                    <thead>
                      <tr><th>Name</th><th>Phone Number</th><th>Generated Roll</th></tr>
                    </thead>
                    <tbody>
                      {ocrResults.map((r, i) => {
                        const activeBatch = selectedBatchFilter || batches[0]?.code || '10A'
                        const batchCount = students.filter(s => s && s.batch === activeBatch).length
                        return (
                          <tr key={i}>
                            <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>{r.name}</td>
                            <td className="monospace-data">{r.phone}</td>
                            <td className="monospace-data" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                              {generateRollNumber(activeBatch, batchCount + i + 1, students)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <div className="modal-footer" style={{ borderTop: 'none', padding: 0 }}>
                    <button className="btn btn-secondary" onClick={() => { setOcrResults(null); setShowOcrModal(false) }}>
                      Discard
                    </button>
                    <button className="btn btn-primary" onClick={handleOcrConfirm}>
                      Confirm and Ingest
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
