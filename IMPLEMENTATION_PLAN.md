# D&D Campaign Story Editor - Multi-Phase Implementation Plan

## Project Overview
Web-based visual node editor for D&D DMs to create branching campaign narratives with dialogue trees, NPCs, encounters, quests. Includes Anthropic Claude API integration with user-configurable API keys and model selection.

**Key constraint:** No dice mechanics

---

## Tech Stack Summary
- **Frontend**: React 18 + TypeScript, React Flow, Zustand, Tailwind CSS, Vite
- **Backend**: Node.js + Express, PostgreSQL, Prisma ORM
- **AI**: Anthropic Claude API (user-provided keys)

---

## Phase 1: Project Setup & Database Foundation ⬜

### Tasks
- [ ] Create root `package.json` (monorepo support)
- [ ] Initialize `/client` with Vite + React + TypeScript
- [ ] Initialize `/server` with Express + TypeScript
- [ ] Initialize `/shared` with TypeScript types/schemas
- [ ] Set up PostgreSQL database (local or Docker)
- [ ] Create Prisma schema:
  - `User` (with encrypted API key, model selection)
  - `Campaign` (name, description, cover)
  - `Scene` (nodes, edges, viewport stored as JSON)
  - `NPC` (stats, personality, portrait URL)
  - `Quest` (objectives, status)
  - `Variable` (local/global, all types)
  - `Session` (notes, date, duration)
- [ ] Run initial Prisma migration
- [ ] Set up `.env` files (database, API secrets)

### Deliverable
- Functional database schema
- All npm dependencies installed
- Basic server/client structure ready
- No UI yet

---

## Phase 2: Authentication & Settings System ⬜

### Tasks
- [ ] Build Express auth middleware (JWT)
- [ ] Create user login/register endpoints
- [ ] Build React login/register pages
- [ ] Build settings page component
- [ ] Implement API key management UI:
  - Add API key input (masked)
  - Select Claude model (dropdown)
  - Test API key on save
  - Remove/clear key
- [ ] Create backend endpoints:
  - POST `/api/settings/anthropic` (save key + model)
  - GET `/api/settings/anthropic` (retrieve settings)
  - POST `/api/settings/test-key` (validate)
- [ ] Implement encryption for API keys at rest
- [ ] Add auth guards to all protected routes

### Deliverable
- Users can register/login
- Users can manage Anthropic API keys and model selection
- Settings persisted to database
- API keys never exposed to frontend after save

---

## Phase 3: Core Node Editor Canvas ⬜

### Tasks
- [ ] Set up React Flow in client
- [ ] Create EditorCanvas component with:
  - Pan/zoom controls
  - Minimap
  - Background grid
  - Viewport state management
- [ ] Build node palette (drag-and-drop):
  - Start, Dialogue, Choice, Branch
  - Variable Set/Get, NPC, Encounter, Quest
  - Run Scene, Comment
- [ ] Implement Zustand store for editor state:
  - Current nodes/edges
  - Selected elements
  - Panel visibility
  - Undo/redo stack (basic)
- [ ] Build properties panel:
  - Node selection UI
  - Edit node data based on type
  - Delete node/edge
- [ ] Connect to backend:
  - Load scene from database
  - Save scene (debounced)
  - Create/delete scenes

### Deliverable
- Functional node editor canvas
- Can create/edit/delete nodes
- Can connect nodes with edges
- Can save/load scenes from database
- Properties panel works for basic editing

---

## Phase 4: Node Type Components ⬜

### Tasks
- [ ] Create individual node components:
  - **Start**: Just entry point
  - **Dialogue**: Speaker, text, NPC reference
  - **Choice**: Prompt, choices array
  - **Branch**: Conditions (variable/operator/value)
  - **Variable Set**: Var name, operation (set/add/subtract/etc), value
  - **Variable Get**: Var name, output var
  - **NPC**: NPC selector, action type
  - **Encounter**: Name, monsters array (from D&D API)
  - **Quest**: Quest selector, action (start/update/complete)
  - **Run Scene**: Scene selector
  - **Comment**: Text, color
