# Classeur Numérique Intelligent – Architecture

## 1. Frontend
- **React.js** (with Material UI or shadcn/ui)
- Runs as a web app (for cloud) and as an Electron app (for local/desktop)
- Handles document import, gallery, search, to-do list, settings, authentication
- Communicates with backend via REST API (Express.js)

## 2. Backend
- **Node.js + Express.js**
- Handles user authentication, document management, classification requests, to-do tasks
- Interfaces with OCR engine and storage provider
- Provides API endpoints for frontend

## 3. OCR & Classification
- **Tesseract.js** (OCR, can be run in frontend for local/Electron or in backend for web)
- **Document Classification**: Rule-based (MVP) or simple Hugging Face model (optional)

## 4. Storage
- **Local**: Filesystem via Electron APIs
- **Cloud**: Firebase Storage or Supabase (file storage + database)

## 5. Security
- Authentication (JWT tokens)
- Basic encryption for sensitive data (at rest and/or in transit)

---

## 🔄 Data Flow Example
1. **User uploads document** via frontend
2. **OCR** runs (in frontend for Electron/local, or backend for web)
3. **Classification** determines type/date/metadata
4. **Document and metadata** are stored (locally or in cloud)
5. **Frontend** displays document in gallery, searchable and organized
6. **To-Do tasks** can be linked to documents

---

## 📊 Component Diagram
```
[User]
   |
[React.js Frontend] <-> [Electron.js (optional)]
   |        |                |
   |   [Tesseract.js]    [Local Filesystem]
   |
[Express.js Backend] <-> [Tesseract.js] <-> [Classification]
   |
[Cloud Storage (Firebase/Supabase)]
```

---

## 🔑 Key Decisions
- Electron for offline/local-first experience
- Modular: can run as web app or desktop
- Storage abstraction for easy switch between local/cloud
- MVP: Rule-based classification, upgradeable to ML

---

*Next: Wireframes/mockups for main UI screens.*
