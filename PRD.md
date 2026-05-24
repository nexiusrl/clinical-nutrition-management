# Product Requirements Document (PRD)
## Clinical Nutrition Management

**Project Name:** Clinical Nutrition Management 
**Version:** 1.0  
**Framework:** Next.js  

---

## 1. Executive Summary

Clinical Nutrition Management adalah platform terpadu yang menghubungkan pasien dan ahli gizi (AG) untuk memberikan asuhan gizi yang terstruktur dan efektif. Platform ini mendukung pengelolaan data gizi pasien secara komprehensif, mulai dari registrasi, assessment, diagnosis, intervensi hingga monitoring berkala.

**Target Users:**
- Ahli Gizi (AG) di rumah sakit, puskesmas, atau praktik mandiri
- Pasien dengan kondisi kesehatan tertentu (ginjal, hipertensi, asam urat)
- Individu yang ingin mengelola gizi mereka secara mandiri

---

## 2. Objectives & Key Results

### Objectives:
1. Menyediakan platform terpusat untuk manajemen asuhan gizi berbasis digital
2. Meningkatkan kualitas asuhan gizi melalui assessment dan monitoring yang terstruktur
3. Meningkatkan kepatuhan pasien terhadap rencana diet melalui teknologi
4. Memfasilitasi kolaborasi efektif antara pasien dan ahli gizi

### Key Results:
- ✅ Implementasi 5 modul utama (Registrasi, Assessment, Diagnosis, Intervensi, Monitoring)
- ✅ Dukungan untuk minimal 3 kondisi penyakit (ginjal, hipertensi, asam urat)
- ✅ User engagement 70%+ dalam 3 bulan pertama
- ✅ Peningkatan kepatuhan diet pasien sebesar 50%

---

## 3. User Personas

### Persona 1: Ahli Gizi Klinis (AG)
- **Name:** Dr. Siti Nurhaliza
- **Role:** Nutritionist at Hospital
- **Goals:** Mengelola asuhan gizi pasien secara efisien, memonitor progress, memberikan intervensi berbasis data
- **Pain Points:** Proses manual yang memakan waktu, sulit melacak progress pasien jangka panjang
- **Device:** Desktop, Tablet

### Persona 2: Pasien Kronis
- **Name:** Budi Santoso
- **Role:** Patient with kidney disease
- **Goals:** Memahami diet yang tepat, mematuhi rencana makan, melihat progress kesehatan
- **Pain Points:** Sulit memahami rekomendasi diet, lupa konsumsi, khawatir dengan kesehatan
- **Device:** Mobile Phone, Tablet

### Persona 3: Health-Conscious Individual
- **Name:** Rina Wijaya
- **Role:** Independent User
- **Goals:** Mengelola gizi secara mandiri, mendapat edukasi gizi, tracking progress
- **Pain Points:** Tidak tahu bagaimana menghitung kebutuhan gizi, perlu edukasi gizi
- **Device:** Mobile Phone, Desktop

---

## 4. Product Features & Scope

### Phase 1: Core Features (MVP)

#### 4.1 Modul Registrasi & Profil
**Purpose:** Mengelola data dasar pengguna sistem

**Features:**
- Registrasi pengguna (Pasien, Ahli Gizi, Independent User)
- Profil pengguna lengkap dengan foto
- Edit profil dan pengaturan akun
- Autentikasi dan otorisasi berbasis role
- Reset password dan email verification

**User Roles:**
- **Admin:** Mengelola pengguna dan sistem
- **Ahli Gizi (AG):** Mengelola pasien dan memberikan asuhan
- **Pasien:** Menerima asuhan dan melaporkan progress
- **Independent User:** Akses fitur mandiri terbatas

---

#### 4.2 Modul Assessment Gizi
**Purpose:** Mengumpulkan dan menganalisis data gizi pasien secara komprehensif

**Sub-Modul:**

**4.2.1 Data Antropometri**
- Input: Tinggi badan (cm), Berat badan (kg), Lingkar pinggang (cm)
- Analisis otomatis:
  - BMI (Body Mass Index) & status gizi
  - Berat badan ideal (BBI)
  - Estimasi berat badan normal
- Visualisasi: Grafik tren BB dari waktu ke waktu
- Input: Hanya oleh AG atau pasien atas instruksi AG

**4.2.2 Data Biokimia**
- Input laboratorium: Kreatinin, Ureum, Kalium, Natrium, Fosfor, Glukosa, Kolesterol, Trigliserida, Hemoglobin, Albumin
- Status interpretasi: Normal/Abnormal/Kritis
- Analisis masalah gizi terkait data lab
- Input: Oleh AG berdasarkan hasil lab pasien

**4.2.3 Data Fisik Klinis**
- Input: Diagnosis medis, pemeriksaan penunjang, gejala klinis
- Riwayat penyakit: Ginjal, Hipertensi, Asam Urat, dll
- Analisis masalah gizi berdasarkan kondisi klinis
- Input: Oleh AG

**4.2.4 Data Kebiasaan Makan & Asupan**
- Input:
  - Frekuensi makan sehari-hari
  - Makanan kesukaan
  - Alergi dan pantangan makanan
  - Preferensi diet (vegetarian, dll)
  - Recall 24 jam: Pencatatan makanan dalam 24 jam terakhir
- Analisis:
  - Tingkat konsumsi (Kelebihan/Kurang)
  - Kebiasaan makan salah
  - Adekuasi nutrisi (Kalori, Protein, Lemak, Karbohidrat)
