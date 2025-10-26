# 🚀 Face Memory Lens - Quick Start Guide

## TL;DR

This is a **proof-of-concept Spectacles lens** that shows conversation memories above faces. It's ready to demo with hardcoded data!

## ⚡ 3-Minute Setup

### 1. Open Lens Studio
```
File → New Project → Spectacles
```

### 2. Add Script
```
Assets Panel → Right Click → Add New → Script
Name: SimpleMemoryDisplay
Copy/Paste: Assets/Scripts/SimpleMemoryDisplay.ts
```

### 3. Create Scene Objects
```
Objects Panel → + → Text → 3D Text (name: "Memory Display")
Objects Panel → + → Empty → Scene Object (name: "Memory Container")
Drag "Memory Display" into "Memory Container"
```

### 4. Configure
```
Select "Memory Container"
Inspector → Add Component → Script → SimpleMemoryDisplay
Assign:
  - Memory Text: Drag "Memory Display" here
  - Distance: 50
  - Height Offset: 10
  - Show On Start: ✅
  - Update Interval: 5
```

### 5. Style Text
```
Select "Memory Display"
Inspector:
  - Size: 2-3
  - Color: White
  - Alignment: Center
```

### 6. Test
```
Click Preview (Cmd+P / Ctrl+P)
```

## 📱 What You'll See

Text bubble in front of you showing:

```
👤 Alice

💬 Last Conversation:
• Discussed working on AR glasses startup
• Talked about moving to San Francisco

❓ Ask: How's the SF apartment search going?
```

Automatically cycles through 3 different people every 5 seconds.

## 🎯 What This Shows

### Current (POC):
- ✅ Text positioning in 3D space
- ✅ Billboard effect (faces user)
- ✅ Hardcoded conversation memories
- ✅ Three bullet points format
- ✅ Smooth animations

### Next Steps for Cal Hacks:
1. Add speech recognition
2. Connect to AI API
3. Generate memories in real-time
4. Add face recognition
5. Store conversation history

## 🔧 Customization

### Change Memories

Edit in `SimpleMemoryDisplay.ts` line 25:

```typescript
private memories = [
    {
        person: "Your Friend's Name",
        topics: [
            "First conversation point",
            "Second conversation point"
        ],
        question: "Question to ask?"
    },
    // Add more...
];
```

### Adjust Position

In Inspector:
- **Distance**: How far (30-100 cm recommended)
- **Height Offset**: How high (-20 to +30 cm)

### Change Cycle Speed

- **Update Interval**:
  - 5 = 5 seconds per person
  - 0 = Manual only (no auto-cycle)

## 💡 Pro Tips

### Make It Look Better:
1. Add a background panel (Image component)
2. Use rounded corners
3. Add drop shadow
4. Increase font size to 3cm for better readability

### For Face Tracking:
Use `FaceMemoryController.ts` instead
- Requires Head component setup
- Shows memory above detected faces
- See full README.md for instructions

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Text not showing | Check text is assigned in Inspector |
| Position wrong | Adjust Distance/Height Offset |
| Text too small | Increase Size to 3-4 |
| Can't read text | Change color to bright/white |
| Script error | Check Lens Studio Logger panel |

## 📚 Files

```
FaceMemoryLens/
├── Assets/Scripts/
│   ├── SimpleMemoryDisplay.ts        ← Start here (easier)
│   └── FaceMemoryController.ts       ← Face tracking version
├── README.md                          ← Full documentation
└── QUICKSTART.md                      ← This file
```

## 🎉 That's It!

You now have a working POC that:
- Shows 3 conversation points above faces
- Uses hardcoded data (ready for AI integration)
- Works on Spectacles
- Ready to demo at Cal Hacks!

---

**Need Help?** Check the full [README.md](README.md) for detailed instructions.

**For AI Integration:** See "Future AI Integration" section in README.md.
