● Here's your testing guide:

  Quick Testing Guide

  1. Start the Servers

  # Terminal 1 - Backend
  cd server
  npm run dev

  # Terminal 2 - Frontend
  cd client
  npm run dev

  Then visit http://localhost:5173

  2. Create an Account & Configure API Key

  1. Click Register and create a test account
  2. Log in with your credentials
  3. Go to Settings (gear icon or top menu)
  4. In the API Key section:
    - Paste your Anthropic API key (from https://console.anthropic.com)
    - Select a Claude model:
      * Claude Sonnet 4.5 (Balanced) - claude-sonnet-4-5-20250929
      * Claude Haiku 4.5 (Fast) - claude-haiku-4-5-20251001
    - Click Test to validate
    - Click Save

  3. Create a Campaign and Scene

  1. Go to Campaigns page
  2. Create a new campaign (e.g., "Dragon's Quest")
  3. Create a scene within it (e.g., "Tavern Meeting")
  4. This opens the Node Editor

  4. Test AI Features

  Option A: Generate Dialogue
  1. From the Node Palette (left side), drag a Dialogue node onto the canvas
  2. Click the node to select it
  3. In the Properties Panel (right), you'll see the node properties
  4. Scroll down and click the ✨ AI button
  5. Enter a speaker name (e.g., "Innkeeper") and click "✨ Generate"
  6. Claude will generate dialogue - edit if needed
  7. Click "✓ Apply" to add it to the node

  Option B: Test All AI Features

  The AI Assistant modal (same ✨ AI button) supports:
  - Dialogue: Generate NPC dialogue
  - NPC: Generate full NPC profiles with personality, backstory, class/race suggestions
  - Branches: Suggest story plot hooks
  - Quest: Generate complete quests with objectives

  5. Test via API (Using cURL or Postman)

  If you want to test the backend directly:

  # 1. Register
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

  # 2. Login (get token)
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'

  # 3. Save API key to settings
  curl -X POST http://localhost:3000/api/settings/anthropic \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -d '{"apiKey":"sk-ant-...","model":"claude-sonnet-4-5-20250929"}'

  # 4. Test API key (optional)
  curl -X POST http://localhost:3000/api/settings/anthropic/test \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -d '{"apiKey":"sk-ant-...","model":"claude-sonnet-4-5-20250929"}'

  # 5. Generate dialogue
  curl -X POST http://localhost:3000/api/ai/generate-dialogue \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -d '{
      "speaker":"Wizard",
      "npcPersonality":"mysterious and wise",
      "sceneSoFar":"The party enters an ancient tower"
    }'

  6. Troubleshooting

  "API key not configured" error:
  - Make sure you've saved your API key in Settings
  - The key must be a valid Anthropic key (starts with sk-ant-)
  - Try clicking "Test" to verify it works

  AI button not appearing:
  - Make sure you've selected a Dialogue node
  - Check browser console for errors (F12 → Console)
  - Reload the page

  No response from Claude:
  - Check that your API key has remaining credits at https://console.anthropic.com
  - Verify the model name is correct
  - Check server logs in Terminal 1 for errors

  7. What to Look For

  ✅ Dialogue generation - Should create realistic NPC dialogue
  ✅ NPC profiles - Should suggest D&D class/race and personality
  ✅ Story branches - Should suggest 2-3 plot continuations
  ✅ Quest generation - Should create a complete quest with objectives
  ✅ Error handling - Should show clear messages if API key is missing

  Let me know if you hit any issues!