- Input: Oleh AG atau Pasien

**4.2.5 Data Riwayat Penyakit**
- Input: Riwayat penyakit keluarga, penyakit komorbiditas
- Timeline view: Visualisasi riwayat penyakit
- Input: Oleh AG atau Pasien

---

#### 4.3 Modul Diagnosis Masalah Gizi
**Purpose:** Mengidentifikasi dan merangkum masalah gizi pasien

**Features:**
- Kompilasi otomatis masalah gizi dari assessment
- Diagnosis berbasis standar IDCN (Indonesian Dietetics and Nutrition Terminology)
- List masalah gizi prioritas
- Input/Edit: Hanya oleh AG
- Status diagnosis: Aktif, Resolved, Under Monitoring

---

#### 4.4 Modul Intervensi Gizi
**Purpose:** Merencanakan dan memberikan intervensi gizi yang terukur

**Features:**
- Analisis kebutuhan energi dan zat gizi otomatis berdasarkan:
  - Harris-Benedict untuk BMR
  - Activity factor sesuai kondisi
  - Faktor penyakit (ginjal: batas K, Na, P; hipertensi: batas Na, lemak)
- Kalkulasi kebutuhan harian: Kalori, Protein, Kalium, Natrium, Fosfor, Cairan
- Pembagian makan sehari: Sarapan, Snack pagi, Lunch, Snack sore, Dinner
- Rekomendasi makanan:
  - Daftar makanan yang BOLEH
  - Daftar makanan yang TIDAK BOLEH
  - Portion size recommendations
- Education materials: Leaflet digital, tips gizi, resep sehat
- Plan timeline: Jangka waktu intervensi dan target
- Input/Edit: Hanya oleh AG

---

#### 4.5 Modul Monitoring
**Purpose:** Memantau kepatuhan dan progress pasien secara berkelanjutan

**Features:**

**4.5.1 Dashboard Ahli Gizi**
- Overview pasien aktif
- Grafik: BB, Lab data, Kepatuhan makan
- Alert: Pasien dengan progress buruk atau data overdue
- Riwayat asupan pasien
- Catatan dan rekomendasi untuk pasien

**4.5.2 Laporan Makan Pasien**
- Pasien mencatat: Tanggal, makanan yang dikonsumsi sepanjang hari
- Foto makanan (optional)
- Feedback otomatis: Apakah sesuai rencana atau tidak
- Apresiasi/Motivasi untuk pasien berdasarkan kepatuhan

**4.5.3 Laporan Progress Klinis**
- Tracking progress: BB, data lab, gejala klinis
- Perbandingan dengan baseline
- Analisis trend dan achievement terhadap target
- Laporan periodik: Mingguan, bulanan, quarterly

---

#### 4.6 Modul Laporan & Log
**Purpose:** Dokumentasi dan evaluasi asuhan gizi

**Features:**
- Log harian konsumsi makanan pasien
- Laporan periodik otomatis (weekly, monthly)
- Export laporan: PDF, Excel
- Progress evaluation: Evaluasi setiap periode
- History tracking: Semua aktivitas pasien tersimpan

---

#### 4.7 Notifikasi & Pengingat
**Purpose:** Meningkatkan kepatuhan melalui reminder sistem

**Features:**
- Notifikasi jadwal makan
- Reminder pencatatan harian
- Reminder konsumsi obat/suplemen (optional)
- Reminder follow-up dengan AG
- Push notification, email, SMS (sesuai preferensi)
- Customizable reminder schedule

---

#### 4.8 Modul Rujukan Pasien
**Purpose:** Memfasilitasi transfer asuhan antar AG

**Features:**
- Referral dari RS AG → Puskesmas AG atau praktek mandiri
- Referral sebaliknya
- Riwayat asuhan tetap accessible oleh pasien
- History transfer dan approval workflow
- Status rujukan: Pending, Accepted, Completed

---

#### 4.9 Chat & Komunikasi
**Purpose:** Fasilitasi komunikasi pasien-AG

**Features:**
- Real-time chat pasien ↔ AG
- History chat tersimpan
- Share file/foto dalam chat
- Notification untuk new messages
- Accessibilitas setelah konsultasi berakhir (read-only)

---

### Phase 2: Advanced Features

#### 4.10 Fitur Mandiri untuk Klien Sehat
**Purpose:** Support health-conscious individuals tanpa AG

**Features:**
- Self-assessment gizi mandiri
- Kalkulator status gizi (BMI, BBI)
- Kalkulator asupan gizi seimbang
- Rekomendasi makan sehat umum
- Progress tracking mandiri (tanpa AG)
- Educational content library

---

#### 4.11 Analytics & Reporting
**Purpose:** Business intelligence dan insights

**Features:**
- Analytics dashboard untuk admin/owner
- Metrics:
  - Jumlah AG aktif
  - Jumlah pasien aktif per kategori penyakit
  - Status gizi pasien (aggregated)
  - Kepatuhan diet rate
  - Usage analytics
- Custom reports: Exportable ke Excel/PDF

---

#### 4.12 Testimoni & Review
**Purpose:** Social proof dan trust building

**Features:**
- Rating dan review dari pasien terhadap AG
- Testimonial form
- Display testimonial di landing page
- Filter review by star, date

---

#### 4.13 Landing Page
**Purpose:** Marketing dan onboarding

