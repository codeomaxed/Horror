# Project Brief: MystOS Recovery Environment

## 1. Project Description

The project is an interactive web-based simulation titled "MystOS Recovery Environment." It emulates a retro, corrupted, and unstable operating system. This simulation serves as a central element in a **creepy/horror/ARG-style YouTube video series**, designed to deliver a **grounded, twisted narrative through discoverable video logs and clues** found within the OS. The user interacts with a desktop environment that includes a boot sequence, OS loader, desktop icons, a taskbar, a start menu, and various windowed applications like a file explorer and a recycle bin. The simulation incorporates sound effects and **subtle, analog horror-style visual "glitch" effects** to enhance the theme of instability and the overarching horror narrative.

## 2. Main Goals and Objectives

*   **Create an Immersive Horror Simulation:** Provide an engaging user experience that simulates interacting with a faulty and mysterious operating system, serving as the primary medium for the YouTube series' narrative.
*   **Interactive Storytelling & ARG Experience:** The corrupted nature of the OS, specific file names, discoverable video logs, and glitch effects will drive an underlying narrative and mystery for the user/viewer to explore and piece together.
*   **Support YouTube Series Narrative:** Function as a key interactive component for a YouTube horror series, providing a platform for storytelling and viewer engagement.
*   **Technical Showcase:** Demonstrate proficiency in HTML, CSS, and JavaScript to create a complex, interactive front-end application with a simulated file system, window management, event handling, and integrated video playback.
*   **User/Viewer Engagement:** Encourage exploration of the simulated environment, its "broken" features, and the hidden narrative elements.

## 3. Target Audience/User

*   **Viewers of Horror/ARG YouTube Series:** Primarily, individuals following the associated YouTube channel and engaging with its narrative content.
*   **Players of Alternate Reality Games (ARGs) or Interactive Fiction:** Users who enjoy exploring digital environments, uncovering clues, and piecing together narratives.
*   **Fans of Analog Horror, Retro Computing, or "Creepypasta" Themes:** Individuals interested in nostalgic OS aesthetics or stories involving haunted/corrupted software and unsettling digital experiences.
*   **Web Developers/Hobbyists:** Potentially other developers interested in seeing how such a simulation is built.

## 4. Core Functionality (as observed)

*   **Boot Simulation:** Visual and auditory simulation of a computer booting up, including BIOS messages and an OS loading sequence.
*   **Desktop Interface:** A graphical desktop with clickable icons (MYSTERIUM_HD, Recycle Bin), a taskbar with a clock and start button, and a wallpaper.
*   **Start Menu:** A functional start menu providing access to simulated applications and system functions (e.g., opening MYSTERIUM_HD, shutdown).
*   **Window Management:** Draggable windows for applications like a file explorer and recycle bin, with basic controls (close).
*   **Simulated File System:** An in-memory JavaScript object representing a hard drive ("MYSTERIUM_HD") with a directory structure and files of various types, some marked as "corrupted," including video log files.
*   **File Explorer:** Allows navigation of the simulated file system.
*   **Recycle Bin:** Simulates deleting and potentially restoring files.
*   **Dialog System:** Displays informational, warning, error, and password prompt dialogs.
*   **Context Menus:** Right-click menus for desktop and file interactions.
*   **Sound and Visual Effects:** Audio cues for user actions and system events. **Subtle, rare visual "glitch" effects (Cursor Stutter, Wrong Character Flicker, Window Breathe)** to reinforce the corrupted theme and horror atmosphere.
*   **(Planned) Video Player:** Functionality to play video files (e.g., `.vlog`, `.mp4`) found within the simulated file system.
