import { useState, useMemo, useEffect } from 'react'

// Generate deterministic attendance history for a student
function generateHistory(name) {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    if (d.getDay() === 0) continue // Skip Sundays
    const seed = name.charCodeAt(0) * 7 + d.getDate() * 13 + i
    data.push({
      date: d.toISOString().split('T')[0],
      present: seed % 5 !== 0,
    })
  }
  return data
}

export default function Attendance({ batches = [], students = [] }) {
  const [selectedBatch, setSelectedBatch] = useState('')

  // Set default selection when batches load
  useEffect(() => {
    if (batches.length > 0 && !selectedBatch) {
      setSelectedBatch(batches[0].id)
    }
  }, [batches, selectedBatch])

  const [attendanceMap, setAttendanceMap] = useState({})
  const [showHistoryStudent, setShowHistoryStudent] = useState(null)

  const batch = batches.find(b => b.id === selectedBatch)
  // Query students dynamically belonging to this batch code
  const batchStudents = useMemo(() => {
    return students.filter(s => s.batch === batch?.code)
  }, [students, batch])

  const today = new Date().toISOString().split('T')[0]

  const markedCount = Object.keys(attendanceMap).length
  const presentCount = Object.values(attendanceMap).filter(Boolean).length
  const absentCount = markedCount - presentCount

  const handleMark = (rollNumber, present) => {
    setAttendanceMap(prev => ({ ...prev, [rollNumber]: present }))
  }

  const bitstreamPayload = useMemo(() => {
    return batchStudents.map(s => attendanceMap[s.rollNumber] === undefined ? '_' : attendanceMap[s.rollNumber] ? '1' : '0')
  }, [attendanceMap, batchStudents])

  const allMarked = batchStudents.length > 0 && markedCount === batchStudents.length

  const stats = [
    { value: String(batchStudents.length).padStart(2, '0'), label: 'Total in Batch' },
    { value: String(presentCount).padStart(2, '0'), label: 'Present' },
    { value: String(absentCount).padStart(2, '0'), label: 'Absent' },
    { value: String(batchStudents.length - markedCount).padStart(2, '0'), label: 'Unmarked' },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0 }}>MARK AND SYNC DAILY ATTENDANCE FOR ACTIVE BATCHES</p>
        </div>
      </div>

      {/* Batch Selectors */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {batches.map(b => (
          <button
            key={b.id}
            className={`btn ${selectedBatch === b.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '0' }}
            onClick={() => { setSelectedBatch(b.id); setAttendanceMap({}) }}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Metrics Row (No Icons, Large Bold Typography) */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-label">{s.label}</span>
            <div className="stat-value" style={{ fontSize: '2rem', fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        {/* Attendance Marking Ledger */}
        <div className="glass-card">
          <div className="glass-card-header">
            <h3>{batch?.name} — {today}</h3>
            {allMarked && <span className="status-indicator success" style={{ fontSize: '0.688rem' }}>Marked</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {batchStudents.length > 0 ? (
              batchStudents.map((s) => {
                const status = attendanceMap[s.rollNumber]
                const isMarked = status !== undefined

                return (
                  <div key={s.rollNumber} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '8px 12px',
                    backgroundColor: isMarked
                      ? (status ? 'rgba(21, 128, 61, 0.03)' : 'rgba(185, 28, 28, 0.03)')
                      : 'var(--bg-main)',
                    border: `1px solid ${isMarked
                      ? (status ? 'rgba(21, 128, 61, 0.15)' : 'rgba(185, 28, 28, 0.15)')
                      : 'var(--border-grid)'}`,
                    transition: 'all 0.15s ease',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.813rem', fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</p>
                      <p className="monospace-data" style={{ color: 'var(--text-muted)' }}>{s.rollNumber}</p>
                    </div>

                    {/* Actions Row */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', borderRadius: 0 }}
                        onClick={() => setShowHistoryStudent(s)}
                        title="View student history log"
                      >
                        LOG
                      </button>
                      <button
                        onClick={() => handleMark(s.rollNumber, true)}
                        style={{
                          width: '32px', height: '32px', border: '1px solid var(--border-grid)',
                          backgroundColor: status === true ? 'var(--status-success)' : 'transparent',
                          color: status === true ? 'white' : 'var(--text-muted)',
                          cursor: 'pointer', fontSize: '0.813rem', fontWeight: 'bold', borderRadius: 0,
                        }}
                      >
                        P
                      </button>
                      <button
                        onClick={() => handleMark(s.rollNumber, false)}
                        style={{
                          width: '32px', height: '32px', border: '1px solid var(--border-grid)',
                          backgroundColor: status === false ? 'var(--status-error)' : 'transparent',
                          color: status === false ? 'white' : 'var(--text-muted)',
                          cursor: 'pointer', fontSize: '0.813rem', fontWeight: 'bold', borderRadius: 0,
                        }}
                      >
                        A
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.813rem' }}>
                NO STUDENTS ENROLLED IN THIS BATCH
              </p>
            )}
          </div>
        </div>

        {/* Sync Console & Teacher Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Console Output box */}
          <div className="glass-card">
            <div className="glass-card-header">
              <h3>SYNC METADATA LOG</h3>
            </div>
            <div className="console-box">
              <span style={{ color: 'var(--text-muted)' }}>$ sagaan-cli --sync-attendance</span>
              <p style={{ color: 'var(--status-success)' }}>&gt; Preparing bitstream serialization...</p>
              <p style={{ color: 'var(--text-main)' }}>batch_id: "{selectedBatch}"</p>
              <p style={{ color: 'var(--text-main)' }}>payload: [{bitstreamPayload.join('')}]</p>
              <p style={{ color: 'var(--text-main)' }}>bits_ready: {bitstreamPayload.filter(b => b !== '_').length}</p>
              {allMarked ? (
                <p style={{ color: 'var(--status-success)' }}>&gt; Status: READY TO TRANSMIT</p>
              ) : (
                <p style={{ color: 'var(--status-warning)' }}>&gt; Status: PENDING MARKERS</p>
              )}
            </div>
            {allMarked && (
              <button className="btn btn-primary" style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
                TRANSMIT BITSTREAM PAYLOAD
              </button>
            )}
          </div>

          <div className="glass-card">
            <div className="glass-card-header">
              <h3>BATCH OVERVIEW</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Instructor</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{batch?.teacher}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tutor Login Status</span>
                <span className="status-indicator success">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student History Modal */}
      {showHistoryStudent && (
        <div className="modal-overlay" onClick={() => setShowHistoryStudent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3>STUDENT HISTORY</h3>
              <button className="modal-close" onClick={() => setShowHistoryStudent(null)}>×</button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {showHistoryStudent.name} ({showHistoryStudent.rollNumber})
            </p>

            <div className="contrib-grid" style={{ gridTemplateColumns: 'repeat(15, 1fr)', gap: '4px' }}>
              {generateHistory(showHistoryStudent.name).map((cell, i) => (
                <div
                  key={i}
                  className={`contrib-cell ${cell.present ? 'level-4' : 'level-0'}`}
                  title={`${cell.date}: ${cell.present ? 'Present' : 'Absent'}`}
                  style={{ width: '100%', height: '18px' }}
                />
              ))}
            </div>

            <div className="contrib-legend" style={{ marginTop: '16px' }}>
              <div className="contrib-cell level-0" style={{ width: '10px', height: '10px' }} /> Absent
              <div style={{ width: '12px' }} />
              <div className="contrib-cell level-4" style={{ width: '10px', height: '10px' }} /> Present
            </div>

            {(() => {
              const history = generateHistory(showHistoryStudent.name)
              const presentDays = history.filter(d => d.present).length
              const pct = Math.round((presentDays / history.length) * 100)
              return (
                <div style={{
                  marginTop: '16px', padding: '10px',
                  border: '1px solid var(--border-grid)',
                  backgroundColor: pct >= 85 ? 'rgba(21, 128, 61, 0.02)' : 'rgba(180, 83, 9, 0.02)',
                }}>
                  <p style={{ fontSize: '0.75rem', color: pct >= 85 ? 'var(--status-success)' : 'var(--status-warning)' }}>
                    Attendance Rate: <strong>{pct}%</strong> ({presentDays}/{history.length} days)
                  </p>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