**Features:**
- Hero section dengan CTA (Sign up / Login)
- Features overview dengan visual
- Benefits untuk pasien dan AG
- Testimonials section
- Pricing (jika applicable)
- FAQ section
- Contact/Support information
- Blog section (optional)

---

## 5. User Flows

### 5.1 Flow: Ahli Gizi Menerima & Mengelola Pasien Baru

```
1. AG Login
2. View Dashboard → "Pasien Baru"
3. Input Pasien Data (Basic Profile)
4. Create Assessment Form
5. Edit Assessment dengan data pasien
6. Auto-analyze Assessment → Generate Diagnosis
7. Create Intervention Plan
8. Share Plan ke pasien
9. Start Monitoring
```

### 5.2 Flow: Pasien Mematuhi Rencana Diet

```
1. Pasien Login
2. View Diet Plan dari AG
3. Daily: Catat makanan yang dikonsumsi
4. Sistem analisis kepatuhan
5. Terima feedback & motivasi
6. Setiap minggu: Lihat progress report
7. Chat dengan AG untuk pertanyaan
```

### 5.3 Flow: Independent User Tracking Gizi Mandiri

```
1. Register tanpa AG
2. Input profil & data kesehatan
3. System calculate kebutuhan gizi
4. Lihat rekomendasi makan sehat
5. Daily tracking makanan
6. Monitor progress metrics
7. Read educational content
```

---

## 6. Technical Requirements

### 6.1 Frontend Stack
- **Framework:** Next.js (App Router recommended)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui atau Material-UI
- **State Management:** React Context API / Zustand
- **Form Management:** React Hook Form
- **Charts & Visualization:** Recharts, Chart.js
- **Date Management:** date-fns atau dayjs
- **HTTP Client:** Axios atau native fetch

### 6.2 Backend Requirements
- **API:** RESTful API (Node.js/Express recommended)
- **Database:** PostgreSQL (relational + JSONB for flexibility)
- **Authentication:** JWT + Refresh Token
- **File Upload:** Cloudinary / AWS S3
- **Notifications:** Firebase Cloud Messaging / NodeMailer
- **Search:** ElasticSearch (optional, for analytics)

### 6.3 Infrastructure
- **Deployment:** Vercel / AWS EC2
- **Database Hosting:** AWS RDS / Supabase
- **CDN:** CloudFront / Cloudflare
- **SSL Certificate:** Let's Encrypt

### 6.4 Performance Requirements
- Page load time: < 3s (First Contentful Paint)
- Lighthouse score: > 80
- Mobile responsive: All screen sizes (320px - 2560px)
- Accessibility: WCAG 2.1 AA compliance

### 6.5 Security Requirements
- HTTPS everywhere
- Data encryption at rest and in transit
- SQL injection prevention (ORM/Parameterized queries)
- CSRF protection
- XSS prevention
- Input validation & sanitization
- Rate limiting
- HIPAA compliance (untuk health data)
- GDPR compliance (untuk data privacy)

---

## 7. Database Schema Overview

```
Users
├── id, email, password_hash, role (enum), status
├── created_at, updated_at

Profiles
├── id, user_id, full_name, date_of_birth, gender
├── phone, address, photo_url

Patients
├── id, user_id, primary_ag_id (FK: Users)
├── condition (enum: kidney, hypertension, gout)

Assessments
├── id, patient_id, ag_id, assessment_date
├── data (JSON: anthropometry, biochemistry, clinical, food_intake, history)

Diagnoses
├── id, assessment_id, diagnosis_list (JSON array)

Interventions
├── id, patient_id, ag_id, start_date, target_date
├── caloric_needs, protein_needs, limitations (JSON)
├── allowed_foods (JSON), prohibited_foods (JSON)

DailyReports
├── id, patient_id, report_date
├── food_intake (JSON), weight, notes

Monitoring
├── id, patient_id, last_weight, last_lab_date
├── compliance_rate, achievement_vs_target

Messages
├── id, sender_id, receiver_id, content, created_at

Referrals
├── id, from_ag_id, to_ag_id, patient_id, status, created_at

Testimonials
├── id, patient_id, ag_id, rating, review_text, created_at
```

---

## 8. API Endpoints (High-level)

```
AUTH
  POST /api/auth/register
  POST /api/auth/login
  POST /api/auth/refresh
  POST /api/auth/logout

USERS & PROFILES
  GET /api/users/:id
  PUT /api/users/:id
  GET /api/profiles/:user_id
  PUT /api/profiles/:user_id

PATIENTS
  GET /api/patients (for AG)
  POST /api/patients (AG adds new patient)
  GET /api/patients/:id
  PUT /api/patients/:id

ASSESSMENTS
  POST /api/assessments (AG creates)
  GET /api/assessments/:patient_id
  PUT /api/assessments/:id

DIAGNOSES
  GET /api/diagnoses/:assessment_id
  POST /api/diagnoses (auto-generated)

INTERVENTIONS
  POST /api/interventions (AG creates plan)
  GET /api/interventions/:patient_id
  PUT /api/interventions/:id

DAILY REPORTS
  POST /api/daily-reports (Patient logs food)
  GET /api/daily-reports/:patient_id
  PUT /api/daily-reports/:id

MONITORING
  GET /api/monitoring/:patient_id (Dashboard data)
  POST /api/monitoring/:patient_id/check-in

MESSAGES
  POST /api/messages (Send message)
  GET /api/messages/:conversation_id
  GET /api/conversations (List chats)

REFERRALS
  POST /api/referrals (Create referral)
  PUT /api/referrals/:id/accept
  PUT /api/referrals/:id/reject

TESTIMONIALS
  POST /api/testimonials (Patient leaves review)
  GET /api/testimonials (Get all, public)
  DELETE /api/testimonials/:id (Own testimonial)

ANALYTICS
  GET /api/analytics/dashboard (Admin)
  GET /api/analytics/patient-demographics
  GET /api/analytics/compliance-rate
```

