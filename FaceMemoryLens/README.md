# Face Memory Lens - POC for Spectacles

A proof-of-concept Spectacles lens that displays conversation memories above detected faces.

## 🎯 What This Does

When you look at someone, this lens displays a text bubble showing:
- ✅ **2 bullet points** of things you last talked about
- ✅ **1 suggested question** to ask them

**Current Version:** Uses hardcoded data for demonstration

**Future Version:** Will integrate with AI to generate personalized conversation memories

## 📁 Project Structure

```
FaceMemoryLens/
├── Assets/
│   └── Scripts/
│       ├── FaceMemoryController.ts      # Full version with face tracking
│       └── SimpleMemoryDisplay.ts       # Simple version (easier to test)
└── README.md
```

## 🚀 Quick Start

### Option 1: Simple Version (Recommended for Testing)

This version displays memory bubbles in front of you without requiring face detection setup.

### Option 2: Face Tracking Version

Displays memory bubbles above detected faces (requires Head component setup).

## 📋 Setup Instructions

### Prerequisites

- **Lens Studio**: v5.15.0+
- **Spectacles OS Version**: v5.64+
- **Target Platform**: Snap Spectacles (2024)

### Step 1: Create New Project in Lens Studio

1. Open Lens Studio
2. Create a new project
3. Set **Device Type Override** to `Spectacles (2024)`
4. File → Project Settings → Target: Spectacles

### Step 2: Add the Script

#### For Simple Version (No Face Tracking):

1. In the **Assets** panel, right-click → **Add New** → **Script**
2. Name it `SimpleMemoryDisplay`
3. Copy the contents of `Assets/Scripts/SimpleMemoryDisplay.ts`
4. Paste into the script file

#### For Face Tracking Version:

1. In the **Assets** panel, right-click → **Add New** → **Script**
2. Name it `FaceMemoryController`
3. Copy the contents of `Assets/Scripts/FaceMemoryController.ts`
4. Paste into the script file

### Step 3: Set Up the Scene

#### Simple Version Setup:

1. **Create Text Object:**
   - In **Objects** panel, click **+** → **Text** → **3D Text**
   - Rename to "Memory Display"

2. **Create Parent Object:**
   - Click **+** → **Empty** → **Scene Object**
   - Rename to "Memory Container"
   - Drag the "Memory Display" text to be a child of "Memory Container"

3. **Add Script Component:**
   - Select "Memory Container"
   - In **Inspector**, click **Add Component** → **Script**
   - Choose `SimpleMemoryDisplay`

4. **Configure Script:**
   - **Memory Text**: Drag the "Memory Display" text object here
   - **Distance**: 50 cm (how far in front)
   - **Height Offset**: 10 cm (how high)
   - **Show On Start**: ✅ Checked
   - **Update Interval**: 5 (cycles through memories every 5 seconds)

5. **Style the Text:**
   - Select "Memory Display" text
   - **Size**: 2-3 cm
   - **Font**: Choose readable font
   - **Color**: White or bright color
   - **Alignment**: Center
   - **Wrap**: Word wrap enabled

#### Face Tracking Version Setup:

1. **Add Face Tracking:**
   - Objects panel → **+** → **Face** → **Face Tracked Object**
   - This creates a Face object with Head component

2. **Create Text Bubble:**
   - Under the Face object, add **Text** → **3D Text**
   - Rename to "Memory Bubble"
   - Add a background panel if desired

3. **Add Script:**
   - Select the Face object
   - Add Component → Script → `FaceMemoryController`

4. **Configure:**
   - **Memory Text**: Drag the text component
   - **Memory Bubble**: Drag the parent object containing the text
   - **Head Component**: Should auto-fill with the Head component
   - **Vertical Offset**: 25 cm
   - **Forward Offset**: 15 cm

### Step 4: Test in Lens Studio

1. Click **Preview** button (or Cmd+P / Ctrl+P)
2. You should see the memory bubble appear
3. For simple version: Text follows your view
4. For face tracking: Text appears when a face is detected

### Step 5: Deploy to Spectacles

