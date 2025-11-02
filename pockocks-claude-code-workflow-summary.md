# How I use Claude Code for real engineering

**Video by:** Matt Pocock  
**Duration:** 10 minutes  
**Published:** 27 October 2025

## Overview

A walkthrough demonstrating a sophisticated workflow for tackling large coding projects using Claude Code's plan mode and multi-phase planning approach.

## Key Takeaways

### Planning-First Approach

- Starts with a rough dictated prompt rather than over-thinking initial specifications
- Uses plan mode to force exploration of the codebase before writing code
- Claude Code generates clarifying questions to refine requirements
- Creates multi-phase plans to handle work spanning multiple context windows

### Custom Rules Configuration

His user memory file (43 lines) includes crucial rules:

- **"Be extremely concise and sacrifice grammar for the sake of concision"** - his favourite rule that keeps plans readable
- Requests unresolved questions at the end of each plan
- GitHub CLI preference for version control operations
- Branch naming convention: prefix with "Matt" to indicate his work
- Specific preferences for PR comments and changesets

### Context Window Management

- Monitors context usage throughout implementation using the `context` command
- Preserves plans across context resets by storing them as GitHub issues
- Can clear context window and resume by referencing the GitHub issue
- Started with 83.7% free space after initial planning
- Phase one used only ~3k tokens

### Implementation Strategy

- **Aggressive auto-accept during implementation phases** after thorough planning
- Stages changes between phases for clarity
- Reviews in VS Code using standard git diff
- Can exit Claude Code (Ctrl+C twice), run CLI commands, then resume with `claude continue`
- Uses `code .` to open VS Code from terminal

### Multi-Phase Planning Benefits

- Breaks large features into manageable chunks
- Each phase uses relatively few tokens (around 3k in his example)
- Phases can span multiple context windows
- GitHub issues enable async collaboration and commenting
- Issues store completed and pending phases with checkboxes

## The Workflow in Detail

### 1. Initial Setup

- Write initial prompt (can be dictated)
- Activate plan mode (shift+tab)
- Submit prompt to trigger exploration

### 2. Planning Phase

- Claude Code explores codebase structure
- Asks clarifying questions (multi-step form)
- Generates concise plan with:
  - New files to create
  - Files to update
  - Implementation steps
  - **Unresolved questions**

### 3. Multi-Phase Breakdown

- If work is substantial, request multi-phase plan
- Prevents context window overflow
- Creates clear implementation stages

### 4. Implementation

- Switch to auto-accept mode
- Execute phases sequentially
- Check context usage between phases
- Stage or commit changes after each phase

### 5. Context Reset (if needed)

- Create GitHub issue with complete plan (checked and unchecked items)
- Clear context window
- Resume by referencing issue: "Get GitHub issue #24 and enact phase 4"

## Top Tips from Matt

1. **Add concision rule to memory file** - makes plans readable and efficient
2. **Request unresolved questions** at the end of each plan
3. **Use GitHub CLI** to create issues for sharing context across multiple context windows
4. **Monitor context window** regularly to avoid surprises
5. **Multi-phase planning** for any substantial feature work

## Custom Status Line

Matt's terminal shows:
- Current repo relative to repos folder
- Current branch
- Staged, unstaged, and new files count

He wishes Claude Code would add token usage to the status line (like Cursor does).

## Example Project

The demonstration involved adding a CLI command to an internal tool for AI Hero courses, specifically a command to get commit diffs with flexible exercise number matching.

## Workflow Benefits

This approach combines:
- Upfront rigorous planning
- Efficient AI-assisted implementation
- Code quality maintenance
- Developer control
- Async collaboration capability

## Links

- [AI Hero Workshops](https://www.aihero.dev/workshops/ai-sdk-v5-crash-course)
- [Matt Pocock on Twitter](https://twitter.com/mattpocockuk)
- [AI Hero Discord](https://aihero.dev/discord)

---

**Video URL:** https://www.youtube.com/watch?v=kZ-zzHVUrO4
