# Classeur Numérique Intelligent – UI Wireframes (uiverse.io inspired)

## 1. Document Import Screen
- Drag & drop area (uiverse.io drag-drop component)
- Upload button (uiverse.io button)
- File list preview

```
+---------------------------------------+
|   [📂 Drag & Drop your documents]     |
|                                       |
|   [Or click to upload] [Upload Btn]   |
|                                       |
|   Uploaded Files:                     |
|   - doc1.pdf   [x]                    |
|   - photo.jpg  [x]                    |
+---------------------------------------+
```

## 2. Document Gallery
- Search bar (uiverse.io search input)
- Filter chips (year, type, tag)
- Gallery grid (uiverse.io card/thumbnails)

```
+-----------------------------------------------+
| [🔍 Search...]   [Year ▼] [Type ▼] [Tag ▼]    |
|                                               |
|  [DocCard]  [DocCard]  [DocCard]  [DocCard]   |
|  [DocCard]  [DocCard]  [DocCard]  [DocCard]   |
+-----------------------------------------------+
```

## 3. Document Preview/Details
- Large preview area (PDF/image viewer)
- Metadata (date, type, tags)
- Actions: Download, Edit, Delete

```
+-------------------------------+
| [<] Doc Name.pdf              |
|                               |
|  [Document Preview Area]      |
|                               |
|  Date: 2024-05-10             |
|  Type: Administratif          |
|  Tags: [Impôt] [PDF]          |
|                               |
|  [Download] [Edit] [Delete]   |
+-------------------------------+
```

## 4. To-Do List Manager
- Add task input (uiverse.io input/button)
- Task list (uiverse.io task/toggle)

```
+-----------------------------+
| [Add a new task...] [Add+]  |
|                             |
| [ ] Relire cours math       |
| [x] Scanner fiche admin     |
| [ ] Télécharger relevé      |
+-----------------------------+
```

## 5. Settings/Sync
- Toggle for local/cloud sync
- Auth/account info
- Theme switch (uiverse.io toggle)

```
+------------------------------+
| Account: user@email.com      |
|                              |
| [ Local Sync  | Cloud Sync ] |
|                              |
| [Theme: Light ◑ Dark]        |
|                              |
| [Logout]                     |
+------------------------------+
```

---

**All UI elements are inspired by uiverse.io. When implementing, use their React code snippets for beautiful, interactive components.**

*Next: Scaffold the React project structure and include uiverse.io components.*
