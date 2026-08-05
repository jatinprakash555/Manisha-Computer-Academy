import { useState, useEffect } from 'react'

// Animated SVG Robot Icon
const RobotIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <rect x="25" y="25" width="50" height="40" rx="10" fill="#7C3AED" stroke="#4C1D95" strokeWidth="3" />
    {/* Ears/Antenna base */}
    <rect x="20" y="40" width="5" height="10" rx="2" fill="#A78BFA" />
    <rect x="75" y="40" width="5" height="10" rx="2" fill="#A78BFA" />
    {/* Antenna */}
    <line x1="50" y1="25" x2="50" y2="10" stroke="#4C1D95" strokeWidth="3" />
    <circle cx="50" cy="10" r="5" fill="#EF4444" />
    {/* Eyes */}
    <circle cx="40" cy="40" r="6" fill="#06B6D4" />
    <circle cx="40" cy="40" r="2" fill="#FFFFFF" />
    <circle cx="60" cy="40" r="6" fill="#06B6D4" />
    <circle cx="60" cy="40" r="2" fill="#FFFFFF" />
    {/* Mouth */}
    <rect x="38" y="52" width="24" height="6" rx="3" fill="#1E293B" />
    {/* Body Connections */}
    <rect x="44" y="65" width="12" height="8" fill="#D1D5DB" stroke="#4C1D95" strokeWidth="2" />
    {/* Body */}
    <rect x="20" y="73" width="60" height="24" rx="8" fill="#7C3AED" stroke="#4C1D95" strokeWidth="3" />
    {/* Light indicators on body */}
    <circle cx="35" cy="85" r="3" fill="#10B981" />
    <circle cx="50" cy="85" r="3" fill="#F59E0B" />
    <circle cx="65" cy="85" r="3" fill="#EF4444" />
  </svg>
)

// Academy Chatbot Component simulating a 200M parameter AI model loaded with institute knowledge
const AcademyChatbot = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaskar! I am the Manisha Academy AI Assistant. How can I help you today regarding our courses, admissions, timings, or internships?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Conversational Knowledge Base mapping without markdown symbols
  const knowledgeBase = [
    {
      keywords: ['course', 'syllabus', 'learn', 'subject', 'teach', 'study', 'class'],
      response: "At Manisha Computer Academy, we offer 40+ professional and academic courses. For IT certifications: OSCIT (3 months), PGDCA (12 months), and DCA (6 months). For programming: C, C++, Java, Python, HTML5, and Web Design. Advanced courses include Artificial Intelligence, Robotics, Cyber Security, Big Data, and AutoCAD. We also offer Tally Prime with GST, MS Office, and Advanced Excel. Additionally, we provide school tuition for CBSE and ICSE students from Class 1 to Class 10, covering Mathematics, Science, English, and Computer Science."
    },
    {
      keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'generative'],
      response: "Our artificial intelligence courses are highly practical and built to help you build real skills. We offer a 6-month AI and Machine Learning Specialist course and a 3-month Generative AI and LLM Engineering bootcamp. In these tracks, you will master Python programming, Scikit-Learn, neural networks, prompt engineering, and API integrations with Gemini and OpenAI."
    },
    {
      keywords: ['intern', 'internship', 'job', 'placement', 'career', 'opportunity'],
      response: "Yes, we provide hands-on internship programs in AI, Machine Learning, and Robotics lasting between 3 to 6 months. During the internship, you will work on live datasets, write scripts for embedded hardware, and build physical automated systems to gain real-world career preparation."
    },
    {
      keywords: ['fee', 'cost', 'price', 'admission', 'apply', 'join', 'register', 'enroll'],
      response: "Admissions are active! Course prices and fees depend on your specific program. For detailed pricing details, please reach out to us by email at manishacomputer2019@gmail.com, call our registrar office directly at 8260164606 or 9861487672, or visit our campus located near Nuapada Durga Mandap in Cuttack, Odisha, where our counseling team will assist you with full details."
    },
    {
      keywords: ['time', 'schedule', 'hour', 'timing', 'open', 'close', 'duration'],
      response: "Classes run from Monday to Saturday, and we offer flexible hourly batches throughout the day to fit different schedules. The registrar office is open from 8:00 AM to 1:00 PM in the morning, and 4:00 PM to 9:00 PM in the evening. We are closed on Sundays."
    },
    {
      keywords: ['address', 'location', 'where', 'map', 'cuttack', 'campus', 'phone', 'contact', 'call', 'number', 'mobile'],
      response: "Our campus is located at Nuapada, Madhupatna, near the Nuapada Durga Mandap in Cuttack, Odisha, India. You can contact us directly by phone at 8260164606 or 9861487672, or write to our registrar via email at manishacomputer2019@gmail.com."
    },
    {
      keywords: ['robot', 'hardware', 'embedded', 'arduino', 'raspberry pi'],
      response: "In our Robotics and Embedded Systems lab, you get to build and program physical systems. You will learn to wire sensors, integrate microcontrollers, and write custom scripts for Arduino and Raspberry Pi boards to automate devices."
    }
  ]

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userText = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setInput('')
    setIsTyping(true)

    // Simulate model inference time
    setTimeout(() => {
      let botResponse = "I'm not sure about that detail. Could you try asking about our courses, admissions, timings, internships, or campus address? You can also contact our registrar at 8260164606."
      const cleanText = userText.toLowerCase()

      // Simple keyword matcher
      for (const item of knowledgeBase) {
        if (item.keywords.some(k => cleanText.includes(k))) {
          botResponse = item.response
          break
        }
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }])
      setIsTyping(false)
    }, 600)
  }

  // Pre-filled questions helper
  const sendQuickQuestion = (qText) => {
    setInput(qText)
    // Trigger submit helper
    setTimeout(() => {
      const e = { preventDefault: () => {} }
      handleSend(e)
    }, 50)
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Dynamic Style Injection for Premium UI */}
      <style>{`
        .mca-chatbot-trigger {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(124, 92, 237, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mca-chatbot-trigger:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 30px rgba(124, 92, 237, 0.6);
        }
        .mca-chatbot-window {
          width: 350px;
          height: 480px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(124, 92, 237, 0.25);
          border-radius: 20px;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: popWindow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: #1E293B;
        }
        .dark-blackboard .mca-chatbot-window {
          background: rgba(15, 23, 42, 0.95);
          border-color: rgba(167, 139, 250, 0.25);
          color: #F8FAFC;
        }
        @keyframes popWindow {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .pulse-status {
          width: 8px;
          height: 8px;
          background-color: #10B981;
          border-radius: 50%;
          display: inline-block;
          position: relative;
        }
        .pulse-status::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          border: 2px solid #10B981;
          animation: pulseAnim 1.5s infinite;
        }
        @keyframes pulseAnim {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .mca-chat-suggest-btn {
          padding: 6px 12px;
          font-size: 0.72rem;
          border-radius: 12px;
          border: 1px solid rgba(124, 92, 237, 0.35);
          background: rgba(124, 92, 237, 0.05);
          color: #7C3AED;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 800;
          transition: all 0.2s ease;
        }
        .dark-blackboard .mca-chat-suggest-btn {
          border-color: rgba(167, 139, 250, 0.35);
          background: rgba(167, 139, 250, 0.05);
          color: #C084FC;
        }
        .mca-chat-suggest-btn:hover {
          background: #7C3AED;
          color: white;
          border-color: #7C3AED;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(124, 92, 237, 0.2);
        }
        .dark-blackboard .mca-chat-suggest-btn:hover {
          background: #A78BFA;
          color: #0F172A;
          border-color: #A78BFA;
        }
        .chat-scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(124, 92, 237, 0.2);
          border-radius: 3px;
        }
        .chat-scroll-area::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 92, 237, 0.4);
        }
      `}</style>

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="mca-chatbot-trigger"
          title="Open AI Assistant"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="mca-chatbot-window">
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
            padding: '14px 18px',
            color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>🤖</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 900, fontSize: '0.88rem', letterSpacing: '0.3px' }}>MCA AI Model (200M)</div>
                <div style={{ fontSize: '0.62rem', opacity: 0.9, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="pulse-status"></span> Active • Knowledge Loaded
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.25rem', cursor: 'pointer', outline: 'none', padding: '4px' }}
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-scroll-area" style={{
            flex: 1, padding: '16px',
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '12px',
            background: theme === 'light' ? '#F8FAFC' : '#0F172A'
          }}>
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={m.sender === 'bot' ? 'message-bubble-bot' : ''}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : (theme === 'light' ? '#FFFFFF' : '#334155'),
                  color: m.sender === 'user' ? 'white' : (theme === 'light' ? '#1E293B' : '#F8FAFC'),
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  fontSize: '0.82rem',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'left',
                  boxShadow: m.sender === 'bot' ? '0 3px 8px rgba(0,0,0,0.03)' : '0 4px 10px rgba(124,92,237,0.15)'
                }}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: theme === 'light' ? '#FFFFFF' : '#334155',
                color: theme === 'light' ? '#64748B' : '#94A3B8',
                padding: '10px 14px',
                borderRadius: '16px 16px 16px 0',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '0 3px 8px rgba(0,0,0,0.03)'
              }}>
                Typing...
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div style={{
            padding: '8px 12px',
            display: 'flex', gap: '6px',
            overflowX: 'auto',
            background: theme === 'light' ? '#FFFFFF' : '#1E293B',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            flexShrink: 0
          }} className="chat-scroll-area">
            <button 
              onClick={() => sendQuickQuestion('What courses do you offer?')}
              className="mca-chat-suggest-btn"
            >
              📚 Courses
            </button>
            <button 
              onClick={() => sendQuickQuestion('How to apply for AI internships?')}
              className="mca-chat-suggest-btn"
            >
              🤖 AI Internships
            </button>
            <button 
              onClick={() => sendQuickQuestion('What are the school timings?')}
              className="mca-chat-suggest-btn"
            >
              🕒 Timings
            </button>
            <button 
              onClick={() => sendQuickQuestion('Where is the campus located?')}
              className="mca-chat-suggest-btn"
            >
              📍 Location
            </button>
          </div>

          {/* Input Form */}
          <form 
            onSubmit={handleSend}
            style={{
              display: 'flex', borderTop: '1px solid rgba(0,0,0,0.05)',
              background: theme === 'light' ? '#FFFFFF' : '#1E293B',
              flexShrink: 0
            }}
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about courses, timings..."
              style={{
                flex: 1, border: 'none', padding: '12px 16px',
                fontSize: '0.82rem', outline: 'none',
                background: 'transparent', color: theme === 'light' ? '#1E293B' : '#F8FAFC'
              }}
            />
            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: 'white', border: 'none',
                padding: '0 18px', cursor: 'pointer', fontWeight: 900,
                fontSize: '0.82rem', transition: 'opacity 0.2s ease'
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