---

## 9. Landing Page Sections

1. **Header/Navigation**
   - Logo, Nav menu, CTA buttons (Sign In, Sign Up)
   - Responsive mobile menu

2. **Hero Section**
   - Compelling headline
   - Subheadline + benefit statement
   - Hero image/illustration
   - Primary CTA (Get Started)

3. **Features Section**
   - 6-8 key features dengan icons
   - Brief description per feature

4. **Benefits Section**
   - For Nutritionists: Time-saving, Better monitoring, etc.
   - For Patients: Easy tracking, Get motivated, etc.

5. **How It Works**
   - 3-4 steps visualized
   - Flowchart style

6. **Testimonials Section**
   - 3-5 testimonials from users
   - Star ratings
   - User name, role

7. **Supported Conditions**
   - Kidney Disease
   - Hypertension
   - Gout/Hyperuricemia

8. **Call to Action Section**
   - "Ready to get started?"
   - Sign up button

9. **FAQ Section**
   - 5-8 common questions
   - Accordion style

10. **Footer**
    - Links, contact info
    - Social media
    - Copyright

---

## 10. Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| User Registration | 500+ users | 6 months |
| Monthly Active Users | 300+ MAU | 6 months |
| Patient Compliance Rate | 70%+ | 6 months |
| AG Satisfaction Score | 4.5/5 | 6 months |
| App Availability | 99.9% uptime | Ongoing |
| Average Session Duration | 15+ min | 3 months |
| Page Load Time | < 3s | Ongoing |

---

## 11. Risk & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| Data privacy compliance | High | Medium | Early consultation dengan legal, implement HIPAA/GDPR from start |
| Complex calculation logic | High | Medium | Unit tests, validation with AG experts |
| User adoption rate low | High | Medium | Strong UX, onboarding materials, training program |
| Integration with hospital systems | Medium | High | Plan API contracts early, test with real systems |
| Scalability issues at peak load | High | Low | Load testing, horizontal scaling, CDN |

---

## 12. Out of Scope (Phase 1)

- Integration dengan existing hospital EHR systems (Phase 2)
- Advanced AI/ML recommendations (Phase 2)
- Wearable device integration (Phase 2)
- Multi-language support initially (Phase 2)
- Video consultation features (Phase 2)
- Pharmacy integration (Phase 2)

---

## 13. UML Diagrams

### 13.1 Class Diagram (Domain Model)

```mermaid
classDiagram
    class User {
        -id: UUID
        -email: string
        -password_hash: string
        -role: enum
        -status: string
        -created_at: datetime
        -updated_at: datetime
        +login()
        +logout()
        +updateProfile()
    }

    class Nutritionist {
        -license_no: string
        -specialty: string
        -verified: boolean
        +createAssessment()
        +generateDiagnosis()
        +createIntervention()
        +monitorPatient()
    }

    class Patient {
        -condition: enum
        -primary_ag_id: UUID
        +logDailyFood()
        +viewDietPlan()
        +trackProgress()
    }

    class IndependentUser {
        -goal_type: string
        +calculateBMI()
        +trackGratuity()
        +viewEducation()
    }

    class Assessment {
        -id: UUID
        -patient_id: UUID
        -ag_id: UUID
        -assessment_date: datetime
        -status: string
        -data: JSON
        +analyze()
        +generateReport()
    }

    class Anthropometry {
        -height: number
        -weight: number
        -waist_circumference: number
        -bmi: number
        -status_gizi: string
        +calculateBMI()
        +calculateIdealWeight()
    }

    class Biochemistry {
        -glucose: number
        -creatinin: number
        -urea: number
        -potassium: number
        -sodium: number
        -status: enum
        +interpretResults()
    }

    class PhysicalData {
        -diagnosis: string
        -symptoms: string
        -medical_history: string
        +analyzeProblems()
    }

    class FoodIntake {
        -meal_frequency: number
        -favorite_foods: string[]
        -allergies: string[]
        -recall_24h: JSON
        +analyzeDiet()
        +generateRecommendation()
    }

    class Diagnosis {
        -id: UUID
        -assessment_id: UUID
        -problems: JSON
        -status: enum
        -priority: string
        +updateDiagnosis()
        +resolveProblem()
    }

    class Intervention {
        -id: UUID
        -patient_id: UUID
        -ag_id: UUID
        -start_date: datetime
        -end_date: datetime
        -caloric_needs: number
        -protein_needs: number
        -restrictions: JSON
        -allowed_foods: JSON
        -prohibited_foods: JSON
        +calculateNeeds()
        +generateMealPlan()
        +updatePlan()
    }

    class Monitoring {
        -id: UUID
        -patient_id: UUID
        -intervention_id: UUID
        -check_in_date: datetime
        -weight: number
        -lab_data: JSON
        -compliance_rate: number
        -notes: string
        +updateProgress()
        +calculateCompliance()
        +generateAlert()
    }

    class DailyReport {
        -id: UUID
        -patient_id: UUID
        -report_date: datetime
        -food_intake: JSON
        -weight: number
        -energy_intake: number
        -notes: string
        +submitReport()
        +getComplianceStatus()
    }

    class Message {
        -id: UUID
        -conversation_id: UUID
        -sender_id: UUID
        -receiver_id: UUID
        -content: string
        -file_url: string
        -created_at: datetime
        +sendMessage()
        +deleteMessage()
    }

    class Referral {
        -id: UUID
        -from_ag_id: UUID
        -to_ag_id: UUID
        -patient_id: UUID
        -reason: string
        -status: enum
        +createReferral()
        +acceptReferral()
        +rejectReferral()
    }

    class Testimonial {
        -id: UUID
        -patient_id: UUID
        -ag_id: UUID
        -rating: number
        -review_text: string
        -approved: boolean
        -created_at: datetime
        +submitReview()
        +approveReview()
    }

    User <|-- Nutritionist
    User <|-- Patient
    User <|-- IndependentUser
    Patient "1" -- "*" Assessment
    Nutritionist "1" -- "*" Assessment
    Assessment "1" -- "1" Anthropometry
    Assessment "1" -- "1" Biochemistry
    Assessment "1" -- "1" PhysicalData
    Assessment "1" -- "1" FoodIntake
    Assessment "1" -- "*" Diagnosis
    Patient "1" -- "*" Intervention
    Nutritionist "1" -- "*" Intervention
    Intervention "1" -- "*" Monitoring
    Patient "1" -- "*" DailyReport
    Patient "1" -- "*" Message
    Nutritionist "1" -- "*" Message
    Patient "1" -- "*" Referral
    Nutritionist "1" -- "*" Testimonial
```

