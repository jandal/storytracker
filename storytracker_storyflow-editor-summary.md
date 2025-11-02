# StoryFlow Editor - Tool Overview

**Video Title:** 🔥Making Story Games? You NEED This Tool!  
**Channel:** Soulstices Dev.  
**Upload Date:** 31 October 2025  
**Duration:** 7 minutes  
**Release Date:** 6 November 2025 (Steam)

## Links
- **Steam:** https://store.steampowered.com/app/4088380/StoryFlow_Editor/
- **Discord:** https://discord.com/invite/3mp5vyKRtN
- **Website:** https://storyflow-editor.com/
- **Patreon:** https://www.patreon.com/c/soulstices/

## Overview

StoryFlow Editor is a node-based visual editor for creating interactive narrative games. The developer spent two years building this tool, which requires no coding and allows designers to create complex branching stories with player-driven experiences.

## Key Features

### 1. Modular Story Structure (00:34)
- Split complex narratives into separate files rather than managing one massive flowchart
- Store conversations with different characters in different files
- Launch different scripts using "run script" nodes
- Improves manageability as projects grow

### 2. Variable Management (01:15)
- **Local Variables:** Confined to individual files, stored and usable only within that file
- **Global Variables:** Marked with a globe icon, accessible across any file in the project
- Global variable states persist when switching between scripts

### 3. Code Reusability (01:37)
- Create reusable logic scripts that can be called from anywhere in the project
- Example demonstrated: NPC visit counter
  - Create a global integer variable to track visits
  - Move increment logic into a separate file
  - Call this file using "run script" from any dialogue
- Eliminates need to copy and paste logic across multiple files

### 4. Conditional Logic (02:47)
- Branch nodes with comparison operators:
  - Greater than
  - Less than
  - Equals
- Combine multiple variables for sophisticated branching logic
- Create dynamic dialogue based on variable states

### 5. Runtime Debugger (03:18)
- Track variable changes in real-time during testing
- Small button in top right corner opens debugger panel
- Variable values update instantly during runtime
- Essential for testing and troubleshooting

### 6. Blueprint-Style Interface (03:40)
- Visual scripting system similar to Unreal Engine Blueprints
- **Advantages:**
  - Easy transition for developers already familiar with Blueprints
  - Provides foundation for learning Blueprints for those new to visual scripting
  - Familiar workflow for UE developers

### 7. Performance Optimisation (04:17)
- Viewport culling technique: only renders nodes currently visible in viewport
- Acknowledged challenges with extremely large numbers of nodes in a single file
- Mitigated by splitting stories into multiple files
- Ongoing monitoring and improvements planned throughout development

### 8. Comments Feature (05:18)
- Ability to add comments to nodes
- Document information that might be forgotten during breaks from the project
- Essential for project maintenance and collaboration

### 9. User Interface (05:36)
- Refined, polished interface after significant development time
- Evolution shown: dialogue editing window moved from popup to resizable right panel
- Space-efficient design
- Positive feedback from community

## Technical Details

### Current Integration
- JSON export feature available
- Requires custom coding for parsing and working with output JSON
- Suitable for developers comfortable with custom integration

### Planned Plugins
The developer plans to release official plugins for:
- Unreal Engine
- Unity
- Godot

These plugins will handle parsing and integration automatically, making the process seamless and straightforward.

## Development Philosophy

The Steam release represents **Phase 1** of the project. The developer emphasises the importance of establishing a solid foundation before expanding with engine plugins. Community feedback through Steam reviews and Discord is crucial for refining the core tool.

### Community Engagement
- Steam reviews requested for feedback
- Discord community poll to determine which engine plugin should be developed first
- Active community involvement in development priorities

## Video Chapters

- 00:00 - Introduction
- 00:34 - Splitting Stories Into Multiple Files
- 01:15 - Local and Global Variables
- 01:37 - Code Reusability
- 02:47 - Conditional Logic
- 03:18 - Runtime Debugger
- 03:40 - Similarity to Unreal Engine Blueprints
- 04:17 - Performance
- 05:18 - Comments
- 05:36 - User Interface
- 06:09 - The Foundation

## Use Cases

Ideal for:
- Game developers creating narrative-driven games
- Writers wanting to design interactive stories
- Teams building branching dialogue systems
- Developers familiar with or wanting to learn Blueprint-style visual scripting
- Projects requiring no-code solutions for story implementation

## Summary

StoryFlow Editor provides a comprehensive, visual approach to interactive storytelling with a focus on scalability, reusability, and ease of use. The Blueprint-inspired interface makes it accessible to developers while remaining approachable for non-programmers. The modular architecture and variable management systems support complex narrative structures, whilst the planned engine integrations will make implementation straightforward across major game engines.
