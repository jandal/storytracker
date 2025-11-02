# StoryTracker - D&D Campaign Story Editor

A web-based visual node editor for Dungeon Masters to create branching campaign narratives with dialogue trees, NPC management, encounters, and quests.

## Features

- **Visual Node Editor**: Drag-and-drop node-based story creation (inspired by Unreal Blueprints)
- **Campaign Management**: Organize stories into multiple scenes
- **NPC Library**: Create and manage NPCs with D&D stats
- **Quest Tracking**: Track quest objectives and status
- **Variable System**: Local and global variables for campaign state
- **AI Assistant**: Generate content using Anthropic Claude API (user-provided keys)
- **Runtime Preview**: Play through your campaign to test it

## Tech Stack

- **Frontend**: React 18 + TypeScript, React Flow, Zustand, Tailwind CSS
- **Backend**: Node.js + Express, PostgreSQL, Prisma ORM
- **AI**: Anthropic Claude API (optional, user-configured)

## Project Structure

```
storytracker/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript types
├── IMPLEMENTATION_PLAN.md
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb storytracker
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/storytracker"
JWT_SECRET="your-secret-key-here"
ENCRYPTION_KEY="32-character-encryption-key-here"
CORS_ORIGIN="http://localhost:5173"
```

### 3. Install Dependencies

Server:
```bash
cd server
npm install
```

Client:
```bash
cd client
npm install
```

Shared (for types):
```bash
cd shared
npm install
```

### 4. Database Migration

```bash
cd server
npm run db:migrate
```

### 5. Start Development Servers

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173`

## Current Status

**Phase 1: Project Setup & Database Foundation** ✅
- ✅ Monorepo structure created
- ✅ TypeScript configured
- ✅ Prisma schema defined
- ✅ Basic server/client skeleton
- ⏳ Database migrations not yet created (requires PostgreSQL setup)
- ⏳ Dependencies not yet installed

Next: Phase 2 - Authentication & Settings System

## Implementation Phases

See `IMPLEMENTATION_PLAN.md` for complete multi-phase plan with:
- Detailed tasks for each phase
- Context management strategy
- Checkpoint locations for context resets

## Contributing

This is a personal project. Feel free to fork and customize!

## License

MIT
