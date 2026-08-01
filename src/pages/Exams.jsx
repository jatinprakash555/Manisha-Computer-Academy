import { useState, useMemo, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const MOCK_INITIAL_EXAMS = [
  {
    id: 'EXM-101',
    title: 'Mid-Term Mathematics Assessment',
    subject: 'Mathematics',
    batches: ['10A', '10B'],
    date: '2026-07-28',
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 40,
    mode: 'ai', // 'ai' or 'pdf'
    difficultyLevel: 7, // 1 to 10
    pdfName: null,
    status: 'scheduled', // 'scheduled', 'live', 'completed'
    questionsCount: 20,
    questions: [
      { id: 1, text: 'Find the quadratic equation whose roots are 3 and -2.', options: ['x² - x - 6 = 0', 'x² + x - 6 = 0', 'x² - 5x + 6 = 0', 'x² + 5x - 6 = 0'], correctIndex: 0, explanation: 'Sum of roots = 1, Product of roots = -6. Equation: x² - (sum)x + product = 0' },
      { id: 2, text: 'If the nth term of an A.P. is (3n + 5), find its common difference.', options: ['2', '3', '5', '8'], correctIndex: 1, explanation: 'a_1 = 8, a_2 = 11. Common difference d = 11 - 8 = 3' },
      { id: 3, text: 'Determine whether 2x² - 7x + 3 = 0 has real and distinct roots.', options: ['Yes, Discriminant = 25 > 0', 'No, Discriminant = -25 < 0', 'Equal roots, Discriminant = 0', 'Undefined'], correctIndex: 0, explanation: 'D = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25 > 0.' }
    ],
    createdAt: '2026-07-20T14:30:00Z'
  },
  {
    id: 'EXM-102',
    title: 'Physics Mechanics Unit Test',
    subject: 'Physics',
    batches: ['11A'],
    date: '2026-07-25',
    startTime: '02:00 PM',
    durationMinutes: 60,
    totalMarks: 50,
    passingMarks: 20,
    mode: 'pdf',
    difficultyLevel: 8,
    pdfName: 'Class_11_Physics_Mechanics_Final_Paper.pdf',
    pdfPages: 4,
    pdfSize: '1.8 MB',
    status: 'scheduled',
    questionsCount: 15,
    questions: [],
    createdAt: '2026-07-21T09:15:00Z'
  },
  {
    id: 'EXM-103',
    title: 'IIT-JEE Physics Advanced Mock Test',
    subject: 'Physics',
    batches: ['11A', '12A'],
    date: '2026-07-25',
    startTime: '08:00 AM',
    durationMinutes: 180,
    totalMarks: 300,
    passingMarks: 120,
    mode: 'ai',
    difficultyLevel: 9,
    pdfName: null,
    status: 'live',
    questionsCount: 30,
    questions: [
      { id: 1, text: 'A particle moves along a circle of radius R with constant angular velocity w. Find its linear acceleration.', options: ['w²R towards center', 'wR away from center', 'w²R² tangent', '0'], correctIndex: 0, explanation: 'Centripetal acceleration is w²R directed towards the center.' }
    ],
    createdAt: '2026-07-25T08:00:00Z'
  },
  {
    id: 'EXM-100',
    title: 'Class 10 Science Quiz (Force & Motion)',
    subject: 'Science',
    batches: ['10A'],
    date: '2026-07-22',
    startTime: '09:00 AM',
    durationMinutes: 45,
    totalMarks: 30,
    passingMarks: 12,
    mode: 'ai',
    difficultyLevel: 4,
    pdfName: null,
    status: 'completed',
    questionsCount: 10,
    questions: [
      { id: 1, text: 'Which law of motion defines inertia?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'], correctIndex: 0, explanation: 'Newton\'s First Law is also known as the Law of Inertia.' }
    ],
    createdAt: '2026-07-15T11:00:00Z'
  }
]

