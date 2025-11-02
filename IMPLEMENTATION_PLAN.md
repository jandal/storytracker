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

## Phase 1: Project Setup & Database Foundation ✅

### Tasks
- [x] Create root `package.json` (monorepo support)
- [x] Initialize `/client` with Vite + React + TypeScript
- [x] Initialize `/server` with Express + TypeScript
- [x] Initialize `/shared` with TypeScript types/schemas
- [x] Create Prisma schema with all models
- [x] Set up `.env` files (database, API secrets)

### Deliverable
✅ Functional database schema, TypeScript configs, basic server/client skeleton

---

## Phase 2: Authentication & Settings System ✅

### Tasks
- [x] Build Express auth middleware (JWT)
- [x] Create user login/register endpoints
- [x] Build React login/register pages
- [x] Build settings page component
- [x] Implement API key management UI:
  - [x] Add API key input (masked)
  - [x] Select Claude model (dropdown)
  - [x] Test API key on save
  - [x] Remove/clear key
- [x] Create backend endpoints:
  - [x] POST `/api/auth/register` (user registration)
  - [x] POST `/api/auth/login` (user login)
  - [x] GET `/api/auth/me` (current user)
  - [x] GET `/api/settings` (get settings)
  - [x] POST `/api/settings/anthropic` (save key + model)
  - [x] POST `/api/settings/anthropic/test` (validate)
  - [x] DELETE `/api/settings/anthropic` (remove key)
- [x] Implement encryption for API keys at rest (AES-256-CBC)
- [x] Add auth guards to all protected routes
- [x] Zustand store for auth state
- [x] Protected route component
- [x] Home page with navigation

### Deliverable
✅ Full authentication system, settings management, API key encryption, protected routes

---

## Phase 3: Core Node Editor Canvas ✅

### Tasks
- [x] Set up React Flow in client with minimap/controls
- [x] Create EditorCanvas component with:
  - [x] Pan/zoom controls
  - [x] Minimap
  - [x] Background grid
  - [x] Node click selection
- [x] Build node palette (drag-and-drop):
  - [x] Start, Dialogue, Choice, Branch nodes
  - [x] Drag-to-canvas node creation
- [x] Implement Zustand editor store:
  - [x] Current nodes/edges management
  - [x] Selected elements
  - [x] Panel visibility toggle
- [x] Build properties panel:
  - [x] Node selection UI
  - [x] Edit label, description
  - [x] Dialogue-specific: speaker, text
  - [x] Choice-specific: prompt
  - [x] Delete node functionality
- [x] Build BaseNode component with handles
- [x] Create individual node types (Start, Dialogue, Choice, Branch)
- [x] Routing setup for editor page
- [x] Campaign list page UI
- [x] Home page links to campaigns

### Deliverable
✅ Fully functional node editor canvas with drag-to-create, selection, properties panel

---

## Phase 4: Node Type Components ✅

### Tasks
- [x] Create all 11 node components:
  - [x] **Start**: Green, entry point (no input)
  - [x] **Dialogue**: Blue, speaker/text
  - [x] **Choice**: Purple, prompt/choices
  - [x] **Branch**: Orange, conditions
  - [x] **Variable Set**: Cyan, name/operation/isGlobal
  - [x] **Variable Get**: Cyan, name/output
  - [x] **NPC**: Red, action type
  - [x] **Encounter**: Dark red, name/monsters/difficulty
  - [x] **Quest**: Yellow, action (start/update/complete/fail)
  - [x] **Run Scene**: Indigo, sceneName/returnToSource
  - [x] **Comment**: Gray, text (no I/O)
- [x] Add proper handles (Start/Comment: no input, Comment: no output)
- [x] Update NodePalette with all 11 types
- [x] Update EditorCanvas with all node type mappings
- [x] Extend PropertiesPanel with all type-specific fields
- [x] Add icons/colors for visual distinction

### Deliverable
✅ All 11 node types fully functional with drag-to-create, properties editing, visual styling

---

## Phase 5: Variable Management System ✅

### Tasks
- [x] Create Zustand variable store
  - [x] Local/global variable state
  - [x] CRUD operations
  - [x] Query methods
- [x] Build VariablesPanel component:
  - [x] Add new variable UI
  - [x] List local variables
  - [x] List global variables
  - [x] Edit variable values
  - [x] Delete variables
  - [x] Type selector (string, number, boolean)
- [x] Create VariableItem sub-component:
  - [x] Display variable info
  - [x] Edit mode with type-appropriate input
  - [x] Save/cancel buttons
- [x] Integrate into EditorPage:
  - [x] Tab system (Properties/Variables)
  - [x] Pass scene/campaign IDs
- [x] Backend variable endpoints:
  - [x] GET `/api/variables/global/campaigns/{campaignId}`
  - [x] POST `/api/variables/global/campaigns/{campaignId}`
  - [x] PATCH `/api/variables/global/{variableId}`
  - [x] DELETE `/api/variables/global/{variableId}`
  - [x] GET `/api/variables/local/scenes/{sceneId}`
  - [x] POST `/api/variables/local/scenes/{sceneId}`
  - [x] PATCH `/api/variables/local/{variableId}`
  - [x] DELETE `/api/variables/local/{variableId}`
- [x] Add variable API client methods
- [x] Wire routes to server

### Deliverable
✅ Full variable management system with local/global scoping, UI, and backend endpoints

---

## Phase 6: Scene Management ✅

### Tasks
- [x] Backend campaign endpoints:
  - [x] GET `/api/campaigns` (list user's campaigns)
  - [x] POST `/api/campaigns` (create campaign)
  - [x] GET `/api/campaigns/{campaignId}` (get campaign with scenes)
  - [x] PATCH `/api/campaigns/{campaignId}` (update campaign)
  - [x] DELETE `/api/campaigns/{campaignId}` (delete campaign)
- [x] Backend scene endpoints:
  - [x] GET `/api/campaigns/{campaignId}/scenes` (list scenes)
  - [x] POST `/api/campaigns/{campaignId}/scenes` (create scene)
  - [x] GET `/api/campaigns/{campaignId}/scenes/{sceneId}` (get scene)
  - [x] PATCH `/api/campaigns/{campaignId}/scenes/{sceneId}` (update scene)
  - [x] POST `/api/campaigns/{campaignId}/scenes/{sceneId}/graph` (save graph)
  - [x] DELETE `/api/campaigns/{campaignId}/scenes/{sceneId}` (delete scene)
  - [x] POST `/api/campaigns/{campaignId}/scenes/{sceneId}/duplicate` (duplicate scene)
  - [x] PATCH `/api/campaigns/{campaignId}/scenes/reorder` (reorder scenes)
- [x] Campaign and scene controllers with full CRUD
- [x] Campaign routes with auth middleware
- [x] Add campaign/scene API client methods
- [x] Wire campaigns routes to server

### Deliverable
✅ Full campaign and scene CRUD with backend persistence

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

✅ **Completed**: Phases 1-6 (Setup, Auth, Settings, Node Editor, Node Types, Variables, Scenes)
⏳ **In Progress**: Phase 7 (D&D Data Integration)

**Context**: ~127k tokens used (63%), ~73k available (37%)

**Next Step**: Build NPC and Encounter systems with D&D 5e API
