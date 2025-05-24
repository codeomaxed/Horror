# Technical Context: MystOS Recovery Environment

## 1. Technologies Used

*   **HTML5:** Provides the core structure, semantic layout (including **divs for resize handles**), and embedding of media (audio, video via `<video>` element).
*   **CSS3:** Used for all styling, visual presentation, layout (including **positioning and appearance of resize handles**), animations, and the retro OS aesthetic.
*   **JavaScript (ES6+):** Powers all interactivity, simulation logic, DOM manipulation (including **dynamic style changes for window dimensions during resize**), event handling (including **mouse events for dragging and resizing**), the in-memory file system, probabilistic glitch effect generation, and video playback control.
*   **SVG (Scalable Vector Graphics):** Used for many icons.
*   **MP3 Audio Files:** Used for sound effects.
*   **JPEG Image:** `Wallpaper.jpg` for desktop background.
*   **Video File Formats (e.g., MP4, WebM for `.vlog`):** Actual video files (e.g., `videos/horror1.mp4`) are now referenced.

## 2. Development Setup & Environment

*   **Web Browser:** Primary runtime environment.
*   **Text Editor/IDE:** VS Code used.
*   **No Build System:** Plain HTML, CSS, JavaScript.
*   **Static Hosting:** Suitable for deployment.

## 3. Technical Constraints

*   **Browser Compatibility:** Relies on modern browser features.
*   **No Backend/Persistence:** State is in-memory.
*   **Single JavaScript File (`script.js`):** Contains all logic. The addition of video player and **window resizing functions (`makeResizable`)** further increases its size.
*   **Performance:** DOM manipulation, glitch effects, HTML5 video playback, and **`mousemove` events during window resizing** are performance considerations.
*   **Video File Handling:** Video files are referenced by relative paths.
*   **Video Controls:** Uses browser default controls.
*   **Window Resizing:** Current implementation uses a bottom-right handle. More complex resize behaviors (e.g., edge/corner-specific handles, aspect ratio locking for specific windows) would require additional logic.

## 4. Dependencies

*   **External Files (Assets):**
    *   `Wallpaper.jpg`
    *   Various `sfx/*.mp3` audio files.
    *   Video files (e.g., `videos/horror1.mp4`).
*   **No External Libraries/Frameworks:** Vanilla HTML, CSS, JavaScript.
*   **Fonts:** Common system fonts.
