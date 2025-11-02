# Claude Code Multi-Phase Workflow: Generic Guide

## Core Principles

This workflow is designed for tackling substantial projects that may span multiple context windows, requiring careful planning and phased execution.

### Key Concepts

- **Planning before execution** - Explore and clarify requirements before implementation
- **Context window management** - Monitor and preserve work across sessions
- **Multi-phase breakdown** - Divide large work into manageable chunks
- **External persistence** - Store plans in accessible locations for resumption

---

## The Four-Stage Process

### Stage 1: Initial Prompt & Exploration

**What to do:**
- Write an initial prompt (can be rough/dictated)
- Activate **plan mode** (Shift+Tab in Claude Code)
- Submit to trigger exploration

**What happens:**
- Claude Code explores your workspace/files
- Identifies clarifying questions
- Presents questions in multi-step form

**Outcome:** Clear understanding of requirements before any work begins

---

### Stage 2: Planning Phase

**What to do:**
- Answer clarifying questions
- Review initial plan
- Request multi-phase plan if work is substantial

**What happens:**
- Claude generates concise plan with:
  - New items to create
  - Existing items to update
  - Implementation steps
  - Unresolved questions

**Decision point:** Choose to auto-accept, manually approve, or keep planning

**Key tip:** If work seems large, request: "Make this plan multi-phase"

---

### Stage 3: Phased Execution

**What to do:**
- Switch to auto-accept mode (after thorough planning)
- Execute phases sequentially
- Check context usage between phases: `context` command
- Save/stage work after each phase

**What happens:**
- Each phase uses relatively few tokens (~3k in examples)
- Clear progress markers
- Manageable review points

**Monitor:** Context window usage throughout execution

---

### Stage 4: Context Reset (When Needed)

**What to do when approaching context limits:**

1. Create persistent record of plan (GitHub issue, document, ticket, etc.)
2. Include completed phases (checked) and pending phases (unchecked)
3. Clear context window
4. Resume by referencing stored plan: "Get [reference] and enact phase [X]"

**Benefits:**
- Enables async collaboration
- Others can comment/update
- Work preserved across sessions
- Context window reset without losing progress

---

## Custom Configuration

### Memory File Setup

Create rules in your user memory file (access via `memory` command) to optimise Claude's behaviour:

**Essential rules:**

```
Be extremely concise and sacrifice grammar for the sake of concision
```
↳ Makes plans readable and scannable

```
At the end of each plan, provide a list of unresolved questions
```
↳ Surfaces issues before execution begins

**Optional rules based on your workflow:**
- Preferred tools or systems
- Naming conventions
- Output formatting preferences
- Integration patterns

**Keep it light:** 40-50 lines is sufficient

---

## Commands & Controls

### During Work

| Command | Purpose |
|---------|---------|
| `context` | Check token usage and context window status |
| `memory` | Access/edit your configuration rules |
| Ctrl+C (twice) | Exit Claude Code |
| `claude continue` | Resume after running external commands |

### Mode Switching

- **Shift+Tab**: Cycle through modes (plan/auto-accept/manual)
- **Plan mode**: Forces exploration before action
- **Auto-accept mode**: Faster execution after planning complete

---

## Context Window Management Strategy

### Monitoring

Check context regularly during work:
- After initial planning
- Between phases
- Before major work chunks

### Typical Usage Patterns

- Initial exploration + planning: ~30-35k tokens
- Each implementation phase: ~3-5k tokens
- Fresh context window: ~16k tokens (system only)

### When to Reset

Reset context when:
- Approaching 80-90% capacity
- Moving to substantially different work area
- Needing async collaboration
- Work naturally pauses between major sections

---

## Best Practices

### Planning Stage

1. **Don't over-specify initially** - rough prompts work well
2. **Use plan mode for large work** - forces proper exploration
3. **Answer clarifying questions thoroughly** - saves rework
4. **Request multi-phase for substantial features** - prevents context overflow

### Execution Stage

1. **Be aggressive with auto-accept after planning** - trust the plan
2. **Stage/commit between phases** - clear progress markers
3. **Review outputs in your preferred tool** - maintain quality
4. **Tell Claude about external changes** - "Pull files into your context"

### Collaboration & Persistence

1. **Use external systems for plan storage** - issues, tickets, documents
2. **Include completion status** - checked/unchecked items
3. **Enable async updates** - others can comment and modify
4. **Reference stored plans when resuming** - "Get [plan] and continue phase [X]"

---

## Workflow Benefits

This approach provides:

- **Rigorous upfront planning** without premature execution
- **Efficient assisted work** with AI handling implementation details
- **Quality maintenance** through phased review
- **Control retention** via manual oversight points
- **Async collaboration** through external plan persistence
- **Scalability** beyond single context window limits

---

## Quick Reference Checklist

**Before starting large work:**
- [ ] Activate plan mode
- [ ] Submit initial prompt
- [ ] Answer clarifying questions
- [ ] Request multi-phase if needed
- [ ] Review and refine plan

**During execution:**
- [ ] Monitor context usage
- [ ] Stage/commit between phases
- [ ] Review outputs
- [ ] Tell Claude about external changes

**When approaching limits:**
- [ ] Create external plan record
- [ ] Mark completed/pending phases
- [ ] Reset context window
- [ ] Resume with plan reference

---

## Customisation Points

Adapt this workflow to your domain by adjusting:

- **Plan storage location** - issues, tickets, docs, wikis, etc.
- **Review tools** - your preferred diff/review interface
- **Naming conventions** - branches, files, tickets, etc.
- **Integration points** - CLI tools, APIs, platforms
- **Concision level** - balance between brevity and clarity
- **Phase granularity** - size of work chunks

---

## Common Scenarios

### Scenario: Large analytical project
- Use plan mode to explore data sources
- Multi-phase for different analysis stages
- Store interim results between phases
- Review findings at phase boundaries

### Scenario: Documentation creation
- Plan content structure first
- Phase by major sections/chapters
- External storage for outline
- Review and refine incrementally

### Scenario: Complex configuration
- Explore existing setup thoroughly
- Multi-phase for different config areas
- Test between phases
- Document changes as you go

### Scenario: Research compilation
- Plan research approach first
- Phase by research questions
- Store findings externally
- Synthesise at final phase

---

*This workflow emphasises planning, phased execution, and context management - principles applicable across diverse projects and domains.*
