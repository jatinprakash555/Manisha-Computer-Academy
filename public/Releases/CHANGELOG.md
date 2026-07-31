# Sagaan - Release History

## [1.0.0 (Build 50)] - 2026-07-29
 


---

## [1.0.0 (Build 49)] - 2026-07-29
 


---

## [1.0.0 (Build 48)] - 2026-07-29
 


---

## [1.0.0 (Build 47)] - 2026-07-29
 


---

## [1.0.0 (Build 46)] - 2026-07-29
 


---

## [1.0.0 (Build 45)] - 2026-07-29
 


---

## [1.0.0 (Build 44)] - 2026-07-29
- Fixed structural chapter mapping bug in LearningModeScreen.kt by loading PGDCA Master syllabus dynamically.
- Cleaned up chapter_8.json HTML5 web development resources to eliminate repeating MS Word ribbon groups.
- Wrote detailed tag-by-tag guides, boilerplate definitions, and clean practical lab projects for the HTML5 chapter.


---

## [1.0.0 (Build 43)] - 2026-07-29
 


---

## [1.0.0 (Build 42)] - 2026-07-29
- Secured admin panel for Manisha Computer Academy (MCA) by removing multiple institutional signup tabs.
- Designed real-time message and exam broadcast notifications via Supabase Realtime channels.
- Added a Broadcast Messages panel in the admin web dashboard to send direct student alerts.
- Integrated a real-time WebSocket listener on the Android client to trigger system notification alerts.
- Implemented app versionization controls in the admin dashboard and configured vercel.json SPA redirects.
- Added dynamic version checking and upgrade banners directly on the student home screen.


---

## [1.0.0 (Build 41)] - 2026-07-28
- Added C++ OOP Programming Masterclass (Chapter 11) with detailed beginner tutorials, coding exercises, and custom terminal output mockups.
- Shifted Tally Prime & Financial Accounting to Chapter 12.
- Redesigned RenderMarkdownContent logic in ChapterScreen.kt to parse and render scrollable code blocks with custom backgrounds, fixing a parser bug where C/C++ '#include' directives were mistakenly rendered as underlined headings and code indentation was truncated.
- Added UtteranceProgressListener inside TextToSpeechHelper.kt and bound callbacks in ChapterScreen.kt and LearningModeScreen.kt to automatically reset 'isSpeaking' UI states on narration completion.
- Optimized RAM footprint and layout loading speed by offloading chapter content parsing and image loading to Dispatchers.IO, introducing loading progress screens, adding explicit bitmap recycling, and automated cache clearing upon exiting chapters.


---

## [1.0.0 (Build 37)] - 2026-07-01
 


---

## [1.0.0 (Build 36)] - 2026-07-01
- Added Duolingo-style animation design tokens to website CSS.
- Created interactive Quiz Playground, AI Study Buddy, Leaderboard, and Streak simulators.
- Designed sticky header navigation and responsive home hero layouts.
- Updated Kotlin ChatScreen.kt to use same Duolingo blue/white chat bubble styles, Sago avatar, and custom monospace markdown math formula parsing.


---

## [1.0.0 (Build 35)] - 2026-06-21
 


---

## [1.0.0 (Build 34)] - 2026-06-21
- Replaced the angled octo_idle.png mascot with a newly generated, high-fidelity front-facing voxel version matching the quiz screen's aesthetic.
- Enhanced the idle floating animation to bob up and down more naturally in the Y-axis by default, creating a smoother aquatic float effect.


---

## [1.0.0 (Build 33)] - 2026-06-21
- Removed the baked-in pixel checkerboard grid background from the octo_sad.png mascot image, restoring perfect transparency.


---

## [1.0.0 (Build 32)] - 2026-06-21
- Integrated a real-time retro 8-bit bubble and glow-dot particle simulation behind the mascot using BoxWithConstraints and a game loop to keep it active and alive when stationary.


---

## [1.0.0 (Build 31)] - 2026-06-21
- Implemented a premium 3D plane floating effect for Octo with interactive pointer-tilt spring physics, replacing the 2D squash/stretch to preserve character shapes.


---

## [1.0.0 (Build 30)] - 2026-06-21
- Added organic state-specific idle/breathing/swaying mascot animations to Octo using Compose suspending transition loops to make it feel alive and dynamic.