- [ ] Add node-specific handle positions (inputs/outputs)
- [ ] Implement validation for each node type
- [ ] Add icons/colors for visual distinction

### Deliverable
- All 11 node types fully functional in editor
- Each node has proper handles for connections
- Node data properly validated

---

## Phase 5: Variable Management System ⬜

### Tasks
- [ ] Create variable panel component
- [ ] Build variable list UI:
  - Show local vars (current scene)
  - Show global vars (campaign)
  - Create new variable
  - Edit/delete variable
  - Type selector (string, number, boolean)
- [ ] Implement variable state storage:
  - Local variables per scene (in Scene model)
  - Global variables per campaign (in Campaign model)
- [ ] Add variable references in nodes:
  - Variable dropdowns in Branch/Set nodes
  - Validation that variables exist
  - Visual indicators for undefined vars
- [ ] Backend endpoints:
  - POST `/api/campaigns/{id}/variables` (create)
  - PATCH `/api/variables/{id}` (update)
  - DELETE `/api/variables/{id}` (delete)
  - GET `/api/scenes/{id}/variables` (list local)
  - GET `/api/campaigns/{id}/variables` (list global)

### Deliverable
- Users can create/edit/delete variables
- Variables properly scoped (local/global)
- Node references validated
- Proper error messages for undefined vars

---

## Phase 6: Scene Management ⬜

### Tasks
- [ ] Build scene list sidebar
- [ ] Implement scene operations:
  - Create new scene
  - Rename scene
  - Delete scene
  - Duplicate scene
  - Reorder scenes
- [ ] Scene switching logic:
  - Save current scene before switching
  - Load new scene into editor
  - Clear undo/redo stack on switch
- [ ] Backend endpoints:
  - POST `/api/campaigns/{id}/scenes` (create)
  - PATCH `/api/scenes/{id}` (update metadata)
  - DELETE `/api/scenes/{id}`
  - POST `/api/scenes/{id}/duplicate`
  - PATCH `/api/campaigns/{id}/scenes/reorder`
- [ ] Implement "Run Scene" node functionality

### Deliverable
- Full scene management UI
- Users can organize campaign into multiple scenes
- Scene switching works smoothly
- Run Scene node resolves properly

---

## Phase 7: D&D Data Integration ⬜

### Tasks
- [ ] Integrate D&D 5e API (open5e.com):
  - Get monsters for Encounter node
  - Get NPC stat templates
  - Get spell/ability references
- [ ] Build NPC library:
  - NPC creation form (name, race, class, stats, personality, portrait)
  - NPC list view
  - Search/filter NPCs
  - Link NPCs to dialogue nodes
- [ ] Build Encounter setup:
  - Monster selector from D&D API
  - Add multiple monsters to encounter
  - CR calculation
  - Difficulty assessment
- [ ] Build Quest system:
  - Quest creation form
  - Quest objectives (checklist items)
  - Link quests to Quest nodes
  - Quest status tracking

### Deliverable
- Full NPC library system
- Encounter builder with D&D API integration
- Quest tracking system
- All nodes properly linked to campaign data

---

## Phase 8: AI Integration (Anthropic API) ⬜

### Tasks
- [ ] Create `anthropicService.ts`:
  - Initialize Anthropic client with user's API key
  - Handle model selection
  - Error handling and logging
- [ ] Implement AI endpoints:
  - POST `/api/ai/generate-dialogue` (generate NPC dialogue)
  - POST `/api/ai/generate-npc` (generate NPC profile)
  - POST `/api/ai/suggest-branches` (suggest story branches)
  - POST `/api/ai/generate-quest` (suggest quest hooks)
  - POST `/api/ai/analyze-campaign` (review story flow)
- [ ] Add AI buttons to UI:
  - Generate dialogue in Dialogue node
  - Generate NPC in NPC library
  - Suggest branches in Branch node
  - Generate quest objectives
- [ ] Add context passing:
  - Send relevant campaign data to Claude
  - Send character context for coherent suggestions
  - Send story so far for consistency
- [ ] Implement streaming responses for long text
- [ ] Error handling if no API key configured