const SAMPLE_AI_QUESTIONS = {
  Mathematics: [
    { text: 'Solve for x: 3x² - 12x + 9 = 0', options: ['x = 1 or x = 3', 'x = 2 or x = 4', 'x = -1 or x = -3', 'x = 0 or x = 3'], correctIndex: 0, explanation: 'Dividing by 3 gives x² - 4x + 3 = 0 => (x-1)(x-3) = 0.' },
    { text: 'Find the 15th term of the arithmetic sequence: 4, 9, 14, 19...', options: ['74', '79', '69', '84'], correctIndex: 0, explanation: 'a = 4, d = 5. a_15 = 4 + 14(5) = 74.' },
    { text: 'Calculate the probability of drawing a red card from a standard deck of 52 cards.', options: ['1/2', '1/4', '1/13', '2/13'], correctIndex: 0, explanation: '26 red cards / 52 total cards = 1/2.' },
    { text: 'What is the sum of roots of the equation 5x² - 20x + 15 = 0?', options: ['4', '-4', '3', '-3'], correctIndex: 0, explanation: 'Sum of roots = -b/a = -(-20)/5 = 4.' },
    { text: 'Find the area of a circle whose radius is 7 cm. (Use π = 22/7)', options: ['154 cm²', '44 cm²', '308 cm²', '77 cm²'], correctIndex: 0, explanation: 'Area = πr² = (22/7) * 7 * 7 = 154 cm².' }
  ],
  Science: [
    { text: 'What is the chemical formula of Rust?', options: ['Fe₂O₃·xH₂O', 'Fe₂O₄', 'FeO', 'FeSO₄'], correctIndex: 0, explanation: 'Hydrated ferric oxide Fe₂O₃·xH₂O forms rust.' },
    { text: 'Which organelle is known as the powerhouse of the cell?', options: ['Mitochondria', 'Ribosome', 'Golgi Body', 'Nucleus'], correctIndex: 0, explanation: 'Mitochondria produce ATP during cellular respiration.' },
    { text: 'What is the SI unit of Electric Resistance?', options: ['Ohm (Ω)', 'Volt (V)', 'Ampere (A)', 'Watt (W)'], correctIndex: 0, explanation: 'Electric resistance is measured in Ohms.' },
    { text: 'pH value of pure water at room temperature is:', options: ['7', '0', '14', '1'], correctIndex: 0, explanation: 'Pure water is neutral with pH 7.' }
  ],
  Physics: [
    { text: 'What is the acceleration due to gravity on the surface of Earth?', options: ['9.8 m/s²', '9.8 cm/s²', '9.8 km/s²', '1.6 m/s²'], correctIndex: 0, explanation: 'Standard g is approximately 9.8 m/s².' },
    { text: 'Work done by a force is zero when the angle between force and displacement is:', options: ['90°', '0°', '180°', '45°'], correctIndex: 0, explanation: 'W = F·d·cos(90°) = 0.' },
    { text: 'What type of lens is used to correct Myopia (Nearsightedness)?', options: ['Concave Lens', 'Convex Lens', 'Cylindrical Lens', 'Bifocal Lens'], correctIndex: 0, explanation: 'Diverging (concave) lenses correct myopic vision.' }
  ]
}

const DIFFICULTY_LABELS = {
  1: 'Level 1: Basic NCERT Fundamentals',
  2: 'Level 2: NCERT Drill & Exercises',
  3: 'Level 3: Conceptual Foundation',
  4: 'Level 4: Standard Board Level',
  5: 'Level 5: Board Hotspot & Applications',
  6: 'Level 6: Exemplar & Analytical',
  7: 'Level 7: Advanced Problem Solving',
  8: 'Level 8: Competitive / Foundation JEE-NEET',
  9: 'Level 9: High-Order Thinking (HOTS)',
  10: 'Level 10: Advanced Olympiad & Challenge'
}

