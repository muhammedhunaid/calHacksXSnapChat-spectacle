/**
 * Simple Memory Display - STATIC VERSION
 * Text stays in one place, doesn't follow camera
 */

import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

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

    private cameraTransform: Transform = WorldCameraFinderProvider.getInstance().getTransform();
    private transform: Transform;
    private timeElapsed: number = 0;
    private isPositioned: boolean = false;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    onStart() {
        print("🧠 SimpleMemoryDisplay: Starting...");

        this.transform = this.sceneObject.getTransform();

        // Set initial static position
        this.setStaticPosition();

        this.updateDisplay();
        print("✅ SimpleMemoryDisplay: Ready!");
    }

    onUpdate() {
        // Only cycle through memories, don't update position
        if (this.updateInterval > 0) {
            this.timeElapsed += getDeltaTime();
            if (this.timeElapsed >= this.updateInterval) {
                this.timeElapsed = 0;
                this.nextMemory();
            }
        }
    }

    private setStaticPosition() {
        // Position text once at startup, then leave it there
        const cameraPos = this.cameraTransform.getWorldPosition();
        const cameraForward = this.cameraTransform.forward;
        const worldUp = new vec3(0, 1, 0);

        const staticPos = cameraPos
            .add(cameraForward.uniformScale(this.distance))
            .add(worldUp.uniformScale(this.heightOffset));

        this.transform.setWorldPosition(staticPos);

        // Face the initial camera position
        const lookDir = cameraPos.sub(staticPos).normalize();
        this.transform.setWorldRotation(quat.lookAt(lookDir, vec3.up()));

        this.isPositioned = true;
        print("📍 Text positioned at static location");
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