---

## [1.0.0 (Build 29)] - 2026-06-21
- Added fun easter eggs when tapping Octo the mascot repeatedly. Clicking Octo triggers a playful 360-degree spin animation and cycles through funny speech bubble responses matched with high-quality MP3 voice assets.


---

## [1.0.0 (Build 28)] - 2026-06-21
- Fixed Option 4 padding behavior by implementing a smart option generator in makeOptions that varies numbers in the correct choice to create mathematically valid distractors.


---

## [1.0.0 (Build 27)] - 2026-06-21
- Refactored question generators in QuestionBank with 4+ high-variance randomized templates per chapter/subject.
- Removed robotic Android TextToSpeech (TTS) engine fallback in favor of high-quality pre-recorded MP3 mascot voice assets.
- Implemented substring-matching logic in OctoSoundManager for playing correct/wrong/welcome mascot audio files under dynamic explanations.


---

## [1.0.0 (Build 26)] - 2026-06-20
1. Implemented calendar/date-based Daily Streak Maintenance and Daily Challenge system.
2. Binded the Home Screen's Daily Challenge banner to live question counts.
3. Automatically resets daily question count and streak status based on calendar day transitions (requiring 5 questions a day to maintain the streak).


---

## [1.0.0 (Build 25)] - 2026-06-20
1. Optimized bandwidth usage by introducing an in-memory fetch cache (isStudentDataFetched) for student profile data. This prevents duplicate and redundant HTTP requests to /students and /firebase_cache on every composition/mount of the HomeScreen and ProfileScreen.


---

## [1.0.0 (Build 24)] - 2026-06-20
1. Muted homepage mascot voice (automatic speech TTS) to prevent annoying repeated readings when navigating back and forth to the learning path.
2. Updated homepage mascot greeting to use the student's actual local streak instead of a hardcoded value.
3. Implemented local persistence and remote Supabase syncing for quiz results. XP is now added, quiz completions are tracked, and stats are uploaded on completion, resolving the issue where XP and level were not increasing.


---

## [1.0.0 (Build 23)] - 2026-06-20
Fixed quiz option visibility and layout overflow in QuizScreen. Specifically, subjective questions with empty option lists are no longer forced into the MCQ layout with generic Option A/B/C/D placeholder cards. Instead, the screen directly presents the handwritten solution upload area and AI grading button immediately, providing clean layout spacing and ensuring that students can always submit their work for grading without layout truncation.


---

## [1.0.0 (Build 22)] - 2026-06-18
- Fixed XP level out-of-sync issue where hardcoded default level could yield a negative experience bar progress.


---

## [1.0.0 (Build 21)] - 2026-06-18
- Added Firebase Firestore as long-term profile master storage.
- Implemented Supabase caching layer (firebase_cache table) to prevent redundant Firestore reads.
- Partitioned student data by parsing the institution ID from the roll number.
- Added student_stats table and student_stats_ranked view to track real-time XP, streaks, and quiz metrics.
- Implemented client write coalescing (saving session stats in local cache and flushing synchronously on app close).
- Configured periodic hourly sync tasks and initial onboarding stats write.


---

## [1.0.0 (Build 20)] - 2026-06-18
- Locked screen orientation of MainActivity to portrait mode to prevent auto-rotation and incorrect rotation upon startup.


---

## [1.0.0 (Build 19)] - 2026-06-17
- Modular CBSE Syllabus Registry: Split the hardcoded chapters into four distinct, premium curriculum lists corresponding to each class and subject (Class 10 Math, Class 11 Physics, Class 12 Chemistry, Class 9 Science).
- Dynamic chapter resolution in the UI based on the student's batch prefix.
- Batch-aware Sago AI Tutor system persona generation in Gemini tutoring prompts.
- Dynamic question generation in QuestionBank based on student's batch.


---

## [1.0.0 (Build 18)] - 2026-06-17
- Updated landing page (HomeScreen.kt) greeting top bar to parse and show only the student's first name.
- Hardened Google Sign-In verification flow to eliminate manual email fallbacks.
- Synced Supabase connection credentials and verified connection.


---

## [1.0.0 (Build 17)] - 2026-06-17
 


---

