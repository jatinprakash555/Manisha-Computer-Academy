import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Versions() {
  const [androidVerName, setAndroidVerName] = useState('1.0.0')
  const [androidVerCode, setAndroidVerCode] = useState('41')
  const [androidDownload, setAndroidDownload] = useState('Sagaan_v1.0.0_b41.apk')
  const [androidNotes, setAndroidNotes] = useState('Added TTS voice synthesis, audio commentary controls, and real-time alerts.')
  
  const [pcVerName, setPcVerName] = useState('1.0.0')
  const [pcDownload, setPcDownload] = useState('sagaan-exam-engine.exe')
  const [pcNotes, setPcNotes] = useState('Initial release of Tauri native proctored examination engine.')

  const [forceUpdate, setForceUpdate] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChannelReady, setIsChannelReady] = useState(false)

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

    // Fetch current app versions from Supabase
    async function loadAppVersions() {
      try {
        const { data: rows } = await supabase
          .from('firebase_cache')
          .select('value')
          .eq('key', 'app_versions')
          .maybeSingle()

        if (rows?.value) {
          const val = rows.value
          if (val.android) {
            setAndroidVerName(val.android.versionName || '1.0.0')
            setAndroidVerCode(String(val.android.versionCode || '41'))
            setAndroidDownload(val.android.downloadName || `Sagaan_v${val.android.versionName}_b${val.android.versionCode}.apk`)
            setAndroidNotes(val.android.releaseNotes || '')
          }
          if (val.pc) {
            setPcVerName(val.pc.versionName || '1.0.0')
            setPcDownload(val.pc.downloadName || 'sagaan-exam-engine.exe')
            setPcNotes(val.pc.releaseNotes || '')
          }
          setForceUpdate(!!val.forceUpdate)
        }
      } catch (err) {
        console.warn('Failed to load app versions:', err.message)
      }
    }

    loadAppVersions()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSaveVersions = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      android: {
        versionName: androidVerName.trim(),
        versionCode: Number(androidVerCode),
        downloadName: androidDownload.trim(),
        downloadUrl: `/Releases/${androidDownload.trim()}`,
        releaseNotes: androidNotes.trim()
      },
      pc: {
        versionName: pcVerName.trim(),
        downloadName: pcDownload.trim(),
        downloadUrl: `/Releases/${pcDownload.trim()}`,
        releaseNotes: pcNotes.trim()
      },
      forceUpdate: forceUpdate,
      updatedAt: new Date().toISOString()
    }

    try {
      // 1. Save in database (firebase_cache) for persistence
      await supabase.from('firebase_cache').upsert({
        institution_id: 'DC',
        key: 'app_versions',
        value: payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

      // 2. Send via Supabase Realtime Broadcast Channel
      const channel = supabase.channel('mca-broadcast')
      await new Promise((resolve) => {
        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.send({
              type: 'broadcast',
              event: 'notification',
              payload: {
                id: `UPDATE-${Date.now()}`,
                type: 'app_update',
                title: '🔄 New Software Update Available',
                body: `Version v${androidVerName} (Build ${androidVerCode}) is ready. Click to download.`,
                versionCode: Number(androidVerCode),
                versionName: androidVerName,
                downloadUrl: `/Releases/${androidDownload.trim()}`,
                forceUpdate: forceUpdate,
                timestamp: new Date().toISOString()
              }
            })
            resolve()
          }
        })
      })

      alert('🚀 App version settings updated and broadcasted successfully!')
    } catch (err) {
      console.error('Error saving app versions:', err)
      alert('Error updating version control: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0 }}>
            MANAGE LATEST BUILDS, TOGGLE FORCE UPDATES, AND BROADCAST UPDATE ALERTS IMMEDIATELY TO STUDENT DEVICES
          </p>
        </div>
      </div>

      {/* Connection status banner */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <span className="stat-label">Current Mobile Build</span>
          <span className="stat-value" style={{ fontFamily: 'monospace' }}>
            v{androidVerName} ({androidVerCode})
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">PC Client Version</span>
          <span className="stat-value" style={{ fontFamily: 'monospace' }}>
            v{pcVerName}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Update Constraints</span>
          <span className="stat-value" style={{ 
            color: forceUpdate ? '#EF4444' : '#10B981', 
            fontSize: '1.25rem', 
            fontWeight: '800'
          }}>
            {forceUpdate ? '⚠️ MANDATORY UPGRADE' : '🟢 OPTIONAL UPGRADE'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveVersions} className="mca-custom-card" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '24px' }}>
          
          {/* Android Column */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤖 Android Mobile App release settings
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="portal-form-group">
                <label className="form-label">Version Name (e.g. 1.0.0)</label>
                <input
                  type="text"
                  className="form-control"
                  value={androidVerName}
                  onChange={(e) => setAndroidVerName(e.target.value)}
                  required
                />
              </div>
              <div className="portal-form-group">
                <label className="form-label">Version Code (e.g. 41)</label>
                <input
                  type="number"
                  className="form-control"
                  value={androidVerCode}
                  onChange={(e) => setAndroidVerCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="portal-form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">APK File Name (must match Releases folder name)</label>
              <input
                type="text"
                className="form-control"
                value={androidDownload}
                onChange={(e) => setAndroidDownload(e.target.value)}
                placeholder="Sagaan_v1.0.0_b41.apk"
                required
              />
            </div>

            <div className="portal-form-group">
              <label className="form-label">Release Highlights / Notes</label>
              <textarea
                className="form-control"
                rows="3"
                value={androidNotes}
                onChange={(e) => setAndroidNotes(e.target.value)}
                placeholder="What is new in this APK release..."
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              ></textarea>
            </div>
          </div>

          {/* PC Column */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💻 PC Exam Client release settings
            </h2>

            <div className="portal-form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Client Version Name (e.g. 1.0.0)</label>
              <input
                type="text"
                className="form-control"
                value={pcVerName}
                onChange={(e) => setPcVerName(e.target.value)}
                required
              />
            </div>

            <div className="portal-form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">PC Executable Name</label>
              <input
                type="text"
                className="form-control"
                value={pcDownload}
                onChange={(e) => setPcDownload(e.target.value)}
                required
              />
            </div>

            <div className="portal-form-group">
              <label className="form-label">Release Highlights / Notes</label>
              <textarea
                className="form-control"
                rows="3"
                value={pcNotes}
                onChange={(e) => setPcNotes(e.target.value)}
                placeholder="What is new in this PC EXE release..."
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              ></textarea>
            </div>
          </div>

        </div>

        {/* Constraints */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.08)', 
          paddingTop: '20px', 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(239, 68, 68, 0.05)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.15)'
        }}>
          <div>
            <strong style={{ display: 'block', color: '#EF4444' }}>Require Student Update Enforcements</strong>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              When enabled, older mobile versions of the Sagaan app will prompt mandatory blocks until upgraded.
            </span>
          </div>
          <input
            type="checkbox"
            checked={forceUpdate}
            onChange={(e) => setForceUpdate(e.target.checked)}
            style={{ width: '22px', height: '22px', cursor: 'pointer' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSaving}>
          {isSaving ? '💾 Broadcasting Version Changes...' : '🔄 Publish & Broadcast Version Updates'}
        </button>
      </form>
    </div>
  )
}
