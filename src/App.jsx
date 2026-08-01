import { useState, useEffect } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Batches from './pages/Batches'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Exams from './pages/Exams'
import Messages from './pages/Messages'
import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import { supabase } from './supabaseClient'

const INITIAL_BATCHES = [
  { id: 'B_OSCIT_12PM', name: 'OSCIT 12:00 PM', students: 6, teacher: 'Manisha Admin', schedule: 'Daily 12:00 PM - 01:00 PM', status: 'active', code: 'OSCIT_12PM' },
  { id: 'B_OSCIT_10_11AM', name: 'OSCIT 10:00 AM - 11:00 AM', students: 10, teacher: 'Manisha Admin', schedule: 'Daily 10:00 AM - 11:00 AM', status: 'active', code: 'OSCIT_10_11AM' },
  { id: 'B_OSCIT_04_05PM_PART1', name: 'OSCIT 04:00 PM (Part 1)', students: 17, teacher: 'Manisha Admin', schedule: 'Daily 04:00 PM - 05:00 PM', status: 'active', code: 'OSCIT_04_05PM_PART1' },
  { id: 'B_OSCIT_04_05PM_PART2', name: 'OSCIT 04:00 PM (Part 2)', students: 5, teacher: 'Manisha Admin', schedule: 'Daily 04:00 PM - 05:00 PM', status: 'active', code: 'OSCIT_04_05PM_PART2' },
  { id: 'B_OSCIT_03_05PM', name: 'OSCIT 03:00 PM - 05:00 PM', students: 12, teacher: 'Manisha Admin', schedule: 'Daily 03:00 PM - 05:00 PM', status: 'active', code: 'OSCIT_03_05PM' },
  { id: 'B_OSCIT_06_07PM', name: 'OSCIT 06:00 PM - 07:00 PM', students: 14, teacher: 'Manisha Admin', schedule: 'Daily 06:00 PM - 07:00 PM', status: 'active', code: 'OSCIT_06_07PM' },
  { id: 'B_OSCIT_07_08PM', name: 'OSCIT 07:00 PM - 08:00 PM', students: 7, teacher: 'Manisha Admin', schedule: 'Daily 07:00 PM - 08:00 PM', status: 'active', code: 'OSCIT_07_08PM' },
  { id: 'B_OSCIT_08_09PM', name: 'OSCIT 08:00 PM - 09:00 PM', students: 38, teacher: 'Manisha Admin', schedule: 'Daily 08:00 PM - 09:00 PM & Addl', status: 'active', code: 'OSCIT_08_09PM' },
]

