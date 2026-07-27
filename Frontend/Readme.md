# AI-First Test DNA — Frontend Workspace

A modern, responsive React + TypeScript frontend application for organizing, searching, and managing main project solutions and sub-project testing environments.

---

## 🌟 Key Features

- **Solution Portfolio & Projects Page**:
  - Displays main project workspaces with category tags, subproject counters, and real-time search filtering.
  - Dynamically create new main projects with custom industry categories, icon symbols, and tags.

- **Sub-Project Workspaces**:
  - View targeted subprojects under a selected parent project.
  - Dynamically configure multi-environment URLs (Dev, Staging, Production, Custom) with real-time add/remove capabilities.

- **Navbar Header**:
  - Sticky header navigation with brand logo, section title, mobile back button navigation, and interactive user profile menu.

- **Zero Hardcoding & Dynamic State**:
  - Pure state-driven architecture with `LocalStorage` persistence.
  - Start clean with zero hardcoded default projects, subprojects, or fake endpoints.

- **100% Responsive Across All Devices**:
  - **Desktop (1200px+)**: 3-column card grid, expanded layout.
  - **Tablet (768px - 1199px)**: 2-column card grid, touch-friendly navigation.
  - **Mobile (< 768px)**: Single-column layout, touch hit targets, scrollable full-width modals, and responsive input rows.

---

## 📁 Folder Structure

```
src/
├── Components/
│   ├── Navbar/
│   │   ├── Navbar.tsx             # Top navigation header & user profile menu
│   │   └── index.ts
│   └── Project/
│       ├── ProjectsPage.tsx       # Main projects portfolio grid view & search
│       ├── SubProjectsPage.tsx    # Subprojects list view for selected parent project
│       ├── CreateProjectModal.tsx # Modal to create main project workspaces
│       ├── CreateSubProjectModal.tsx # Modal to create subprojects & environment URLs
│       └── index.ts
├── types/
│   └── project.ts                 # TypeScript interfaces (Project, SubProject, EnvironmentUrl, UserProfile)
├── App.tsx                        # Main state management, navigation routing, & modal handlers
├── index.css                      # Design system, CSS tokens, luxury badges, and responsive media queries
└── main.tsx                       # React application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
cd Frontend
npm install
```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the port specified in terminal output).

### Building for Production

To compile TypeScript and create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