---

### 13.2 Use Case Diagram

```mermaid
graph TB
    subgraph Actors
        AG["👨‍⚕️ Ahli Gizi (AG)"]
        Patient["👤 Pasien"]
        Admin["🔐 Admin"]
        IndepUser["👥 Independent User"]
    end

    subgraph PatientManagement
        ManageReg["Manage Patient Registration"]
        CreateAssess["Create Assessment"]
        GenDiagnosis["Generate Diagnosis"]
        CreateIntervention["Create Intervention Plan"]
    end

    subgraph Monitoring
        MonitorProgress["Monitor Patient Progress"]
        GenReports["Generate Reports"]
        Dashboard["View Dashboard"]
        ComplianceCheck["Check Compliance"]
    end

    subgraph Communication
        ChatAG["Chat with Patient"]
        SendNotif["Send Notifications"]
        CreateReferral["Create Referral"]
    end

    subgraph PatientActivities
        ViewPlan["View Diet Plan"]
        LogFood["Log Daily Food Intake"]
        TrackProgress["Track Progress"]
        ViewReport["View Monitoring Report"]
        ReceiveNotif["Receive Notifications"]
        ChatPatient["Chat with AG"]
        LeaveTestimonial["Leave Testimonial"]
    end

    subgraph AdminActivities
        ManageUsers["Manage Users"]
        ViewAnalytics["View System Analytics"]
        MonitorHealth["Monitor System Health"]
        ConfigSettings["Configure Settings"]
    end

    subgraph IndepActivities
        SelfAssess["Self-Assessment Gizi"]
        CalcNeeds["Calculate Nutrition Needs"]
        GetRecommendation["Get Diet Recommendations"]
        TrackIndep["Track Food Intake"]
        ReadEducation["Read Educational Content"]
    end

    AG -->|performs| ManageReg
    AG -->|performs| CreateAssess
    AG -->|performs| GenDiagnosis
    AG -->|performs| CreateIntervention
    AG -->|performs| MonitorProgress
    AG -->|performs| GenReports
    AG -->|performs| Dashboard
    AG -->|performs| ComplianceCheck
    AG -->|performs| ChatAG
    AG -->|performs| SendNotif
    AG -->|performs| CreateReferral

    Patient -->|performs| ViewPlan
    Patient -->|performs| LogFood
    Patient -->|performs| TrackProgress
    Patient -->|performs| ViewReport
    Patient -->|performs| ReceiveNotif
    Patient -->|performs| ChatPatient
    Patient -->|performs| LeaveTestimonial

    Admin -->|performs| ManageUsers
    Admin -->|performs| ViewAnalytics
    Admin -->|performs| MonitorHealth
    Admin -->|performs| ConfigSettings

    IndepUser -->|performs| SelfAssess
    IndepUser -->|performs| CalcNeeds
    IndepUser -->|performs| GetRecommendation
    IndepUser -->|performs| TrackIndep
    IndepUser -->|performs| ReadEducation
```

---

### 13.3 Sequence Diagram: Patient Assessment & Intervention Creation

```mermaid
sequenceDiagram
    participant AG as Ahli Gizi
    participant System as System
    participant DB as Database
    participant Notif as Notification

    AG->>System: 1. Create Assessment
    System->>DB: 2. Validate Input Data
    DB-->>System: Valid
    System->>DB: 3. Store Assessment
    
    AG->>System: 4. Fill Form<br/>(Anthropometry, Biochemistry, etc)
    System->>System: 5. Auto-analyze Assessment<br/>(Calculate BMI, Status Gizi)
    System-->>AG: 6. Review Assessment
    
    AG->>System: 7. Generate Diagnosis
    System->>DB: 8. Retrieve Problems
    DB-->>System: Problem List
    System->>DB: 9. Store Diagnosis
    System-->>AG: 10. View & Edit Diagnosis
    
    AG->>System: 11. Create Intervention Plan
    System->>System: 12. Calculate Nutrition Needs<br/>(Based on: Patient data, Condition)
    System->>System: 13. Generate Meal Plan &<br/>Food List
    
    AG->>System: 14. Finalize & Approve Plan
    System->>DB: 15. Store Intervention
    System->>Notif: 16. Send Notification to Patient
    System-->>AG: 17. Confirm Plan Sent
```