const INITIAL_STUDENTS_RAW = [
  { id: 100, name: "Sweety Das", phone: "Sweety@OSCIT", email: "mca-oscit_12pm-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_12PM", rollNumber: "MCA-OSCIT_12PM-001", aiUsed: 0, aiTotal: 150 },
  { id: 101, name: "Beauty Das", phone: "Beauty@OSCIT", email: "mca-oscit_12pm-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_12PM", rollNumber: "MCA-OSCIT_12PM-002", aiUsed: 0, aiTotal: 150 },
  { id: 102, name: "Monalisa Behera", phone: "Monalisa@OSCIT", email: "mca-oscit_12pm-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_12PM", rollNumber: "MCA-OSCIT_12PM-003", aiUsed: 0, aiTotal: 150 },
  { id: 103, name: "Snehashree Priyadarshini", phone: "Snehashree@OSCIT", email: "mca-oscit_12pm-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_12PM", rollNumber: "MCA-OSCIT_12PM-004", aiUsed: 0, aiTotal: 150 },
  { id: 104, name: "Smruti Mohanty", phone: "Smruti@OSCIT", email: "mca-oscit_12pm-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_12PM", rollNumber: "MCA-OSCIT_12PM-005", aiUsed: 0, aiTotal: 150 },
  { id: 105, name: "Ameli Kar", phone: "Ameli@OSCIT", email: "mca-oscit_12pm-006.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_12PM", rollNumber: "MCA-OSCIT_12PM-006", aiUsed: 0, aiTotal: 150 },
  { id: 106, name: "Adyasha Pradhan", phone: "Adyasha@OSCIT", email: "mca-oscit_10_11am-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-001", aiUsed: 0, aiTotal: 150 },
  { id: 107, name: "Sonali Rout", phone: "Sonali@OSCIT", email: "mca-oscit_10_11am-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-002", aiUsed: 0, aiTotal: 150 },
  { id: 108, name: "Alekha Das", phone: "Alekha@OSCIT", email: "mca-oscit_10_11am-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-003", aiUsed: 0, aiTotal: 150 },
  { id: 109, name: "Bharati Nayak", phone: "Bharati@OSCIT", email: "mca-oscit_10_11am-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-004", aiUsed: 0, aiTotal: 150 },
  { id: 110, name: "Sujit Kumar Mallick", phone: "Sujit@OSCIT", email: "mca-oscit_10_11am-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-005", aiUsed: 0, aiTotal: 150 },
  { id: 111, name: "Swastika Panda", phone: "Swastika@OSCIT", email: "mca-oscit_10_11am-006.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-006", aiUsed: 0, aiTotal: 150 },
  { id: 112, name: "Rasmita Behera", phone: "Rasmita@OSCIT", email: "mca-oscit_10_11am-007.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-007", aiUsed: 0, aiTotal: 150 },
  { id: 113, name: "Sushree Sangeeta", phone: "Sushree@OSCIT", email: "mca-oscit_10_11am-008.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-008", aiUsed: 0, aiTotal: 150 },
  { id: 114, name: "Subham Sahoo", phone: "Subham@OSCIT", email: "mca-oscit_10_11am-009.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-009", aiUsed: 0, aiTotal: 150 },
  { id: 115, name: "Banjulata Das", phone: "Banjulata@OSCIT", email: "mca-oscit_10_11am-010.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_10_11AM", rollNumber: "MCA-OSCIT_10_11AM-010", aiUsed: 0, aiTotal: 150 },
  { id: 116, name: "Dolly Das", phone: "Dolly@OSCIT", email: "mca-oscit_04_05pm_part1-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-001", aiUsed: 0, aiTotal: 150 },
  { id: 117, name: "Krushna Das", phone: "Krushna@OSCIT", email: "mca-oscit_04_05pm_part1-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-002", aiUsed: 0, aiTotal: 150 },
  { id: 118, name: "Pratima Behera", phone: "Pratima@OSCIT", email: "mca-oscit_04_05pm_part1-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-003", aiUsed: 0, aiTotal: 150 },
  { id: 119, name: "Dibyajyoti Das", phone: "Dibyajyoti@OSCIT", email: "mca-oscit_04_05pm_part1-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-004", aiUsed: 0, aiTotal: 150 },
  { id: 120, name: "Subhashree Sahoo", phone: "Subhashree@OSCIT", email: "mca-oscit_04_05pm_part1-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-005", aiUsed: 0, aiTotal: 150 },
  { id: 121, name: "Aditya Prasad Das", phone: "Aditya@OSCIT", email: "mca-oscit_04_05pm_part1-006.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-006", aiUsed: 0, aiTotal: 150 },
  { id: 122, name: "Alok Sahoo", phone: "Alok@OSCIT", email: "mca-oscit_04_05pm_part1-007.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-007", aiUsed: 0, aiTotal: 150 },
  { id: 123, name: "Sima Swain", phone: "Sima@OSCIT", email: "mca-oscit_04_05pm_part1-008.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-008", aiUsed: 0, aiTotal: 150 },
  { id: 124, name: "Pinky Sahoo", phone: "Pinky@OSCIT", email: "mca-oscit_04_05pm_part1-009.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-009", aiUsed: 0, aiTotal: 150 },
  { id: 125, name: "Laxmi Priya Sahoo", phone: "Laxmi@OSCIT", email: "mca-oscit_04_05pm_part1-010.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-010", aiUsed: 0, aiTotal: 150 },
  { id: 126, name: "Laxmi Priya Rout", phone: "Laxmi@OSCIT", email: "mca-oscit_04_05pm_part1-011.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-011", aiUsed: 0, aiTotal: 150 },
  { id: 127, name: "Adipta Chinara", phone: "Adipta@OSCIT", email: "mca-oscit_04_05pm_part1-012.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-012", aiUsed: 0, aiTotal: 150 },
  { id: 128, name: "Sudipta Chinara", phone: "Sudipta@OSCIT", email: "mca-oscit_04_05pm_part1-013.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-013", aiUsed: 0, aiTotal: 150 },
  { id: 129, name: "Ligarani Behera", phone: "Ligarani@OSCIT", email: "mca-oscit_04_05pm_part1-014.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-014", aiUsed: 0, aiTotal: 150 },
  { id: 130, name: "Payal Sahoo", phone: "Payal@OSCIT", email: "mca-oscit_04_05pm_part1-015.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-015", aiUsed: 0, aiTotal: 150 },
  { id: 131, name: "Janaseni", phone: "Janaseni@OSCIT", email: "mca-oscit_04_05pm_part1-016.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-016", aiUsed: 0, aiTotal: 150 },
  { id: 132, name: "Arpita Behera", phone: "Arpita@OSCIT", email: "mca-oscit_04_05pm_part1-017.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART1", rollNumber: "MCA-OSCIT_04_05PM_PART1-017", aiUsed: 0, aiTotal: 150 },
  { id: 133, name: "Ayush Kumar Pattnaik", phone: "Ayush@OSCIT", email: "mca-oscit_04_05pm_part2-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART2", rollNumber: "MCA-OSCIT_04_05PM_PART2-001", aiUsed: 0, aiTotal: 150 },
  { id: 134, name: "Kanchan Behera", phone: "Kanchan@OSCIT", email: "mca-oscit_04_05pm_part2-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART2", rollNumber: "MCA-OSCIT_04_05PM_PART2-002", aiUsed: 0, aiTotal: 150 },
  { id: 135, name: "Roushan Sahoo", phone: "Roushan@OSCIT", email: "mca-oscit_04_05pm_part2-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART2", rollNumber: "MCA-OSCIT_04_05PM_PART2-003", aiUsed: 0, aiTotal: 150 },
  { id: 136, name: "Ankita Behera", phone: "Ankita@OSCIT", email: "mca-oscit_04_05pm_part2-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART2", rollNumber: "MCA-OSCIT_04_05PM_PART2-004", aiUsed: 0, aiTotal: 150 },
  { id: 137, name: "Anushka Gupta", phone: "Anushka@OSCIT", email: "mca-oscit_04_05pm_part2-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_04_05PM_PART2", rollNumber: "MCA-OSCIT_04_05PM_PART2-005", aiUsed: 0, aiTotal: 150 },
  { id: 138, name: "Bhagyashree Nayak", phone: "Bhagyashree@OSCIT", email: "mca-oscit_03_05pm-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-001", aiUsed: 0, aiTotal: 150 },
  { id: 139, name: "Anjali Baskey", phone: "Anjali@OSCIT", email: "mca-oscit_03_05pm-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-002", aiUsed: 0, aiTotal: 150 },
  { id: 140, name: "Sai Archita Sahoo", phone: "Sai@OSCIT", email: "mca-oscit_03_05pm-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-003", aiUsed: 0, aiTotal: 150 },
  { id: 141, name: "Swarnamayee Singh", phone: "Swarnamayee@OSCIT", email: "mca-oscit_03_05pm-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-004", aiUsed: 0, aiTotal: 150 },
  { id: 142, name: "Puspanjali Jena", phone: "Puspanjali@OSCIT", email: "mca-oscit_03_05pm-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-005", aiUsed: 0, aiTotal: 150 },
  { id: 143, name: "Jyotsnarani Sahoo", phone: "Jyotsnarani@OSCIT", email: "mca-oscit_03_05pm-006.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-006", aiUsed: 0, aiTotal: 150 },
  { id: 144, name: "Kaivalya Mahapatra", phone: "Kaivalya@OSCIT", email: "mca-oscit_03_05pm-007.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-007", aiUsed: 0, aiTotal: 150 },
  { id: 145, name: "Anupama Behera", phone: "Anupama@OSCIT", email: "mca-oscit_03_05pm-008.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-008", aiUsed: 0, aiTotal: 150 },
  { id: 146, name: "Nirupama Sahoo", phone: "Nirupama@OSCIT", email: "mca-oscit_03_05pm-009.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-009", aiUsed: 0, aiTotal: 150 },
  { id: 147, name: "Rupeswari Sahoo", phone: "Rupeswari@OSCIT", email: "mca-oscit_03_05pm-010.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-010", aiUsed: 0, aiTotal: 150 },
  { id: 148, name: "Uspaha Kalpana", phone: "Uspaha@OSCIT", email: "mca-oscit_03_05pm-011.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-011", aiUsed: 0, aiTotal: 150 },
  { id: 149, name: "Choudhury Ganjam", phone: "Choudhury@OSCIT", email: "mca-oscit_03_05pm-012.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_03_05PM", rollNumber: "MCA-OSCIT_03_05PM-012", aiUsed: 0, aiTotal: 150 },
  { id: 150, name: "Debesh Kumar Swain", phone: "Debesh@OSCIT", email: "mca-oscit_06_07pm-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-001", aiUsed: 0, aiTotal: 150 },
  { id: 151, name: "Sangram Nayak", phone: "Sangram@OSCIT", email: "mca-oscit_06_07pm-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-002", aiUsed: 0, aiTotal: 150 },
  { id: 152, name: "Subhashree Sahoo", phone: "Subhashree@OSCIT", email: "mca-oscit_06_07pm-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-003", aiUsed: 0, aiTotal: 150 },
  { id: 153, name: "Anusmriti Rout", phone: "Anusmriti@OSCIT", email: "mca-oscit_06_07pm-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-004", aiUsed: 0, aiTotal: 150 },
  { id: 154, name: "Swati Jena", phone: "Swati@OSCIT", email: "mca-oscit_06_07pm-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-005", aiUsed: 0, aiTotal: 150 },
  { id: 155, name: "Subhalaxmi Pradhan", phone: "Subhalaxmi@OSCIT", email: "mca-oscit_06_07pm-006.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-006", aiUsed: 0, aiTotal: 150 },
  { id: 156, name: "Bandana Sahu", phone: "Bandana@OSCIT", email: "mca-oscit_06_07pm-007.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-007", aiUsed: 0, aiTotal: 150 },
  { id: 157, name: "Bikash Kumar Parida", phone: "Bikash@OSCIT", email: "mca-oscit_06_07pm-008.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-008", aiUsed: 0, aiTotal: 150 },
  { id: 158, name: "Sai Sourav Mohanty", phone: "Sai@OSCIT", email: "mca-oscit_06_07pm-009.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-009", aiUsed: 0, aiTotal: 150 },
  { id: 159, name: "Purna Chandra Panda", phone: "Purna@OSCIT", email: "mca-oscit_06_07pm-010.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-010", aiUsed: 0, aiTotal: 150 },
  { id: 160, name: "Pragyanjali Rout", phone: "Pragyanjali@OSCIT", email: "mca-oscit_06_07pm-011.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-011", aiUsed: 0, aiTotal: 150 },
  { id: 161, name: "Soumya Samarth Sahu", phone: "Soumya@OSCIT", email: "mca-oscit_06_07pm-012.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-012", aiUsed: 0, aiTotal: 150 },
  { id: 162, name: "Lopamudra Behera", phone: "Lopamudra@OSCIT", email: "mca-oscit_06_07pm-013.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-013", aiUsed: 0, aiTotal: 150 },
  { id: 163, name: "Pragya Sarangi", phone: "Pragya@OSCIT", email: "mca-oscit_06_07pm-014.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_06_07PM", rollNumber: "MCA-OSCIT_06_07PM-014", aiUsed: 0, aiTotal: 150 },
  { id: 164, name: "Mama Moharana", phone: "Mama@OSCIT", email: "mca-oscit_07_08pm-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_07_08PM", rollNumber: "MCA-OSCIT_07_08PM-001", aiUsed: 0, aiTotal: 150 },
  { id: 165, name: "Abhinash Swain", phone: "Abhinash@OSCIT", email: "mca-oscit_07_08pm-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_07_08PM", rollNumber: "MCA-OSCIT_07_08PM-002", aiUsed: 0, aiTotal: 150 },
  { id: 166, name: "Ayushman Swain", phone: "Ayushman@OSCIT", email: "mca-oscit_07_08pm-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_07_08PM", rollNumber: "MCA-OSCIT_07_08PM-003", aiUsed: 0, aiTotal: 150 },
  { id: 167, name: "Ranjit Kumar Gantayat", phone: "Ranjit@OSCIT", email: "mca-oscit_07_08pm-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_07_08PM", rollNumber: "MCA-OSCIT_07_08PM-004", aiUsed: 0, aiTotal: 150 },
  { id: 168, name: "Soumya Ranjan Sahoo", phone: "Soumya@OSCIT", email: "mca-oscit_07_08pm-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_07_08PM", rollNumber: "MCA-OSCIT_07_08PM-005", aiUsed: 0, aiTotal: 150 },
  { id: 169, name: "Pratyush Priyadarshini", phone: "Pratyush@OSCIT", email: "mca-oscit_07_08pm-006.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_07_08PM", rollNumber: "MCA-OSCIT_07_08PM-006", aiUsed: 0, aiTotal: 150 },
  { id: 170, name: "Supriya Samal", phone: "Supriya@OSCIT", email: "mca-oscit_07_08pm-007.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_07_08PM", rollNumber: "MCA-OSCIT_07_08PM-007", aiUsed: 0, aiTotal: 150 },
  { id: 171, name: "Shivaprasad Sahoo", phone: "Shivaprasad@OSCIT", email: "mca-oscit_08_09pm-001.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-001", aiUsed: 0, aiTotal: 150 },
  { id: 172, name: "Meenakshi Bhatt", phone: "Meenakshi@OSCIT", email: "mca-oscit_08_09pm-002.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-002", aiUsed: 0, aiTotal: 150 },
  { id: 173, name: "Gitanjali Moharana", phone: "Gitanjali@OSCIT", email: "mca-oscit_08_09pm-003.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-003", aiUsed: 0, aiTotal: 150 },
  { id: 174, name: "Rudranarayan Swain", phone: "Rudranarayan@OSCIT", email: "mca-oscit_08_09pm-004.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-004", aiUsed: 0, aiTotal: 150 },
  { id: 175, name: "Nirakar Nayak", phone: "Nirakar@OSCIT", email: "mca-oscit_08_09pm-005.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-005", aiUsed: 0, aiTotal: 150 },
  { id: 176, name: "Ambika Priyadarshini", phone: "Ambika@OSCIT", email: "mca-oscit_08_09pm-006.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-006", aiUsed: 0, aiTotal: 150 },
  { id: 177, name: "Tapas Ranjan Behera", phone: "Tapas@OSCIT", email: "mca-oscit_08_09pm-007.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-007", aiUsed: 0, aiTotal: 150 },
  { id: 178, name: "Niranjan Barik", phone: "Niranjan@OSCIT", email: "mca-oscit_08_09pm-008.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-008", aiUsed: 0, aiTotal: 150 },
  { id: 179, name: "Padmalochan Behera", phone: "Padmalochan@OSCIT", email: "mca-oscit_08_09pm-009.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-009", aiUsed: 0, aiTotal: 150 },
  { id: 180, name: "Swastik Harichandan", phone: "Swastik@OSCIT", email: "mca-oscit_08_09pm-010.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-010", aiUsed: 0, aiTotal: 150 },
  { id: 181, name: "Payal Priya Nayak", phone: "Payal@OSCIT", email: "mca-oscit_08_09pm-011.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-011", aiUsed: 0, aiTotal: 150 },
  { id: 182, name: "Amrit Kumar Biswal", phone: "Amrit@OSCIT", email: "mca-oscit_08_09pm-012.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-012", aiUsed: 0, aiTotal: 150 },
  { id: 183, name: "Shituna Nayak", phone: "Shituna@OSCIT", email: "mca-oscit_08_09pm-013.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-013", aiUsed: 0, aiTotal: 150 },
  { id: 184, name: "Bhabani Priyadarshini Ram", phone: "Bhabani@OSCIT", email: "mca-oscit_08_09pm-014.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-014", aiUsed: 0, aiTotal: 150 },
  { id: 185, name: "Nihar Sir", phone: "Nihar@OSCIT", email: "mca-oscit_08_09pm-015.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-015", aiUsed: 0, aiTotal: 150 },
  { id: 186, name: "Kapil Sir", phone: "Kapil@OSCIT", email: "mca-oscit_08_09pm-016.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-016", aiUsed: 0, aiTotal: 150 },
  { id: 187, name: "Pramod Sethy Sir", phone: "Pramod@OSCIT", email: "mca-oscit_08_09pm-017.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-017", aiUsed: 0, aiTotal: 150 },
  { id: 188, name: "Amrita Palei Mam", phone: "Amrita@OSCIT", email: "mca-oscit_08_09pm-018.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-018", aiUsed: 0, aiTotal: 150 },
  { id: 189, name: "Krishna Marndi", phone: "Krishna@OSCIT", email: "mca-oscit_08_09pm-019.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-019", aiUsed: 0, aiTotal: 150 },
  { id: 190, name: "Soubhagya Mahapatra", phone: "Soubhagya@OSCIT", email: "mca-oscit_08_09pm-020.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-020", aiUsed: 0, aiTotal: 150 },
  { id: 191, name: "Aditya Singh", phone: "Aditya@OSCIT", email: "mca-oscit_08_09pm-021.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-021", aiUsed: 0, aiTotal: 150 },
  { id: 192, name: "Subham Prasad Pradhan", phone: "Subham@OSCIT", email: "mca-oscit_08_09pm-022.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-022", aiUsed: 0, aiTotal: 150 },
  { id: 193, name: "Debendra Hemram", phone: "Debendra@OSCIT", email: "mca-oscit_08_09pm-023.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-023", aiUsed: 0, aiTotal: 150 },
  { id: 194, name: "Laxmipriya Samal", phone: "Laxmipriya@OSCIT", email: "mca-oscit_08_09pm-024.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-024", aiUsed: 0, aiTotal: 150 },
  { id: 195, name: "Nishanta Sahoo", phone: "Nishanta@OSCIT", email: "mca-oscit_08_09pm-025.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-025", aiUsed: 0, aiTotal: 150 },
  { id: 196, name: "Saroj Samal", phone: "Saroj@OSCIT", email: "mca-oscit_08_09pm-026.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-026", aiUsed: 0, aiTotal: 150 },
  { id: 197, name: "Lipismita Mallick", phone: "Lipismita@OSCIT", email: "mca-oscit_08_09pm-027.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-027", aiUsed: 0, aiTotal: 150 },
  { id: 198, name: "Adyasha Priyadarshini", phone: "Adyasha@OSCIT", email: "mca-oscit_08_09pm-028.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-028", aiUsed: 0, aiTotal: 150 },
  { id: 199, name: "Keshab Behera", phone: "Keshab@OSCIT", email: "mca-oscit_08_09pm-029.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-029", aiUsed: 0, aiTotal: 150 },
  { id: 200, name: "Subham Gupta", phone: "Subham@OSCIT", email: "mca-oscit_08_09pm-030.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-030", aiUsed: 0, aiTotal: 150 },
  { id: 201, name: "Pragyananda Panda", phone: "Pragyananda@OSCIT", email: "mca-oscit_08_09pm-031.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-031", aiUsed: 0, aiTotal: 150 },
  { id: 202, name: "Sharada Prasanna Mohanty", phone: "Sharada@OSCIT", email: "mca-oscit_08_09pm-032.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-032", aiUsed: 0, aiTotal: 150 },
  { id: 203, name: "Ritesh Mohanty", phone: "Ritesh@OSCIT", email: "mca-oscit_08_09pm-033.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-033", aiUsed: 0, aiTotal: 150 },
  { id: 204, name: "Jogamaya Tripathy", phone: "Jogamaya@OSCIT", email: "mca-oscit_08_09pm-034.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-034", aiUsed: 0, aiTotal: 150 },
  { id: 205, name: "Badri Prasad Chanda", phone: "Badri@OSCIT", email: "mca-oscit_08_09pm-035.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-035", aiUsed: 0, aiTotal: 150 },
  { id: 206, name: "Subham Karmi", phone: "Subham@OSCIT", email: "mca-oscit_08_09pm-036.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-036", aiUsed: 0, aiTotal: 150 },
  { id: 207, name: "Golapi Marndi", phone: "Golapi@OSCIT", email: "mca-oscit_08_09pm-037.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-037", aiUsed: 0, aiTotal: 150 },
  { id: 208, name: "Rudra (11-10)", phone: "Rudra@OSCIT", email: "mca-oscit_08_09pm-038.temp@manisha.academy", joiningMonth: "July 2026", avatar: "/src/assets/student_avatar.png", batch: "OSCIT_08_09PM", rollNumber: "MCA-OSCIT_08_09PM-038", aiUsed: 0, aiTotal: 150 },
]

