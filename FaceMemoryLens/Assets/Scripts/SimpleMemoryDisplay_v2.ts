/**
 * Simple Memory Display - Fixed Version
 * Displays conversation memories in front of user
 */

@component
export class SimpleMemoryDisplay extends BaseScriptComponent {
    @input
    memoryText: Text;

    @input
    distance: number = 50.0;

    @input
    heightOffset: number = 10.0;

    @input
    updateInterval: number = 5.0;

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
    private cameraTransform: Transform;
    private timeElapsed: number = 0;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    onStart() {
        print("🧠 SimpleMemoryDisplay: Starting...");

        this.transform = this.sceneObject.getTransform();

        // Use global.scene to access the scene
        const scene = global.scene as Scene;
        const cameraObj = scene.getRoot().find("Camera");

        if (cameraObj) {
            this.cameraTransform = cameraObj.getTransform();
            print("✅ Found camera");
        } else {
            // Fallback: use the script's own transform
            this.cameraTransform = this.transform;
            print("⚠️ No camera found, using fallback");
        }

        this.updateDisplay();
        print("✅ SimpleMemoryDisplay: Ready!");
    }

    onUpdate() {
        this.positionInFrontOfUser();

        if (this.updateInterval > 0) {
            this.timeElapsed += getDeltaTime();
            if (this.timeElapsed >= this.updateInterval) {
                this.timeElapsed = 0;
                this.nextMemory();
            }
        }
    }

    private positionInFrontOfUser() {
        if (!this.cameraTransform) return;

        const cameraPos = this.cameraTransform.getWorldPosition();
        const cameraForward = this.cameraTransform.forward;
        const worldUp = new vec3(0, 1, 0);

        const targetPos = cameraPos
            .add(cameraForward.uniformScale(this.distance))
            .add(worldUp.uniformScale(this.heightOffset));

        const currentPos = this.transform.getWorldPosition();
        const smoothPos = vec3.lerp(currentPos, targetPos, getDeltaTime() * 3);
        this.transform.setWorldPosition(smoothPos);

        const lookDir = cameraPos.sub(smoothPos).normalize();
        this.transform.setWorldRotation(quat.lookAt(lookDir, vec3.up()));
    }

    private updateDisplay() {
        if (!this.memoryText) {
            print("⚠️ No text component");
            return;
        }

        const memory = this.memories[this.currentMemoryIndex];
        const displayText = `👤 ${memory.person}\n\n💬 Last Conversation:\n• ${memory.topics[0]}\n• ${memory.topics[1]}\n\n❓ Ask: ${memory.question}`;

        this.memoryText.text = displayText;
        print(`📝 Showing: ${memory.person}`);
    }

    public nextMemory() {
        this.currentMemoryIndex = (this.currentMemoryIndex + 1) % this.memories.length;
        this.updateDisplay();
    }

    public previousMemory() {
        this.currentMemoryIndex = (this.currentMemoryIndex - 1 + this.memories.length) % this.memories.length;
        this.updateDisplay();
    }

    public addMemory(person: string, topics: string[], question: string) {
        this.memories.push({
            person: person,
            topics: topics,
            question: question
        });
        print(`✅ Added memory for ${person}`);
    }
}