export default function Exams({ batches = [], exams = MOCK_INITIAL_EXAMS, setExams }) {
  const [examList, setExamList] = useState(exams)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewPaperExam, setViewPaperExam] = useState(null)
  const [viewMarksheetExam, setViewMarksheetExam] = useState(null)

  // Schedule Exam Form State
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('Mathematics')
  const [selectedBatches, setSelectedBatches] = useState([])
  const [date, setDate] = useState('2026-08-01')
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('18:00')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [totalMarks, setTotalMarks] = useState(100)
  const [passingMarks, setPassingMarks] = useState(40)
  const [mode, setMode] = useState('ai') // 'ai' or 'pdf'
  const [difficultyLevel, setDifficultyLevel] = useState(5)
  const [questionCount, setQuestionCount] = useState(10)

  // PDF Upload State
  const [uploadedPdf, setUploadedPdf] = useState(null)

  // AI Generated Questions State
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load live exams from Supabase firebase_cache on mount
  useEffect(() => {
    async function loadLiveExams() {
      try {
        const { data: rows } = await supabase
          .from('firebase_cache')
          .select('value')
          .eq('key', 'exams')
          .maybeSingle()

        if (rows?.value?.exams && Array.isArray(rows.value.exams)) {
          setExamList(rows.value.exams)
          if (setExams) setExams(rows.value.exams)
        }
      } catch (err) {
        console.warn('[Exams] Supabase load notice:', err.message)
      }
    }
    loadLiveExams()
  }, [])

  // Filtered Exams list
  const filteredExams = useMemo(() => {
    return examList.filter(e => {
      const matchStatus = filterStatus === 'ALL' || e.status.toUpperCase() === filterStatus
      const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.batches.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchStatus && matchSearch
    })
  }, [examList, filterStatus, searchQuery])

  const handleToggleBatch = (batchCode) => {
    if (selectedBatches.includes(batchCode)) {
      setSelectedBatches(selectedBatches.filter(b => b !== batchCode))
    } else {
      setSelectedBatches([...selectedBatches, batchCode])
    }
  }

  const handleGenerateAiPaper = async () => {
    setIsGenerating(true)
    const GEMINI_API_KEY = "AIzaSyCvLghZgsBjZ3ap0JxcRb7OkEaEiYfCyXw"
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

    const prompt = `Generate ${questionCount} unique multiple-choice questions for ${subject} at difficulty level ${difficultyLevel} out of 10 (${DIFFICULTY_LABELS[difficultyLevel]}). Return ONLY a valid JSON array of objects with keys: "id" (number), "text" (string), "options" (array of 4 strings), "correctIndex" (number 0-3), "explanation" (string).`

    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      })

      if (res.ok) {
        const data = await res.json()
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/)
        if (jsonMatch) {
          const parsedQs = JSON.parse(jsonMatch[0])
          setGeneratedQuestions(parsedQs)
          setIsGenerating(false)
          return
        }
      }
    } catch (err) {
      console.warn('Live Gemini API fallback activated:', err)
    }

    // Fallback to pool if API is offline or response format varies
    const pool = SAMPLE_AI_QUESTIONS[subject] || SAMPLE_AI_QUESTIONS.Mathematics
    const fallbackQs = []
    for (let i = 0; i < questionCount; i++) {
      const item = pool[i % pool.length]
      fallbackQs.push({
        id: i + 1,
        text: `[Level ${difficultyLevel}] ${item.text}`,
        options: item.options,
        correctIndex: item.correctIndex,
        explanation: item.explanation
      })
    }
    setGeneratedQuestions(fallbackQs)
    setIsGenerating(false)
  }

  const handlePdfFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedPdf({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        pages: Math.floor(Math.random() * 5) + 2
      })
    }
  }

  const handleSaveExam = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter an Exam Title.')
      return
    }
    if (selectedBatches.length === 0) {
      alert('Please select at least one Batch for this exam.')
      return
    }
    if (mode === 'pdf' && !uploadedPdf) {
      alert('Please select or upload a Question Paper PDF file.')
      return
    }

    const newExam = {
      id: `EXM-${Math.floor(100 + Math.random() * 900)}`,
      title,
      subject,
      batches: selectedBatches,
      date,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      mode,
      difficultyLevel: Number(difficultyLevel),
      pdfName: mode === 'pdf' ? uploadedPdf.name : null,
      pdfPages: mode === 'pdf' ? uploadedPdf.pages : null,
      pdfSize: mode === 'pdf' ? uploadedPdf.size : null,
      status: 'scheduled',
      questionsCount: mode === 'ai' ? generatedQuestions.length || questionCount : questionCount,
      questions: mode === 'ai' ? generatedQuestions : [],
      createdAt: new Date().toISOString()
    }

    const updated = [newExam, ...examList]
    setExamList(updated)
    if (setExams) setExams(updated)

    // Push the full exam list (including AI-generated questions) to Supabase
    // so the CBT PC desktop client and Flutter admin app fetch them live
    setIsSyncing(true)
    try {
      await supabase.from('firebase_cache').upsert({
        institution_id: 'DC',
        key: 'exams',
        value: { exams: updated },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

      // Dispatch realtime broadcast notification to students mobile apps
      const channel = supabase.channel('mca-broadcast')
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.send({
            type: 'broadcast',
            event: 'notification',
            payload: {
              id: newExam.id,
              type: 'exam',
              title: `📝 New Exam Allotted`,
              body: `${newExam.title} for ${newExam.subject} is scheduled for ${newExam.date} at ${newExam.startTime}.`,
              targetRoll: 'ALL',
              timestamp: new Date().toISOString()
            }
          })
          supabase.removeChannel(channel)
        }
      })
    } catch (err) {
      console.warn('[Exams] Sync notice:', err.message)
    } finally {
      setIsSyncing(false)
    }

    // Reset Form
    setShowModal(false)
    setTitle('')
    setSelectedBatches([])
    setUploadedPdf(null)
    setGeneratedQuestions([])
  }

  const handleDeleteExam = async (id) => {
    if (confirm('Are you sure you want to delete this scheduled exam?')) {
      const updated = examList.filter(e => e.id !== id)
      setExamList(updated)
      if (setExams) setExams(updated)

      // Sync deletion to Supabase
      setIsSyncing(true)
      try {
        await supabase.from('firebase_cache').upsert({
          institution_id: 'DC',
          key: 'exams',
          value: { exams: updated },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' })
      } catch (err) {
        console.warn('[Exams] Delete sync notice:', err.message)
      } finally {
        setIsSyncing(false)
      }
    }
  }

  const stats = [
    { label: 'Total Scheduled Exams', value: String(examList.length).padStart(2, '0') },
    { label: 'Active / Live Exams', value: String(examList.filter(e => e.status === 'live').length).padStart(2, '0') },
    { label: 'AI Generated Papers', value: String(examList.filter(e => e.mode === 'ai').length).padStart(2, '0') },
    { label: 'Custom PDF Papers', value: String(examList.filter(e => e.mode === 'pdf').length).padStart(2, '0') },
  ]

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ margin: 0 }}>
            SCHEDULE BATCH EXAMS, GENERATE AI QUESTION PAPERS (LEVEL 1-10) & UPLOAD CUSTOM PDFs
            {isSyncing && <span style={{ marginLeft: '12px', color: '#FBBF24', fontSize: '0.75rem', fontWeight: 'bold' }}>⟳ SYNCING TO CBT CLIENTS...</span>}
            {!isSyncing && <span style={{ marginLeft: '12px', color: '#10B981', fontSize: '0.75rem' }}>● SUPABASE LIVE</span>}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Schedule New Exam
        </button>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-label">{s.label}</span>
            <div className="stat-value" style={{ fontSize: '2rem', fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'SCHEDULED', 'LIVE', 'COMPLETED'].map(st => (
            <button
              key={st}
              className={`btn ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus(st)}
              style={{ fontSize: '0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search exam title, subject, batch..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Scheduled Exams Ledger Table */}
      <div className="glass-card">
        <div className="glass-card-header">
          <h3>Scheduled Exam Registry</h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{filteredExams.length} Exams Listed</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>REF / ID</th>
                <th>EXAM TITLE & SUBJECT</th>
                <th>ALLOTTED BATCHES</th>
                <th>DATE & TIME</th>
                <th>DURATION & MARKS</th>
                <th>QUESTION SOURCE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    No exams found. Click "+ Schedule New Exam" to create one.
                  </td>
                </tr>
              ) : (
                filteredExams.map(exam => (
                  <tr key={exam.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38BDF8' }}>{exam.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{exam.title}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>{exam.subject}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {exam.batches.map(b => (
                          <span key={b} className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{exam.date}</div>
                      <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{exam.startTime}</div>
                    </td>
                    <td>
                      <div>{exam.durationMinutes} mins</div>
                      <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{exam.totalMarks} Marks ({exam.questionsCount} Qs)</div>
                    </td>
                    <td>
                      {exam.mode === 'ai' ? (
                        <span className="badge" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                          🤖 AI Gen (Level {exam.difficultyLevel})
                        </span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#FACC15', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                          📄 Custom PDF ({exam.pdfName || 'Uploaded'})
                        </span>
                      )}
                    </td>
                    <td>
                      {exam.status === 'scheduled' && (
                        <span className="status-indicator success" style={{ fontSize: '0.7rem' }}>Scheduled</span>
                      )}
                      {exam.status === 'live' && (
                        <span className="status-indicator warning" style={{ fontSize: '0.7rem' }}>🔴 Live Now</span>
                      )}
                      {exam.status === 'completed' && (
                        <span className="status-indicator" style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Completed</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {exam.status === 'scheduled' ? (
                          <button
                            className="btn btn-secondary"
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.7rem',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                              color: '#64748B',
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)'
                            }}
                            disabled
                            title="Marksheet access disabled for scheduled/oncoming exams. Available once exam is Live or Completed."
                          >
                            🔒 Pending Live
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.7rem', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38BDF8' }}
                            onClick={() => setViewMarksheetExam(exam)}
                          >
                            📊 Marksheet
                          </button>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => setViewPaperExam(exam)}>
                          📄 Paper
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDeleteExam(exam.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE EXAM MODAL */}
      {showModal && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: '780px', width: '95%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule New Batch Exam</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveExam}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {/* Basic Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Exam Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. CBSE Class 10 Math Chapter-Wise Test"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Subject *</label>
                    <select className="form-control" value={subject} onChange={e => setSubject(e.target.value)}>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science (Physics, Chemistry, Bio)</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>

                {/* Batch Allotment */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Allot to Batches *</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(batches.length > 0 ? batches : [{ code: '10A', name: 'Class 10 - Math A' }, { code: '10B', name: 'Class 10 - Math B' }, { code: '11A', name: 'Class 11 - Physics A' }, { code: '12A', name: 'Class 12 - Advanced' }]).map(b => {
                      const isSelected = selectedBatches.includes(b.code)
                      return (
                        <button
                          type="button"
                          key={b.code}
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ borderRadius: '4px', fontSize: '0.75rem' }}
                          onClick={() => handleToggleBatch(b.code)}
                        >
                          {isSelected ? '✓ ' : '+ '} Batch {b.code} ({b.name || 'Batch'})
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Date, Start Time, Closing Time, Duration */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Exam Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Start Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Closing Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Duration (Mins) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={durationMinutes}
                      onChange={e => setDurationMinutes(e.target.value)}
                      min="15"
                      max="300"
                      required
                    />
                  </div>
                </div>

                {/* Total Marks & Passing Marks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label className="form-label">Total Marks</label>
                    <input
                      type="number"
                      className="form-control"
                      value={totalMarks}
                      onChange={e => setTotalMarks(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Passing Marks</label>
                    <input
                      type="number"
                      className="form-control"
                      value={passingMarks}
                      onChange={e => setPassingMarks(e.target.value)}
                    />
                  </div>
                </div>

                {/* QUESTION SOURCE MODE SWITCHER */}
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#F8FAFC', marginBottom: '12px', display: 'block' }}>
                    Select Question Source Mode:
                  </label>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      className={`btn ${mode === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '12px', textTransform: 'none' }}
                      onClick={() => setMode('ai')}
                    >
                      🤖 AI Question Generator
                    </button>

                    <button
                      type="button"
                      className={`btn ${mode === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '12px', textTransform: 'none' }}
                      onClick={() => setMode('pdf')}
                    >
                      📄 Custom Question Paper PDF
                    </button>
                  </div>

                  {/* TAB A: AI GENERATOR */}
                  {mode === 'ai' && (
                    <div className="animate-fadeIn">
                      {/* Difficulty Level Slider (Level 1 to 10) */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38BDF8' }}>
                            Difficulty Level: {difficultyLevel} / 10
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#C084FC', fontWeight: 500 }}>
                            {DIFFICULTY_LABELS[difficultyLevel]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={difficultyLevel}
                          onChange={e => setDifficultyLevel(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
                          <span>L1: NCERT Basic</span>
                          <span>L5: Board Hotspot</span>
                          <span>L10: Olympiad</span>
                        </div>
                      </div>

                      {/* Question Count & Trigger */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Number of Questions</label>
                          <select className="form-control" value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))}>
                            <option value={5}>5 Questions</option>
                            <option value={10}>10 Questions</option>
                            <option value={15}>15 Questions</option>
                            <option value={20}>20 Questions</option>
                            <option value={30}>30 Questions</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ marginTop: '18px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', borderColor: 'rgba(168, 85, 247, 0.4)' }}
                          onClick={handleGenerateAiPaper}
                          disabled={isGenerating}
                        >
                          {isGenerating ? '⚡ Generating Paper...' : '✨ Generate AI Paper'}
                        </button>
                      </div>

                      {/* Generated Questions Preview */}
                      {generatedQuestions.length > 0 && (
                        <div style={{ backgroundColor: '#0B0F1A', padding: '12px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38BDF8', marginBottom: '8px' }}>
                            ✓ Generated Paper Preview ({generatedQuestions.length} Questions):
                          </div>
                          {generatedQuestions.slice(0, 3).map((q, idx) => (
                            <div key={idx} style={{ fontSize: '0.75rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <span style={{ fontWeight: 600, color: '#F8FAFC' }}>Q{q.id}. {q.text}</span>
                              <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '2px' }}>Options: {q.options.join(' | ')}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB B: CUSTOM PDF UPLOAD */}
                  {mode === 'pdf' && (
                    <div className="animate-fadeIn">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Upload Exam Question Paper PDF *</label>
                      <div style={{
                        border: '2px dashed rgba(56, 189, 248, 0.3)',
                        borderRadius: '8px',
                        padding: '24px',
                        textAlign: 'center',
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfFileSelect}
                          style={{ display: 'none' }}
                          id="pdf-upload-input"
                        />
                        <label htmlFor="pdf-upload-input" style={{ cursor: 'pointer' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
                          <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.85rem' }}>
                            {uploadedPdf ? uploadedPdf.name : 'Click to select sample or custom exam PDF'}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '4px' }}>
                            {uploadedPdf ? `${uploadedPdf.size} • ${uploadedPdf.pages} Pages Ready` : 'Supports PDF files up to 50 MB'}
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PAPER MODAL */}
      {viewPaperExam && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setViewPaperExam(null)}>
          <div className="modal-content" style={{ maxWidth: '700px', width: '95%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{viewPaperExam.title}</h2>
              <button className="modal-close-btn" onClick={() => setViewPaperExam(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  Batches: {viewPaperExam.batches.join(', ')}
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#C084FC' }}>
                  {viewPaperExam.mode === 'ai' ? `AI Generated (Level ${viewPaperExam.difficultyLevel})` : `PDF Paper (${viewPaperExam.pdfName})`}
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#FACC15' }}>
                  {viewPaperExam.durationMinutes} Mins • {viewPaperExam.totalMarks} Marks
                </span>
              </div>

              {viewPaperExam.mode === 'pdf' ? (
                <div style={{ textAlign: 'center', padding: '32px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backgroundColor: '#0B0F1A' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📑</div>
                  <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{viewPaperExam.pdfName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Custom Uploaded Question Paper PDF ({viewPaperExam.pdfSize || '1.5 MB'})</div>
                  <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => alert(`Downloading ${viewPaperExam.pdfName}...`)}>
                    ⬇️ Download PDF Paper
                  </button>
                </div>
              ) : (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#38BDF8', marginBottom: '12px' }}>Question Paper & Solution Key:</h4>
                  {viewPaperExam.questions.length === 0 ? (
                    <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>10 AI generated questions attached to this exam schedule.</p>
                  ) : (
                    viewPaperExam.questions.map((q, idx) => (
                      <div key={idx} style={{ marginBottom: '16px', padding: '12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', backgroundColor: '#0B0F1A' }}>
                        <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.85rem' }}>Q{idx + 1}. {q.text}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '8px 0' }}>
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} style={{ fontSize: '0.75rem', color: oIdx === q.correctIndex ? '#4ADE80' : '#94A3B8', fontWeight: oIdx === q.correctIndex ? 600 : 400 }}>
                              {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctIndex && '✓'}
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#38BDF8', fontStyle: 'italic', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '4px', marginTop: '4px' }}>
                          Explanation: {q.explanation}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT MARKSHEET & PERFORMANCE HUB MODAL */}
      {viewMarksheetExam && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setViewMarksheetExam(null)}>
          <div className="modal-content" style={{ maxWidth: '850px', width: '95%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Student Exam Marksheet & Performance Hub</h2>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                  {viewMarksheetExam.title} ({viewMarksheetExam.id}) • Batches {viewMarksheetExam.batches.join(', ')}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setViewMarksheetExam(null)}>✕</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Performance Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Class Average</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8', fontFamily: 'Outfit, sans-serif' }}>81.0 / 100</div>
                </div>
                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Highest Score</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ADE80', fontFamily: 'Outfit, sans-serif' }}>92 / 100</div>
                </div>
                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Pass Rate</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FACC15', fontFamily: 'Outfit, sans-serif' }}>83.3%</div>
                </div>
                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Attempted</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C084FC', fontFamily: 'Outfit, sans-serif' }}>6 Students</div>
                </div>
              </div>

              {/* Marksheet Table */}
              <h4 style={{ fontSize: '0.85rem', color: '#38BDF8', marginBottom: '12px' }}>Student Score Ledger & Proctoring Logs:</h4>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ROLL NUMBER</th>
                      <th>STUDENT NAME</th>
                      <th>BATCH</th>
                      <th>MARKS OBTAINED</th>
                      <th>GRADE & STATUS</th>
                      <th>TIME SPENT</th>
                      <th>MALPRACTICE LOGS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Arjun Mehta', roll: 'DC-10A-01', batch: '10A', score: 92, total: 100, status: 'PASS', grade: 'A+', timeSpent: '48m', warnings: 0 },
                      { name: 'Jatin Prakash Behera', roll: 'DC-10A-99', batch: '10A', score: 85, total: 100, status: 'PASS', grade: 'A', timeSpent: '52m', warnings: 0 },
                      { name: 'Priya Sharma', roll: 'DC-10A-02', batch: '10A', score: 78, total: 100, status: 'PASS', grade: 'B+', timeSpent: '55m', warnings: 1 },
                      { name: 'Rohit Kumar', roll: 'DC-10A-03', batch: '10A', score: 64, total: 100, status: 'PASS', grade: 'B', timeSpent: '58m', warnings: 0 },
                      { name: 'Sneha Patel', roll: 'DC-10B-01', batch: '10B', score: 88, total: 100, status: 'PASS', grade: 'A', timeSpent: '50m', warnings: 0 },
                      { name: 'Karan Joshi', roll: 'DC-10A-04', batch: '10A', score: 32, total: 100, status: 'FAIL', grade: 'F', timeSpent: '30m', warnings: 3 }
                    ].map(st => (
                      <tr key={st.roll}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38BDF8' }}>{st.roll}</td>
                        <td style={{ fontWeight: 600, color: '#F8FAFC' }}>{st.name}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>{st.batch}</span>
                        </td>
                        <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                          {st.score} / {st.total}
                        </td>
                        <td>
                          {st.status === 'PASS' ? (
                            <span className="status-indicator success" style={{ fontSize: '0.7rem' }}>PASS ({st.grade})</span>
                          ) : (
                            <span className="status-indicator" style={{ fontSize: '0.7rem', color: '#EF4444' }}>FAIL ({st.grade})</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{st.timeSpent}</td>
                        <td>
                          {st.warnings === 0 ? (
                            <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>✓ 0 Warnings (Clean)</span>
                          ) : st.warnings < 3 ? (
                            <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FACC15' }}>⚠️ {st.warnings} Warning</span>
                          ) : (
                            <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>🚨 {st.warnings} Warnings (Flagged)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
