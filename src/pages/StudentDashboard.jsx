import { useState } from 'react'

export default function StudentDashboard({ student, onSignOut, theme }) {
  // Extract student details and stats with fallback mock values matching Android LocalStore defaults
  const roll = student.rollNumber || 'DC-10A-01'
  const name = student.name || 'Scholar'
  const batch = student.batch || '10A'
  const email = student.email || 'scholar@manishaacademy.edu'
  const phone = student.phone || '+919861487672'
  const joiningMonth = student.joiningMonth || 'March 2026'
  const avatar = student.avatar?.replace('/src/assets/', '/') || '/student_avatar.png'

  // Retrieve Supabase synced student stats
  const stats = student.stats || {
    total_xp: 340,
    streak_counter: 7,
    questions_solved_correctly: 33,
    quizzes_attended: 0,
    average_accuracy: 78.57,
    rank: 2,
    ai_credits: 150
  }

  const calculatedLevel = Math.floor((stats.total_xp || 0) / 500) + 1

  return (
    <div className={`student-dashboard-wrapper ${theme === 'light' ? 'light-notebook' : 'dark-blackboard'}`} style={{ padding: '30px', fontFamily: "'Outfit', sans-serif", minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: theme === 'light' ? '#1E3A8A' : '#FBBF24', margin: 0 }}>
            Student Profile Cockpit
          </h1>
          <p style={{ opacity: 0.8, fontSize: '1.05rem', margin: '4px 0 0' }}>
            Welcome back, <strong>{name}</strong>! View your profile details and real-time Android game sync metrics.
          </p>
        </div>
        <button 
          onClick={onSignOut}
          style={{ 
            background: theme === 'light' ? '#EF4444' : '#B91C1C', 
            color: '#FFFFFF', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          🚪 Sign Out Session
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: STUDENT PROFILE CARD */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: theme === 'light' ? '#1E3A8A' : '#FBBF24', marginBottom: '18px' }}>
            👤 Personal Student Profile
          </h2>
          <div className="mca-custom-card" style={{ margin: 0, padding: '24px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: theme === 'light' ? '#E2E8F0' : '#1E293B', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '4.5rem',
                border: '3px solid #3B82F6'
              }}>
                👨‍🎓
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>{name}</h3>
            <span style={{ fontSize: '0.8rem', background: '#3B82F6', color: '#FFFFFF', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
              Roll Number: {roll}
            </span>

            <div style={{ marginTop: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(128,128,128,0.15)', paddingTop: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase' }}>Academic Batch</span>
                <strong style={{ fontSize: '0.95rem' }}>{batch} (Computer Class)</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase' }}>Email Address</span>
                <strong style={{ fontSize: '0.95rem' }}>{email}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase' }}>Contact Number</span>
                <strong style={{ fontSize: '0.95rem' }}>{phone}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase' }}>Admission Joining Date</span>
                <strong style={{ fontSize: '0.95rem' }}>{joiningMonth}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANDROID SYNCED GAME METRICS & INSTALLERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* GAME METRICS SECTION */}
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: theme === 'light' ? '#1E3A8A' : '#FBBF24', marginBottom: '18px' }}>
              🎮 Android Game Sync & Gamification Stats
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              
              {/* Leaderboard Rank */}
              <div className="mca-custom-card" style={{ margin: 0, padding: '20px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Academy Rank</span>
                <strong style={{ fontSize: '1.8rem', color: '#FBBF24' }}>🏆 #{stats.rank || '2'}</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', marginTop: '6px' }}>Based on total accumulated XP.</span>
              </div>

              {/* Learning Streak */}
              <div className="mca-custom-card" style={{ margin: 0, padding: '20px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Active Streak</span>
                <strong style={{ fontSize: '1.8rem', color: '#EF4444' }}>🔥 {stats.streak_counter || '7'} Days</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', marginTop: '6px' }}>Consecutive learning days logged.</span>
              </div>

              {/* Level & XP */}
              <div className="mca-custom-card" style={{ margin: 0, padding: '20px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Experience (XP)</span>
                <strong style={{ fontSize: '1.8rem', color: '#10B981' }}>🎖️ {stats.total_xp || '340'} XP</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', marginTop: '6px' }}>Level {calculatedLevel} Scholar Rank.</span>
              </div>

              {/* Accuracy Rate */}
              <div className="mca-custom-card" style={{ margin: 0, padding: '20px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Solving Accuracy</span>
                <strong style={{ fontSize: '1.8rem', color: '#3B82F6' }}>🎯 {stats.average_accuracy || '78.57'}%</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', marginTop: '6px' }}>Percentage of correct answers.</span>
              </div>

              {/* Practice Questions */}
              <div className="mca-custom-card" style={{ margin: 0, padding: '20px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Practice Score</span>
                <strong style={{ fontSize: '1.8rem', color: '#8B5CF6' }}>✅ {stats.questions_solved_correctly || '33'} Qs</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', marginTop: '6px' }}>Correctly answered questions.</span>
              </div>

              {/* AI Credits */}
              <div className="mca-custom-card" style={{ margin: 0, padding: '20px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>AI Sandbox Tokens</span>
                <strong style={{ fontSize: '1.8rem', color: '#F59E0B' }}>⚡ {stats.ai_credits || '150'} / 150</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', marginTop: '6px' }}>Tokens for proctoring sessions.</span>
              </div>

            </div>
          </div>

          {/* APPLICATION SUITE DOWNLOADS */}
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: theme === 'light' ? '#1E3A8A' : '#FBBF24', marginBottom: '18px' }}>
              📥 Client Suite Downloads
            </h2>
            <div className="mca-custom-card" style={{ margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.85 }}>
                Launch examinations and run labs by downloading our multi-platform student clients:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* CBT PC Client */}
                <a 
                  href="/Releases/mca-exam-engine.exe" 
                  download
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    textDecoration: 'none', 
                    color: 'inherit',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1.5px solid #3B82F6',
                    background: 'rgba(59, 130, 246, 0.05)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                >
                  <div style={{ fontSize: '2.2rem' }}>💻</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>CBT Examination Client (PC)</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Download mca-exam-engine.exe</div>
                  </div>
                </a>

                {/* Android APK */}
                <a 
                  href="/Releases/mca-latest.apk" 
                  download="MCA_Student_App_Latest.apk"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    textDecoration: 'none', 
                    color: 'inherit',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1.5px solid #10B981',
                    background: 'rgba(16, 185, 129, 0.05)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'}
                >
                  <div style={{ fontSize: '2.2rem' }}>📱</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>MCA Student App (Android)</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Download latest APK release</div>
                  </div>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