### Deliverable
- Users can generate content using their own API keys
- All AI features integrated
- Proper error handling and user feedback
- Respects user's model selection

---

## Phase 9: Runtime Engine & Preview Mode ⬜

### Tasks
- [ ] Build graph traversal engine:
  - Find Start node
  - Execute nodes in sequence
  - Follow edges based on connections
  - Handle Branch logic (evaluate conditions)
  - Track execution history
- [ ] Implement node executors:
  - Each node type returns result/next node ID
  - Variable Set/Get modifies execution context
  - Run Scene jumps to other scene
  - Choice pauses for player input
- [ ] Create runtime UI:
  - Dialogue display (speaker + text)
  - Choice buttons for player input
  - NPC portrait display
  - Encounter summary display
  - Quest objectives display
- [ ] Build debugger panel:
  - Watch variables (local + global)
  - Current node highlight
  - Execution history
  - Pause/resume/step execution
- [ ] Backend endpoints:
  - POST `/api/campaigns/{id}/execute/start` (begin)
  - POST `/api/campaigns/{id}/execute/choice` (choose)
  - POST `/api/campaigns/{id}/execute/next` (advance)
  - POST `/api/campaigns/{id}/execute/state` (get current state)

### Deliverable
- Full runtime engine
- Users can "play through" their campaign
- Debugger helps troubleshoot
- All node types execute properly

---

## Phase 10: Polish & Export ⬜

### Tasks
- [ ] Implement auto-save:
  - Debounced saves while editing
  - Local storage backup (30s interval)
  - Conflict resolution (timestamp-based)
- [ ] Add undo/redo:
  - Store history in Zustand
  - Limit to last 50 actions
  - Keyboard shortcuts (Ctrl+Z/Ctrl+Shift+Z)
- [ ] Implement keyboard shortcuts:
  - Delete (Del key)
  - Copy/Paste (Ctrl+C/V)
  - Select All (Ctrl+A)
  - Undo/Redo
- [ ] Build campaign dashboard:
  - Campaign list view
  - Create new campaign
  - Campaign metadata editor
  - Session log (notes from playtesting)
- [ ] Implement export features:
  - Export scene to JSON
  - Export campaign as JSON
  - Export as PDF (campaign guide)
  - Share link (view-only)
- [ ] UI Polish:
  - Dark/light theme toggle
  - Responsive design
  - Better error messages
  - Loading states
  - Success notifications

### Deliverable
- Fully polished application
- All save/load features working
- Export capabilities
- Campaign management dashboard
- Professional UX

---

## Context Management Strategy

### Phases 1-3 (Setup + Foundation)
- **Estimated tokens**: 20-25k
- **Checkpoint**: Save after Phase 3
- Commit to git: "Phase 1-3: Setup, auth, core editor"

### Phases 4-6 (Nodes + Variables + Scenes)
- **Estimated tokens**: 15-20k
- **Checkpoint**: Save after Phase 6
- Commit to git: "Phase 4-6: Node types, variables, scenes"

### Phases 7-8 (D&D + AI)
- **Estimated tokens**: 15-20k
- **Checkpoint**: Save after Phase 8
- Commit to git: "Phase 7-8: D&D integration, AI"

### Phases 9-10 (Runtime + Polish)
- **Estimated tokens**: 15-20k
- **Checkpoint**: Save after Phase 10
- Commit to git: "Phase 9-10: Runtime, polish, export"

---

## Unresolved Questions

1. **Database choice**: Use PostgreSQL locally or cloud (AWS RDS)?
2. **Authentication**: Simple JWT or social login (Google/Discord)?
3. **Hosting**: Self-hosted, Vercel, or custom deployment?
4. **File storage**: Where to store portraits/maps (S3, Cloudinary, local)?
5. **Real-time collaboration**: Single-user only or multi-user later?

---

## Current Status

✅ **Completed**: Project planning, tech stack decision, workflow setup
⬜ **To Start**: Phase 1 (Project Setup & Database Foundation)

**Next Step**: Exit plan mode and begin Phase 1 execution
