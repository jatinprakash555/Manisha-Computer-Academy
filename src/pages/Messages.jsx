import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Messages({ students = [] }) {
  const [messages, setMessages] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState('ALL')
  const [msgType, setMsgType] = useState('info') // 'info' | 'urgent' | 'exam'
  const [isSending, setIsSending] = useState(false)
  const [isChannelReady, setIsChannelReady] = useState(false)

  // Subscriptions channel reference
  useEffect(() => {
    // Setup and confirm broadcast channel
    const channel = supabase.channel('mca-broadcast')
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsChannelReady(true)
      } else {
        setIsChannelReady(false)
      }
    })

    // Fetch message history from Supabase cache
    async function loadMessageHistory() {
      try {
        const { data: rows } = await supabase
          .from('firebase_cache')
          .select('value')
          .eq('key', 'announcements')
          .maybeSingle()

        if (rows?.value?.announcements && Array.isArray(rows.value.announcements)) {
          setMessages(rows.value.announcements)
        }
      } catch (err) {
        console.warn('Failed to load message history:', err.message)
      }
    }

    loadMessageHistory()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      alert('Please fill in both the title and body of the announcement.')
      return
    }

    setIsSending(true)

    const newMsg = {
      id: `MSG-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      targetRoll: target,
      targetName: target === 'ALL' ? 'All Students' : students.find(s => s.rollNumber === target)?.name || target,
      type: msgType,
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [newMsg, ...messages]

    try {
      // 1. Send via Supabase Realtime Broadcast Channel
      const channel = supabase.channel('mca-broadcast')
      await new Promise((resolve) => {
        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.send({
              type: 'broadcast',
              event: 'notification',
              payload: newMsg
            })
            resolve()
          }
        })
      })

      // 2. Save in database (firebase_cache) for persistence
      await supabase.from('firebase_cache').upsert({
        institution_id: 'DC',
        key: 'announcements',
        value: { announcements: updatedMessages },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

      setMessages(updatedMessages)
      setTitle('')
      setBody('')
      alert('🚀 Announcement dispatched and broadcast successfully!')
    } catch (err) {
      console.error('Error sending message:', err)
      alert('Error dispatching message. Check connection.')
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to revoke/delete this message?')) return

    const updatedMessages = messages.filter(m => m.id !== id)

    try {
      await supabase.from('firebase_cache').upsert({
        institution_id: 'DC',
        key: 'announcements',
        value: { announcements: updatedMessages },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

      setMessages(updatedMessages)
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0 }}>
            SEND ANNOUNCEMENTS AND URGENT ALERTS VIA SUPABASE BROADCAST CHANNELS DIRECT TO DEVICE NOTIFICATIONS
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <span className="stat-label">Total Broadcasts Sent</span>
          <span className="stat-value" style={{ fontFamily: 'monospace' }}>
            {String(messages.length).padStart(2, '0')}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Direct Student Dispatches</span>
          <span className="stat-value" style={{ fontFamily: 'monospace' }}>
            {String(messages.filter(m => m.targetRoll !== 'ALL').length).padStart(2, '0')}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Supabase Channel Status</span>
          <span className="stat-value" style={{ 
            color: isChannelReady ? '#10B981' : '#FBBF24', 
            fontSize: '1rem', 
            fontWeight: '800',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              display: 'inline-block', 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: isChannelReady ? '#10B981' : '#FBBF24',
              boxShadow: isChannelReady ? '0 0 8px #10B981' : 'none'
            }}></span>
            {isChannelReady ? 'ONLINE / BROADCAST ACTIVE' : 'CONNECTING...'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '30px' }}>
        
        {/* Left Form */}
        <div className="mca-custom-card" style={{ margin: 0, padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8', marginBottom: '20px' }}>
            📢 Dispatch New Broadcast Announcement
          </h2>

          <form onSubmit={handleSendMessage}>
            <div className="portal-form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Announcement Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lab Session Rescheduled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="portal-form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Announcement Message Body *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Type the message detail that will show as an app notification..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                required
              ></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="portal-form-group">
                <label className="form-label">Recipients / Target</label>
                <select
                  className="form-control"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option value="ALL">📢 All Students (Universal)</option>
                  {students.map(s => (
                    <option key={s.rollNumber} value={s.rollNumber}>
                      🎓 {s.name} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="portal-form-group">
                <label className="form-label">Alert Classification</label>
                <select
                  className="form-control"
                  value={msgType}
                  onChange={(e) => setMsgType(e.target.value)}
                >
                  <option value="info">🔵 General Info</option>
                  <option value="urgent">🔴 Urgent / Critical Alert</option>
                  <option value="exam">🟣 Exam / Assessment Reminder</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSending}>
              {isSending ? '🔌 Broadcasting...' : '⚡ Dispatch Real-Time Announcement'}
            </button>
          </form>
        </div>

        {/* Right Log */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px' }}>
            🕒 Sent Dispatch History
          </h2>

          <div style={{ 
            maxHeight: '460px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}>
            {messages.length === 0 ? (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.01)',
                border: '1.5px dashed var(--border-grid)',
                borderRadius: '8px',
                color: 'var(--text-muted)'
              }}>
                No broadcast history found. Sent messages will be logged here.
              </div>
            ) : (
              messages.map((msg) => {
                let badgeBg = 'rgba(56, 189, 248, 0.15)'
                let badgeColor = '#38BDF8'
                if (msg.type === 'urgent') {
                  badgeBg = 'rgba(239, 68, 68, 0.15)'
                  badgeColor = '#EF4444'
                } else if (msg.type === 'exam') {
                  badgeBg = 'rgba(168, 85, 247, 0.15)'
                  badgeColor = '#C084FC'
                }

                return (
                  <div key={msg.id} className="mca-custom-card" style={{ 
                    margin: 0, 
                    padding: '16px', 
                    borderLeft: `4px solid ${badgeColor}`,
                    background: 'rgba(13, 19, 31, 0.85)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: badgeBg, 
                        color: badgeColor, 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase'
                      }}>
                        {msg.type}
                      </span>
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Revoke
                      </button>
                    </div>

                    <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: '4px 0 2px' }}>{msg.title}</h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '4px 0 10px', lineHeight: '1.4' }}>
                      {msg.body}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      fontSize: '0.7rem', 
                      color: 'var(--text-muted)',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '8px'
                    }}>
                      <span>To: <strong>{msg.targetName}</strong></span>
                      <span>{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