---

### 13.4 Sequence Diagram: Patient Daily Food Logging & Monitoring

```mermaid
sequenceDiagram
    participant Patient as Pasien
    participant Mobile as Mobile App
    participant API as Backend API
    participant DB as Database
    participant AG as AG System

    Patient->>Mobile: 1. Open App
    Mobile->>API: 2. Load Daily Form
    API->>DB: 3. Query Meal Plan
    DB-->>API: Meal Plan Data
    API-->>Mobile: Form Ready
    
    Patient->>Mobile: 4. Input Meals<br/>(Breakfast, Lunch, Dinner)<br/>+ Photos (Optional)
    Mobile->>API: 5. Validate Input
    API->>API: 6. Check Nutritional<br/>Content (vs. plan)
    API->>API: 7. Auto-Analysis<br/>- Caloric match<br/>- Compliance %<br/>- Warnings
    
    Mobile-->>Patient: 8. View Feedback<br/>"Good job! You<br/>met 90% of plan"
    
    Patient->>Mobile: 10. Submit
    Mobile->>API: 9. Store Daily Report
    API->>DB: 11. Insert into DB
    API->>API: 12. Update Compliance Metrics
    
    alt Compliance < 70%
        API->>AG: 13. Send Alert to AG
    end
    
    AG-->>Patient: 14. Receive Daily<br/>Reminder (next day)
```

---