## [1.0.0 (Build 16)] - 2026-06-17
 


---

## [1.0.0 (Build 15)] - 2026-06-17
 


---

## [1.0.0 (Build 14)] - 2026-06-17
- Added Google Play Services Auth dependency to integration classpath.
- Implemented real Google Sign-In SDK binding using Firebase Authentication in Step 1 of the Onboarding screen.
- Created fallback flow to allow manual email input if Google Play services is missing or misconfigured in the developer console.


---

## [1.0.0 (Build 13)] - 2026-06-17
- Migrated Firebase integration to project ID "studio-335172955-89f3c" by copying new google-services.json to the app module.
- Updated applicationId in build.gradle.kts to "books.sagaan" to match the Firebase configuration package name.


---

## [1.0.0 (Build 12)] - 2026-06-17
- Added a "Logout from Arena" button to the student Profile Screen.
- Implemented state reset to clear LocalStore onboarding flags and user properties.
- Configured safe navigation pop-up to clear the Home/Profile backstack and redirect back to the onboarding login screen.


---

## [1.0.0 (Build 11)] - 2026-06-17
- Implemented real-time student credential verification against the live Supabase database.
- Locked down student entrance by verifying Roll Number (Primary Key), Name & Coaching Name (Secondary Parameters), and Google Email & Phone Number (Tertiary Security Parameters).
- Extracted and matched coaching abbreviations from roll number prefixes (e.g. DC for Deltaclass Academy).
- Added resilient phone number verification (ignores country code/special character formatting differences).


---

## [1.0.0 (Build 10)] - 2026-06-15
 


---

## [1.0.0 (Build 9)] - 2026-06-15
- Added a floating Sago AI chat logo button on the HomeScreen with pulsing glow effect.
- Created the Sago AI Study Lounge (ChatScreen.kt) allowing students to upload images, ask mathematical queries, and have context-aware follow-up conversations.
- Fixed the audio bug: implemented a robust synthesized ToneGenerator fallback in OctoSoundManager.kt so sound effects (for correct/wrong options and thinking) play perfectly even when audio resource files are absent.
- Registered Chat route in navigation graph (DakshNavigation.kt).
- Corrected the laterally squeezed mascot in logo.png by scaling the active mascot content region back to a 1:1 aspect ratio and centering it on a 512x512 canvas.
- Regenerated all launcher icons in mipmap folders (mdpi, hdpi, xxhdpi, xxxhdpi) from the corrected logo.png to fix the squeezed application icon on Android devices.
- Integrated Android's native Text-to-Speech (TTS) engine inside OctoSoundManager.kt so Sago actually reads the mascot commentary and chat messages out loud in a cute, child-friendly high-pitched voice.
- Synthesized and integrated beautiful, cute, 8-bit custom chiptune retro game sound effect files (octo_correct.wav, octo_wrong.wav, octo_celebrate.wav, octo_thinking.wav) in the res/raw directory so that Sago's actions trigger high-quality, delightful audio chimes instead of classic robotic beeps.
- Added VIBRATE permission to AndroidManifest.xml and integrated premium custom haptic feedback patterns (double-pulse for correct, heavy warning buzz for incorrect, happy heartbeat for celebrate, and gentle tick for thinking) into the sound manager.
- Expanded the question bank (QuestionBank.kt) to guarantee a minimum of 150 deterministic, mathematically sound questions for every chapter and difficulty level (Easy/NCERT, Medium/Exemplar, Hard/RD Sharma) by programmatically generating curriculum-aligned questions on the fly.


---

## [1.0.0 (Build 8)] - 2026-06-15
- Added a floating Sago AI chat logo button on the HomeScreen with pulsing glow effect.
- Created the Sago AI Study Lounge (ChatScreen.kt) allowing students to upload images, ask mathematical queries, and have context-aware follow-up conversations.
- Fixed the audio bug: implemented a robust synthesized ToneGenerator fallback in OctoSoundManager.kt so sound effects (for correct/wrong options and thinking) play perfectly even when audio resource files are absent.
- Registered Chat route in navigation graph (DakshNavigation.kt).
- Corrected the laterally squeezed mascot in logo.png by scaling the active mascot content region back to a 1:1 aspect ratio and centering it on a 512x512 canvas.
- Regenerated all launcher icons in mipmap folders (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) from the corrected logo.png to fix the squeezed application icon on Android devices.
- Integrated Android's native Text-to-Speech (TTS) engine inside OctoSoundManager.kt so Sago actually reads the mascot commentary and chat messages out loud in a cute, child-friendly high-pitched voice.
- Synthesized and integrated beautiful, cute, 8-bit custom chiptune retro game sound effect files (octo_correct.wav, octo_wrong.wav, octo_celebrate.wav, octo_thinking.wav) in the res/raw directory so that Sago's actions trigger high-quality, delightful audio chimes instead of classic robotic beeps.


