# 🔧 Troubleshooting Guide

## Error: "Failed to resolve dependency"

### Problem
```
Failed to resolve dependency ./SimpleMemoryDisplay.ts in asset Assets/SimpleMemoryDisplay.ts.ts
InternalError: Cannot find type: ./SimpleMemoryDisplay.ts
```

### Root Cause
The file got double extension `.ts.ts` instead of just `.ts`

### Solution 1: Create Script Correctly in Lens Studio

**DO THIS:**
1. Assets Panel → Right Click → **Add New** → **Script**
2. When naming, type JUST the name: `SimpleMemoryDisplay`
   - ✅ Type: `SimpleMemoryDisplay`
   - ❌ DON'T type: `SimpleMemoryDisplay.ts`
3. Lens Studio will automatically add `.ts`
4. THEN paste the code

### Solution 2: Fix Existing File

If you already created the file:

1. **Delete the existing script:**
   - Select `SimpleMemoryDisplay.ts.ts` in Assets
   - Right click → Delete

2. **Create new script:**
   - Assets → Right Click → Add New → Script
   - Name it: `SimpleMemoryDisplay` (no extension!)
   - Paste the code

3. **Alternative - Rename:**
   - If you see file named `SimpleMemoryDisplay.ts.ts`
   - Right click → Rename
   - Change to: `SimpleMemoryDisplay` (remove the double .ts)

## Step-by-Step Fresh Start

### 1. Clean Slate
```
Delete any existing SimpleMemoryDisplay scripts
Close and reopen Lens Studio project
```

### 2. Create Script the RIGHT Way

**In Lens Studio:**

```
1. Click Assets panel (bottom)
2. Right click in empty space
3. Select "Add New" → "Script"
4. A dialog appears asking for name
5. Type EXACTLY: SimpleMemoryDisplay
   (DO NOT add .ts!)
6. Click OK
```

### 3. Copy Code

Open the newly created script:
- Double click `SimpleMemoryDisplay` in Assets panel
- This opens the script editor
- Select ALL existing code (Cmd+A / Ctrl+A)
- DELETE it
- Paste the code from `SimpleMemoryDisplay_Fixed.ts`
- Save (Cmd+S / Ctrl+S)

### 4. Set Up Scene

**Create Text Object:**
```
Objects Panel → + → Text → 3D Text
Name: "MemoryDisplay"
```

**Create Container:**
```
Objects Panel → + → Empty → Scene Object
Name: "MemoryContainer"
Drag "MemoryDisplay" to be child of "MemoryContainer"
```

**Add Script:**
```
Select "MemoryContainer"
Inspector → Add Component → Script
Choose: SimpleMemoryDisplay
```

**Configure:**
```
In Inspector, assign:
- Memory Text: Drag "MemoryDisplay" text here
- Distance: 50
- Height Offset: 10
- Update Interval: 5
```

## Common Lens Studio Issues

### Issue: Script Won't Compile

**Check Logger:**
```
Window → Logger Panel
Look for red errors
```

**Common Causes:**
1. Missing semicolons
2. Typo in class name
3. Wrong file extension
4. Code copied incorrectly

**Fix:**
- Use `SimpleMemoryDisplay_Fixed.ts` (cleaner version)
- Copy entire file contents
- Make sure no characters are missing

### Issue: "Component not found"

**Symptoms:**
- Can't find script in Add Component menu

**Fix:**
1. Make sure script compiled (check Logger)
2. Script name must match class name
3. Must have `@component` decorator
4. Try restarting Lens Studio

### Issue: Text Not Showing

**Check:**
1. Text component is assigned in Inspector
2. Text object is enabled (checkbox in Inspector)
3. Camera is present in scene
4. Text size is at least 2-3 cm

**Debug:**
```
Open Logger Panel (Window → Logger)
Look for:
  "🧠 SimpleMemoryDisplay: Starting..."
  "✅ SimpleMemoryDisplay: Ready!"
  "📝 Showing: Alice"
```

If you see these, script is working!

### Issue: Text Position is Wrong

**Adjust in Inspector:**
```
Distance: Try 30-100 (cm from camera)
Height Offset: Try -20 to +30 (cm above/below)
```

**Test different values:**
- Too close: Distance = 30
- Normal: Distance = 50
- Far: Distance = 80

## Ultra-Simple Test Version

If still having issues, try this minimal version:

```typescript
@component
export class TestScript extends BaseScriptComponent {
    @input
    testText: Text;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            print("✅ Script loaded!");
            if (this.testText) {
                this.testText.text = "Hello Spectacles!";
                print("✅ Text updated!");
            }
        });
    }
}
```

**Test Steps:**
1. Create new script named `TestScript`
2. Paste above code
3. Create 3D Text object
4. Add TestScript component
5. Assign text to Test Text field
6. Check Logger for "✅ Script loaded!"

If this works, the issue is with the more complex script.

## Lens Studio Version Check

**Required:**
- Lens Studio: v5.15.0 or higher
- Project Type: Spectacles (2024)

**Check Version:**
```
Lens Studio → About Lens Studio
Should show 5.15.0+
```

**Fix if Wrong:**
1. Download latest Lens Studio
2. Create NEW project
3. Select "Spectacles" template

## Still Not Working?

### Option 1: Use Even Simpler Code

I can create an even more basic version with:
- No camera tracking
- Static position
- Just text display
- No animations

### Option 2: Check File Contents

```bash
# In your terminal:
cat FaceMemoryLens/Assets/Scripts/SimpleMemoryDisplay_Fixed.ts
```

Make sure the file looks correct.

### Option 3: Manual Copy

1. Open `SimpleMemoryDisplay_Fixed.ts` in a text editor
2. Copy ENTIRE contents
3. In Lens Studio: Assets → Add New → Script
4. Name: `SimpleMemoryDisplay`
5. Paste ALL code
6. Save

## Verification Checklist

Before asking for help, verify:

- [ ] File is named `SimpleMemoryDisplay.ts` (not .ts.ts)
- [ ] Logger shows no red errors
- [ ] Class name matches file name
- [ ] Has `@component` decorator
- [ ] Script compiles (no errors in Logger)
- [ ] Text component exists and is assigned
- [ ] Text object is enabled
- [ ] Using Spectacles project type
- [ ] Lens Studio version is 5.15.0+

## Need More Help?

Provide this information:
1. Exact error message from Logger
2. Lens Studio version
3. Project type (should be Spectacles)
4. Screenshot of:
   - Assets panel showing script
   - Inspector showing component
   - Logger panel showing errors

---

**Quick Fix:** Use `SimpleMemoryDisplay_Fixed.ts` - it's a cleaned up version that should work!
