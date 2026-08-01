import { useState } from 'react'

export default function Batches({ batches = [], setBatches, onViewRegistry }) {
  const [showModal, setShowModal] = useState(false)
  const [newBatch, setNewBatch] = useState({ name: '', teacher: '', schedule: '' })

  const handleCreate = () => {
    if (!newBatch.name.trim()) return
    const nextIdNumber = batches.length + 1
    const code = `B${String(nextIdNumber).padStart(3, '0')}`
    const batch = {
      id: code,
      name: newBatch.name,
      students: 0,
      teacher: newBatch.teacher || 'Unassigned',
      schedule: newBatch.schedule || 'TBD',
      status: 'active',
      code: code,
    }
    setBatches([...batches, batch])
    setNewBatch({ name: '', teacher: '', schedule: '' })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setBatches(batches.filter(b => b.id !== id))
  }

  const totalStudents = batches.reduce((s, b) => s + b.students, 0)

  return (
    <div className="animate-fadeIn">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0 }}>{batches.length} BATCHES · {totalStudents} ENROLLED STUDENTS</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create Batch
        </button>
      </div>

      {/* Batch Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {batches.map((batch) => (
          <div className="glass-card" key={batch.id} style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
            {/* Card Content */}
            <div style={{ padding: '20px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600 }}>{batch.name}</h4>
                  <span className="monospace-data" style={{ color: 'var(--text-muted)' }}>ID: {batch.id}</span>
                </div>
                <span className={`status-indicator ${batch.status === 'active' ? 'success' : 'warning'}`}>
                  {batch.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Students</span>
                  <span className="monospace-data" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{batch.students}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Teacher</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{batch.teacher}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Schedule</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{batch.schedule}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{
              display: 'flex',
              borderTop: '1px solid var(--border-grid)',
              backgroundColor: 'rgba(0, 0, 0, 0.01)'
            }}>
              <button
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderRadius: 0,
                  border: 'none',
                  borderRight: '1px solid var(--border-grid)',
                  padding: '10px 0'
                }}
                onClick={() => onViewRegistry(batch.code)}
              >
                View Registry
              </button>
              <button
                className="btn btn-danger"
                style={{
                  width: '44px',
                  justifyContent: 'center',
                  borderRadius: 0,
                  border: 'none',
                  padding: '10px 0'
                }}
                onClick={() => handleDelete(batch.id)}
                title="Delete batch"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Batch Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Batch</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Batch Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Class 11 - Physics Batch A"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assigned Teacher</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Dr. Verma"
                    value={newBatch.teacher}
                    onChange={(e) => setNewBatch({ ...newBatch, teacher: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Schedule</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Mon/Wed/Fri 10 AM"
                    value={newBatch.schedule}
                    onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create Batch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
