/**
 * Simple Memory Display - Improved Version
 * Enhanced UI with better sizing, layout, and animations
 * Based on patterns from Think Out Loud and AI Playground examples
 */

import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";

@component
export class SimpleMemoryDisplay extends BaseScriptComponent {
    @ui.separator
    @ui.label("Text Components")
    @ui.separator

    @input
    @hint("Main text component for all content (simple mode)")
    memoryText: Text;

    @ui.separator
    @ui.label("Positioning")
    @ui.separator

    @input
    @hint("Distance from camera in centimeters")
    distance: number = 80.0;  // Increased from 50 for better readability

    @input
    @hint("Height offset from camera forward in centimeters")
    heightOffset: number = 15.0;  // Increased from 10 for better positioning

    @input
    @hint("Time between memory updates in seconds")
    updateInterval: number = 5.0;

    @ui.separator
    @ui.label("Animation Settings")
    @ui.separator

    @input
    @hint("Enable smooth animations")
    enableAnimations: boolean = true;

    @input
    @hint("Scale factor when appearing (0-1)")
    scaleInDuration: number = 0.5;

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

    // Use WorldCameraFinderProvider - the correct Spectacles pattern
    private cameraProvider = WorldCameraFinderProvider.getInstance();
    private cameraTransform: Transform;
    private transform: Transform;
    private timeElapsed: number = 0;
    private isFirstUpdate: boolean = true;

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    onStart() {
        print("🧠 SimpleMemoryDisplay (Improved): Starting...");

        this.transform = this.sceneObject.getTransform();
        this.cameraTransform = this.cameraProvider.getTransform();

        // Start with scale of 0 for animation
        if (this.enableAnimations) {
            this.transform.setLocalScale(vec3.zero());
        }

        this.updateDisplay();
        print("✅ SimpleMemoryDisplay (Improved): Ready!");
    }

    onUpdate() {
        this.positionInFrontOfUser();

        // Animate in on first update
        if (this.isFirstUpdate && this.enableAnimations) {
            this.animateIn();
            this.isFirstUpdate = false;
        }

        // Cycle through memories
        if (this.updateInterval > 0) {
            this.timeElapsed += getDeltaTime();
            if (this.timeElapsed >= this.updateInterval) {
                this.timeElapsed = 0;
                this.nextMemory();
            }
        }
    }

    private animateIn() {
        const targetScale = vec3.one();
        const startScale = vec3.zero();

        animate({
            duration: this.scaleInDuration,
            easing: "ease-out-back",
            update: (t) => {
                const x = startScale.x + (targetScale.x - startScale.x) * t;
                const y = startScale.y + (targetScale.y - startScale.y) * t;
                const z = startScale.z + (targetScale.z - startScale.z) * t;
                this.transform.setLocalScale(new vec3(x, y, z));
            }
        });
    }

    private positionInFrontOfUser() {
        if (!this.cameraTransform) {
            this.cameraTransform = this.cameraProvider.getTransform();
            return;
        }

        const cameraPos = this.cameraTransform.getWorldPosition();
        const cameraForward = this.cameraTransform.forward;
        const worldUp = new vec3(0, 1, 0);

        // Calculate target position
        const targetPos = cameraPos
            .add(cameraForward.uniformScale(this.distance))
            .add(worldUp.uniformScale(this.heightOffset));

        // Smooth position interpolation for natural movement
        const currentPos = this.transform.getWorldPosition();
        const smoothPos = vec3.lerp(currentPos, targetPos, getDeltaTime() * 3);
        this.transform.setWorldPosition(smoothPos);

        // Face the user (billboard effect)
        const lookDir = cameraPos.sub(smoothPos).normalize();
        this.transform.setWorldRotation(quat.lookAt(lookDir, vec3.up()));
    }

    private updateDisplay() {
        if (!this.memoryText) {
            print("⚠️ No text component");
            return;
        }

        const memory = this.memories[this.currentMemoryIndex];

        // Enhanced formatting with better spacing and structure
        const displayText = `${memory.person}\n\n` +
                          `${memory.topics[0]}\n\n` +
                          `${memory.topics[1]}\n\n` +
                          `💬 "${memory.question}"`;

        this.memoryText.text = displayText;
        print(`📝 Showing: ${memory.person}`);
    }

    private nextMemoryWithAnimation() {
        if (!this.enableAnimations) {
            this.nextMemory();
            return;
        }

        // Scale out
        const currentScale = this.transform.getLocalScale();
        const targetScale = vec3.zero();

        animate({
            duration: 0.2,
            easing: "ease-in-quad",
            update: (t) => {
                const x = currentScale.x + (targetScale.x - currentScale.x) * t;
                const y = currentScale.y + (targetScale.y - currentScale.y) * t;
                const z = currentScale.z + (targetScale.z - currentScale.z) * t;
                this.transform.setLocalScale(new vec3(x, y, z));
            },
            ended: () => {
                // Update content
                this.currentMemoryIndex = (this.currentMemoryIndex + 1) % this.memories.length;
                this.updateDisplay();

                // Scale in
                const startScale = vec3.zero();
                const endScale = vec3.one();
                animate({
                    duration: 0.3,
                    easing: "ease-out-back",
                    update: (t) => {
                        const x = startScale.x + (endScale.x - startScale.x) * t;
                        const y = startScale.y + (endScale.y - startScale.y) * t;
                        const z = startScale.z + (endScale.z - startScale.z) * t;
                        this.transform.setLocalScale(new vec3(x, y, z));
                    }
                });
            }
        });
    }

    public nextMemory() {
        if (this.enableAnimations) {
            this.nextMemoryWithAnimation();
        } else {
            this.currentMemoryIndex = (this.currentMemoryIndex + 1) % this.memories.length;
            this.updateDisplay();
        }
    }

    public previousMemory() {
        if (this.enableAnimations) {
            // Similar animation as nextMemory
            const currentScale = this.transform.getLocalScale();
            const targetScale = vec3.zero();

            animate({
                duration: 0.2,
                easing: "ease-in-quad",
                update: (t) => {
                    const x = currentScale.x + (targetScale.x - currentScale.x) * t;
                    const y = currentScale.y + (targetScale.y - currentScale.y) * t;
                    const z = currentScale.z + (targetScale.z - currentScale.z) * t;
                    this.transform.setLocalScale(new vec3(x, y, z));
                },
                ended: () => {
                    this.currentMemoryIndex = (this.currentMemoryIndex - 1 + this.memories.length) % this.memories.length;
                    this.updateDisplay();

                    const startScale = vec3.zero();
                    const endScale = vec3.one();
                    animate({
                        duration: 0.3,
                        easing: "ease-out-back",
                        update: (t) => {
                            const x = startScale.x + (endScale.x - startScale.x) * t;
                            const y = startScale.y + (endScale.y - startScale.y) * t;
                            const z = startScale.z + (endScale.z - startScale.z) * t;
                            this.transform.setLocalScale(new vec3(x, y, z));
                        }
                    });
                }
            });
        } else {
            this.currentMemoryIndex = (this.currentMemoryIndex - 1 + this.memories.length) % this.memories.length;
            this.updateDisplay();
        }
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
