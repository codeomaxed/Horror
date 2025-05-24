# System Patterns: MystOS Recovery Environment

## 1. System Architecture

*   **Client-Side Single Page Application (SPA):** The entire simulation runs in the user's web browser using HTML, CSS, and JavaScript. There is no backend component.
*   **Event-Driven Architecture:** The application's logic is heavily reliant on DOM event listeners to trigger actions and state changes.
*   **Modular (Conceptual) Design:** While contained within a single `script.js` file, the JavaScript code is organized into distinct functional areas:
    *   Boot sequence management
    *   OS loader management
    *   Desktop initialization and management
    *   **Windowing System:**
        *   Draggable windows (`makeDraggable`).
        *   **Resizable windows (`makeResizable`) via corner handles.**
        *   Z-index management (`bringToFront`).
        *   Open/close logic (`openWindow`, `closeWindow`).
    *   Simulated file system logic (`fileSystem` object, `getItemFromPath`).
    *   File explorer logic.
    *   Recycle bin logic.
    *   Dialog management.
    *   Context menu handling.
    *   Sound effect playback.
    *   Rare Glitch Effect System.
    *   Video Player System.
    *   Global state variables.
*   **Asset-Based:** Relies on external assets like `Wallpaper.jpg`, MP3 files, and video files. Icons are primarily embedded as Base64 encoded SVGs.
*   **Video Playback Integration:** Uses HTML5 `<video>` element for playback within a dedicated, draggable, **and resizable** window.

## 2. Key Technical Decisions

*   **Pure Front-End Simulation.**
*   **In-Memory File System:** `fileSystem` JavaScript object is the source of truth for file/folder data, including relative paths for video content.
*   **DOM Manipulation for UI:** UI built and updated by directly manipulating DOM elements. **Resize handles are dynamically added divs.**
*   **CSS for Styling and Layout:** Used for retro OS appearance, window styling, video player window styling (including increased default size), **resize handle appearance**, and glitch effects.
*   **Base64 Encoded SVGs for Icons.**
*   **Global State Management.**
*   **Audio Playback via HTML5 Audio.**
*   **Video Playback via HTML5 Video:** The `<video>` tag is used with default browser controls enabled.
*   **Probabilistic Glitch Implementation.**
*   **Window Resizing:** Implemented with JavaScript event handling (`mousedown` on handle, `mousemove` and `mouseup` on document) to dynamically adjust window `width` and `height` styles.

## 3. Design Patterns & Approaches

*   **State Management (Simple):** Global variables (including for drag and resize states: `dragOffsetX`, `resizeStartX`, etc.).
*   **Observer Pattern (Implicit):** DOM event listeners, including video element events and **mouse events for resizing**.
*   **Module Pattern (Conceptual).**
*   **Singleton (for UI components).**
*   **Factory Pattern (for UI elements).**
*   **Finite State Machine (Conceptual):** Boot/load, glitches, video player states, **window resizing interaction (idle, resizing)**.
*   **Visual Theming.**
*   **Strategy Pattern (Conceptual for Glitches).**

## 4. Component Relationships & Data Flow

*   **`index.html` (Structure):** Defines HTML structure, including the `#video-player-window`, its `<video>` element, and **`.window-resize-handle` divs within each window**.
*   **`style.css` (Presentation):** Styles all elements, including video player, **and the `.window-resize-handle`**.
*   **`script.js` (Behavior & Logic):**
    *   Initializes simulation, desktop, windows (draggable, closable, **resizable via `makeResizable()`**).
    *   **`makeResizable()` function attaches event listeners to resize handles and updates window dimensions on mouse drag.**
    *   Handles user interactions.
    *   Manages `fileSystem` state.
    *   Updates DOM.
    *   Plays sounds.
    *   Manages and triggers glitches.
    *   `openVideoPlayer()` function handles loading video sources.
    *   `openFile()` delegates to `openVideoPlayer()`.
*   **Data Flow (for Window Resizing):**
    *   User `mousedown` on a `.window-resize-handle`.
    *   `makeResizable`'s `mousedown` handler:
        *   Records initial mouse position and window dimensions.
        *   Attaches `mousemove` and `mouseup` listeners to `document`.
    *   `document.onmousemove`:
        *   Calculates change in mouse position.
        *   Calculates new window width/height.
        *   Applies new dimensions to the window's style, respecting min/max constraints.
    *   `document.onmouseup`:
        *   Removes `mousemove` and `mouseup` listeners.
*   **Key Components & Interactions:**
    *   Existing components remain.
    *   **Video Player:** (As previously documented, now also resizable).
    *   **Window Resize Handles:** Divs within each window that trigger resize logic.