1. Connect your Spectacles to Lens Studio
2. Click **Push to Spectacles**
3. Put on your Spectacles
4. Test the lens!

## 📝 Customization

### Changing Memory Data

Edit the `memories` array in either script:

```typescript
private memories = [
    {
        person: "Alice",
        topics: [
            "Your first conversation point",
            "Your second conversation point"
        ],
        question: "Your suggested question?"
    },
    // Add more memories...
];
```

### Adjusting Position

**Simple Version:**
- `distance`: How far in front (50 = 50cm)
- `heightOffset`: How high (10 = 10cm)

**Face Tracking Version:**
- `verticalOffset`: Height above face
- `forwardOffset`: Distance in front of face

### Changing Update Speed

In `SimpleMemoryDisplay.ts`:
```typescript
@input
updateInterval: number = 5.0;  // Change to desired seconds
```

Set to `0` to disable auto-rotation.

## 🔄 Future AI Integration

To integrate with AI for real-time memory generation:

1. **Add Remote Service Gateway** for API calls
2. **Implement face recognition** to identify people
3. **Call AI API** with conversation history
4. **Update memory data** using:

```typescript
// For SimpleMemoryDisplay
this.addMemory(personName, topics, question);

// For FaceMemoryController
this.setMemoryData(personId, topics, question);
```

Example AI integration pattern:
```typescript
// Pseudo-code for future implementation
async function generateMemory(personId: string) {
    const response = await callAIAPI({
        personId: personId,
        conversationHistory: getHistory(personId),
        prompt: "Generate 2 conversation topics and 1 question"
    });

    this.setMemoryData(personId, response.topics, response.question);
}
```

## 🎨 Styling Tips

### Make it Look Better:

1. **Add Background Panel:**
   - Add Image component behind text
   - Use rounded rectangle
   - Semi-transparent background (alpha 0.7)

2. **Add Icon:**
   - Small brain 🧠 or chat 💬 icon above text

3. **Animations:**
   - Fade in/out when appearing
   - Subtle floating motion
   - Scale on interaction

4. **Font Choices:**
   - Use Montserrat or Roboto for readability
   - Size 2-3cm for comfort
   - Bold for headers, regular for body

## 🐛 Troubleshooting

### Text Not Showing:
- Check that text component is assigned in script
- Verify text has content (check Inspector)
- Make sure object is enabled

### Position is Wrong:
- Adjust `distance` and `heightOffset` parameters
- Check that camera transform is being found

### Face Not Detected (Face Tracking Version):
- Make sure Head component is properly attached
- Check lighting conditions
- Verify face tracking is enabled on Spectacles

### Script Not Running:
- Check console for errors (Window → Logger)
- Verify TypeScript compiles successfully
- Make sure Script component is added

## 📚 Related Examples

Based on patterns from:
- **Think Out Loud** - Head label positioning
- **AI Playground** - Text display and UI
- **Essentials** - Basic Spectacles patterns

## 🎯 Next Steps

### For Cal Hacks Demo:

1. ✅ **Current**: Hardcoded conversation memories
2. 🚧 **Next**: Integrate with speech recognition
3. 🚧 **Next**: Add AI to generate memories
4. 🚧 **Next**: Implement actual face recognition
5. 🚧 **Next**: Store conversation history
6. 🚧 **Next**: Add voice activation ("Hey Spectacles, who is this?")

### Production Features:

- Cloud storage for persistent memories
- Privacy controls
- Multi-user support
- Conversation summarization
- Context-aware questions
- Integration with calendar/email for context

## 📖 Documentation

- [Lens Studio API Docs](../scrape/developers.snap.com/lens-studio/api/lens-scripting/index.html)
- [Spectacles Design Guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)
- [TypeScript Definitions](../scrape/studio.d.ts)

## ⚡ Quick Test Commands

```typescript
// In Lens Studio console, test these:

// Cycle to next memory
this.nextMemory();

// Go to previous memory
this.previousMemory();

// Add new memory
this.addMemory("Test Person", ["Topic 1", "Topic 2"], "Test question?");
```

---

**Built for Cal Hacks** 🎉

*Proof of concept for AI-powered conversation memory on Spectacles*