// Render the clean reconstructed PNG Logo asset generated by Gemini

// Render the clean reconstructed PNG Logo asset generated by Gemini
const McaLogo = ({ height = 75, className = "" }) => {
  return (
    <div className={`mca-logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img 
        src="/src/assets/mca_logo.png" 
        alt="Manisha Computer Academy (MCA)" 
        style={{ 
          height: `${height}px`, 
          width: 'auto', 
          display: 'block',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF', // High contrast canvas backing for slate themes
          padding: '6px 16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }} 
      />
    </div>
  )
}

export default function LandingPage({
  onLogin,
  onSignUp,
  onGoogleSignIn,
  onDemoLogin,
  authError,
  authLoading,
  theme,
  onToggleTheme
}) {
  const [authTab, setAuthTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [institution, setInstitution] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Web Navigation Active Tab
  const [activeTab, setActiveTab] = useState('home') // 'home' | 'about' | 'features' | 'lab' | 'contact' | 'ai'

  const robotQuotes = [
    "Hello! I am the MCA AI Companion. Did you know we offer Python & AI internships?",
    "Our Robotics Lab lets you build and code physical automated microcontrollers!",
    "Mastering prompt engineering, Gemini API, and LangChain is part of our curriculum.",
    "We provide 100% hands-on training with modern AI tools like ChatGPT and Copilot.",
    "Click me again to discover more AI features at Manisha Computer Academy!"
  ]
  const [quoteIndex, setQuoteIndex] = useState(0)

  // Auth Sign-Up States
  const [signUpStep, setSignUpStep] = useState('DETAILS') // 'DETAILS' | 'OTP_VERIFY'
  const [generatedId, setGeneratedId] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [quickInstId, setQuickInstId] = useState('')
  const [quickPass, setQuickPass] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState('')
  const [otpNotice, setOtpNotice] = useState('')

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!institution || !email) return
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    const newInstId = `MCA-${randomDigits}-2026`
    const newOtp = String(Math.floor(100000 + Math.random() * 900000))
    setGeneratedId(newInstId)
    setGeneratedOtp(newOtp)
    setOtpInput(newOtp)
    setSignUpStep('OTP_VERIFY')
    setOtpNotice(`Verification code (${newOtp}) generated. Your assigned ID is ${newInstId}.`)
  }

  const handleVerifyOtpAndSetPassword = (e) => {
    e.preventDefault()
    if (otpInput.trim() !== generatedOtp.trim()) {
      alert('Invalid OTP. Check the code and try again.')
      return
    }
    onSignUp(email, password, institution, generatedId)
  }

  const handleQuickPortalLogin = async (e) => {
    e.preventDefault()
    if (!quickInstId.trim() || !quickPass.trim()) {
      setPortalError('Please enter your Roll Number and Password.')
      return
    }
    setPortalLoading(true)
    setPortalError('')
    try {
      await onLogin(quickInstId.trim(), quickPass.trim())
    } catch (err) {
      setPortalError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setPortalLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (authTab === 'login') {
      onLogin(email, password)
    } else {
      if (signUpStep === 'DETAILS') {
        handleSendOtp(e)
      } else {
        handleVerifyOtpAndSetPassword(e)
      }
    }
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`mca-landing-container ${theme === 'light' ? 'light-notebook' : 'dark-blackboard'}`}>
      
      {/* ─── DYNAMIC STYLING INJECTION ────────────────────────────────────────── */}
      <style>{`
        .mca-landing-container {
          font-family: 'Outfit', 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          width: 100%;
          transition: background-color 0.4s ease, color 0.4s ease;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* ─── Page 1 Welcome Screen: Slate Blackboard ─── */
        .welcome-blackboard-hero {
          min-height: 100vh;
          width: 100%;
          background-color: #17202A;
          background-image: 
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 24px 24px;
          border: 18px solid #5C3A21; /* Rich wood frame border */
          box-shadow: inset 0 0 50px rgba(0,0,0,0.85), 0 10px 30px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between; /* Top header, middle body, bottom controls */
          position: relative;
          color: #FFFFFF;
          padding: 30px 24px 80px; /* Safe padding spacing */
          box-sizing: border-box;
        }

        /* Top row container for institutional badges to prevent overlap with title */
        .welcome-top-row {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          gap: 20px;
          z-index: 20;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        @media (max-width: 968px) {
          .welcome-top-row {
            justify-content: center;
          }
        }

        .blackboard-badge-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 8px 14px;
        }
        .blackboard-badge-item .badge-lbls {
          display: flex;
          flex-direction: column;
        }
        .blackboard-badge-item .badge-lbls .title-main {
          font-weight: 800;
          font-size: 0.95rem;
          color: #FEF08A; /* Chalk yellow */
        }
        .blackboard-badge-item .badge-lbls .title-sub {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.75;
        }

        /* Middle body container for central title and subtext */
        .welcome-center-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 960px;
          margin: auto;
          z-index: 10;
        }

        /* 2D chalk written title: covering 45-50% area cleanly with responsive scaling */
        .welcome-brand-2d {
          font-size: 4.8rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 2px;
          line-height: 1.15;
          margin-bottom: 16px;
          font-family: 'Outfit', 'Comic Sans MS', cursive, sans-serif;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 
            0 0 2px rgba(255, 255, 255, 0.6),
            0 0 6px rgba(255, 255, 255, 0.3),
            1px 1px 1px rgba(0, 0, 0, 0.2);
        }
        @media (max-width: 768px) {
          .welcome-brand-2d {
            font-size: 2.8rem;
          }
        }

        .welcome-brand-sub {
          font-size: 1.3rem;
          font-family: 'Serif', Georgia, serif;
          color: #FCD34D; /* Chalk yellow */
          font-style: italic;
          margin-bottom: 28px;
          text-shadow: 0 0 4px rgba(252, 211, 77, 0.4);
        }

        /* Cap on the Y layout */
        .y-cap-holder {
          position: relative;
          display: inline-block;
        }
        .academic-cap-y {
          position: absolute;
          top: -40px;
          right: -15px;
          font-size: 2.8rem;
          transform: rotate(-18deg);
          animation: floatCap 2.5s infinite ease-in-out;
        }
        @keyframes floatCap {
          0%, 100% { transform: rotate(-18deg) translateY(0); }
          50% { transform: rotate(-22deg) translateY(-6px); }
        }

        /* Office Suite Logos on the Blackboard Welcomer */
        .welcome-office-logos {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
          width: 100%;
        }
        .welcome-office-logos .office-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.65);
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
        }
        .logos-flex {
          display: flex;
          gap: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 10px 24px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .logo-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        /* Bottom Row for Scroll CTAs & chalk pieces */
        .welcome-bottom-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          z-index: 10;
          margin-top: auto;
        }

        /* Big Floating Subject Attributes (Responsive margins, hidden on mobile to prevent overlap) */
        .floating-subject {
          position: absolute;
          font-size: 1.6rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          user-select: none;
          z-index: 5;
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
          font-family: 'Outfit', 'Comic Sans MS', cursive, sans-serif;
          animation: drift 7s infinite ease-in-out;
        }
        @media (max-width: 1200px) {
          .floating-subject {
            display: none; /* Hide floating labels on small views to clear space */
          }
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }

        /* Wooden shelf with chalks/duster at the bottom */
        .chalk-shelf {
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 16px;
          background: #8B5A2B;
          border-radius: 4px 4px 0 0;
          border: 1px solid #5C3A21;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 24px;
          z-index: 15;
          box-shadow: 0 -4px 10px rgba(0,0,0,0.3);
        }
        .duster-mock {
          background: #D2B48C;
          border: 1px solid #8B5A2B;
          width: 80px;
          height: 22px;
          margin-bottom: 8px;
          border-radius: 4px;
          color: #4A3525;
          font-size: 0.65rem;
          font-weight: bold;
          text-align: center;
          line-height: 20px;
          box-shadow: 2px -2px 5px rgba(0,0,0,0.2);
        }
        .chalk-stick {
          width: 8px;
          height: 32px;
          border-radius: 2px;
          margin-bottom: 8px;
          transform: rotate(82deg);
          box-shadow: 2px -1px 3px rgba(0,0,0,0.2);
        }
        .chalk-stick.white { background: #FFFFFF; }
        .chalk-stick.yellow { background: #FEF08A; }
        .chalk-stick.blue { background: #93C5FD; }

        .welcome-enter-btn {
          border: 2.5px solid #FCD34D;
          background: transparent;
          color: #FCD34D;
          padding: 14px 32px;
          border-radius: 35px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .welcome-enter-btn:hover {
          background: #FCD34D;
          color: #17202A;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(252, 211, 77, 0.4);
        }

        /* ─── LIGHT MODE: Ruled Notebook Paper Style ─── */
        .mca-landing-container.light-notebook {
          background-color: #FAF6ED;
          color: #1F2937;
          background-image: 
            /* Red Margin line */
            linear-gradient(to right, transparent 55px, #F87171 55px, #F87171 57px, transparent 57px),
            /* Blue Ruled Lines */
            linear-gradient(to bottom, transparent 35px, #BFDBFE 35px, #BFDBFE 36px);
          background-size: 100% 100%, 100% 36px;
          background-repeat: no-repeat, repeat;
        }

        /* ─── DARK MODE: Slate Blackboard Style ─── */
        .mca-landing-container.dark-blackboard {
          background-color: #1E293B;
          color: #F8FAFC;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        /* Header layout */
        .mca-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          border-bottom: 2px dashed rgba(0,0,0,0.1);
        }
        .dark-blackboard .mca-header {
          border-bottom: 2px dashed rgba(255,255,255,0.1);
        }

        .mca-logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .theme-switcher-btn {
          background: rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.1);
          padding: 10px 20px;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.95rem;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .dark-blackboard .theme-switcher-btn {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
        }
        .theme-switcher-btn:hover {
          background: rgba(0,0,0,0.1);
        }
        .dark-blackboard .theme-switcher-btn:hover {
          background: rgba(255,255,255,0.15);
        }

        /* Academic Navigation Tabs bar */
        .mca-tabs-bar {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 20px 40px;
          border-bottom: 1.5px dashed rgba(0,0,0,0.1);
          flex-wrap: wrap;
        }
        .dark-blackboard .mca-tabs-bar {
          border-bottom-color: rgba(255,255,255,0.1);
        }
        .mca-tab-btn {
          background: transparent;
          border: none;
          color: inherit;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 10px 22px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
          opacity: 0.75;
        }
        .mca-tab-btn.active {
          opacity: 1;
          background: rgba(30, 58, 138, 0.08);
          border-bottom: 3.5px solid #1E3A8A;
        }
        .dark-blackboard .mca-tab-btn.active {
          background: rgba(251, 191, 36, 0.1);
          border-bottom-color: #FBBF24;
        }
        .mca-tab-btn:hover {
          opacity: 1;
          background: rgba(0,0,0,0.04);
        }
        .dark-blackboard .mca-tab-btn:hover {
          background: rgba(255,255,255,0.05);
        }

        /* OS-CIT Logo Emblem */
        .oscit-logo-badge {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(30, 58, 138, 0.06);
          border: 1.5px solid #1E3A8A;
          border-radius: 12px;
          padding: 14px 22px;
          width: fit-content;
          margin-bottom: 24px;
        }
        .dark-blackboard .oscit-logo-badge {
          background: rgba(251, 191, 36, 0.06);
          border-color: #FBBF24;
        }
        .oscit-badge-text {
          display: flex;
          flex-direction: column;
        }
        .oscit-badge-text .badge-main {
          font-weight: 900;
          font-size: 1.45rem;
          letter-spacing: 0.5px;
        }
        .oscit-badge-text .badge-sub {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
        }

        /* MS Office logos row */
        .ms-logos-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .ms-app-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.08);
          font-weight: 700;
          font-size: 0.8rem;
        }
        .dark-blackboard .ms-app-logo {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.08);
        }

        /* Modern Split Hero Layout (Increased text sizes) */
        .mca-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          padding: 40px 40px 60px;
        }
        @media (max-width: 968px) {
          .mca-hero-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 40px 20px;
          }
          .hero-mockup-container {
            display: none;
          }
        }

        .mca-hero-title {
          font-size: 3.2rem;
          font-weight: 950;
          line-height: 1.15;
          margin-bottom: 18px;
        }
        .light-notebook .mca-hero-title {
          color: #1E3A8A;
        }
        .dark-blackboard .mca-hero-title {
          color: #FBBF24;
        }
        .mca-hero-subtitle {
          font-size: 1.3rem;
          line-height: 1.6;
          opacity: 0.85;
          margin-bottom: 32px;
        }

        .hero-badges {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .hero-badge-item {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 750;
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.4);
        }
        .dark-blackboard .hero-badge-item {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
        }

        /* Perspective Mockup Sheet on Right */
        .hero-mockup-container {
          perspective: 1000px;
        }
        .hero-notebook-mock {
          background: #FFFFFF;
          border: 1.5px solid #D1D5DB;
          border-radius: 14px;
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.05);
          padding: 24px;
          transform: rotateY(-12deg) rotateX(8deg);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          font-family: monospace;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .dark-blackboard .hero-notebook-mock {
          background: #0F172A;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.25);
        }
        .hero-notebook-mock:hover {
          transform: rotateY(0deg) rotateX(0deg) scale(1.03);
          box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.08);
        }
        .dark-blackboard .hero-notebook-mock:hover {
          box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.35);
        }

        .mock-notebook-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #EF4444;
          padding-bottom: 8px;
          margin-bottom: 12px;
          font-weight: 700;
          font-size: 0.78rem;
          color: #EF4444;
          text-transform: uppercase;
        }
        .mock-notebook-line {
          border-bottom: 1px solid #BFDBFE;
          padding: 4px 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dark-blackboard .mock-notebook-line {
          border-bottom-color: rgba(255,255,255,0.06);
        }

        /* Card System (Increased font sizes) */
        .mca-section {
          padding: 48px 40px;
        }
        .mca-section-title {
          font-size: 2.2rem;
          font-weight: 850;
          margin-bottom: 28px;
          border-bottom: 2px solid currentColor;
          padding-bottom: 8px;
          display: inline-block;
        }

        .mca-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
          margin-bottom: 36px;
        }

        .mca-custom-card {
          border-radius: 14px;
          padding: 28px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .light-notebook .mca-custom-card {
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          box-shadow: 4px 4px 0px rgba(31, 41, 55, 0.08);
        }
        .dark-blackboard .mca-custom-card {
          background: #334155;
          border: 1.5px solid rgba(255,255,255,0.08);
          box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
        }

        .mca-custom-card:hover {
          transform: translate(-3px, -3px);
        }
        .light-notebook .mca-custom-card:hover {
          box-shadow: 7px 7px 0px rgba(31, 41, 55, 0.12);
        }
        .dark-blackboard .mca-custom-card:hover {
          box-shadow: 7px 7px 0px rgba(0,0,0,0.4);
        }

        .mca-card-icon {
          font-size: 2.4rem;
          margin-bottom: 14px;
        }
        .mca-card-title {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 10px;
        }
        .mca-card-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          opacity: 0.85;
        }

        /* Ruled-Paper Course List layout */
        .course-list-paper {
          border-radius: 12px;
          padding: 36px;
          margin-bottom: 44px;
        }
        .light-notebook .course-list-paper {
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .dark-blackboard .course-list-paper {
          background: #1E293B;
          border: 1.5px solid rgba(255,255,255,0.08);
        }

        .course-row {
          display: grid;
          grid-template-columns: 240px 1fr;
          padding: 20px 0;
          border-bottom: 1px dashed rgba(0,0,0,0.1);
        }
        .dark-blackboard .course-row {
          border-bottom-color: rgba(255,255,255,0.1);
        }
        .course-row:last-child {
          border-bottom: none;
        }
        .course-name {
          font-weight: 800;
          font-size: 1.25rem;
        }
        .course-details {
          font-size: 1.05rem;
          opacity: 0.85;
          line-height: 1.5;
        }

        /* Downloads Center */
        .downloads-table-container {
          overflow-x: auto;
          margin-bottom: 28px;
        }
        .downloads-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 1.05rem;
        }
        .downloads-table th, .downloads-table td {
          padding: 14px 18px;
          border-bottom: 1.5px solid rgba(0,0,0,0.08);
        }
        .dark-blackboard .downloads-table th, .downloads-table td {
          border-bottom-color: rgba(255,255,255,0.08);
        }
        .downloads-table th {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .sys-req-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 20px;
        }
        .sys-req-box {
          border-radius: 8px;
          padding: 20px;
        }
        .light-notebook .sys-req-box {
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
        }
        .dark-blackboard .sys-req-box {
          background: #475569;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .sys-req-title {
          font-weight: 800;
          font-size: 1.05rem;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .sys-req-list {
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
          padding-left: 20px;
        }

        /* Quick Access Portal */
        .quick-portal-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 60px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .quick-portal-box {
            grid-template-columns: 1fr;
            padding: 24px;
          }
        }
        .light-notebook .quick-portal-box {
          background: #FFFFFF;
          border: 1.5px solid #D1D5DB;
          box-shadow: 6px 6px 0px rgba(0,0,0,0.05);
        }
        .dark-blackboard .quick-portal-box {
          background: #334155;
          border: 1.5px solid rgba(255,255,255,0.08);
        }

        .portal-form-group {
          margin-bottom: 20px;
        }
        .portal-form-group label {
          display: block;
          font-weight: 800;
          font-size: 0.9rem;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .portal-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 1.05rem;
          border: 1.5px solid rgba(0,0,0,0.15);
          background: #FFFFFF;
          color: #1F2937;
          box-sizing: border-box;
        }
        .dark-blackboard .portal-input {
          border-color: rgba(255,255,255,0.15);
          background: #1E293B;
          color: #F8FAFC;
        }
        .portal-submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 1.05rem;
          border: none;
          cursor: pointer;
          background: #1E3A8A;
          color: #FFFFFF;
          transition: background 0.2s;
        }
        .dark-blackboard .portal-submit-btn {
          background: #FBBF24;
          color: #1E293B;
        }
        .portal-submit-btn:hover {
          opacity: 0.9;
        }

        .portal-info-title {
          font-size: 1.9rem;
          font-weight: 850;
          margin-bottom: 14px;
        }
        .portal-info-desc {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.85;
          margin-bottom: 24px;
        }
        .portal-pills {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .portal-pill {
          font-size: 0.8rem;
          padding: 6px 12px;
          border-radius: 12px;
          font-weight: 800;
          background: rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.1);
        }
        .dark-blackboard .portal-pill {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.1);
        }

        /* Modals & login overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content-wrapper {
          width: 90%;
          max-width: 480px;
          position: relative;
        }
        .auth-card {
          border-radius: 16px;
          padding: 36px;
          position: relative;
        }
        .light-notebook .auth-card {
          background: #FFFFFF;
          border: 2px solid #D1D5DB;
          box-shadow: 8px 8px 0px rgba(0,0,0,0.1);
          color: #1F2937;
        }
        .dark-blackboard .auth-card {
          background: #334155;
          border: 2px solid rgba(255,255,255,0.1);
          box-shadow: 8px 8px 0px rgba(0,0,0,0.4);
          color: #F8FAFC;
        }
        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: inherit;
        }
        .auth-tabs-pill {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1.5px solid rgba(0,0,0,0.1);
          padding-bottom: 8px;
        }
        .dark-blackboard .auth-tabs-pill {
          border-bottom-color: rgba(255,255,255,0.1);
        }
        .auth-tab-pill-btn {
          background: none;
          border: none;
          font-weight: 700;
          font-size: 0.95rem;
          color: inherit;
          opacity: 0.6;
          cursor: pointer;
          padding: 4px 8px;
        }
        .auth-tab-pill-btn.active {
          opacity: 1;
          border-bottom: 3px solid currentColor;
        }

        .auth-form-card label {
          display: block;
          font-weight: 700;
          font-size: 0.75rem;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .auth-error-msg {
          color: #EF4444;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        /* Footer */
        .mca-footer {
          display: flex;
          justify-content: space-between;
          padding: 40px;
          border-top: 1px dashed rgba(0,0,0,0.1);
          font-size: 0.9rem;
          opacity: 0.8;
        }
        .dark-blackboard .mca-footer {
          border-top-color: rgba(255,255,255,0.1);
        }

        /* AI & Robotics Hub Styles */
        .ai-hub-container {
          padding: 10px 0;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .ai-hero-card {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(147, 51, 234, 0.04) 100%);
          border: 2.5px solid #8B5CF6;
          padding: 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .light-notebook .ai-hero-card {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(147, 51, 234, 0.06) 100%);
          border-color: #7C3AED;
          color: #1E293B;
        }
        .dark-blackboard .ai-hero-card {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
          border-color: #A78BFA;
          color: #F8FAFC;
        }
        .ai-hero-content {
          flex: 2;
          min-width: 280px;
        }
        .ai-robot-visual {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: 200px;
        }
        .robot-interactive {
          width: 140px;
          height: 140px;
          cursor: pointer;
          animation: floatRobot 4s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .robot-interactive:hover {
          transform: scale(1.1) rotate(2deg);
        }
        @keyframes floatRobot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .robot-bubble {
          background: #FFFFFF;
          border: 2px solid #7C3AED;
          color: #1E293B;
          padding: 12px 16px;
          border-radius: 16px;
          position: relative;
          max-width: 250px;
          margin-bottom: 16px;
          font-size: 0.85rem;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          animation: popBubble 0.3s ease-out;
        }
        .dark-blackboard .robot-bubble {
          background: #1E293B;
          border-color: #A78BFA;
          color: #F8FAFC;
        }
        @keyframes popBubble {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .robot-bubble::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 45px;
          border-width: 8px 8px 0;
          border-style: solid;
          border-color: #FFFFFF transparent;
          display: block;
          width: 0;
        }
        .dark-blackboard .robot-bubble::after {
          border-color: #1E293B transparent;
        }
        .ai-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .ai-tool-card {
          background: #FFFFFF;
          border: 2px solid rgba(0,0,0,0.08);
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #1E293B;
        }
        .dark-blackboard .ai-tool-card {
          background: #1E293B;
          border-color: rgba(255,255,255,0.08);
          color: #F8FAFC;
        }
        .ai-tool-card:hover {
          border-color: #7C3AED;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .dark-blackboard .ai-tool-card:hover {
          border-color: #A78BFA;
        }
        .ai-tool-icon {
          font-size: 2rem;
        }
        .ai-tool-name {
          font-weight: 900;
          font-size: 0.85rem;
        }
      `}</style>

      {/* ─── PAGE 1: CHALKBOARD WELCOME ENTRANCE SCREEN ────────────────────────── */}
      <section className="welcome-blackboard-hero">
        
      {/* Top row containing institutional badges */}
        <div className="welcome-top-row">
          <div className="blackboard-badge-item">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#1E3A8A" stroke="#FBBF24" strokeWidth="2"/>
              <path d="M10 16L14 20L22 12" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="badge-lbls">
              <span className="title-main">OS-CIT</span>
              <span className="title-sub">Approved Center</span>
            </div>
          </div>

          <div className="blackboard-badge-item">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#047857" stroke="#FBBF24" strokeWidth="1.5"/>
              <path d="M16 6L24 11V18C24 22 19 25 16 26C13 25 8 22 8 18V11L16 6Z" fill="#FBBF24"/>
              <text x="16" y="16.5" fill="#047857" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">GOVT</text>
              <text x="16" y="21.5" fill="#047857" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">REGD</text>
            </svg>
            <div className="badge-lbls">
              <span className="title-main" style={{ color: '#34D399' }}>Govt. Registered</span>
              <span className="title-sub">Regd. No. 334/2019</span>
            </div>
          </div>

          {/* Instagram Link — top-right of blackboard */}
          <a
            href="https://www.instagram.com/manishacomputer.26?utm_source=qr&igsh=cGZ0dWlibjRsMWps"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram @manishacomputer.26"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.03em',
              boxShadow: '0 4px 16px rgba(220,39,67,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: '1.5px solid rgba(255,255,255,0.25)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,39,67,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,39,67,0.35)'; }}
          >
            {/* Instagram SVG icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
            </svg>
            @manishacomputer.26
          </a>
        </div>

        {/* Floating Academic Subject Words (Absolute left/right boundaries to prevent overlaps) */}
        <div className="floating-subject" style={{ top: '22%', left: '4%', color: '#FEF08A', fontSize: '1.9rem', animationDelay: '0s' }}>PGDCA</div>
        <div className="floating-subject" style={{ top: '24%', right: '5%', color: '#93C5FD', fontSize: '2rem', animationDelay: '1.2s' }}>Tally Prime</div>
        <div className="floating-subject" style={{ top: '48%', left: '3%', color: '#86EFAC', fontSize: '1.8rem', animationDelay: '2.5s' }}>C++ OOP</div>
        <div className="floating-subject" style={{ top: '50%', right: '4%', color: '#FDBA74', fontSize: '1.9rem', animationDelay: '3.8s' }}>HTML5</div>
        <div className="floating-subject" style={{ bottom: '22%', left: '5%', color: '#FCA5A5', fontSize: '1.8rem', animationDelay: '1.8s' }}>Web Design</div>
        <div className="floating-subject" style={{ bottom: '24%', right: '5%', color: '#C084FC', fontSize: '2rem', animationDelay: '2.9s' }}>MS Excel</div>

        {/* Center 2D Chalk Written Title & Logos container */}
        <div className="welcome-center-body">
          <h1 className="welcome-brand-2d">
            MANISHA COMPUTER ACADEM<span className="y-cap-holder">Y<span className="academic-cap-y">🎓</span></span>
          </h1>
          <p className="welcome-brand-sub">
            ~ Certified IT Studies, Double-Entry Tally, and Object-Oriented Labs ~
          </p>

          {/* MS Office Original Application Logos */}
          <div className="welcome-office-logos">
            <span className="office-title">Core MS Office Modules</span>
            <div className="logos-flex">
              <div className="logo-item">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="6" width="30" height="36" rx="4" fill="#185ABD"/>
                  <path d="M12 14H32V34H12V14Z" fill="#106EBE"/>
                  <rect x="4" y="12" width="22" height="24" rx="3" fill="#185ABD" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"/>
                  <text x="9" y="29" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="sans-serif">W</text>
                </svg>
                <span>Word</span>
              </div>
              <div className="logo-item">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="6" width="30" height="36" rx="4" fill="#107C41"/>
                  <path d="M12 14H32V34H12V14Z" fill="#107C41"/>
                  <rect x="4" y="12" width="22" height="24" rx="3" fill="#107C41" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"/>
                  <text x="10" y="29" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="sans-serif">X</text>
                </svg>
                <span>Excel</span>
              </div>
              <div className="logo-item">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="6" width="30" height="36" rx="4" fill="#C43E1C"/>
                  <path d="M12 14H32V34H12V14Z" fill="#C43E1C"/>
                  <rect x="4" y="12" width="22" height="24" rx="3" fill="#C43E1C" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"/>
                  <text x="10" y="29" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="sans-serif">P</text>
                </svg>
                <span>PowerPoint</span>
              </div>
              <div className="logo-item">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="6" width="30" height="36" rx="4" fill="#A4373A"/>
                  <path d="M12 14H32V34H12V14Z" fill="#A4373A"/>
                  <rect x="4" y="12" width="22" height="24" rx="3" fill="#A4373A" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"/>
                  <text x="10" y="29" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="sans-serif">A</text>
                </svg>
                <span>Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom controls and Enter button */}
        <div className="welcome-bottom-controls">
          <button className="welcome-enter-btn" onClick={() => scrollTo('portal-details-page')}>
            📜 Enter Academy Portal &rarr;
          </button>
        </div>

        {/* Wooden chalk shelf */}
        <div className="chalk-shelf">
          <div className="duster-mock">🧹 MCA DUSTER</div>
          <div className="chalk-stick white"></div>
          <div className="chalk-stick yellow"></div>
          <div className="chalk-stick blue"></div>
        </div>
      </section>

      {/* ─── PAGE 2: PORTAL DETAILS WITH NAVIGATION TABS ───────────────────────── */}
      <div id="portal-details-page">
        
        {/* HEADER */}
        <header className="mca-header">
          <div className="mca-logo-section">
            <McaLogo 
              height={75} 
              className="mca-portal-header-logo" 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="theme-switcher-btn" onClick={onToggleTheme}>
              {theme === 'light' ? '🎓 Blackboard Mode' : '📝 Notebook Mode'}
            </button>
            <button className="theme-switcher-btn" onClick={() => setIsModalOpen(true)}>
              🔐 Administrator Login
            </button>
          </div>
        </header>

        {/* TABS NAVIGATION BAR */}
        <nav className="mca-tabs-bar">
          <button 
            className={`mca-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            🏠 Home (Downloads)
          </button>
          <button 
            className={`mca-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            🏫 About Us
          </button>
          <button 
            className={`mca-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            ✨ OS-CIT & Study Features
          </button>
          <button 
            className={`mca-tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
            onClick={() => setActiveTab('lab')}
          >
            🧪 Hands-on Lab
          </button>
          <button 
            className={`mca-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI & Internship
          </button>
          <button 
            className={`mca-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            📞 Contact Us
          </button>
        </nav>

        {/* ─── TAB CONTENT: HOME (DOWNLOADS & HERO) ─── */}
        {activeTab === 'home' && (
          <div>
            <section className="mca-section" style={{ padding: '40px 0 20px' }}>
              <div className="mca-hero-grid">
                <div>
                  <h1 className="mca-hero-title">
                    Where Computer Literacy Meets Practical Excellence
                  </h1>
                  <p className="mca-hero-subtitle">
                    Welcome to Manisha Computer Academy's unified study and testing gateway. We offer industry-aligned professional IT certifications with optimized study courseware, step-by-step programming labs, and secure computer-based examinations.
                  </p>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    <button 
                      className="portal-submit-btn" 
                      style={{ width: 'auto', padding: '12px 24px' }}
                      onClick={() => {
                        setActiveTab('home');
                        setTimeout(() => scrollTo('software-portal'), 100);
                      }}
                    >
                      📥 Download Software Center
                    </button>
                    <button 
                      className="theme-switcher-btn" 
                      style={{ padding: '12px 24px' }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      🔐 Institutional Sign In
                    </button>
                  </div>

                  <div className="hero-badges">
                    <span className="hero-badge-item">✓ Govt. Registered Institute</span>
                    <span className="hero-badge-item">✓ 7+ Years of Excellence</span>
                    <span className="hero-badge-item">✓ Hands-on Lab Guidance</span>
                    <span className="hero-badge-item">✓ 40+ Courses Offered</span>
                    <span className="hero-badge-item">✓ CBSE &amp; ICSE Tuition (Class 1–10)</span>
                  </div>
                </div>

                <div className="hero-mockup-container">
                  <div className="hero-notebook-mock">
                    <div className="mock-notebook-header">
                      <span>MCA Lined Sheet #10</span>
                      <span>Date: 28/07/26</span>
                    </div>
                    <div className="mock-notebook-line">Topic: C++ OOP Class</div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '15px', color: '#2563EB' }}>
                      <code>#include &lt;iostream&gt;</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '15px', color: '#2563EB' }}>
                      <code>using namespace std;</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '15px' }}>
                      <code>class Academy {"{"}</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '30px' }}>
                      <code>public:</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '45px', color: '#059669' }}>
                      <code>string name = "Manisha";</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '45px' }}>
                      <code>void greet() {"{"}</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '60px', color: '#DC2626' }}>
                      <code>cout &lt;&lt; name;</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '45px' }}>
                      <code>{"}"}</code>
                    </div>
                    <div className="mock-notebook-line" style={{ paddingLeft: '15px' }}>
                      <code>{"};"}</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mca-section" id="software-portal" style={{ paddingTop: 0 }}>
              <h2 className="mca-section-title">Institute Software Downloads & Release Center</h2>
              <div className="mca-custom-card">
                <div className="downloads-table-container">
                  <table className="downloads-table">
                    <thead>
                      <tr>
                        <th>Platform / Client</th>
                        <th>Version</th>
                        <th>Release Date</th>
                        <th>Changelog / Highlights</th>
                        <th>Package File</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>MCA Student Portal APK</strong> (Android Mobile)</td>
                        <td>v1.0.0 (Build 41)</td>
                        <td>2026-07-28</td>
                        <td>Asynchronous IO parser, explicit bitmap recycling, C++ OOP masterclass courseware, and TTS progress listeners.</td>
                        <td><a href="/Releases/mca-latest.apk" download="MCA_Student_App_Latest.apk" style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>Download APK</a></td>
                      </tr>
                      <tr>
                        <td><strong>CBT Examination Client</strong> (PC App)</td>
                        <td>v1.2.0 (Build 5)</td>
                        <td>2026-07-28</td>
                        <td>Secure exam lockouts, secure database sync, and automated score uploads.</td>
                        <td><a href="/Releases/mca-exam-engine.exe" download style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>Download Installer</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sys-req-grid">
                  <div className="sys-req-box">
                    <span className="sys-req-title">💻 CBT PC Application System Specs</span>
                    <ul className="sys-req-list">
                      <li><strong>Minimum OS:</strong> Windows 10 (64-bit Edition)</li>
                      <li><strong>Processor:</strong> Dual-Core Intel Core i3 (4th Gen) or AMD equivalent</li>
                      <li><strong>System RAM:</strong> 4 GB DDR3 Memory</li>
                      <li><strong>Storage:</strong> 100 MB free hard drive disk space</li>
                      <li><strong>Recommended:</strong> Windows 10/11, Intel Core i5, 8 GB RAM, SSD Storage</li>
                    </ul>
                  </div>
                  <div className="sys-req-box">
                    <span className="sys-req-title">📱 MCA Android App System Specs</span>
                    <ul className="sys-req-list">
                      <li><strong>Minimum OS:</strong> Android 8.0 (Oreo) or higher</li>
                      <li><strong>System RAM:</strong> 2 GB active memory</li>
                      <li><strong>Storage:</strong> 50 MB free internal flash storage</li>
                      <li><strong>Audio:</strong> Active speakers or headphones (required for Text-to-Speech)</li>
                      <li><strong>Recommended:</strong> Android 10.0 or higher, 4 GB RAM</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ─── TAB CONTENT: ABOUT US ─── */}
        {activeTab === 'about' && (
          <section className="mca-section animate-fade">
            <h2 className="mca-section-title">About Manisha Computer Academy & Classes</h2>
            <div className="mca-custom-card" style={{ padding: '36px', lineHeight: '1.8' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: theme === 'light' ? '#1E3A8A' : '#FBBF24', marginBottom: '16px' }}>
                Institute Introduction
              </h3>
              <p style={{ fontSize: '1.15rem', opacity: 0.95, marginBottom: '24px' }}>
                Manisha Computer Academy & Classes is a leading computer training institute dedicated to providing quality education and practical skills to students. Our mission is to empower learners with the knowledge and confidence required to succeed in today's digital world.
              </p>
              
              <div style={{ borderLeft: '4px solid #7C3AED', paddingLeft: '20px', margin: '24px 0', background: 'rgba(124, 92, 237, 0.03)', padding: '16px 20px', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 850, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Wide Range of Professional & Career-Oriented Courses:
                </h4>
                <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9 }}>
                  We offer <strong>40+ courses</strong> spanning professional IT, academics, and skill development:
                </p>
                <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '2', fontSize: '1.05rem', opacity: 0.9 }}>
                  <li>🎓 <strong>IT Certifications:</strong> OSCIT, PGDCA, DCA</li>
                  <li>📊 <strong>Accounting & Commerce:</strong> Tally Prime with GST, Advanced Excel</li>
                  <li>💻 <strong>Office Suite:</strong> MS Office (Word, Excel, PowerPoint, Access)</li>
                  <li>🖥️ <strong>Programming:</strong> C, C++, Java, Python, HTML5, Web Design</li>
                  <li>🤖 <strong>Advanced Tech:</strong> Artificial Intelligence (AI), Robotics, Cyber Security, Big Data, AutoCAD</li>
                  <li>🏫 <strong>School Tuition (CBSE &amp; ICSE):</strong> Mathematics, Science, English &amp; Computer Science for Class 1 to Class 10</li>
                </ul>
              </div>

              <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '24px' }}>
                Our experienced faculty members focus on practical learning, individual guidance, and industry-relevant training to help students build successful careers. At Manisha Computer Academy & Classes, we believe in creating a friendly learning environment where every student can develop technical skills and achieve their career goals.
              </p>

              <div style={{ textAlign: 'center', marginTop: '32px', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(124, 92, 237, 0.05) 100%)', padding: '24px', borderRadius: '12px', border: '1.5px dashed var(--brand-accent)' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: theme === 'light' ? '#1E3A8A' : '#FEF08A' }}>
                  ✨ Join us and take the first step towards a brighter future with quality education, practical knowledge, and professional excellence.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ─── TAB CONTENT: AI & INTERNSHIPS ─── */}
        {activeTab === 'ai' && (
          <section className="mca-section animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="mca-section-title">AI & Robotics Hub</h2>
            
            <div className="ai-hero-card">
              <div className="ai-hero-content">
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '14px', color: theme === 'light' ? '#1E3A8A' : '#FEF08A' }}>
                  Empowering the Next Generation of AI Professionals
                </h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>
                  At Manisha Computer Academy & Classes, we prepare our students for the future of tech. Our advanced Artificial Intelligence (AI) courses, Python Machine Learning bootcamps, and robotics internships provide learners with industry-relevant certifications, individual guidance, and hands-on laboratory implementation.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <span className="hero-badge-item" style={{ background: '#7C3AED', color: 'white', border: 'none' }}>✓ Hands-on Internships</span>
                  <span className="hero-badge-item">✓ Robotics Lab Access</span>
                  <span className="hero-badge-item">✓ AI Tools Mastery</span>
                </div>
              </div>
              <div className="ai-robot-visual">
                <div className="robot-bubble">
                  {robotQuotes[quoteIndex]}
                </div>
                <div 
                  className="robot-interactive" 
                  onClick={() => setQuoteIndex(prev => (prev + 1) % robotQuotes.length)}
                  title="Click me to chat!"
                >
                  <RobotIcon />
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '8px', fontWeight: 700 }}>
                  🤖 Click the robot to interact!
                </span>
              </div>
            </div>

            <h3 className="mca-section-title" style={{ marginTop: '24px', marginBottom: '0' }}>AI Courses & Internship Opportunities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              
              <div className="mca-custom-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid #7C3AED', background: '#FFFFFF', color: '#1E293B', padding: '24px', borderRadius: '12px' }}>
                <div>
                  <span className="portal-pill" style={{ background: 'rgba(124,92,237,0.1)', color: '#7C3AED', alignSelf: 'flex-start', marginBottom: '12px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 900 }}>Training & Internship</span>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '8px 0', color: '#1E3A8A' }}>AI & Machine Learning (Specialist)</h4>
                  <p style={{ opacity: 0.85, fontSize: '0.95rem', lineHeight: '1.5', margin: '8px 0' }}>
                    Master Python data libraries (NumPy, Pandas), Scikit-Learn algorithms, neural networks, and model deployment. Includes projects on regression, computer vision, and NLP.
                  </p>
                </div>
                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span>Duration: 6 Months</span>
                  <span style={{ color: '#7C3AED' }}>Practical Projects</span>
                </div>
              </div>

              <div className="mca-custom-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid #EC4899', background: '#FFFFFF', color: '#1E293B', padding: '24px', borderRadius: '12px' }}>
                <div>
                  <span className="portal-pill" style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899', alignSelf: 'flex-start', marginBottom: '12px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 900 }}>Professional Boot Camp</span>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '8px 0', color: '#BE185D' }}>Generative AI & LLM Engineering</h4>
                  <p style={{ opacity: 0.85, fontSize: '0.95rem', lineHeight: '1.5', margin: '8px 0' }}>
                    Learn Prompt Engineering, Gemini/OpenAI API integrations, LangChain framework, vector databases, and building RAG (Retrieval-Augmented Generation) applications.
                  </p>
                </div>
                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span>Duration: 3 Months</span>
                  <span style={{ color: '#EC4899' }}>API Mastery</span>
                </div>
              </div>

              <div className="mca-custom-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid #10B981', background: '#FFFFFF', color: '#1E293B', padding: '24px', borderRadius: '12px' }}>
                <div>
                  <span className="portal-pill" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', alignSelf: 'flex-start', marginBottom: '12px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 900 }}>Hardware Lab</span>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '8px 0', color: '#047857' }}>Robotics & Embedded Systems</h4>
                  <p style={{ opacity: 0.85, fontSize: '0.95rem', lineHeight: '1.5', margin: '8px 0' }}>
                    Build automated systems using Arduino & Raspberry Pi. Wire sensors, configure microcontrollers, and write code to control physical mechanical hardware modules.
                  </p>
                </div>
                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span>Duration: 6 Months</span>
                  <span style={{ color: '#10B981' }}>Hands-on Physical</span>
                </div>
              </div>

            </div>

            <h3 className="mca-section-title" style={{ marginTop: '24px', marginBottom: '0' }}>AI Tools Taught & Practiced</h3>
            <div className="ai-tools-grid">
              <div className="ai-tool-card">
                <span className="ai-tool-icon">🧠</span>
                <span className="ai-tool-name">Gemini / GPT</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-icon">💻</span>
                <span className="ai-tool-name">GitHub Copilot</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-icon">🎨</span>
                <span className="ai-tool-name">Stable Diffusion</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-icon">🔬</span>
                <span className="ai-tool-name">TensorFlow</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-icon">🤖</span>
                <span className="ai-tool-name">ROS / Arduino</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-icon">⛓️</span>
                <span className="ai-tool-name">LangChain</span>
              </div>
            </div>
          </section>
        )}

        {/* ─── TAB CONTENT: FEATURES & OS-CIT LEARNING ─── */}
        {activeTab === 'features' && (
          <section className="mca-section animate-fade">
            <h2 className="mca-section-title">Courses, OS-CIT Learning &amp; Student Benefits</h2>
            <p style={{ fontSize: '1.05rem', opacity: 0.85, marginBottom: '18px' }}>
              Manisha Computer Academy offers <strong>40+ courses</strong> — from professional IT certifications to school tuition for <strong>CBSE &amp; ICSE students (Class 1–10)</strong>.
            </p>
            
            {/* OS-CIT Emblem Logo Badge */}
            {/* OS-CIT Emblem Logo Badge */}
            <div className="oscit-logo-badge" style={{ marginBottom: '14px' }}>
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#1E3A8A" stroke="#FBBF24" strokeWidth="2"/>
                <path d="M10 16L14 20L22 12" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="oscit-badge-text">
                <span className="badge-main" style={{ color: theme === 'light' ? '#1E3A8A' : '#FBBF24' }}>OS-CIT</span>
                <span className="badge-sub">Odisha IT Literacy Course</span>
              </div>
            </div>

            {/* ─── EXACT BANNER CARDS: OS-CIT PROGRAMS ─── */}
            <div className="oscit-banner-title" style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '22px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme === 'light' ? '#1E3A8A' : '#FEF08A' }}>
              Learn Basic to Advanced New Age Digital Skills!
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
              gap: '24px', 
              marginBottom: '36px' 
            }}>
              
              {/* Card 1: OS-CIT */}
              <div style={{ 
                background: '#FFFFFF', 
                border: '3px solid #EA580C', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                color: '#1E293B',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.65rem', fontWeight: 900, background: '#EFF6FF', color: '#1E3A8A', padding: '3px 8px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  ⚡ AI POWERED
                </div>
                <div style={{ padding: '30px 20px 20px' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#EA580C', fontFamily: "'Impact', sans-serif", letterSpacing: '1px' }}>
                    OS-CIT®
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '12px 0 6px', color: '#334155', lineHeight: '1.4' }}>
                    Odisha State-Certificate In Information Technology
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                    Authorized OKCL IT Literacy Course
                  </div>
                </div>
                <div style={{ background: '#1E3A8A', color: '#FFFFFF', padding: '10px', fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Duration : 3 Months
                </div>
              </div>

              {/* Card 2: OS-CIT 'A' */}
              <div style={{ 
                background: '#FFFFFF', 
                border: '3px solid #E11D48', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                color: '#1E293B',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.65rem', fontWeight: 900, background: '#FEF2F2', color: '#EF4444', padding: '3px 8px', borderRadius: '8px', border: '1px solid #FECACA' }}>
                  🎓 CERTIFICATE
                </div>
                <div style={{ padding: '30px 20px 20px' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#E11D48', fontFamily: "'Impact', sans-serif", letterSpacing: '1px' }}>
                    OS-CIT 'A'
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '12px 0 6px', color: '#334155', lineHeight: '1.4' }}>
                    Certificate Course of Odisha State Certificate in IT
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                    Extending Foundations to Office Automation
                  </div>
                </div>
                <div style={{ background: '#1E3A8A', color: '#FFFFFF', padding: '10px', fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Duration : 6 Months
                </div>
              </div>

              {/* Card 3: OS-CIT 'A+' */}
              <div style={{ 
                background: '#FFFFFF', 
                border: '3px solid #1E3A8A', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                color: '#1E293B',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.65rem', fontWeight: 900, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                  🚀 AI FLAVOURED
                </div>
                <div style={{ padding: '30px 20px 20px' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#1E3A8A', fontFamily: "'Impact', sans-serif", letterSpacing: '1px' }}>
                    OS-CIT 'A+'
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '12px 0 6px', color: '#334155', lineHeight: '1.4' }}>
                    Diploma Course of Odisha State Certificate in IT
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                    Advanced 1-Year Diploma Program
                  </div>
                </div>
                <div style={{ background: '#1E3A8A', color: '#FFFFFF', padding: '10px', fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Duration : 12 Months
                </div>
              </div>

              {/* Card 4: OCOC Python & Java */}
              <div style={{ 
                background: '#FFFFFF', 
                border: '3px solid #2563EB', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                color: '#1E293B',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.65rem', fontWeight: 900, background: '#EEF2FF', color: '#4F46E5', padding: '3px 8px', borderRadius: '8px', border: '1px solid #C7D2FE' }}>
                  🚀 CAREER ORIENTED
                </div>
                <div style={{ padding: '30px 20px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8 2C6.9 2 6.9 4.1 6.9 4.1V6.2H12V6.9H4.8S2 6.9 2 11.8C2 16.7 4.5 16.5 4.5 16.5H6.2V14.1S6 11.2 8.9 11.2H13.6S16.2 11.2 16.2 8.7V4.3S16.2 2 11.8 2Z" fill="#3776AB"/>
                      <path d="M12.2 22C17.1 22 17.1 19.9 17.1 19.9V17.8H12V17.1H19.2S22 17.1 22 12.2C22 7.3 19.5 7.5 19.5 7.5H17.8V9.9S18 12.8 15.1 12.8H10.4S7.8 12.8 7.8 15.3V19.7S7.8 22 12.2 22Z" fill="#FFE873"/>
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18C6 18 8 19 11 19C14 19 17 17 17 15C17 13 14 13 12 12C10 11 8 10 8 8C8 6 11 5 13 5C15 5 17 6 17 6" stroke="#5382A1" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      <path d="M9 13C9 13 10.5 14 12 14C13.5 14 15 13 15 13" stroke="#F89820" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                      <path d="M10 3C10 3 11 4 11 5" stroke="#E76F51" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="12.5" y1="2" x2="13.5" y2="4.5" stroke="#E76F51" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: '2.0rem', fontWeight: 950, color: '#2563EB', fontFamily: "'Impact', sans-serif", letterSpacing: '0.5px' }}>
                    OCOC Python & Java
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '12px 0 6px', color: '#334155', lineHeight: '1.4' }}>
                    Build Career in Computer Programming Course
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                    Gateway to New Collar Jobs (OKCL OCOC)
                  </div>
                </div>
                <div style={{ background: '#1E3A8A', color: '#FFFFFF', padding: '10px', fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Duration : 6 Months
                </div>
              </div>

              {/* Card 5: School Tuition CBSE & ICSE */}
              <div style={{
                background: '#FFFFFF',
                border: '3px solid #059669',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                color: '#1E293B',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.65rem', fontWeight: 900, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                  📚 SCHOOL TUITION
                </div>
                <div style={{ padding: '30px 20px 20px' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🏫</div>
                  <div style={{ fontSize: '2.0rem', fontWeight: 950, color: '#059669', fontFamily: "'Impact', sans-serif", letterSpacing: '0.5px' }}>
                    CBSE &amp; ICSE
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '12px 0 6px', color: '#334155', lineHeight: '1.4' }}>
                    School Tuition — Class 1 to Class 10
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.75, lineHeight: '1.5' }}>
                    Mathematics · Science · English · Computer Science
                  </div>
                </div>
                <div style={{ background: '#059669', color: '#FFFFFF', padding: '10px', fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  All Academic Subjects
                </div>
              </div>

            </div>

            {/* Affiliation Notice */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              background: theme === 'light' ? 'rgba(30, 58, 138, 0.05)' : 'rgba(255,255,255,0.04)', 
              border: '1.5px dashed rgba(30, 58, 138, 0.3)', 
              borderRadius: '12px', 
              padding: '16px 20px', 
              marginBottom: '36px',
              fontSize: '1.02rem',
              color: 'inherit'
            }}>
              <span>📜</span>
              <span>
                <strong>Accreditation Status:</strong> Authorized Educational Center of <strong>Odisha Knowledge Corporation Limited (OKCL)</strong>. Proficiency Test & Certification conducted by <strong>Odisha State Open University (OSOU)</strong>.
              </span>
            </div>

            <div className="mca-custom-card" style={{ marginBottom: '30px' }}>
              <h3>OS-CIT Syllabus Subjects</h3>
              <p style={{ fontSize: '1.05rem', marginBottom: '18px', opacity: 0.9 }}>
                The Odisha State Certificate in Information Technology (OS-CIT) is an essential course designed to make learners digitally literate. Our OS-CIT course covers:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '16px', borderLeft: '4px solid #1E3A8A', background: 'rgba(0,0,0,0.02)' }}>
                  <strong>1. IT Concepts & Windows</strong>
                  <p style={{ fontSize: '0.95rem', margin: '6px 0 0', opacity: 0.85 }}>Hardware inputs, RAM/ROM structures, file paths, and Windows GUI environments.</p>
                </div>
                <div style={{ padding: '16px', borderLeft: '4px solid #107C41', background: 'rgba(0,0,0,0.02)' }}>
                  <strong>2. MS Office Suite (Microsoft Apps)</strong>
                  <p style={{ fontSize: '0.95rem', margin: '6px 0 0', opacity: 0.85 }}>Complete training in documentation, formulas, and databases.</p>
                  
                  {/* Inline MS Office Suite Logos */}
                  <div className="ms-logos-row">
                    <span className="ms-app-logo" style={{ color: '#185ABD' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#185ABD"/><path d="M7 7.5L10 16.5L12.5 7.5L15 16.5L18 7.5" stroke="#FFFFFF" strokeWidth="2"/></svg>
                      Word
                    </span>
                    <span className="ms-app-logo" style={{ color: '#107C41' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#107C41"/><path d="M8 8L16 16M16 8L8 16" stroke="#FFFFFF" strokeWidth="2.5"/></svg>
                      Excel
                    </span>
                    <span className="ms-app-logo" style={{ color: '#C43E1C' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#C43E1C"/><circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2"/></svg>
                      PPT
                    </span>
                    <span className="ms-app-logo" style={{ color: '#A4373A' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#A4373A"/><path d="M8 7H16V10.5H8V7Z" stroke="#FFFFFF" strokeWidth="2"/></svg>
                      Access
                    </span>
                  </div>
                </div>
                <div style={{ padding: '16px', borderLeft: '4px solid #FCD34D', background: 'rgba(0,0,0,0.02)' }}>
                  <strong>3. Smart Citizen Services</strong>
                  <p style={{ fontSize: '0.95rem', margin: '6px 0 0', opacity: 0.85 }}>Hands-on training for UPI payments, Aadhaar services, DigiLocker, and ticketing portals.</p>
                </div>
                <div style={{ padding: '16px', borderLeft: '4px solid #EF4444', background: 'rgba(0,0,0,0.02)' }}>
                  <strong>4. Cyber Security & Safety</strong>
                  <p style={{ fontSize: '0.95rem', margin: '6px 0 0', opacity: 0.85 }}>Protecting credentials, identifying phishing mails, and safe browsing settings.</p>
                </div>
              </div>
            </div>

            <div className="mca-cards-grid">
              <div className="mca-custom-card">
                <div className="mca-card-icon">📝</div>
                <h3 className="mca-card-title">Handmade Ruled Notebook Study Guides</h3>
                <p className="mca-card-desc">
                  Notes are rendered using custom ruled-paper notebook layouts that eliminate screen glare. Simple, elegant, and focused.
                </p>
              </div>
              <div className="mca-custom-card">
                <div className="mca-card-icon">💻</div>
                <h3 className="mca-card-title">Absolute Beginner Programming Courseware</h3>
                <p className="mca-card-desc">
                  Master logic writing step-by-step starting right from "Hello, World!" to complex Object-Oriented patterns, pointers, and memory blocks.
                </p>
              </div>
              <div className="mca-custom-card">
                <div className="mca-card-icon">🔊</div>
                <h3 className="mca-card-title">Narrated Audio Lesson Voice Assists</h3>
                <p className="mca-card-desc">
                  Listen to the course contents hands-free using our intelligent voice synthesizer. Audio play toggles reset automatically when reading finishes.
                </p>
              </div>
              <div className="mca-custom-card">
                <div className="mca-card-icon">📊</div>
                <h3 className="mca-card-title">Pinch-to-Zoom Technical Flowcharts</h3>
                <p className="mca-card-desc">
                  Complex structures (like CPU registers or double-entry voucher cycles) are simplified into neat visual diagrams that you can drag, scale, and inspect.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ─── TAB CONTENT: HANDS-ON EXPERIENCE (LAB) ─── */}
        {activeTab === 'lab' && (
          <section className="mca-section animate-fade">
            <h2 className="mca-section-title">Hands-on Experience & Practical Lab Assignments</h2>
            <div className="mca-custom-card">
              <h3>Computer Lab Infrastructure</h3>
              <p style={{ lineHeight: '1.6', fontSize: '1.1rem', opacity: 0.9 }}>
                Learning IT requires practical execution. At Manisha Computer Academy, students spend 60% of their course hours inside our modern computer testing labs.
              </p>
              
              <h3 style={{ marginTop: '28px' }}>Active Practical Assignments</h3>
              <ul style={{ paddingLeft: '24px', lineHeight: '1.9', fontSize: '1.05rem' }}>
                <li><strong>MS Excel Spreadsheet Labs:</strong> Practice absolute cells referencing ($A$1), write conditional IF logic, build VLOOKUP/XLOOKUP reports, and aggregate data using Pivot Tables.</li>
                <li><strong>C & C++ Programming Labs:</strong> Compile coding programs starting from Hello World, trace variable pointers memory addresses, initialize structures, and implement OOP inheritance.</li>
                <li><strong>Tally Accounting Labs:</strong> Set up dummy companies, pass receipt/payment ledgers, apply GST rules, and prepare Profit & Loss reports using correct shortcuts.</li>
                <li><strong>Web Layout Markups:</strong> Build structured web pages using HTML5 semantic elements and links.</li>
              </ul>
            </div>
          </section>
        )}

        {/* ─── TAB CONTENT: CONTACT US ─── */}
        {activeTab === 'contact' && (
          <section className="mca-section animate-fade">
            <h2 className="mca-section-title">Contact Our Registrar Office</h2>
            <div className="quick-portal-box" style={{ background: 'none', border: 'none', padding: 0 }}>
              <div>
                <h3 className="portal-info-title">Nuapada Cuttack Campus</h3>
                <p style={{ lineHeight: '1.8', opacity: 0.9, fontSize: '1.1rem' }}>
                  <strong>Address:</strong> Manisha Computer Academy, Nuapada, Madhupatna (Near Nuapada Durga Mandap), Cuttack - 753010, Odisha, India.<br/>
                  <strong>Working Hours:</strong><br/>
                  &nbsp;&nbsp;• Monday – Saturday: 8:00 AM – 1:00 PM & 4:00 PM – 9:00 PM<br/>
                  &nbsp;&nbsp;• Sunday: Closed<br/>
                  <strong>Contact Number:</strong> 8260164606, 9861487672<br/>
                  <strong>Registrar Mail:</strong> <a href="mailto:manishacomputer2019@gmail.com" style={{ color: 'inherit' }}>manishacomputer2019@gmail.com</a>
                </p>
                <p style={{ fontSize: '1rem', marginTop: '16px', opacity: 0.8 }}>
                  Our admissions helpdesk is open during the working hours listed above.
                </p>

                {/* Google Maps Embed Location Frame */}
                <div style={{ marginTop: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <iframe 
                    title="Manisha Computer Academy Google Map"
                    width="100%" 
                    height="320" 
                    src="https://maps.google.com/maps?q=Manisha%20Computer%20Academy%20Nuapada%20Cuttack&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              <form className="mca-custom-card" style={{ margin: 0 }} onSubmit={(e) => { e.preventDefault(); alert('Query sent to Registrar!'); }}>
                <div className="portal-form-group">
                  <label>Full Student Name</label>
                  <input type="text" className="portal-input" placeholder="e.g. Lipika Das" required />
                </div>
                <div className="portal-form-group">
                  <label>Admission Query / Message</label>
                  <textarea 
                    className="portal-input" 
                    rows="3" 
                    placeholder="Enter your query here..." 
                    style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '1.05rem' }}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="portal-submit-btn">
                  Send Admission Query &rarr;
                </button>
              </form>
            </div>
          </section>
        )}

        {/* QUICK PORTAL SECTION */}
        <section className="mca-section">
          <div className="quick-portal-box">
            <div>
              <h2 className="portal-info-title">Institutional Quick Access Portal</h2>
              <p className="portal-info-desc">
                Are you currently a registered student or instructor at Manisha Computer Academy? Enter your verified roll ID and login password to enter your classroom dashboard tracker and sync your exam credits instantly.
              </p>
              <div className="portal-pills">
                <span className="portal-pill">v1.0.0-Stable</span>
                <span className="portal-pill">DBConnection_Syncing</span>
                <span className="portal-pill">CreditsEngine_Active</span>
              </div>
            </div>

            <form className="mca-custom-card" style={{ margin: 0 }} onSubmit={handleQuickPortalLogin}>
              <div className="portal-form-group">
                <label>Student Roll Number</label>
                <input 
                  type="text" 
                  className="portal-input"
                  placeholder="e.g. MCA-OSCIT_12PM-001"
                  value={quickInstId}
                  onChange={(e) => { setQuickInstId(e.target.value); setPortalError('') }}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="portal-form-group">
                <label>Password <span style={{ fontSize: '0.78rem', opacity: 0.65, fontWeight: 400 }}>(your registered phone password)</span></label>
                <input 
                  type="password" 
                  className="portal-input"
                  placeholder="••••••••"
                  value={quickPass}
                  onChange={(e) => { setQuickPass(e.target.value); setPortalError('') }}
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Error message */}
              {portalError && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  color: '#EF4444',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  marginBottom: '8px'
                }}>
                  ⚠️ {portalError}
                </div>
              )}

              <button type="submit" className="portal-submit-btn" disabled={portalLoading}>
                {portalLoading
                  ? <span>⏳ Verifying with database...</span>
                  : <span>Sign In to Classroom →</span>}
              </button>

              <p style={{ fontSize: '0.78rem', opacity: 0.6, textAlign: 'center', margin: '10px 0 0' }}>
                Use your <strong>Roll Number</strong> (e.g. MCA-OSCIT_12PM-001) and the <strong>phone password</strong> set by your instructor.
              </p>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mca-footer">
          <div>
            <strong>Manisha Computer Academy</strong>
            <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>
              © 2026 Manisha Computer Academy. All rights reserved.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Academy Rules</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Syllabus Details</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Registrar</a>
            {/* Instagram footer icon */}
            <a
              href="https://www.instagram.com/manishacomputer.26?utm_source=qr&igsh=cGZ0dWlibjRsMWps"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram @manishacomputer.26"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'inherit', textDecoration: 'none', opacity: 0.85 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
              </svg>
              Instagram
            </a>
          </div>
        </footer>

      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="auth-card">
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <McaLogo 
                  height={80} 
                  className="mca-auth-modal-logo" 
                />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0' }}>Manisha Academy Admin Portal</h3>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SECURE STAFF & INSTRUCTOR LOGIN
                </span>
              </div>

              {authError && <p className="auth-error-msg">{authError}</p>}

              <form className="auth-form-card" onSubmit={handleSubmit}>
                <div className="portal-form-group">
                  <label>Administrator Email</label>
                  <input 
                    type="email" 
                    className="portal-input"
                    placeholder="admin@manishaacademy.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="portal-form-group">
                  <label>Access Password</label>
                  <input 
                    type="password" 
                    className="portal-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="portal-submit-btn" disabled={authLoading}>
                  {authLoading ? 'Verifying...' : 'Sign In as Administrator'}
                </button>
              </form>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                  onClick={() => {
                    onDemoLogin()
                    setIsModalOpen(false)
                  }}
                  style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'inherit', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                >
                  ⚡ Access Demo Sandbox Classroom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AcademyChatbot theme={theme} />
    </div>
  )
}
