/**
 * Memory Display References
 * Organizes all UI component references for the memory display
 * Pattern inspired by Think Out Loud HeadLabelReferences
 */

@component
export class MemoryDisplayReferences extends BaseScriptComponent {
    @input
    @hint("Text component for person's name")
    textPersonName: Text;

    @input
    @hint("Text component for conversation topic 1")
    textTopic1: Text;

    @input
    @hint("Text component for conversation topic 2")
    textTopic2: Text;

    @input
    @hint("Text component for suggested question")
    textQuestion: Text;

    @input
    @hint("Background panel object (optional)")
    backgroundPanel: SceneObject;

    @input
    @hint("Icon or avatar object (optional)")
    personIcon: SceneObject;
}
