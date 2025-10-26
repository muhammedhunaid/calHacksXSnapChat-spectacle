/**
 * Simple Memory Display (No Face Tracking Required)
 *
 * Displays conversation memory in front of the user
 * Easier to test on Spectacles without face tracking setup
 *
 * Shows:
 * - Last 2 things discussed
 * - 1 suggested follow-up question
 */

@component
export class SimpleMemoryDisplay extends BaseScriptComponent {
    @input
    @hint("Text component for displaying memory")
    memoryText: Text;

    @input
    @hint("Distance in front of user (in cm)")
    distance: number = 50.0;

    @input
    @hint("Height offset (in cm)")
    heightOffset: number = 10.0;

    @input
    @hint("Show memory on startup")
    showOnStart: boolean = true;

    @input
    @hint("Update interval in seconds (0 = no auto-update)")
    updateInterval: number = 5.0;

    // Hardcoded conversation data for POC
    private currentMemoryIndex: number = 0;
    private memories = [
        {
            person: "Alice",
            topics: [
                "Discussed working on AR glasses startup",
                "Talked about moving to San Francisco"
            ],
            question: "How's the SF apartment search going?"
        },
        {
            person: "Bob",
            topics: [
                "Planning Cal Hacks hackathon project",
                "Learning TypeScript for Spectacles"
            ],
            question: "Did you finish the API integration?"
        },
        {
            person: "Carol",
            topics: [
                "Showed me her new Spectacles lens",
                "Mentioned graduating in Spring"
            ],
            question: "What are your post-grad plans?"
        }
    ];

    private transform: Transform;
    private worldCameraTransform: Transform;
    private timeElapsed: number = 0;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    onStart() {
        print("🧠 SimpleMemoryDisplay: Starting...");

        // Get transforms
        this.transform = this.sceneObject.getTransform();

        // Get world camera transform for positioning
        try {
            const camera = this.sceneObject.getScene().getRoot().find("Camera");
            if (camera) {
                this.worldCameraTransform = camera.getTransform();
            } else {
                // Fallback: use current scene object's transform
                this.worldCameraTransform = this.transform;
            }
        } catch (e) {
            print("⚠️ SimpleMemoryDisplay: Using fallback transform");
            this.worldCameraTransform = this.transform;
        }

        // Initialize display
        if (this.showOnStart) {
            this.updateDisplay();
        }

        print("✅ SimpleMemoryDisplay: Initialized");
    }

    onUpdate() {
        // Position in front of user
        this.positionInFrontOfUser();

        // Auto-rotate through memories if enabled
        if (this.updateInterval > 0) {
            this.timeElapsed += getDeltaTime();
            if (this.timeElapsed >= this.updateInterval) {
                this.timeElapsed = 0;
                this.nextMemory();
            }
        }
    }

    /**
     * Position text in front of user's view
     */
    private positionInFrontOfUser() {
        if (!this.worldCameraTransform) return;

        const cameraPos = this.worldCameraTransform.getWorldPosition();
        const cameraForward = this.worldCameraTransform.forward;
        const worldUp = new vec3(0, 1, 0);

        // Position in front and slightly above
        const targetPos = cameraPos
            .add(cameraForward.uniformScale(this.distance))
            .add(worldUp.uniformScale(this.heightOffset));

        // Smooth movement
        const currentPos = this.transform.getWorldPosition();
        const smoothPos = vec3.lerp(currentPos, targetPos, getDeltaTime() * 3);
        this.transform.setWorldPosition(smoothPos);

        // Face the user
        const lookDir = cameraPos.sub(smoothPos).normalize();
        this.transform.setWorldRotation(quat.lookAt(lookDir, vec3.up()));
    }

    /**
     * Update the displayed memory
     */
    private updateDisplay() {
        if (!this.memoryText) {
            print("⚠️ SimpleMemoryDisplay: No text component assigned");
            return;
        }

        const memory = this.memories[this.currentMemoryIndex];

        // Format text with emojis and bullet points
        const displayText = `👤 ${memory.person}\n\n💬 Last Conversation:\n• ${memory.topics[0]}\n• ${memory.topics[1]}\n\n❓ Ask: ${memory.question}`;

        this.memoryText.text = displayText;

        print(`📝 Showing memory for ${memory.person}`);
    }

    /**
     * Show next memory (rotate through list)
     */
    public nextMemory() {
        this.currentMemoryIndex = (this.currentMemoryIndex + 1) % this.memories.length;
        this.updateDisplay();
    }

    /**
     * Show previous memory
     */
    public previousMemory() {
        this.currentMemoryIndex = (this.currentMemoryIndex - 1 + this.memories.length) % this.memories.length;
        this.updateDisplay();
    }

    /**
     * Add new memory data (for AI integration later)
     */
    public addMemory(person: string, topics: string[], question: string) {
        this.memories.push({
            person: person,
            topics: topics,
            question: question
        });
        print(`✅ Added memory for ${person}`);
    }
}