### 13.5 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ PROFILES : has
    USERS ||--o{ NUTRITIONISTS : is_a
    USERS ||--o{ PATIENTS : is_a
    USERS ||--o{ INDEPENDENT_USERS : is_a
    
    NUTRITIONISTS ||--o{ ASSESSMENTS : creates
    NUTRITIONISTS ||--o{ INTERVENTIONS : creates
    NUTRITIONISTS ||--o{ TESTIMONIALS : receives
    NUTRITIONISTS ||--o{ MESSAGES : sends_receive
    NUTRITIONISTS ||--o{ REFERRALS : creates
    
    PATIENTS ||--o{ ASSESSMENTS : has
    PATIENTS ||--o{ INTERVENTIONS : has
    PATIENTS ||--o{ DAILY_REPORTS : submits
    PATIENTS ||--o{ MONITORING : tracked_by
    PATIENTS ||--o{ MESSAGES : sends_receive
    PATIENTS ||--o{ TESTIMONIALS : leaves
    PATIENTS ||--o{ REFERRALS : subject_of
    
    ASSESSMENTS ||--o{ DIAGNOSES : generates
    ASSESSMENTS ||--o{ ANTHROPOMETRY : contains
    ASSESSMENTS ||--o{ BIOCHEMISTRY : contains
    ASSESSMENTS ||--o{ PHYSICAL_DATA : contains
    ASSESSMENTS ||--o{ FOOD_INTAKE : contains
    
    INTERVENTIONS ||--o{ MONITORING : tracked_by
    INTERVENTIONS ||--o{ DAILY_REPORTS : relates_to
    
    CONVERSATIONS ||--o{ MESSAGES : contains
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        enum role
        string status
        datetime created_at
        datetime updated_at
    }
    
    PROFILES {
        uuid id PK
        uuid user_id FK
        string full_name
        date dob
        enum gender
        string phone
        string address
        string photo_url
    }
    
    NUTRITIONISTS {
        uuid id PK "FK to Users"
        string license_no
        string specialty
        boolean verified
        datetime verified_date
    }
    
    PATIENTS {
        uuid id PK "FK to Users"
        enum condition
        uuid primary_ag_id FK
    }
    
    INDEPENDENT_USERS {
        uuid id PK "FK to Users"
        string goal_type
        datetime tracking_date
    }
    
    ASSESSMENTS {
        uuid id PK
        uuid patient_id FK
        uuid ag_id FK
        datetime assessment_date
        enum status
        json data
    }
    
    ANTHROPOMETRY {
        uuid id PK
        uuid assessment_id FK
        decimal height
        decimal weight
        decimal waist_circumference
        decimal bmi
        string status_gizi
    }
    
    BIOCHEMISTRY {
        uuid id PK
        uuid assessment_id FK
        decimal glucose
        decimal creatinin
        decimal urea
        decimal potassium
        decimal sodium
        enum status
    }
    
    PHYSICAL_DATA {
        uuid id PK
        uuid assessment_id FK
        string diagnosis
        string symptoms
        string medical_history
    }
    
    FOOD_INTAKE {
        uuid id PK
        uuid assessment_id FK
        integer meal_frequency
        json favorite_foods
        json allergies
        json recall_24h
    }
    
    DIAGNOSES {
        uuid id PK
        uuid assessment_id FK
        json problems
        enum status
        string priority
        datetime created_at
    }
    
    INTERVENTIONS {
        uuid id PK
        uuid patient_id FK
        uuid ag_id FK
        date start_date
        date end_date
        decimal caloric_needs
        decimal protein_needs
        json restrictions
        json allowed_foods
        json prohibited_foods
        enum status
    }
    
    MONITORING {
        uuid id PK
        uuid patient_id FK
        uuid intervention_id FK
        date check_in_date
        decimal weight
        json lab_data
        decimal compliance_rate
        string notes
    }
    
    DAILY_REPORTS {
        uuid id PK
        uuid patient_id FK
        date report_date
        json food_intake
        decimal weight
        decimal energy_intake
        string notes
        decimal compliance
    }
    
    CONVERSATIONS {
        uuid id PK
        uuid participant1_id FK
        uuid participant2_id FK
        datetime created_at
        datetime last_message_at
    }
    
    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        uuid receiver_id FK
        string content
        string file_url
        datetime created_at
    }
    
    TESTIMONIALS {
        uuid id PK
        uuid patient_id FK
        uuid ag_id FK
        integer rating
        string review_text
        boolean approved
        datetime created_at
    }
    
    REFERRALS {
        uuid id PK
        uuid from_ag_id FK
        uuid to_ag_id FK
        uuid patient_id FK
        string reason
        enum status
        datetime created_at
        datetime completed_at
    }
```

---

### 13.6 State Diagram: Patient Workflow

```mermaid
stateDiagram-v2
    [*] --> Registered
    
    Registered --> AssessmentInProgress: AG starts assessment
    
    AssessmentInProgress --> DiagnosisIdentified: Assessment complete
    
    DiagnosisIdentified --> PlanCreated: AG creates intervention plan
    
    PlanCreated --> UnderMonitoring: Patient reads & starts following
    
    UnderMonitoring --> GoalAchieved: Patient reaches goal
    UnderMonitoring --> NoProgress: No progress in monitoring
    UnderMonitoring --> ReferredToAnother: Referred to another AG
    
    GoalAchieved --> Completed: Patient discharged
    Completed --> [*]
    
    NoProgress --> UnderMonitoring: New intervention plan created
    
    ReferredToAnother --> ReferralDecision: Awaiting decision
    ReferralDecision --> ReferredOut: Referral accepted
    ReferralDecision --> UnderMonitoring: Referral rejected
    
    ReferredOut --> [*]
    
    UnderMonitoring -.->|Patient re-engage| UnderMonitoring
```

---

### 13.7 Component Architecture Diagram (Next.js Stack)

```mermaid
graph TB
    subgraph Frontend["🎨 FRONTEND (Next.js + React)"]
        Pages["📄 Pages & Layouts<br/>/landing, /auth, /dashboard<br/>/assessment, /intervention<br/>/monitoring, /messages"]
        Components["🧩 Reusable Components<br/>Input, Display, Feature<br/>Navigation, Layout"]
        State["🔄 State Management<br/>AuthContext, Zustand Stores<br/>AssessmentStore, UIStore"]
        Services["⚙️ Services & Hooks<br/>API Calls, Custom Hooks<br/>Utilities & Calculations"]
    end

    subgraph Backend["🔌 BACKEND API (Express.js)"]
        Routes["🛣️ Routes Layer<br/>/api/auth, /api/patients<br/>/api/assessments<br/>/api/interventions"]
        Controllers["📋 Controllers<br/>AuthController, PatientCtrlr<br/>AssessmentCtrlr, etc"]
        BusinessLogic["🧠 Business Logic Services<br/>AuthService, PatientService<br/>AssessmentService, etc"]
        Middleware["🔐 Middleware<br/>Auth, Authorization<br/>Validation, Error Handling"]
        DataLayer["💾 Data Access Layer<br/>Repositories, ORM<br/>Query Building"]
    end

    subgraph External["🌐 External Services"]
        Firebase["🔔 Firebase Cloud Messaging<br/>Push Notifications"]
        Email["📧 SendGrid / NodeMailer<br/>Email Service"]
        CloudFile["☁️ Cloudinary<br/>Image Upload"]
        SMS["📱 Twilio<br/>SMS Service Optional"]
        Analytics["📊 Analytics Service<br/>Tracking & Reporting"]
    end

    subgraph Database["🗄️ DATABASE (PostgreSQL)"]
        CoreTables["📚 Core Tables<br/>Users, Profiles<br/>Nutritionists, Patients"]
        AssessmentTables["📊 Assessment Tables<br/>Assessments, Diagnoses<br/>Anthropometry, etc"]
        ProcessTables["📝 Process Tables<br/>DailyReports, Monitoring<br/>Messages, Referrals"]
    end

    Pages --> Components
    Pages --> State
    Components --> Services
    State --> Services
    Services -->|HTTP/HTTPS| Routes
    
    Routes --> Controllers
    Controllers --> BusinessLogic
    Controllers --> Middleware
    
    BusinessLogic --> DataLayer
    Middleware --> DataLayer
    
    DataLayer -->|SQL Queries| CoreTables
    DataLayer -->|SQL Queries| AssessmentTables
    DataLayer -->|SQL Queries| ProcessTables
    
    BusinessLogic --> Firebase
    BusinessLogic --> Email
    BusinessLogic --> CloudFile
    BusinessLogic --> SMS
    BusinessLogic --> Analytics

    style Frontend fill:#e1f5ff
    style Backend fill:#f3e5f5
    style External fill:#fff3e0
    style Database fill:#e8f5e9
```

---

### 13.8 Project Timeline (Gantt Chart)

```mermaid
gantt
    title Nutrition Management System - Project Timeline
    dateFormat YYYY-MM-DD
    
    section Planning & Design
    Design & Planning :des, 2024-06-01, 14d
    UI/UX Mockups :des2, after des, 10d
    Database Design :des3, after des, 7d
    API Specification :des4, after des, 7d
    
    section Phase 1: MVP Development
    Frontend Setup :dev1, after des4, 3d
    Auth Module (Login/Register) :dev2, after dev1, 5d
    User Management Pages :dev3, after dev2, 5d
    Assessment Module :dev4, after dev3, 10d
    Diagnosis Module :dev5, after dev4, 5d
    Intervention Module :dev6, after dev5, 8d
    Monitoring Dashboard :dev7, after dev6, 8d
    Daily Reports & Logging :dev8, after dev7, 5d
    Chat Module :dev9, after dev8, 5d
    Landing Page :dev10, after dev1, 5d
    
    section Backend Development
    Backend Setup :backend1, after des4, 3d
    API Routes & Controllers :backend2, after backend1, 10d
    Business Logic Services :backend3, after backend2, 10d
    Database Integration :backend4, after backend3, 7d
    Authentication & Security :backend5, after backend4, 5d
    External Services Integration :backend6, after backend5, 5d
    
    section Testing & QA
    Unit Testing :test1, after backend6, 5d
    Integration Testing :test2, after test1, 5d
    E2E Testing :test3, after test2, 5d
    UAT :test4, after test3, 5d
    Bug Fixes & Optimization :test5, after test4, 7d
    
    section Beta Launch
    Beta Testing :beta, after test5, 10d
    Feedback Collection :beta2, after beta, 5d
    Final Adjustments :beta3, after beta2, 5d
    
    section Deployment
    Production Deployment :deploy, after beta3, 3d
    Marketing & Announcement :deploy2, after deploy, 7d
    
    section Post-Launch
    Monitoring & Support :support, after deploy, 30d
    Phase 2 Planning :support2, after support, 14d
```

### A. Condition-Specific Calculation Rules

**Kidney Disease (Chronic Kidney Disease)**
- Protein restriction: 0.6-0.8 g/kg IBW
- Sodium limit: < 2,300 mg/day
- Potassium limit: < 2,000 mg/day
- Phosphorus limit: < 1,000 mg/day
- Fluid restriction: Based on urine output

**Hypertension**
- Sodium limit: < 2,300 mg/day (DASH diet approach)
- Caloric needs: Based on target weight
- Emphasis on fruits, vegetables, whole grains
- Limit saturated fat: < 10% total calories

**Gout/Hyperuricemia**
- Purine restriction: < 100 mg/day
- Hydration: > 2L water/day
- Limit high-purine foods: Organ meats, seafood, red meat
- Avoid alcohol, especially beer
- Limit fructose

---

---

### 13.9 Data Flow Diagram (DFD) - Level 1

```mermaid
graph LR
    subgraph Users["👥 Users"]
        AG["Ahli Gizi"]
        Patient["Pasien"]
        Admin["Admin"]
    end

    subgraph Frontend["📱 Frontend Layer"]
        Web["Web App<br/>Next.js"]
    end

    subgraph Backend["🔧 Backend Layer"]
        API["REST API<br/>Express.js"]
    end

    subgraph Services["☁️ Services"]
        Auth["Auth Service"]
        Assessment["Assessment Service"]
        Nutrition["Nutrition Calculator"]
        Report["Report Generator"]
        Notify["Notification Service"]
    end

    subgraph Database["🗄️ Database"]
        DB["PostgreSQL<br/>Users, Assessments<br/>Interventions, Reports"]
    end

    subgraph External["🌐 External Services"]
        FCM["Firebase<br/>Cloud Messaging"]
        Email["SendGrid<br/>Email"]
        Cloud["Cloudinary<br/>Image Storage"]
    end

    AG -->|Login/Input| Web
    Patient -->|Login/Log Food| Web
    Admin -->|Manage System| Web
    
    Web -->|HTTP/HTTPS| API
    
    API -->|Authenticate| Auth
    API -->|Process Data| Assessment
    API -->|Calculate Needs| Nutrition
    API -->|Generate| Report
    API -->|Send| Notify
    
    Auth -->|Store/Verify| DB
    Assessment -->|Store/Retrieve| DB
    Nutrition -->|Retrieve Data| DB
    Report -->|Query| DB
    Notify -->|Log| DB
    
    Notify -->|Send| FCM
    Notify -->|Send| Email
    Assessment -->|Upload| Cloud
    
    FCM -->|Push Notification| Patient
    Email -->|Email| AG
    Email -->|Email| Patient
    Cloud -->|Serve| Web
    
    DB -->|Send Results| API
    API -->|Display Data| Web
    Web -->|Update UI| AG
    Web -->|Display Reports| Patient

    style Users fill:#fff9c4
    style Frontend fill:#e1f5fe
    style Backend fill:#f3e5f5
    style Services fill:#fff3e0
    style Database fill:#e8f5e9
    style External fill:#fce4ec
```

---

## 14. Glossary

| Term | Definition |
|------|-----------|
| AG (Ahli Gizi) | Nutrition specialist / Registered Dietitian |
| BMI | Body Mass Index (weight/height²) |
| BBI | Berat Badan Ideal (Ideal Body Weight) |
| Assessment | Comprehensive nutrition evaluation |
| Diagnosis | Nutrition-related problem identification |
| Intervention | Nutrition care plan |
| Monitoring | Tracking patient compliance & progress |
| Recall 24 jam | Food intake log for 24-hour period |
| Leaflet | Educational handout |
| Comorbidity | Concurrent medical conditions |