let mcaOscitCount = 0
const INITIAL_STUDENTS_PROCESSED = INITIAL_STUDENTS_RAW.map((s, idx) => {
  const isCredentialPhone = s.phone && s.phone.includes('@')
  const phoneVal = isCredentialPhone ? `+91 98123 ${String(idx + 100).padStart(5, '0')}` : s.phone
  const passwordVal = isCredentialPhone ? s.phone : `${s.name.split(' ')[0]}@123`
  let updated = {
    ...s,
    phone: phoneVal,
    password: passwordVal
  }
  if (s.rollNumber && s.rollNumber.startsWith('MCA-')) {
    mcaOscitCount++
    const padded = String(mcaOscitCount).padStart(3, '0')
    updated = {
      ...updated,
      rollNumber: `MCA-${padded}`,
      email: `mca-${padded}.temp@manisha.academy`
    }
  }
  return updated
})

const INITIAL_STUDENTS = INITIAL_STUDENTS_PROCESSED

export default function App() {
  // ─── Theme State ───────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme'
    localStorage.setItem('theme', theme)
  }, [theme])

  // ─── Auth State ────────────────────────────────────────────────────────────
  const [session, setSession] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('mock_session=true')) {
      return { user: { email: 'jatinprakashb1@gmail.com' } }
    }
    return null
  })
  const [authChecked, setAuthChecked] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    // Check for existing session
    if (window.location.search.includes('mock_session=true')) {
      setAuthChecked(true)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthChecked(true)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleDemoLogin = () => {
    setSession({ user: { email: 'jatinprakashb1@gmail.com', role: 'admin' } })
  }

  const handleLogin = async (emailOrId, password) => {
    setAuthError('')
    setAuthLoading(true)
    try {
      // Bypass credential check for Manisha Academy Admin
      if (emailOrId === 'manisha.academy.admin@gmail.com' && password === 'Manisha@admin2026') {
        setSession({ user: { email: emailOrId, role: 'admin' } })
        setCurrentPage('dashboard')
        setAuthLoading(false)
        return
      }

      const isStudent = emailOrId.startsWith('DC-') || emailOrId.startsWith('MCA-')
      if (isStudent) {
        // Query profile from Supabase
        const { data: studentDb } = await supabase
          .from('students')
          .select('*')
          .eq('rollNumber', emailOrId)
          .maybeSingle()

        // Query game stats from Supabase view
        const { data: statsDb } = await supabase
          .from('student_stats_ranked')
          .select('*')
          .eq('roll_number', emailOrId)
          .maybeSingle()

        let foundStudent = studentDb
        if (!foundStudent) {
          foundStudent = students.find(s => s.rollNumber.toLowerCase() === emailOrId.toLowerCase())
        }

        if (!foundStudent && (emailOrId === 'MCA-STUDENT-2026' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          foundStudent = {
            name: 'Arjun Mehta',
            rollNumber: emailOrId,
            batch: '10A',
            email: 'arjun.mehta@gmail.com',
            phone: '+919876543210',
            aiUsed: 42,
            aiTotal: 150
          }
        }

        if (foundStudent) {
          if (foundStudent.phone && foundStudent.phone.trim() !== password.trim()) {
            throw new Error('Incorrect password for this student Roll Number.')
          }
          const mergedStudent = {
            ...foundStudent,
            stats: statsDb || null
          }
          setSession({ user: { email: mergedStudent.email, role: 'student', studentDetails: mergedStudent } })
          setCurrentPage('student-dashboard')
        } else {
          throw new Error('Student Roll Number not found in registry.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: emailOrId, password })
        if (error) throw error
        setSession({ user: { email: emailOrId, role: 'admin' } })
        setCurrentPage('dashboard')
      }
    } catch (err) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const isStudent = emailOrId.startsWith('DC-') || emailOrId.startsWith('MCA-')
        if (isStudent) {
          const mockStudent = students.find(s => s.rollNumber.toLowerCase() === emailOrId.toLowerCase()) || {
            name: 'Aadesh Shrivastav',
            rollNumber: emailOrId,
            batch: '10A',
            email: 'mca-10a-011.temp@manisha.academy',
            phone: 'Aadesh@10A',
            aiUsed: 0,
            aiTotal: 150
          }
          if (mockStudent.phone && mockStudent.phone.trim() !== password.trim()) {
            setAuthError('Incorrect student password.')
            setAuthLoading(false)
            return
          }
          const { data: statsDb } = await supabase
            .from('student_stats_ranked')
            .select('*')
            .eq('roll_number', mockStudent.rollNumber)
            .maybeSingle()
          
          setSession({ 
            user: { 
              email: mockStudent.email, 
              role: 'student', 
              studentDetails: { ...mockStudent, stats: statsDb || null } 
            } 
          })
          setCurrentPage('student-dashboard')
        } else {
          setSession({ user: { email: emailOrId || 'jatinprakashb1@gmail.com', role: 'admin' } })
          setCurrentPage('dashboard')
        }
      } else {
        setAuthError(err.message || 'Sign in failed. Please check your credentials.')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignUp = async (email, password, institution) => {
    setAuthError('')
    setAuthLoading(true)
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { institution_name: institution }
        }
      })
      if (error) throw error
      if (data?.session) {
        setSession(data.session)
      } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setSession({ user: { email: email || 'jatinprakashb1@gmail.com' } })
      } else {
        alert('Account created! Check your email to verify.')
      }
    } catch (err) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setSession({ user: { email: email || 'jatinprakashb1@gmail.com' } })
      } else {
        setAuthError(err.message || 'Sign up failed. Please try again.')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthError('')
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (err) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setSession({ user: { email: 'admin@deltaclass.edu' } })
      } else {
        setAuthError(err.message || 'Google Sign In failed.')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  // ─── Dashboard State ──────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [batches, setBatches] = useState([])
  const [students, setStudents] = useState([])
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('')
  const [dbConnected, setDbConnected] = useState(false)
  const [hasPasswordColumn, setHasPasswordColumn] = useState(false)
  const [exams, setExams] = useState([])
  const [timeString, setTimeString] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const d = new Date()
      const time = d.toLocaleTimeString('en-US', { hour12: false })
      const date = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
      setTimeString(`${time} | ${date}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const getHeaderTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Institutional Overview'
      case 'batches': return 'Batch Management'
      case 'students': return 'Student Registry'
      case 'attendance': return 'Attendance Tracker'
      case 'exams': return 'AI Examination Hub'
      case 'messages': return 'Broadcast Messages'
      default: return 'Institutional Portal'
    }
  }

  // Fetch batches and students from Supabase on mount (only when authenticated)
  useEffect(() => {
    if (!session) return

    async function loadData() {
      try {
        const { data: batchesData, error: batchesErr } = await supabase
          .from('batches')
          .select('*')
          .order('id', { ascending: true })

        if (batchesErr) throw batchesErr

        const { data: studentsData, error: studentsErr } = await supabase
          .from('students')
          .select('*')
          .order('id', { ascending: true })

        if (studentsErr) throw studentsErr

        setBatches(batchesData || [])
        setStudents(studentsData || [])
        setDbConnected(true)
        if (studentsData && studentsData.length > 0) {
          setHasPasswordColumn(studentsData[0].password !== undefined)
        }

        // Load exams from cache
        const { data: examsData } = await supabase
          .from('firebase_cache')
          .select('value')
          .eq('key', 'exams')
          .maybeSingle()

        if (examsData && examsData.value && examsData.value.exams) {
          setExams(examsData.value.exams)
        } else {
          setExams([
            {
              id: 'EXM-101',
              title: 'Mid-Term Mathematics Assessment',
              subject: 'Mathematics',
              batches: ['10A', '10B'],
              date: '2026-07-28',
              startTime: '10:00',
              endTime: '23:59',
              durationMinutes: 60,
              totalMarks: 100,
              passingMarks: 40,
              mode: 'ai',
              difficultyLevel: 7,
              status: 'scheduled',
              questionsCount: 3,
              questions: [
                { id: 1, text: 'Find the quadratic equation whose roots are 3 and -2.', options: ['x² - x - 6 = 0', 'x² + x - 6 = 0', 'x² - 5x + 6 = 0', 'x² + 5x - 6 = 0'], correctIndex: 0, explanation: 'Sum of roots = 1, Product of roots = -6. Equation: x² - (sum)x + product = 0' },
                { id: 2, text: 'If the nth term of an A.P. is (3n + 5), find its common difference.', options: ['2', '3', '5', '8'], correctIndex: 1, explanation: 'a_1 = 8, a_2 = 11. Common difference d = 11 - 8 = 3' },
                { id: 3, text: 'Determine whether 2x² - 7x + 3 = 0 has real and distinct roots.', options: ['Yes, Discriminant = 25 > 0', 'No, Discriminant = -25 < 0', 'Equal roots, Discriminant = 0', 'Undefined'], correctIndex: 0, explanation: 'D = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25 > 0.' }
              ]
            }
          ])
        }
      } catch (err) {
        console.warn('Failed to load live data from Supabase (falling back to memory data):', err.message)
        // Fallback to static memory seeds if tables do not exist yet
        setBatches(INITIAL_BATCHES)
        setStudents(INITIAL_STUDENTS)
        setDbConnected(false)
      }
    }
    loadData()
  }, [session])

  // Sync state changes to Supabase wrapper (with local state fallback)
  const handleSetBatches = async (newBatchesOrUpdater) => {
    let nextBatches
    if (typeof newBatchesOrUpdater === 'function') {
      nextBatches = newBatchesOrUpdater(batches)
    } else {
      nextBatches = newBatchesOrUpdater
    }
    setBatches(nextBatches)

    if (dbConnected) {
      // Find newly added batches and insert them
      const newBatchItems = nextBatches.filter(b => !batches.some(old => old.id === b.id))
      for (const batch of newBatchItems) {
        await supabase.from('batches').insert([batch])
      }
    }
  }

  const handleSetStudents = async (newStudentsOrUpdater) => {
    let nextStudents
    if (typeof newStudentsOrUpdater === 'function') {
      nextStudents = newStudentsOrUpdater(students)
    } else {
      nextStudents = newStudentsOrUpdater
    }
    setStudents(nextStudents)

    if (dbConnected) {
      // Find new students
      const newItems = nextStudents.filter(s => !students.some(old => old.id === s.id))
      for (const student of newItems) {
        const { id, ...studentData } = student
        const payload = {
          name: studentData.name,
          phone: studentData.phone,
          email: studentData.email,
          batch: studentData.batch,
          rollNumber: studentData.rollNumber,
          aiTotal: studentData.aiTotal,
          aiUsed: studentData.aiUsed,
        }
        if (hasPasswordColumn) {
          payload.password = studentData.password || '123456'
        }
        await supabase.from('students').insert([payload])
      }

      // Find updated students
      const updatedItems = nextStudents.filter(s => {
        const old = students.find(o => o.id === s.id)
        return old && (
          old.name !== s.name ||
          old.phone !== s.phone ||
          old.email !== s.email ||
          old.batch !== s.batch ||
          old.rollNumber !== s.rollNumber ||
          old.aiTotal !== s.aiTotal ||
          old.aiUsed !== s.aiUsed ||
          old.password !== s.password
        )
      })

      for (const student of updatedItems) {
        const payload = {
          name: student.name,
          phone: student.phone,
          email: student.email,
          batch: student.batch,
          rollNumber: student.rollNumber,
          aiTotal: student.aiTotal,
          aiUsed: student.aiUsed,
        }
        if (hasPasswordColumn) {
          payload.password = student.password || '123456'
        }
        await supabase
          .from('students')
          .update(payload)
          .eq('id', student.id)
      }
    }
  }

  const handleSetExams = async (newExamsOrUpdater) => {
    let nextExams
    if (typeof newExamsOrUpdater === 'function') {
      nextExams = newExamsOrUpdater(exams)
    } else {
      nextExams = newExamsOrUpdater
    }
    setExams(nextExams)

    if (dbConnected) {
      try {
        await supabase.from('firebase_cache').upsert({
          institution_id: 'DC',
          key: 'exams',
          value: { exams: nextExams },
          updated_at: new Date().toISOString()
        })
      } catch (err) {
        console.warn('Failed to upsert exams to Supabase:', err.message)
      }
    }
  }

  // Dynamically update the student count in batches based on students list
  const batchesWithCounts = batches.map(b => {
    const count = students.filter(s => s.batch === b.code).length
    return { ...b, students: count }
  })

  const handleNavigate = (page, batchFilter = '') => {
    setCurrentPage(page)
    setSelectedBatchFilter(batchFilter)
  }

  // ─── Show loading state while checking auth ────────────────────────────────
  if (!authChecked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B0F1A',
        color: '#F1F5F9',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '0.875rem',
      }}>
        <div className="auth-spinner" style={{ width: 24, height: 24 }}></div>
      </div>
    )
  }

  // ─── Unauthenticated → Landing Page ────────────────────────────────────────
  if (!session) {
    return (
      <LandingPage
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onGoogleSignIn={handleGoogleSignIn}
        onDemoLogin={handleDemoLogin}
        authError={authError}
        authLoading={authLoading}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />
    )
  }
  // ─── Authenticated Student → Student Dashboard ──────────────────────────────
  if (session && session.user?.role === 'student') {
    return (
      <StudentDashboard 
        student={session.user.studentDetails}
        onSignOut={handleSignOut}
        theme={theme}
      />
    )
  }

  // ─── Authenticated → Admin Dashboard ───────────────────────────────────────
  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => handleNavigate(page, '')}
        onSignOut={handleSignOut}
        userEmail={session.user?.email}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />
      <div className="main-container" style={{ marginLeft: 'var(--sidebar-width)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Unified Top Header Bar */}
        <header className="stitch-dash-header" style={{ borderBottom: '1px solid var(--border-grid)', padding: '20px 36px', backgroundColor: 'var(--bg-main)' }}>
          <div>
            <h1 className="stitch-dash-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{getHeaderTitle()}</h1>
          </div>

          <div className="stitch-header-controls">
            <select
              className="stitch-batch-select"
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
            >
              <option value="">ALL BATCHES</option>
              {batches.map(b => (
                <option key={b.id} value={b.code}>
                  BATCH: {b.code} ({b.name})
                </option>
              ))}
            </select>

            <div className="stitch-clock-pill">
              {timeString}
            </div>

            <div className="stitch-notification-bell">
              🔔<span className="bell-dot"></span>
            </div>

            <div className="stitch-admin-avatar-card">
              <div className="stitch-admin-avatar">👩‍💼</div>
              <div>
                <div className="admin-name">Manisha Admin</div>
                <div className="admin-role">Global Administrator</div>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content" style={{ margin: 0, padding: '32px 36px', flex: 1 }}>
          {currentPage === 'dashboard' && (
            <Dashboard batches={batchesWithCounts} students={students} exams={exams} selectedBatchCode={selectedBatchFilter || 'ALL'} />
          )}
          {currentPage === 'batches' && (
            <Batches
              batches={batchesWithCounts}
              setBatches={handleSetBatches}
              onViewRegistry={(batchCode) => handleNavigate('students', batchCode)}
            />
          )}
          {currentPage === 'students' && (
            <Students
              students={students}
              setStudents={handleSetStudents}
              batches={batches}
              selectedBatchFilter={selectedBatchFilter}
              setSelectedBatchFilter={setSelectedBatchFilter}
              hasPasswordColumn={hasPasswordColumn}
            />
          )}
          {currentPage === 'attendance' && (
            <Attendance
              batches={batchesWithCounts}
              students={students}
            />
          )}
          {currentPage === 'exams' && (
            <Exams
              batches={batchesWithCounts}
              exams={exams}
              setExams={handleSetExams}
            />
          )}
          {currentPage === 'messages' && (
            <Messages
              students={students}
            />
          )}
        </main>
      </div>
    </div>
  )
}
