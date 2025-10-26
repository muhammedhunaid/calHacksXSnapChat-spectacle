/**
 * Face Memory Controller
 *
 * Displays conversation memory above detected faces
 * Shows:
 * - Last 2 things discussed
 * - 1 suggested follow-up question
 *
 * For POC, uses hardcoded data
 */

@component
export class FaceMemoryController extends BaseScriptComponent {
    @input
    @hint("Text component for displaying bullet points")
    memoryText: Text;

    @input
    @hint("SceneObject that will be positioned above the face")
    memoryBubble: SceneObject;

    @input
    @hint("Head component for face tracking")
    headComponent: Head;

    @input
    @hint("Distance above face to position bubble (in cm)")
    verticalOffset: number = 25.0;

    @input
    @hint("Distance forward from face (in cm)")
    forwardOffset: number = 15.0;

    // Hardcoded conversation data for POC
    private conversationMemories = {
        "Person A": {
            lastTopics: [
                "Discussed their new job at Snap",
                "Talked about hiking in Yosemite"
            ],
            suggestedQuestion: "How's the new role going?"
        },
        "Person B": {
            lastTopics: [
                "Planning a trip to Japan next month",
                "Working on AR glasses project"
            ],
            suggestedQuestion: "Ready for your Japan trip?"
        },
        "Default": {
            lastTopics: [
                "We talked about AR technology",
                "You mentioned Cal Hacks project"
            ],
            suggestedQuestion: "How's your project coming along?"
        }
    };

    private cameraTransform: Transform;
    private bubbleTransform: Transform;
    private isTracking: boolean = false;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    onStart() {
        print("🧠 FaceMemoryController: Starting...");

        // Get transforms
        if (this.memoryBubble) {
            this.bubbleTransform = this.memoryBubble.getTransform();
        } else {
            print("❌ FaceMemoryController: Memory bubble not assigned!");
            return;
        }

        // Get camera transform for positioning
        this.cameraTransform = this.sceneObject.getTransform();

        // Subscribe to face tracking events
        if (this.headComponent) {
            print("✅ FaceMemoryController: Head component found, setting up face tracking");
            this.setupFaceTracking();
        } else {
            print("⚠️ FaceMemoryController: No head component assigned");
        }

        // Initialize with default memory
        this.updateMemoryDisplay("Default");

        print("✅ FaceMemoryController: Initialized");
    }

    onUpdate() {
        if (!this.isTracking || !this.headComponent || !this.bubbleTransform) {
            return;
        }

        // Position the memory bubble above the tracked face
        this.positionBubbleAboveFace();
    }

    /**
     * Set up face tracking event handlers
     */
    private setupFaceTracking() {
        // Face found event
        const faceFoundEvent = this.createEvent("FaceFoundEvent") as FaceFoundEvent;
        faceFoundEvent.bind(() => {
            print("👤 Face detected!");
            this.isTracking = true;
            this.memoryBubble.enabled = true;
            this.updateMemoryDisplay("Default"); // In real version, identify person
        });

        // Face lost event
        const faceLostEvent = this.createEvent("FaceLostEvent") as FaceLostEvent;
        faceLostEvent.bind(() => {
            print("👋 Face lost");
            this.isTracking = false;
            this.memoryBubble.enabled = false;
        });
    }

    /**
     * Position the memory bubble above the tracked face
     */
    private positionBubbleAboveFace() {
        // Get face position from camera/head transform
        const facePos = this.cameraTransform.getWorldPosition();
        const faceForward = this.cameraTransform.forward;
        const worldUp = new vec3(0, 1, 0);

        // Position bubble above and in front of face
        const targetPos = facePos
            .add(faceForward.uniformScale(this.forwardOffset))
            .add(worldUp.uniformScale(this.verticalOffset));

        // Smooth position update
        const currentPos = this.bubbleTransform.getWorldPosition();
        const smoothPos = vec3.lerp(currentPos, targetPos, getDeltaTime() * 5);
        this.bubbleTransform.setWorldPosition(smoothPos);

        // Make bubble face the camera
        this.bubbleTransform.setWorldRotation(
            quat.lookAt(faceForward.uniformScale(-1), vec3.up())
        );
    }

    /**
     * Update the displayed memory text
     */
    private updateMemoryDisplay(personId: string) {
        if (!this.memoryText) {
            print("⚠️ FaceMemoryController: No text component assigned");
            return;
        }

        // Get memory data for this person (or default)
        const memory = this.conversationMemories[personId] || this.conversationMemories["Default"];

        // Format as bullet points
        const displayText = `💬 Last Time We Talked:\n\n• ${memory.lastTopics[0]}\n\n• ${memory.lastTopics[1]}\n\n❓ Ask: ${memory.suggestedQuestion}`;

        this.memoryText.text = displayText;

        print(`📝 Updated memory display for ${personId}`);
    }

    /**
     * Public method to update memory for a specific person
     * (For future AI integration)
     */
    public setMemoryData(personId: string, topics: string[], question: string) {
        this.conversationMemories[personId] = {
            lastTopics: topics,
            suggestedQuestion: question
        };
        this.updateMemoryDisplay(personId);
    }
}