---

## [1.0.0 (Build 7)] - 2026-06-15
- Added a floating Sago AI chat logo button on the HomeScreen with pulsing glow effect.
- Created the Sago AI Study Lounge (ChatScreen.kt) allowing students to upload images, ask mathematical queries, and have context-aware follow-up conversations.
- Fixed the audio bug: implemented a robust synthesized ToneGenerator fallback in OctoSoundManager.kt so sound effects (for correct/wrong options and thinking) play perfectly even when audio resource files are absent.
- Registered Chat route in navigation graph (DakshNavigation.kt).
- Corrected the laterally squeezed mascot in logo.png by scaling the active mascot content region back to a 1:1 aspect ratio and centering it on a 512x512 canvas.
- Regenerated all launcher icons in mipmap folders (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) from the corrected logo.png to fix the squeezed application icon on Android devices.
- Integrated Android's native Text-to-Speech (TTS) engine inside OctoSoundManager.kt so Sago actually reads the mascot commentary and chat messages out loud in a cute, child-friendly high-pitched voice.


---

## [1.0.0 (Build 6)] - 2026-06-15
- Added a floating Sago AI chat logo button on the HomeScreen with pulsing glow effect.
- Created the Sago AI Study Lounge (ChatScreen.kt) allowing students to upload images, ask mathematical queries, and have context-aware follow-up conversations.
- Fixed the audio bug: implemented a robust synthesized ToneGenerator fallback in OctoSoundManager.kt so sound effects (for correct/wrong options and thinking) play perfectly even when audio resource files are absent.
- Registered Chat route in navigation graph (DakshNavigation.kt).
- Corrected the laterally squeezed mascot in logo.png by scaling the active mascot content region back to a 1:1 aspect ratio and centering it on a 512x512 canvas.
- Regenerated all launcher icons in mipmap folders (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) from the corrected logo.png to fix the squeezed application icon on Android devices.


---

## [1.0.0 (Build 5)] - 2026-06-15
- Added a floating Sago AI chat logo button on the HomeScreen with pulsing glow effect.
- Created the Sago AI Study Lounge (ChatScreen.kt) allowing students to upload images, ask mathematical queries, and have context-aware follow-up conversations.
- Fixed the audio bug: implemented a robust synthesized ToneGenerator fallback in OctoSoundManager.kt so sound effects (for correct/wrong options and thinking) play perfectly even when audio resource files are absent.
- Registered Chat route in navigation graph (DakshNavigation.kt).


---

## [1.0.0 (Build 4)] - 2026-06-15
- Removed white backgrounds from all four Octo mascot sprite PNGs (idle, happy, sad, thinking) to make them fully transparent.
- Updated the quiz flow in QuizScreen.kt to always present MCQ options first for all difficulties, only showing the photo upload area on incorrect answers for additional guidance.
- Added a "Skip to Next Question" button when a wrong answer is submitted.
- Renamed all UI and prompt references of "Antigravity AI" to "Sago AI".


---

## [1.0.0 (Build 3)] - 2026-06-13
- Rebranded the application name to Sagaan
- Integrated the custom pixel octopus logo assets across all mipmap density configurations
- Updated the Splash Screen to render the custom logo image instead of a placeholder emoji


---

## [1.0.0 (Build 2)] - 2026-06-13
- Built complete gamified Kotlin + Jetpack Compose learning architecture
- Implemented 6 core screens: Splash, Home, Chapter, Quiz, Result, and Profile
- Integrated Outfit geometric font family across 6 weight variations
- Configured local gradle properties versioning and local.properties configuration
- Created automated build_and_release.bat script following project standards


--- 
 















































