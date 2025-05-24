document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const clickToStartScreen = document.getElementById('click-to-start');
    const bootSeqContainer = document.getElementById('boot-sequence-container');
    const osLoaderScreen = document.getElementById('os-loader-screen');
    const osLoaderProgressBar = document.getElementById('os-loader-progress-bar');
    const osLoaderStatus = document.getElementById('os-loader-status');
    const desktop = document.getElementById('desktop');
    const channelIntro = document.getElementById('channel-intro');
    const mystHdIcon = document.getElementById('myst_hd_icon');
    const taskbarClock = document.getElementById('taskbar-clock');
    const fileExplorerWindow = document.getElementById('file-explorer');
    const feTitle = fileExplorerWindow.querySelector('.window-title');
    const feCloseButton = fileExplorerWindow.querySelector('.window-control-close');
    const feUpButton = document.getElementById('fe-up-button');
    const feAddressBar = document.getElementById('address-bar');
    const feFileListing = document.getElementById('file-listing');
    const feItemCount = document.getElementById('fe-item-count');
    const feSpaceFree = document.getElementById('fe-space-free');
    const genericDialog = document.getElementById('generic-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogIcon = document.getElementById('dialog-icon');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogOkButton = document.getElementById('dialog-ok-button');
    const dialogCloseButton = genericDialog.querySelector('.window-control-close');
    const desktopContextMenu = document.getElementById('desktop-context-menu');
    const fileContextMenu = document.getElementById('file-context-menu');
    const recycleBinIconDesktop = document.getElementById('recycle_bin_icon_desktop');
    const recycleBinImgDesktop = document.getElementById('recycle_bin_img_desktop');
    const recycleBinWindow = document.getElementById('recycle-bin-window');
    const rbCloseButton = recycleBinWindow.querySelector('.window-control-close');
    const rbRestoreButton = document.getElementById('rb-restore-button');
    const rbEmptyButton = document.getElementById('rb-empty-button');
    const rbFileListing = document.getElementById('recycle-bin-listing');
    const rbItemCount = document.getElementById('rb-item-count');
    const cmdDialog = document.getElementById('cmd-dialog');
    const cmdDialogTitleElement = document.getElementById('cmd-dialog-title');
    const cmdOutput = document.getElementById('cmd-output');
    const cmdDialogCloseButton = document.getElementById('cmd-dialog-close-button');
    const passwordPromptDialog = document.getElementById('password-prompt-dialog');
    const passwordPromptFilename = document.getElementById('password-prompt-filename');
    const passwordPromptInput = document.getElementById('password-prompt-input');
    const passwordPromptError = document.getElementById('password-prompt-error');
    const passwordPromptOkButton = document.getElementById('password-prompt-ok-button');
    const passwordPromptCancelButton = document.getElementById('password-prompt-cancel-button');
    const passwordPromptCloseButton = passwordPromptDialog.querySelector('.window-control-close');

    // Video Player Elements
    const videoPlayerWindow = document.getElementById('video-player-window');
    const videoPlayerTitle = document.getElementById('video-player-title');
    const videoPlayerCloseButton = document.getElementById('video-player-close-button');
    const mainVideoPlayer = document.getElementById('main-video-player');
    const videoPlayerStatus = document.getElementById('video-player-status');

    // New DOM Elements for Start Menu & Taskbar interaction
    const taskbarStartButton = document.getElementById('taskbar-start-button');
    const startMenu = document.getElementById('start-menu');
    const shutdownScreen = document.getElementById('shutdown-screen');


    const audioElements = {
        biosBeep: document.getElementById('audio-bios-beep'),
        hddSeek: document.getElementById('audio-hdd-seek'),
        osStartup: document.getElementById('audio-os-startup'),
        click: document.getElementById('audio-click'),
        doubleClick: document.getElementById('audio-double-click'),
        error: document.getElementById('audio-error'),
        windowOpen: document.getElementById('audio-window-open'),
        windowClose: document.getElementById('audio-window-close'),
        hddHum: document.getElementById('audio-hdd-hum'),
        shellHandover: document.getElementById('audio-shell-handover'),
        recycle: document.getElementById('audio-recycle')
    };
    let soundEnabled = false;

    let systemLog = ["MystOS Recovery Environment initialized."];
    let currentPath = "MYSTERIUM_HD:"; // Note: Path logic might need review if root has issues
    let selectedFileElement = null;
    let contextMenuTarget = null;
    let activeWindow = null;
    let highestZIndex = 100; // Start menu will need higher z-index
    let recycleBinContents = {};
    let selectedRecycleBinItemElement = null;
    let clickTimeout = null;
    const DOUBLE_CLICK_THRESHOLD = 250;
    let currentArchiveToUnlock = null;
    let customCursorElement = null;


    const ICONS = {
        folder: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGQjMwMCI+PHBhdGggZD0iTTEwIDRIMkMtMS4xIDQgMCA1LjEgMCA2djEyYzAgMS4xLjk0IDIgMiAyaDIwYzEuMSAwIDItLjkgMi0yVjhjMC0xLjEtLjktMi0yLTJoLThsLTItMnoiLz48L3N2Zz4=",
        file: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0VFRUVFRSI+PHBhdGggZD0iTTYgMmg4bDYgNnYxMmMwIDEuMS0uOSAyLTIgMkg2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJ6bTcgNXY1LjVoNVY3SDExeiIvPjwvc3ZnPg==",
        text: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0EwQTBBMCI+PHBhdGggZD0iTTYgMmg4bDYgNnYxMmMwIDEuMS0uOSAyLTIgMkg2Yy0xLjEgMC0yLS4xLTItMlY0YzAtMS4xLjktMiAyLTJ6bTcgN1Y3SDd2MTBoMTBWMTNINzVIOVYxMXoiLz48L3N2Zz4=",
        video: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzZGQUFGMyI+PHBhdGggZD0iTTE4IDNINkMxLjggMyAwIDQuOCAwIDd2MTBjMCAyLjIgMS44IDQgNCA0aDEyYzIuMiAwIDQtMS44IDQtNFY3YzAtMi4yLTEuOC00LTQtNHptLTYgMTJoLTUgTDEzIDEybC01IDNabTYtN2MwIDEuMS0uOSAyLTItMnMtLjktMi0yLTItMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6Ii8+PC9zdmc+",
        vlog: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzZGQUFGMyI+PHBhdGggZD0iTTE4IDNINkMxLjggMyAwIDQuOCAwIDd2MTBjMCAyLjIgMS44IDQgNCA0aDEyYzIuMiAwIDQtMS44IDQtNFY3YzAtMi4yLTEuOC00LTQtNHptLTYgMTJoLTUgTDEzIDEybC01IDNabTYtN2MwIDEuMS0uOSAyLTItMnMtLjktMi0yLTItMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6Ii8+PC9zdmc+", // Re-use video icon for .vlog
        log: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRDQUNBQyI+PHBhdGggZD0iTTE0IDJINmMyLjIgMCA0IDEuOCA0IDR2MTJjMCAyLjIgMS44IDQgNCA0aDEyYzIuMiAwIDQtMS44IDQtNFY4bC02LTZ6bS0yIDE2SDh2LTJoNG0wLTRIOThtNC03aC04djJoOFY5eiIvPjwvc3ZnPg==",
        config: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzg4ODg4OCI+PHBhdGggZD0iTTE5LjQyIDEyLjkxYy4wMy0uMjMuMDUtLjQ2LjA1Ljc5czAtLjU2LS4wNS0uNzlMMjEgMTFoLTEuNThsLS43MS0xLjY4Yy0uMy0uNzItLjY5LTEuNDUtMS4xMS0xLjk3bDEuMi0xLjM1TDExIDEyLjQybC0xLjM1IDEuMmMtLjUyLS40MS0xLjI1LS44MS0xLjk3LTEuMTFMOSAzSDcuMDNsLTEuNjggLjcxYy0uNzIgLjMtMS40NSAuNjktMS45NyAxLjExTDIsNi44NyA2Ljg3IDJsMS4xMSAxLjk3Yy40Mi41My44MSAxLjI2IDEuMTQgMS45N0wzIDlsMS42OC43MWMuMy43Mi42OSAxLjQ1IDEuMTEgMS45N0wyIDExLjU4IDEyLjQyIDEzbDEuOTcgMS4xMWMuNTMtLjQyIDEuMjYtLjggMS45Ny0xLjE0TDE1IDIxdi0xLjkybDcuMS0xLjY4Yy43Mi0uMyAxLjQ1LS42OSAxLjk3LTEuMTFsMS4zNS0xLjJMMTggOWwtMS4yIDEuMzVjLS40MS0uNTMtLjgtMS4yNi0xLjE0LTEuOTd6TTEyIDE1Yy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3oiLz48L3N2Zz4=",
        batch: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNjY2NjY2IiBkPSJNNCwySDEybDEsMUgxMWwtMSwxSDEwTDksNEg4TDcsNUg2TDUsNkg0VjIwSDIwVjRIMTRMMTMsM0gxMkwxMSwySDRNNSw1SDE5VjE5SDVWNVoiLz48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNNiw3SDE4VjhINk02LDlIMThWMTBINk02LDExSDE4VjEySDZNMTAsMTNIMTRWMTRIOTZNMTAsMTVIMTRWMThIOTYiLz48L3N2Zz4=",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQzNDM0MzIiBkPSJNMjEsMyBDMjEuNTUsMyAyMiwzLjQ1IDIyLDQgTDIyLDIwIEMyMiwyMC41NSAyMS41NSwyMSAyMSwyMSBMMywyMSBDMi40NSwyMSAyLDIwLjU1IDIsMjAgTDIsNCBDMiwzLjQ1IDIuNDUsMyAzLDMgTDIxLDNNMjAsNUgzVjE5IEwyMCw1TTgsOSBDNi45LDkgNiw5LjkgNiwxMSBDNiwxMi4xIDYuOSwxMyA4LDEzIEM5LjEsMTMgMTAsMTIuMSAxMCwxMSBDMTAsOS45IDkuMSw5IDgsOU0xOSw5IEwxMywxNSBMMTAsMTIgTDUsMTcgTDE5LDE3IEwxOSw5WiIvPjwvc3ZnPg==",
        archive: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkZCMDAwIiBkPSJNMTksM0g1QzMuOSwzIDMsMy45IDMsNVYxOUMzLDIwLjEgMy45LDIxIDUsMjFIMTlDMjAuMSwyMSAyMSwyMC4xIDIxLDE5VjVDMjEsMy45IDIwLjEsMyAxOSwzTTUsMTlWNUgxOVYxOUg1WiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMiwxMEgxMFYxMkg4VjEwSDZWOGgxMFYxMEgxNFYxMkgxMlpNMTcsOEgxNVYxMEgxN1Y4WiIvPjwvc3ZnPg==",
        unknown: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzgwODA4MCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVIOFYxM2gzVjRIMTJWMTd6bS0xLTRoLTR2LTRoNHY0eiIvPjwvc3ZnPg==",
        dialog_info: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIxOTZmMyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVoLTJ2LTZoMnY2em0wLThoLTJWN2gydjJ6Ii8+PC9zdmc+",
        dialog_warning: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGQzEwNyI+PHBhdGggZD0iTTEgMjFoMjJMMTIgMmwtMTEgMTl6bTEyLTNoLTJ2LTJoMnYyem0wLTRoLTJ2LTRoMnY0eiIvPjwvc3ZnPg==",
        dialog_error: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0Y0NDMzNiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC44IDEwLTEwUzE3LjUyIDIgMTIgMnpNMTEgMTdoMlYxNWgtMlYxN1ptMS00aC0yVjdoMnY2WiIvPjwvc3ZnPg==",
        recycle_bin_empty: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cGF0aCBkPSJNNDEgMTFIMjNMMjEgMTNoMjBsMi0yem0xNyA0SDZWNDFoNDJWMTV6TTggNDNoNDh2Mkg4em00LTI3djIzaDMydi0yM0gxMnoiIGZpbGw9IiNjMGMwYzAiLz48cGF0aCBkPSJNNDAgMjdIMjR2MWgxNnYtMXptLTggN2gtOHYxaDh2LTF6IiBmaWxsPSIjODA4MDgwIi8+PC9zdmc+",
        recycle_bin_full: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cGF0aCBkPSJNNDEgMTFIMjNMMjEgMTNoMjBsMi0yem0xNyA0SDZWNDFoNDJWMTV6TTggNDNoNDh2Mkg4em00LTI3djIzaDMydi0yM0gxMnoiIGZpbGw9IiNjMGMwYzAiLz48cGF0aCBkPSJNMzIgMjBjLTQgMC03IDMtNyA3djVoMTR2LTdjMC00LTMtNy03LTd6IiBmaWxsPSIjZmZmIiBzdHJva2U9IiM4MDgwODAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik00MCAyN0gyNHYxaDE2di0xem0tOCA3aC04djFoOHYtMXptMCA0aC04djFoOHYtMXoiIGZpbGw9IiM4MDgwODAiLz48L3N2Zz4="
    };

    const fileSystem = {
        "MYSTERIUM_HD:": { // Key for drive doesn't have trailing slash
            type: "drive",
            children: {
                "SYSTEM": { type: "folder", corrupted: false, children: { /* ... */ }},
                "CASE_001_CHC": { type: "folder", corrupted: false, children: {
                    "evidence_photos": { type: "folder", corrupted: true, children: {} },
                    "witness_statements.txt": { type: "file", extension: "txt", content: "W1: Subject seemed agitated...\nW2: Heard strange noises from the west wing." },
                    "EVP_Analysis_Subject_03.txt": { type: "file", extension: "txt", content: "EVP Log S03:\n[00:12:34] - Faint whisper detected - '...leave...'\n[00:15:02] - Static burst, possible voice pattern - '...not safe...'\n[00:22:11] - Clearer voice - 'GET OUT'" },
                    "SECURITY_FOOTAGE_01.vlog": { type: "file", extension: "vlog", content: "videos/horror1.mp4" }, // Actual path
                    "SECURITY_FOOTAGE_02.vlog": { type: "file", extension: "vlog", content: "videos/horror2.mp4", corrupted: true }, // Actual path, marked corrupted
                    "encrypted_research.zip": { type: "file", extension: "zip", password: "truth", corrupted: false, children: {
                        "PROJECT_VERIDIAN_NOTES.txt": { type: "file", extension: "txt", content: "Project Veridian: Notes unclear. Data appears to be heavily encrypted or damaged. Partial fragments mention 'containment protocols' and 'subject observation logs'. Further analysis required." },
                        "CLASSIFIED_MEMO.txt": { type: "file", extension: "txt", content: "MEMORANDUM FOR RECORD\nSUBJECT: Incident Report - Sector Gamma\nAll personnel are reminded that access to Sector Gamma is strictly forbidden without Level 4 clearance. The events of 03/15 are under active investigation. Do not discuss with unauthorized individuals." }
                    }}
                }},
                "UTILS": { type: "folder", corrupted: false, children: {
                    "cleanup.bat": { type: "file", extension: "bat", lines: ["ECHO OFF", "ECHO Deleting temporary files...", "REM This is a simulation", "ECHO Process complete. Some errors may have occurred."] },
                    "corrupted_image.jpg": { type: "file", extension: "jpg", corrupted: true, content: "This is a corrupted JPEG. Cannot display." },
                    "another_image.png": { type: "file", extension: "png", corrupted: false, content: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABFSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAAAYCAgAAAAAAAAAAAAAAAAAAAAAKg3AWiAAAEU3X9aAAAAAElFTkSuQmCC" } // Example: 64x64 black PNG
                }},
                "PERSONAL_LOG_01.mp4": { type: "video", extension: "mp4", corrupted: false, content: "videos/horror3.mp4" }, // Actual path
                "DATA_FRAGMENT_XYZ.mp4": { type: "video", extension: "mp4", corrupted: false, content: "videos/horror4.mp4" }, // Actual path
                "unknown_transmission_077.wav": { type: "file", extension: "wav", corrupted: false, content: "Simulated audio content for unknown_transmission_077.wav" },
                "readme_IMPORTANT.txt": { type: "file", extension: "txt", corrupted: false, content: "If you are reading this, the primary system has failed.\nThis recovery environment is unstable.\nProceed with caution.\nKey files may be encrypted or corrupted.\nTrust nothing." },
                "system.log": { type: "log", corrupted: true, content: "SYS_LOG_START\n...\n[ERR] Kernel Panic - Memory Access Violation @ 0xDEADBEEF\n[WARN] Filesystem corruption detected on /dev/myst0\n[INFO] Attempting recovery mode...\n[ERR] §±¥¦©ª¬®¯°²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ" },
                "corrupted_executable.exe": { type: "file", extension: "exe", corrupted: true, content: "This executable is corrupted."}
            }
        }
    };

    // --- Function Definitions ---
    function playSound(soundId, force = false) {
        if (!soundEnabled && !force) return;
        try {
            const audio = audioElements[soundId];
            if (audio) {
                if (soundId === 'click' && audioElements.doubleClick && !audioElements.doubleClick.paused && audioElements.doubleClick.currentTime > 0) {
                    return;
                }
                if (soundId === 'doubleClick' && audioElements.click && !audioElements.click.paused && audioElements.click.currentTime > 0) {
                    audioElements.click.pause();
                    audioElements.click.currentTime = 0;
                }
                audio.currentTime = 0;
                audio.play().catch(e => console.warn(`Audio play failed for ${soundId}: ${e.message}`));
            }
        } catch (e) {
            console.error(`Error playing sound ${soundId}:`, e);
        }
    }

    function logSystemEvent(message) {
        const timestamp = new Date().toLocaleTimeString();
        systemLog.push(`[${timestamp}] ${message}`);
        console.log(`System Log: ${message}`);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomGlitchChar() {
        const glitchChars = [
            '▓', '▒', '░', '█', '', '│', '─', '┼', '┐', '└', '├', 'µ', 'ß', '£', '§', ' ', '.', '_', '/', '\\'
        ];
        if (Math.random() < 0.1) {
             const alphanum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
             return alphanum.charAt(Math.floor(Math.random() * alphanum.length));
        }
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }

    const bootMessages = [
        { text: "MystOS BIOS v0.7.3 (Corrupted Core)", delay: 500 },
        { text: "Copyright (C) 200X, Mysterium Systems Inc.", delay: 500 },
        { text: "CPU: Unknown Processor @ ???GHz", delay: 300 },
        { text: "Initializing Memory...", delay: 500, action: 'memoryTest' },
        { text: "IDE Channel 0 Master: MYSTERIUM_H<span class='glitch-char'>D</span> [UDMA Mode ? ERR<span class='glitch-char'>█</span>R]", delay: 1000, sound: 'hddSeek', stopSound: 'hddSeek', glitch: true },
        { text: "IDE Channel 0 Slave: None", delay: 500 },
        { text: "IDE Channel 1 Master: None", delay: 500 },
        { text: "IDE Channel 1 Slave: ERROR DETECTED - DEVI<span class='glitch-char'>▓</span>E UNR<span class='glitch-char'>_</span>SPONS<span class='glitch-char'>▒</span>VE", delay: 1000, sound: 'error', glitch: true },
        { text: "Verifying DMI Pool Data................ <span class='glitch-char'>▓</span><span class='glitch-char'>▒</span> CORRUPTED", delay: 2000 },
        { text: "Booting from Hard Disk...", delay: 1500 },
    ];

    async function startBootSequence() {
        bootSeqContainer.classList.remove('hidden');
        logSystemEvent("Boot sequence started.");
        playSound('biosBeep', true);
        for (const item of bootMessages) {
            await sleep(item.delay);
            let line = item.text;
            if (item.glitch && !line.includes("<span class='glitch-char'>")) {
                let textArray = line.split('');
                if (line.includes("ERROR") || line.includes("UNRESPONSIVE")) {
                    for (let i = 0; i < textArray.length; i++) {
                        if (Math.random() < 0.15 && textArray[i] !== ' ' && textArray[i] !== '[' && textArray[i] !== ']') {
                            textArray[i] = `<span class='glitch-char'>${getRandomGlitchChar()}</span>`;
                        }
                    }
                    line = textArray.join('');
                } else if (Math.random() < 0.05) {
                     for (let i = 0; i < textArray.length; i++) {
                        if (Math.random() < 0.01 && textArray[i] !== ' ') {
                            textArray[i] = `<span class='glitch-char'>${getRandomGlitchChar()}</span>`;
                        }
                    }
                    line = textArray.join('');
                }
            }
            bootSeqContainer.innerHTML += `<p>${line}</p>`;
            bootSeqContainer.scrollTop = bootSeqContainer.scrollHeight;
            if (item.sound) playSound(item.sound);
            if (item.action === 'memoryTest') {
                const memLine = bootSeqContainer.lastElementChild;
                let memCount = 0;
                const totalMem = 64;
                const memInterval = setInterval(() => {
                    memCount += Math.floor(Math.random() * 3) + 1;
                    if (memCount >= totalMem - Math.floor(Math.random()*5)) {
                        memCount = Math.min(memCount, totalMem);
                        clearInterval(memInterval);
                        let memStatus = `${memCount}MB OK`;
                        if (Math.random() < 0.7) {
                            memStatus += ` (with error<span class='glitch-char'>s</span><span class='glitch-char'>░</span>)`;
                        }
                        memLine.innerHTML += ` ${memStatus}`;
                        bootSeqContainer.scrollTop = bootSeqContainer.scrollHeight;
                    } else {
                        memLine.innerHTML = `Initializing Memory... ${memCount}MB`;
                    }
                }, 150);
                await sleep(totalMem * 60);
            }
            if (item.stopSound) {
                if (audioElements[item.stopSound]) audioElements[item.stopSound].pause();
            }
        }
        await sleep(1000);
        bootSeqContainer.classList.add('hidden');
        startOsLoader();
    }

    const osLoaderMessages = [
        { text: "KERNEL.SYS Load @ 0xC0100000...", progress: 10, delay: 1200 },
        { text: "HAL_INIT_SEQ...", progress: 25, delay: 1500 },
        { text: "FS_CHK: [MYSTERIUM_HD] Read MFT... (Irregularities)", progress: 40, delay: 2200, glitchEffect: true, sound: 'hddSeek' },
        { text: "RECOVERY_MOD: Sector Scan... ERR:0x03A1", progress: 50, delay: 1800, sound: 'error' },
        { text: "UI_SHELL: Load (FB_MODE)", progress: 75, delay: 2000 },
        { text: "SYS_INTEGRITY: WARN (Unstable Modules)", progress: 90, delay: 1300 },
        { text: "SHELL_HANDOVER...", progress: 100, delay: 1500, sound: 'shellHandover' }
    ];

    async function startOsLoader() {
        osLoaderScreen.classList.remove('hidden');
        if(audioElements.hddSeek && audioElements.hddSeek.loop) audioElements.hddSeek.play().catch(e=>console.warn(e));
        logSystemEvent("OS Loader started.");
        for (const item of osLoaderMessages) {
            await sleep(item.delay);
            osLoaderStatus.textContent = item.text;
            osLoaderProgressBar.style.width = item.progress + '%';
            if (item.glitchEffect) {
                osLoaderScreen.classList.add('flicker');
                await sleep(150 + Math.random() * 100);
                osLoaderScreen.classList.remove('flicker');
            }
            if (item.sound) playSound(item.sound);
        }
        if(audioElements.hddSeek) audioElements.hddSeek.pause();
        await sleep(1000);
        osLoaderScreen.classList.add('hidden');
        initializeDesktop();
    }

    function initializeDesktop() {
        desktop.classList.remove('hidden');
        logSystemEvent("Desktop initialized.");
        playSound('osStartup');
        playSound('hddHum');
        spawnDeadPixels();
        updateRecycleBinIcon();
        updateClock();
        setInterval(updateClock, 15000);
        channelIntro.style.opacity = '0';
        channelIntro.style.animation = 'none';
        setTimeout(() => channelIntro.style.animation = 'fadeInIntro 5s 1s forwards', 500);
        
        setupCustomCursor();
        setupRareGlitches();

        // Make all standard windows draggable and resizable
        [fileExplorerWindow, recycleBinWindow, genericDialog, cmdDialog, passwordPromptDialog, videoPlayerWindow].forEach(win => {
            if (win) {
                makeDraggable(win);
                makeResizable(win); // Call makeResizable for each window
            } else {
                console.error("A window element was not found during initialization for draggable/resizable setup.");
            }
        });

        // Specific close button for video player (already handled if part of the loop above, but good to ensure)
        // The close button listener for videoPlayerWindow is set up in setupEventListeners
    }

    function spawnDeadPixels() {
        const numPixels = Math.floor(Math.random() * 4) + 2;
        const colors = ['#000000'];
        const desktopWidth = desktop.clientWidth;
        const desktopHeight = desktop.clientHeight;
        for (let i = 0; i < numPixels; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'stuck-pixel';
            pixel.style.left = `${Math.random() * desktopWidth}px`;
            pixel.style.top = `${Math.random() * desktopHeight}px`;
            pixel.style.backgroundColor = colors[0];
            desktop.appendChild(pixel);
        }
        logSystemEvent(`${numPixels} display anomalies (dead pixels) detected.`);
    }

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeString = `${hours}:${minutes} ${ampm}`;
        taskbarClock.textContent = timeString;
        taskbarClock.classList.remove('clock-glitch');
        if (Math.random() < 0.05) {
            logSystemEvent("Clock anomaly detected.");
            const randomClockGlitchChar = () => ['▓', '▒', '░', '█', '?', '*', '#'][Math.floor(Math.random() * 7)];
            taskbarClock.textContent = `${randomClockGlitchChar()}${randomClockGlitchChar()}:${randomClockGlitchChar()}${randomClockGlitchChar()} ${randomClockGlitchChar()}M`;
            taskbarClock.classList.add('clock-glitch');
            playSound('error');
        }
    }

    let dragOffsetX, dragOffsetY, resizeStartX, resizeStartY, initialWidth, initialHeight;
    function makeDraggable(windowElement) {
        const header = windowElement.querySelector('.window-header');
        if (!header) return;
        header.onmousedown = (e) => {
            if (e.target.closest('.window-controls button')) return;
            bringToFront(windowElement);
            activeWindow = windowElement;
            dragOffsetX = e.clientX - windowElement.offsetLeft;
            dragOffsetY = e.clientY - windowElement.offsetTop;
            document.onmousemove = (ev) => {
                let newX = ev.clientX - dragOffsetX;
                let newY = ev.clientY - dragOffsetY;
                const desktopRect = desktop.getBoundingClientRect();
                const taskbarHeight = document.getElementById('taskbar').offsetHeight;
                newX = Math.max(0, Math.min(newX, desktopRect.width - windowElement.offsetWidth));
                newY = Math.max(0, Math.min(newY, desktopRect.height - windowElement.offsetHeight - taskbarHeight));
                windowElement.style.left = newX + 'px';
                windowElement.style.top = newY + 'px';
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                activeWindow = null;
            };
            e.preventDefault();
        };
    }

    function makeResizable(windowElement) {
        const resizeHandle = windowElement.querySelector('.window-resize-handle');
        if (!resizeHandle) return;

        resizeHandle.onmousedown = (e) => {
            e.preventDefault(); // Prevent text selection during resize
            e.stopPropagation(); // Prevent drag from starting if handle is on header
            bringToFront(windowElement);

            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            initialWidth = windowElement.offsetWidth;
            initialHeight = windowElement.offsetHeight;
            
            const computedStyle = window.getComputedStyle(windowElement);
            const minWidth = parseInt(computedStyle.minWidth, 10) || 150; // Default min-width
            const minHeight = parseInt(computedStyle.minHeight, 10) || 100; // Default min-height

            document.onmousemove = (ev) => {
                const deltaX = ev.clientX - resizeStartX;
                const deltaY = ev.clientY - resizeStartY;

                let newWidth = initialWidth + deltaX;
                let newHeight = initialHeight + deltaY;

                newWidth = Math.max(minWidth, newWidth);
                newHeight = Math.max(minHeight, newHeight);
                
                const desktopRect = desktop.getBoundingClientRect();
                const taskbarHeight = document.getElementById('taskbar').offsetHeight;
                // Calculate max width/height based on window's current position
                const maxAllowedWidth = desktopRect.width - windowElement.offsetLeft;
                const maxAllowedHeight = desktopRect.height - windowElement.offsetTop - taskbarHeight;

                newWidth = Math.min(newWidth, maxAllowedWidth);
                newHeight = Math.min(newHeight, maxAllowedHeight);

                windowElement.style.width = newWidth + 'px';
                windowElement.style.height = newHeight + 'px';

                if (windowElement.id === 'video-player-window' && mainVideoPlayer) {
                    // Aspect ratio is handled by object-fit: contain in CSS
                }
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    function bringToFront(windowElement) {
        if (windowElement) {
            highestZIndex++;
            windowElement.style.zIndex = highestZIndex;
        }
    }

    function openWindow(windowElement) {
        windowElement.classList.remove('hidden');
        bringToFront(windowElement);
        playSound('windowOpen');
    }

    function closeWindow(windowElement) {
        windowElement.classList.add('hidden');
        playSound('windowClose');
        if (windowElement === fileExplorerWindow) {
             logSystemEvent("File Explorer closed.");
        }
        if (windowElement === recycleBinWindow) {
            logSystemEvent("Recycle Bin window closed.");
        }
        if (windowElement === passwordPromptDialog) {
            currentArchiveToUnlock = null;
        }
        if (windowElement === videoPlayerWindow) {
            logSystemEvent("Video Player window closed.");
            if (mainVideoPlayer) {
                mainVideoPlayer.pause();
                mainVideoPlayer.removeAttribute('src'); // Remove src
                mainVideoPlayer.load(); // Attempt to reset the player
                // Clear any child <source> elements
                while (mainVideoPlayer.firstChild) {
                    mainVideoPlayer.removeChild(mainVideoPlayer.firstChild);
                }
                if(videoPlayerStatus) videoPlayerStatus.textContent = "Idle";
            }
        }
    }
    
    function getItemFromPath(path, fsObject = fileSystem) {
        const parts = path.split('/').filter(p => p.length > 0);
        if (parts.length === 0) {
            console.error(`getItemFromPath called with invalid or empty path: "${path}"`);
            return null;
        }
        let currentLevel = fsObject;
        if (fsObject === fileSystem) {
            const driveName = parts[0];
            if (fsObject[driveName]) {
                currentLevel = fsObject[driveName];
                for (let i = 1; i < parts.length; i++) {
                    const partName = parts[i];
                    if (currentLevel && currentLevel.children && currentLevel.children[partName]) {
                        currentLevel = currentLevel.children[partName];
                    } else {
                        return null;
                    }
                }
                return currentLevel;
            } else {
                return null;
            }
        } else {
            for (const partName of parts) {
                if (currentLevel && currentLevel[partName]) {
                    currentLevel = currentLevel[partName];
                } else if (currentLevel && currentLevel.children && currentLevel.children[partName]) {
                    currentLevel = currentLevel.children[partName];
                } else {
                    return null;
                }
            }
            return currentLevel;
        }
    }

    function updateRecycleBinIcon() {
        if (Object.keys(recycleBinContents).length > 0) {
            recycleBinImgDesktop.src = ICONS.recycle_bin_full;
        } else {
            recycleBinImgDesktop.src = ICONS.recycle_bin_empty;
        }
        // Ensure the alt text is appropriate too, though less critical for visual
        recycleBinImgDesktop.alt = Object.keys(recycleBinContents).length > 0 ? "Recycle Bin (Full)" : "Recycle Bin (Empty)";
    }

    function openRecycleBinWindow() {
        logSystemEvent("Recycle Bin window opened.");
        openWindow(recycleBinWindow);
        renderRecycleBinContents();
        // Placeholder if renderRecycleBinContents is missing
        if (typeof renderRecycleBinContents !== 'function' || renderRecycleBinContents.toString().includes('/* ... (keep existing) ... */')) {
            rbFileListing.innerHTML = '<p style="color: #888; text-align: center; margin-top: 20px;">Recycle Bin content rendering is not fully implemented.</p>';
            rbItemCount.textContent = `${Object.keys(recycleBinContents).length} object(s)`;
        }
    }

    function renderRecycleBinContents() {
        logSystemEvent("Rendering Recycle Bin contents.");
        rbFileListing.innerHTML = ''; // Clear previous listing
        selectedRecycleBinItemElement = null; // Deselect any recycle bin item

        const itemCount = Object.keys(recycleBinContents).length;
        rbItemCount.textContent = `${itemCount} object(s)`;

        if (itemCount > 0) {
            // Sort items by deletedTime, most recent first (optional)
            const sortedItems = Object.entries(recycleBinContents)
                .sort(([, a], [, b]) => b.deletedTime - a.deletedTime);

            for (const [uniqueId, item] of sortedItems) {
                // Create a file item element. We might want to adapt createFileItemElement
                // or create a new one if recycle bin items need different behavior/appearance.
                // For now, using the existing one. The 'item.originalPath' is the full path.
                const itemElement = createFileItemElement(item.name, item.data, item.originalPath);
                itemElement.dataset.recycleId = uniqueId; // Store unique ID for restore/delete actions

                // Override default dblclick for recycle bin items (maybe show properties or do nothing)
                itemElement.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    playSound('click'); // Or 'error' if no action
                    showDialog("Item Properties (Recycle Bin)", 
                               `Name: ${item.name}\nOriginal Path: ${item.originalPath}\nDeleted: ${new Date(item.deletedTime).toLocaleString()}`, 
                               "info");
                });
                
                // Context menu for recycle bin items (can be a specific one or adapt fileContextMenu)
                itemElement.addEventListener('contextmenu', (e) => {
                    // Select the item first
                    if (selectedRecycleBinItemElement && selectedRecycleBinItemElement !== itemElement) {
                       selectedRecycleBinItemElement.classList.remove('selected-file');
                       const oldNameSpan = selectedRecycleBinItemElement.querySelector('.file-icon-name');
                       if(oldNameSpan) oldNameSpan.classList.remove('selected-file');
                    }
                    itemElement.classList.add('selected-file');
                    const nameSpan = itemElement.querySelector('.file-icon-name');
                    if(nameSpan) nameSpan.classList.add('selected-file');
                    selectedRecycleBinItemElement = itemElement;
                    
                    // For now, let's use the standard file context menu.
                    // Later, we can create a specific recycleBinContextMenu if needed.
                    // The handleContextMenuAction will need to know if the target is from the bin.
                    showContextMenu(e, 'file', itemElement); 
                    // We might need to adapt fileContextMenu or handleContextMenuAction to show
                    // "Restore" and "Permanently Delete" instead of "Delete".
                });

                rbFileListing.appendChild(itemElement);
            }
        } else {
            rbFileListing.innerHTML = '<p style="color: #888; text-align: center; margin-top: 20px;">The Recycle Bin is empty.</p>';
        }
    }

    function deleteItem(parentItemPath, itemName, itemData) { // itemPath is the parent directory
        logSystemEvent(`[deleteItem] Attempting to delete: "${itemName}" from parent path: "${parentItemPath}"`);
        console.log(`[deleteItem] Received itemData:`, JSON.parse(JSON.stringify(itemData)));
        
        const parentObject = getItemFromPath(parentItemPath);
        console.log(`[deleteItem] Retrieved parentObject from getItemFromPath("${parentItemPath}"):`, parentObject ? JSON.parse(JSON.stringify(parentObject)) : null);

        if (parentObject && parentObject.children && parentObject.children[itemName]) {
            console.log(`[deleteItem] Item "${itemName}" confirmed to exist in parentObject.children.`);
            // Store a deep copy for the recycle bin, including its original full path
            const fullOriginalPath = parentItemPath + itemName;
            const uniqueId = `rb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            recycleBinContents[uniqueId] = { 
                originalPath: fullOriginalPath, // Store the full path of the item itself
                name: itemName, 
                data: JSON.parse(JSON.stringify(itemData)), // Deep copy of item data
                deletedTime: Date.now() 
            };

            // Actually remove from fileSystem
            delete parentObject.children[itemName];
            logSystemEvent(`Successfully deleted "${itemName}" from file system at "${parentItemPath}".`);

            playSound('recycle');
            updateRecycleBinIcon();
            renderFileExplorer(); // Refresh current file explorer view

            if (!recycleBinWindow.classList.contains('hidden')) {
                renderRecycleBinContents(); // Refresh recycle bin view if open
            }
            showDialog("Delete", `"${itemName}" has been moved to the Recycle Bin.`, "info");
        } else {
            showErrorDialog("Delete Error", `Could not find "${itemName}" in "${parentItemPath}" to delete.`);
            logSystemEvent(`Error deleting: ${itemName} not found in ${parentItemPath}.`);
        }
    }

    function restoreSelectedItemFromRecycleBin() {
        if (!selectedRecycleBinItemElement || !selectedRecycleBinItemElement.dataset.recycleId) {
            showErrorDialog("Restore Error", "No item selected in Recycle Bin to restore.");
            return;
        }

        const recycleId = selectedRecycleBinItemElement.dataset.recycleId;
        const itemToRestore = recycleBinContents[recycleId];

        if (!itemToRestore) {
            showErrorDialog("Restore Error", "Selected item not found in Recycle Bin records.");
            return;
        }

        logSystemEvent(`Attempting to restore: ${itemToRestore.name} to ${itemToRestore.originalPath}`);

        const originalFullPath = itemToRestore.originalPath;
        const lastSlashIndex = originalFullPath.lastIndexOf('/');
        const originalParentPath = lastSlashIndex > 0 ? originalFullPath.substring(0, lastSlashIndex + 1) : (originalFullPath.includes(":/") ? originalFullPath.substring(0, originalFullPath.indexOf(":/") + 2) + "/" : "");
        const itemName = originalFullPath.substring(lastSlashIndex + 1);
        
        let parentNodeInFS = getItemFromPath(originalParentPath);

        if (!parentNodeInFS && originalParentPath === "MYSTERIUM_HD:/") { // Special case for root
             parentNodeInFS = fileSystem["MYSTERIUM_HD:"];
        }


        if (parentNodeInFS && (parentNodeInFS.type === 'folder' || parentNodeInFS.type === 'drive')) {
            if (!parentNodeInFS.children) {
                parentNodeInFS.children = {};
            }

            if (parentNodeInFS.children[itemName]) {
                // Conflict: Item with the same name already exists at the original location.
                // Ask user to overwrite or rename (simplified: show error for now)
                showErrorDialog("Restore Conflict", `An item named "${itemName}" already exists at the original location "${originalParentPath}". Cannot restore.`);
                logSystemEvent(`Restore conflict for "${itemName}" at "${originalParentPath}".`);
                return;
            }

            // Add item back to fileSystem
            parentNodeInFS.children[itemName] = JSON.parse(JSON.stringify(itemToRestore.data)); // Deep copy

            // Remove from recycleBinContents
            delete recycleBinContents[recycleId];

            logSystemEvent(`Successfully restored "${itemName}" to "${originalParentPath}".`);
            playSound('click'); // Or a specific "restore" sound

            updateRecycleBinIcon();
            renderRecycleBinContents(); // Refresh Recycle Bin view

            // Refresh File Explorer if the restored item's parent path is currently visible
            // or if it's a parent of the current path.
            if (currentPath.startsWith(originalParentPath) || originalParentPath.startsWith(currentPath)) {
                renderFileExplorer();
            }
            
            showDialog("Item Restored", `"${itemName}" has been restored to its original location.`, "info");
            selectedRecycleBinItemElement = null; // Deselect
        } else {
            showErrorDialog("Restore Error", `Original location "${originalParentPath}" for "${itemName}" no longer exists or is invalid. Cannot restore.`);
            logSystemEvent(`Error restoring "${itemName}": Original parent path "${originalParentPath}" not found or invalid.`);
        }
    }

    function emptyRecycleBin() {
        if (Object.keys(recycleBinContents).length === 0) {
            showDialog("Recycle Bin", "The Recycle Bin is already empty.", "info");
            return;
        }

        // For a proper confirmation, we'd need a dialog that can return a promise or use a callback.
        // Simulating a confirm dialog with a simple prompt for now, or directly emptying.
        // Let's use a custom dialog that needs to be built or adapt showDialog.
        // For now, let's assume a simple confirm() for brevity, though it's blocking.
        // A better approach would be to adapt showDialog to handle confirmations.
        // showDialog("Confirm Empty Recycle Bin", "Are you sure you want to permanently delete all items in the Recycle Bin?", "confirm", () => { ... });
        // Since showDialog is not set up for confirm callbacks, we'll proceed directly for now and note this for future improvement.
        
        // TODO: Implement a proper confirmation dialog for emptyRecycleBin
        // For now, we'll just empty it directly after a simple info dialog.
        showDialog("Confirmation Needed", "Emptying the Recycle Bin will permanently delete all items. (This is a placeholder for a real confirmation dialog). Proceeding to empty.", "warning");

        // Proceeding as if confirmed:
        logSystemEvent("Empty Recycle Bin confirmed (simulated confirmation).");
        recycleBinContents = {};
        playSound('recycle'); // Or a more destructive sound
        updateRecycleBinIcon();
        if (!recycleBinWindow.classList.contains('hidden')) {
            renderRecycleBinContents();
        }
        logSystemEvent("Recycle Bin emptied.");
        showDialog("Recycle Bin", "The Recycle Bin has been emptied.", "info");
    }

    function renderFileExplorer() {
        logSystemEvent(`Rendering File Explorer for path: ${currentPath}`);
        feFileListing.innerHTML = ''; // Clear previous listing
        selectedFileElement = null; // Deselect any file explorer item

        const driveNameOnly = currentPath.split('/')[0].replace(/:$/, '');
        feTitle.textContent = driveNameOnly;
        
        const currentFolderObject = getItemFromPath(currentPath);
        feAddressBar.value = currentPath;

        if (currentFolderObject && (currentFolderObject.type === "drive" || currentFolderObject.type === "folder")) {
            if (currentFolderObject.children && Object.keys(currentFolderObject.children).length > 0) {
                let itemCount = 0;
                // Sort items: folders first, then files, then alphabetically
                const sortedChildren = Object.entries(currentFolderObject.children)
                    .sort(([aName, aData], [bName, bData]) => {
                        if (aData.type === 'folder' && bData.type !== 'folder') return -1;
                        if (aData.type !== 'folder' && bData.type === 'folder') return 1;
                        return aName.localeCompare(bName);
                    });


                for (const [name, data] of sortedChildren) {
                    // Construct the full path for this item
                    let itemFullPath = currentPath;
                    // Ensure currentPath ends with a slash if it's a directory/drive root before appending name
                    if ((currentFolderObject.type === "drive" || currentFolderObject.type === "folder") && !itemFullPath.endsWith('/')) {
                        itemFullPath += '/';
                    }
                    itemFullPath += name;

                    const itemElement = createFileItemElement(name, data, itemFullPath);
                    
                    // Add dblclick listener to open item
                    itemElement.addEventListener('dblclick', () => {
                        playSound('doubleClick');
                        // Pass itemFullPath to handleOpenItem
                        handleOpenItem(name, data, itemFullPath); 
                    });

                    // Add contextmenu listener
                    itemElement.addEventListener('contextmenu', (e) => {
                        e.stopPropagation(); // Prevent event from bubbling to desktop
                        // Select the item first
                        if (selectedFileElement && selectedFileElement !== itemElement) {
                           selectedFileElement.classList.remove('selected-file');
                           const oldNameSpan = selectedFileElement.querySelector('.file-icon-name');
                           if(oldNameSpan) oldNameSpan.classList.remove('selected-file');
                        }
                        itemElement.classList.add('selected-file');
                        const nameSpan = itemElement.querySelector('.file-icon-name');
                        if(nameSpan) nameSpan.classList.add('selected-file');
                        selectedFileElement = itemElement;
                        
                        // Ensure 'file' type is passed to showContextMenu for file items
                        showContextMenu(e, 'file', itemElement); 
                    });

                    feFileListing.appendChild(itemElement);
                    itemCount++;
                }
                feItemCount.textContent = `${itemCount} object(s)`;
            } else {
                feFileListing.innerHTML = '<p style="color: #888; text-align: center; margin-top: 20px;">This folder is empty.</p>';
                feItemCount.textContent = '0 object(s)';
            }
        } else {
            let errorMsg = `Error: Could not access path "${currentPath}".`;
            if (currentFolderObject && currentFolderObject.type !== "drive" && currentFolderObject.type !== "folder") {
                 errorMsg = `Error: Cannot browse "${currentPath}". It is not a folder.`;
                 showErrorDialog("File Explorer Error", errorMsg);
            } else if (!currentFolderObject) { 
                showErrorDialog("File Explorer Error", `The path "${currentPath}" could not be found or is corrupted.`);
            }
            feFileListing.innerHTML = `<p style="color: red; text-align: center; margin-top: 20px;">${errorMsg}</p>`;
            feItemCount.textContent = '0 object(s)';
        }
        updateFakeFreeSpace();
    }

    function updateFakeFreeSpace() { 
        // Placeholder - a more elaborate version could calculate based on fileSystem
        const totalSpace = 700; // MB
        const usedSpace = Math.floor(Math.random() * 200) + 50; // Random used space
        const freeSpace = totalSpace - usedSpace;
        feSpaceFree.textContent = `${freeSpace} MB Free`;
        if (Math.random() < 0.1) { // Chance of glitchy free space
            feSpaceFree.textContent = `${getRandomGlitchChar()}${getRandomGlitchChar()} KB Free (Corrupted Sector?)`;
        }
    } 

    function createFileItemElement(name, data, itemPath) { // context and uniqueId can be added later if needed
        const itemElement = document.createElement('div');
        itemElement.className = 'file-item';
        itemElement.dataset.name = name;
        itemElement.dataset.path = itemPath; // Store the full path for context menu/actions
        itemElement.dataset.type = data.type;
        if (data.extension) {
            itemElement.dataset.extension = data.extension;
        }

        const iconImg = document.createElement('img');
        iconImg.alt = name; // Alt text for accessibility

        let iconSrc = ICONS.unknown; // Default icon

        if (data.type === 'folder') {
            iconSrc = ICONS.folder;
        } else if (data.type === 'drive') { // Should not happen for items *within* a drive listing
            iconSrc = mystHdIcon.querySelector('img').src; // Use the main HD icon
        } else if (data.type === 'file' || data.type === 'video' || data.type === 'log') { // More specific file types
            switch (data.extension) {
                case 'txt': iconSrc = ICONS.text; break;
                case 'log': iconSrc = ICONS.log; break;
                case 'mp4': case 'avi': case 'mov': case 'vlog': iconSrc = ICONS.video; break; // Added vlog to use video icon
                case 'jpg': case 'jpeg': case 'png': case 'gif': iconSrc = ICONS.image; break;
                case 'bat': iconSrc = ICONS.batch; break;
                case 'zip': case 'rar': iconSrc = ICONS.archive; break;
                case 'ini': case 'cfg': case 'conf': iconSrc = ICONS.config; break;
                default: iconSrc = ICONS.file; // Generic file icon if extension not matched
            }
        }
        iconImg.src = iconSrc;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'file-icon-name';
        nameSpan.textContent = name;

        if (data.corrupted) {
            itemElement.classList.add('corrupted-item');
            if (Math.random() < 0.3) { // Randomly make corrupted item name glitchy
                nameSpan.innerHTML = name.split('').map(char => 
                    Math.random() < 0.2 ? `<span class="glitch-char">${getRandomGlitchChar()}</span>` : char
                ).join('');
            }
        }
        
        // Basic click listener for selection (can be expanded)
        itemElement.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('click');
            if (selectedFileElement && selectedFileElement !== itemElement) {
                selectedFileElement.classList.remove('selected-file');
                 if(selectedFileElement.querySelector('.file-icon-name')) {
                    selectedFileElement.querySelector('.file-icon-name').classList.remove('selected-file'); // Ensure text selection style is also removed
                 }
            }
            itemElement.classList.add('selected-file');
            if(nameSpan) nameSpan.classList.add('selected-file'); // Style the text part of the selection
            selectedFileElement = itemElement;
            // For recycle bin context, might need different selection handling
            if (itemElement.closest('#recycle-bin-listing')) {
                selectedRecycleBinItemElement = itemElement;
            } else {
                selectedRecycleBinItemElement = null; // Clear if selecting in file explorer
            }
        });

        // Placeholder for double click (to be implemented by renderFileExplorer or similar)
        // itemElement.addEventListener('dblclick', () => { ... });

        // Placeholder for context menu (to be implemented by renderFileExplorer or similar)
        // itemElement.addEventListener('contextmenu', (e) => { ... });

        itemElement.appendChild(iconImg);
        itemElement.appendChild(nameSpan);
        return itemElement;
    }

    async function runBatchFile(name, lines) { 
        logSystemEvent(`Executing batch file: ${name}`);
        cmdDialogTitleElement.textContent = name;
        cmdOutput.innerHTML = `<p>MystOS Batch Processor v0.8 (Corrupted)</p><p>Executing ${name}...</p>`;
        openWindow(cmdDialog);
        
        if (!lines || lines.length === 0) {
            lines = ["ECHO OFF", "ECHO Batch file is empty or corrupted."];
        }

        for (const line of lines) {
            await sleep(Math.random() * 300 + 100);
            let outputLine = line;
            if (Math.random() < 0.1) outputLine = line.split('').map(c => Math.random() < 0.2 ? getRandomGlitchChar() : c).join('');
            
            const p = document.createElement('p');
            if (line.toUpperCase().startsWith("ECHO ")) {
                p.textContent = outputLine.substring(5);
            } else if (line.toUpperCase() === "CLS") {
                cmdOutput.innerHTML = ''; // Clear screen
                continue;
            } else if (line.toUpperCase().startsWith("REM ")) {
                p.innerHTML = `<span style="color: #00AA00;">${outputLine}</span>`; // Comments in green
            }
             else {
                p.textContent = `> ${outputLine}`;
                if (Math.random() < 0.2) { // Chance of command "error"
                    await sleep(200);
                    const errP = document.createElement('p');
                    errP.style.color = 'red';
                    errP.textContent = `ERR: Syntax error or command not recognized (Code: ${Math.floor(Math.random()*255)})`;
                    cmdOutput.appendChild(errP);
                }
            }
            cmdOutput.appendChild(p);
            cmdOutput.scrollTop = cmdOutput.scrollHeight;
        }
        const doneP = document.createElement('p');
        doneP.textContent = `Batch file ${name} finished.`;
        cmdOutput.appendChild(doneP);
        cmdOutput.scrollTop = cmdOutput.scrollHeight;
    }

    function handleOpenItem(name, data, itemFullPath) { // Added itemFullPath argument
        logSystemEvent(`Opening item: ${name} at ${itemFullPath}`);
        if (!data) {
            showErrorDialog("Error", `Data for "${name}" is missing.`);
            return;
        }
        if (data.type === 'folder') {
            currentPath = itemFullPath;
            if (!currentPath.endsWith('/')) { // Ensure path consistency for folders
                currentPath += '/';
            }
            renderFileExplorer();
        } else if (data.type === 'file' || data.type === 'video' || data.type === 'log' || data.type === 'image' || data.type === 'archive' || data.type === 'batch' || data.extension === 'vlog') { // Added vlog
            openFile(name, data, itemFullPath);
        } else {
            showErrorDialog("Cannot Open", `Cannot open "${name}". Unknown item type or action not defined.`);
        }
    }

    function openFile(name, data, itemFullPath) {
        logSystemEvent(`Opening file: ${name} with extension ${data.extension}`);
        if (data.corrupted && Math.random() < 0.5) {
            showErrorDialog("File Corrupted", `The file "${name}" appears to be corrupted and cannot be opened.\n\nPath: ${itemFullPath}`);
            playSound('error');
            return;
        }

        switch (data.extension) {
            case 'txt':
            case 'log':
                let content = data.content || `Content of ${name} is unavailable or corrupted.`;
                if (data.corrupted) content = content.split('').map(c => Math.random() < 0.15 ? getRandomGlitchChar() : c).join('');
                showDialog(name, `<pre>${content}</pre>`, ICONS.text);
                break;
            case 'jpg':
            case 'png':
            case 'gif':
                if (name === "corrupted_image.jpg" && data.corrupted) {
                     showDialog(name, data.content || "Image data is corrupted.", ICONS.image);
                } else if (data.content && !data.corrupted) {
                     showDialog(name, `<img src="${data.content}" alt="${name}" style="max-width:100%; max-height: 300px; image-rendering: pixelated;">`, ICONS.image);
                } else {
                     showDialog(name, "Image preview not available or image is corrupted.", ICONS.image);
                }
                break;
            case 'bat':
                runBatchFile(name, data.lines || ["ECHO OFF", `ECHO Batch file ${name} has no commands or is unreadable.`]);
                break;
            case 'zip':
            case 'rar':
                promptForPassword(name, data, itemFullPath);
                break;
            case 'mp4':
            case 'vlog': // Handle .vlog like .mp4 for video playback
                openVideoPlayer(name, data, itemFullPath);
                break;
            case 'wav': // Example for audio - placeholder
                 showDialog(name, `Audio player for .${data.extension} is corrupted or missing. Cannot play "${name}".`, ICONS.file); // Generic file icon for now
                 break;
            default:
                showErrorDialog("Cannot Open File", `Files with extension ".${data.extension}" cannot be opened by MystOS or the required application is missing/corrupted.`);
        }
    }

    function openVideoPlayer(fileName, fileData, filePath) {
        logSystemEvent(`Opening video player for: ${fileName}`);
        if (!videoPlayerWindow || !mainVideoPlayer || !videoPlayerTitle || !videoPlayerStatus) {
            showErrorDialog("Video Player Error", "The video player components are missing or corrupted.");
            return;
        }

        videoPlayerTitle.textContent = fileName;
        
        // Clear previous video source and tracks
        mainVideoPlayer.removeAttribute('src');
        while (mainVideoPlayer.firstChild) {
            mainVideoPlayer.removeChild(mainVideoPlayer.firstChild);
        }
        mainVideoPlayer.load(); // Important to reset the media element

        if (fileData.corrupted) {
            videoPlayerStatus.textContent = "Error: Video file corrupted.";
            mainVideoPlayer.poster = ""; // Clear poster if any
            // Optionally display a "corrupted video" placeholder image or message in the video area
            // For now, just status bar message.
            showErrorDialog("Video Error", `The video file "${fileName}" is corrupted and cannot be played.`);
        } else if (fileData.content && typeof fileData.content === 'string') {
            // Assuming fileData.content is a relative path to the video file
            const sourceElement = document.createElement('source');
            sourceElement.src = fileData.content; 
            // Determine type based on extension, default to video/mp4
            sourceElement.type = fileData.extension === 'vlog' ? 'video/mp4' : `video/${fileData.extension}`; // Basic type assumption
            mainVideoPlayer.appendChild(sourceElement);
            mainVideoPlayer.load(); // Load the new source
            videoPlayerStatus.textContent = "Loading video...";
        } else {
            videoPlayerStatus.textContent = "Error: Video source missing.";
            showErrorDialog("Video Error", `The video source for "${fileName}" is missing.`);
            return; // Don't open window if no source
        }

        openWindow(videoPlayerWindow);
    }
    
    // Video Player Event Listeners (can be added in initializeDesktop or here)
    if (mainVideoPlayer && videoPlayerStatus) {
        mainVideoPlayer.oncanplay = () => { videoPlayerStatus.textContent = "Ready to play"; };
        mainVideoPlayer.onplay = () => { videoPlayerStatus.textContent = "Playing"; };
        mainVideoPlayer.onpause = () => { videoPlayerStatus.textContent = "Paused"; };
        mainVideoPlayer.onended = () => { videoPlayerStatus.textContent = "Finished"; };
        mainVideoPlayer.onerror = (e) => {
            let errorMsg = "Error: Could not play video.";
            if (mainVideoPlayer.error) {
                switch (mainVideoPlayer.error.code) {
                    case MediaError.MEDIA_ERR_ABORTED: errorMsg = 'Playback aborted.'; break;
                    case MediaError.MEDIA_ERR_NETWORK: errorMsg = 'Network error caused video download to fail.'; break;
                    case MediaError.MEDIA_ERR_DECODE: errorMsg = 'Video decoding error.'; break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: errorMsg = 'Video format not supported.'; break;
                    default: errorMsg = 'An unknown error occurred.';
                }
            }
            videoPlayerStatus.textContent = errorMsg;
            // Optionally show a dialog as well
            // showErrorDialog("Video Playback Error", `Could not play "${videoPlayerTitle.textContent}".\n${errorMsg}`);
            logSystemEvent(`Video player error for "${videoPlayerTitle.textContent}": ${errorMsg}`);
        };
    }


    function promptForPassword(fileName, fileData, filePath) {
        logSystemEvent(`Password prompt for: ${fileName}`);
        currentArchiveToUnlock = { name: fileName, data: fileData, path: filePath };
        passwordPromptFilename.textContent = fileName;
        passwordPromptInput.value = '';
        passwordPromptError.textContent = '';
        openWindow(passwordPromptDialog);
        passwordPromptInput.focus();
    }

    function handlePasswordUnlock() {
        playSound('click');
        if (!currentArchiveToUnlock) return;

        const enteredPassword = passwordPromptInput.value;
        const { name, data, path } = currentArchiveToUnlock;

        if (data.password === enteredPassword) {
            logSystemEvent(`Password correct for ${name}.`);
            closeWindow(passwordPromptDialog);
            extractArchiveContents(name, data, path.substring(0, path.lastIndexOf('/') + 1)); // Pass parent path
            currentArchiveToUnlock = null;
        } else {
            logSystemEvent(`Password incorrect for ${name}.`);
            passwordPromptError.textContent = 'Incorrect password. Access denied.';
            playSound('error');
            // Shake effect for dialog (optional)
            passwordPromptDialog.classList.add('screen-shake');
            setTimeout(() => passwordPromptDialog.classList.remove('screen-shake'), 300);
        }
    }

    function extractArchiveContents(archiveName, archiveData, targetPath) {
        logSystemEvent(`Extracting archive: ${archiveName} to ${targetPath}`);
        if (!archiveData.children || Object.keys(archiveData.children).length === 0) {
            showDialog("Empty Archive", `The archive "${archiveName}" is empty or corrupted.`, "info");
            return;
        }

        let parentNode = getItemFromPath(targetPath);
        if (!parentNode || (parentNode.type !== 'folder' && parentNode.type !== 'drive')) {
            showErrorDialog("Extraction Error", `Cannot extract to "${targetPath}". Invalid target path.`);
            return;
        }
        if (!parentNode.children) parentNode.children = {};


        let extractedCount = 0;
        for (const [itemName, itemData] of Object.entries(archiveData.children)) {
            if (parentNode.children[itemName]) {
                // Rudimentary conflict handling: skip or slightly alter name
                console.warn(`Conflict: ${itemName} already exists in ${targetPath}. Skipping.`);
                // Or: parentNode.children[`${itemName}_extracted`] = itemData;
                continue;
            }
            parentNode.children[itemName] = JSON.parse(JSON.stringify(itemData)); // Deep copy
            extractedCount++;
        }

        showDialog("Extraction Complete", `Extracted ${extractedCount} item(s) from "${archiveName}" to "${targetPath.slice(0, -1) || targetPath}".`, "info");
        if (currentPath === targetPath || currentPath.startsWith(targetPath)) {
            renderFileExplorer(); // Refresh if current view is affected
        }
    }

    function showContextMenu(event, type, targetElement = null) {
        event.preventDefault();
        playSound('click'); 
        hideAllContextMenus(); 

        let menuToShow;
        contextMenuTarget = targetElement; 
        console.log(`[showContextMenu] Called with type: "${type}", targetElement:`, targetElement);

        if (type === 'desktop') {
            menuToShow = desktopContextMenu;
            logSystemEvent("Desktop context menu requested. Showing desktopContextMenu.");
            console.log("[showContextMenu] Showing desktopContextMenu");
        } else if (type === 'file' && targetElement) {
            menuToShow = fileContextMenu;
            logSystemEvent(`File context menu requested for: ${targetElement.dataset.name}. Showing fileContextMenu.`);
            console.log("[showContextMenu] Showing fileContextMenu for target:", targetElement.dataset.name);
        } else {
            logSystemEvent(`Unknown context menu type or missing target: ${type}. No menu shown.`);
            console.error(`[showContextMenu] Unknown type or missing target. Type: ${type}, Target:`, targetElement);
            return;
        }

        if (!menuToShow) {
            console.error("[showContextMenu] menuToShow is undefined. Cannot display context menu.");
            return;
        }

        // Position the menu
        // Basic positioning:
        menuToShow.style.left = `${event.clientX}px`;
        menuToShow.style.top = `${event.clientY}px`;
        
        // Advanced positioning: ensure menu stays within viewport
        const menuRect = menuToShow.getBoundingClientRect(); // Get dimensions after setting initial position (may need a tick)
        const desktopRect = desktop.getBoundingClientRect();

        let newLeft = event.clientX;
        let newTop = event.clientY;

        // Temporarily show to get dimensions, then hide, then position, then show.
        // This avoids flicker but ensures dimensions are correct.
        menuToShow.classList.remove('hidden');
        const realMenuRect = menuToShow.getBoundingClientRect();


        if (event.clientX + realMenuRect.width > desktopRect.right) {
            newLeft = desktopRect.right - realMenuRect.width - 5; // 5px buffer
        }
        if (event.clientY + realMenuRect.height > desktopRect.bottom - document.getElementById('taskbar').offsetHeight) {
            newTop = desktopRect.bottom - realMenuRect.height - document.getElementById('taskbar').offsetHeight - 5; // 5px buffer
        }
        
        menuToShow.style.left = `${Math.max(0, newLeft)}px`;
        menuToShow.style.top = `${Math.max(0, newTop)}px`;
        
        bringToFront(menuToShow); // Ensure it's on top
        menuToShow.classList.remove('hidden');
    }
    function hideAllContextMenus() {
        desktopContextMenu.classList.add('hidden');
        fileContextMenu.classList.add('hidden');
        // Also hide Start Menu if it's open and we click elsewhere (unless clicking Start button itself)
        if (startMenu && !startMenu.classList.contains('hidden')) {
             if (contextMenuTarget !== taskbarStartButton) { // Check if the click wasn't on start button
                startMenu.classList.add('hidden');
                taskbarStartButton.classList.remove('active');
         }
    }
    // contextMenuTarget = null; // Moved to end of handleContextMenuAction
}
function handleContextMenuAction(action) {
        playSound('click');
        logSystemEvent(`Context menu action: ${action} on target: ${contextMenuTarget ? (contextMenuTarget.dataset.name || contextMenuTarget.id) : 'desktop'}`);
        hideAllContextMenus();

        if (!action) return;

        const targetIsDesktop = !contextMenuTarget || contextMenuTarget === desktop || contextMenuTarget.id === 'desktop';
        const targetIsFileItem = contextMenuTarget && contextMenuTarget.classList.contains('file-item');
        const targetIsDesktopIcon = contextMenuTarget && contextMenuTarget.classList.contains('desktop-icon');

        let itemName, itemPath, itemData, itemType;

        if (targetIsFileItem) {
            itemName = contextMenuTarget.dataset.name;
            itemPath = contextMenuTarget.dataset.path; // Full path of the item itself
            itemType = contextMenuTarget.dataset.type;
            // To get itemData, we need to parse the parent path and then get the child
            const parentPath = itemPath.substring(0, itemPath.lastIndexOf('/') + 1);
            console.log(`[handleContextMenuAction] For item "${itemName}": itemPath="${itemPath}", derived parentPath="${parentPath}"`);
            const parentObject = getItemFromPath(parentPath);
            if (parentObject && parentObject.children && parentObject.children[itemName]) {
                itemData = parentObject.children[itemName];
                console.log(`[handleContextMenuAction] Found itemData for "${itemName}":`, JSON.parse(JSON.stringify(itemData)));
            } else {
                console.error(`[handleContextMenuAction] Could not retrieve itemData. parentObject:`, parentObject ? JSON.parse(JSON.stringify(parentObject)) : null, `itemName:`, itemName);
                showErrorDialog("Error", `Could not retrieve data for "${itemName}".`);
                return;
            }
        } else if (targetIsDesktopIcon) {
            itemName = contextMenuTarget.id === 'myst_hd_icon' ? "MYSTERIUM_HD" : "Recycle Bin";
            // For desktop icons, path and data might be conceptual or predefined
            if (contextMenuTarget.id === 'myst_hd_icon') {
                itemPath = "MYSTERIUM_HD:/"; // Path to the drive itself
                itemData = fileSystem["MYSTERIUM_HD:"];
                itemType = "drive";
            } else if (contextMenuTarget.id === 'recycle_bin_icon_desktop') {
                // Recycle Bin doesn't have a "path" in the same way in fileSystem
                itemPath = "Desktop/Recycle Bin"; // Conceptual path
                itemData = { type: "recyclebin", name: "Recycle Bin" }; // Placeholder data
                itemType = "recyclebin";
            }
        }


        switch (action) {
            case 'open':
                if (targetIsFileItem && itemName && itemData && itemPath) {
                    handleOpenItem(itemName, itemData, itemPath);
                } else if (targetIsDesktopIcon && contextMenuTarget.id === 'myst_hd_icon') {
                    currentPath = "MYSTERIUM_HD:/";
                    openWindow(fileExplorerWindow);
                    renderFileExplorer();
                } else if (targetIsDesktopIcon && contextMenuTarget.id === 'recycle_bin_icon_desktop') {
                    openRecycleBinWindow();
                }
                break;
            case 'delete_item':
                if (targetIsFileItem && itemName && itemData && itemPath) {
                    // Check if item is in recycle bin already (via recycleId dataset)
                    if (contextMenuTarget.dataset.recycleId) {
                         showErrorDialog("Delete Error", "This item is already in the Recycle Bin. You can restore it or empty the Recycle Bin.");
                    } else {
                        const parentPathOnly = itemPath.substring(0, itemPath.lastIndexOf('/') + 1);
                        deleteItem(parentPathOnly, itemName, itemData); // deleteItem expects parent path
                    }
                } else {
                    showErrorDialog("Delete Error", "Cannot delete this item. Target not recognized or no item selected.");
                }
                break;
            case 'restore_item': // Specific to recycle bin context menu (if we add one)
                 if (targetIsFileItem && contextMenuTarget.dataset.recycleId) {
                    selectedRecycleBinItemElement = contextMenuTarget; // Ensure it's selected
                    restoreSelectedItemFromRecycleBin();
                } else {
                    showErrorDialog("Restore Error", "This action is only valid for items in the Recycle Bin.");
                }
                break;
            case 'properties':
                if (targetIsFileItem && itemName && itemPath && itemType) {
                    let content = `Name: ${itemName}\nType: ${itemType}\nPath: ${itemPath}`;
                    if (itemData && itemData.extension) content += `\nExtension: .${itemData.extension}`;
                    if (itemData && itemData.corrupted) content += `\nStatus: Corrupted`;
                    if (contextMenuTarget.dataset.recycleId && itemData.deletedTime) { // If from recycle bin
                        content += `\nDeleted: ${new Date(itemData.deletedTime).toLocaleString()}`;
                    }
                    showDialog("Properties", `<pre>${content}</pre>`, ICONS.dialog_info); // Use a specific icon
                } else if (targetIsDesktopIcon) {
                     showDialog("Properties", `Name: ${itemName}\nType: Special System Icon`, ICONS.dialog_info);
                } else {
                    showErrorDialog("Properties Error", "Cannot show properties. Target not recognized.");
                }
                break;
            case 'refresh_desktop': // Desktop context menu
                if (targetIsDesktop) {
                    logSystemEvent("Desktop refresh requested.");
                    // Simple visual "glitch" refresh for now
                    desktop.classList.add('flicker');
                    setTimeout(() => desktop.classList.remove('flicker'), 200);
                    if (!fileExplorerWindow.classList.contains('hidden') && currentPath === "MYSTERIUM_HD:/") { // If FE is open at desktop equivalent
                        // renderFileExplorer(); // This might be too broad if FE is showing a subfolder
                    }
                }
                break;
            case 'system_properties': // Desktop context menu
                if (targetIsDesktop) {
                    showDialog("System Properties", "MystOS Recovery Environment v0.7.3\nStatus: Unstable\nMemory: 64MB (Errors Detected)\nCore: Corrupted", ICONS.dialog_info);
                }
                break;
            default:
                showErrorDialog("Unknown Action", `The action "${action}" is not recognized or implemented.`);
        }
        contextMenuTarget = null; // Clear target after action is handled
    }
    function showDialog(titleText, messageText, iconTypeOrSvg = 'info') {
        dialogTitle.textContent = titleText;
        dialogMessage.innerHTML = messageText; // Use innerHTML to support <pre> or other tags

        let iconToShow = ICONS.dialog_info; // Default
        if (typeof iconTypeOrSvg === 'string') {
            switch (iconTypeOrSvg.toLowerCase()) {
                case 'info': iconToShow = ICONS.dialog_info; playSound('click'); break; // Or a specific info sound
                case 'warning': iconToShow = ICONS.dialog_warning; playSound('error'); break; // Or a warning sound
                case 'error': iconToShow = ICONS.dialog_error; playSound('error'); break;
                // If iconTypeOrSvg is an actual SVG string (e.g., from ICONS.text)
                default: if (iconTypeOrSvg.startsWith('data:image/svg+xml')) {
                            iconToShow = iconTypeOrSvg;
                         } else {
                            // Fallback if string is not a known type or SVG
                            console.warn(`Unknown dialog icon type: ${iconTypeOrSvg}, using default info icon.`);
                         }
                         playSound('click'); // Default sound for custom icons
                         break; 
            }
        }
        dialogIcon.src = iconToShow;
        
        openWindow(genericDialog);
    }
    function showErrorDialog(title, message) { showDialog(title, message, 'error'); }

    // --- Start Menu Specific Functions ---
    function toggleStartMenu() {
        playSound('click');
        const isHidden = startMenu.classList.toggle('hidden');
        if (isHidden) {
            taskbarStartButton.classList.remove('active');
        } else {
            taskbarStartButton.classList.add('active');
            bringToFront(startMenu); // Ensure Start Menu is on top
            // Add a one-time event listener to the document to close the menu if clicking outside
            // but not if clicking the start button itself again
            document.addEventListener('click', handleClickOutsideStartMenu, { once: true });
        }
    }

    function handleClickOutsideStartMenu(event) {
        if (!startMenu.classList.contains('hidden') && !startMenu.contains(event.target) && event.target !== taskbarStartButton && !taskbarStartButton.contains(event.target)) {
            startMenu.classList.add('hidden');
            taskbarStartButton.classList.remove('active');
        } else if (!startMenu.classList.contains('hidden') && (startMenu.contains(event.target) || event.target === taskbarStartButton || taskbarStartButton.contains(event.target))) {
            // If click was inside menu or on start button again, re-add listener
            // because the toggle might have happened or we want to keep it open.
            // This handles the case where you click an item in the start menu too.
            if (!startMenu.classList.contains('hidden')) { // Only if it's still open
                 document.addEventListener('click', handleClickOutsideStartMenu, { once: true });
            }
        }
    }
    
    function handleStartMenuItemClick(action) {
        logSystemEvent(`Start Menu item clicked: ${action}`);
        startMenu.classList.add('hidden'); // Close menu after selection
        taskbarStartButton.classList.remove('active');

        switch (action) {
            case 'open_myst_hd':
                currentPath = "MYSTERIUM_HD:/"; // Set path to root
                openWindow(fileExplorerWindow);
                renderFileExplorer();
                break;
            case 'programs':
                showDialog("Programs", "No user programs installed or accessible.\nSystem utilities are corrupted or missing.", "info");
                break;
            case 'documents':
                showDialog("Documents", "User document repository is unreadable or non-existent.\nPossible data corruption.", "warning");
                break;
            case 'settings':
                showDialog("Settings", "Control Panel applets failed to load.\nConfiguration files may be missing or corrupted.", "error");
                break;
            case 'find':
            case 'help':
            case 'run':
                showDialog(action.charAt(0).toUpperCase() + action.slice(1), `The "${action}" feature is currently unavailable due to system instability.`, "info");
                break;
            case 'shutdown':
                showShutdownScreen();
                break;
            default:
                console.warn("Unknown Start Menu action:", action);
        }
    }

    async function showShutdownScreen() {
        // Hide everything on the desktop
        desktop.querySelectorAll('.window:not(.hidden)').forEach(win => win.classList.add('hidden'));
        desktop.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.add('hidden'));
        if (startMenu) startMenu.classList.add('hidden');
        if (taskbarStartButton) taskbarStartButton.classList.remove('active');
        if (taskbar) taskbar.classList.add('hidden');
        if (channelIntro) channelIntro.classList.add('hidden');
        
        // Stop looping sounds
        if (audioElements.hddHum && !audioElements.hddHum.paused) audioElements.hddHum.pause();
        
        // Play a final "powering down" sound (optional, if you have one)
        // playSound('powerDown'); 

        shutdownScreen.classList.remove('hidden');
        const glitchText = shutdownScreen.querySelector('.shutdown-glitch');
        await sleep(2000); // Wait a bit
        glitchText.style.opacity = '1'; // Show the glitchy text
        logSystemEvent("Shutdown sequence initiated.");
        // At this point, the simulation is effectively "over" for this session.
        // You might want to prevent further interaction or add a way to "restart" the HTML page.
    }


    // --- Glitch Effect Functions ---
    function selectRandomVisibleWindowOrTaskbar() {
        const candidateElements = [];
        // Add visible windows
        document.querySelectorAll('.window:not(.hidden)').forEach(win => {
            if (win.offsetWidth > 0 || win.offsetHeight > 0 || win.getClientRects().length > 0) {
                candidateElements.push(win);
            }
        });
        // Add taskbar
        const taskbarElement = document.getElementById('taskbar');
        if (taskbarElement && (taskbarElement.offsetWidth > 0 || taskbarElement.offsetHeight > 0 || taskbarElement.getClientRects().length > 0)) {
            candidateElements.push(taskbarElement);
        }

        if (candidateElements.length > 0) {
            return candidateElements[Math.floor(Math.random() * candidateElements.length)];
        }
        return null;
    }

    function glitchEffect_windowBreathe(element) {
        if (!element || !document.hasFocus()) return;

        const originalTransform = element.style.transform;
        const originalTransition = element.style.transition;
        const originalTransformOrigin = element.style.transformOrigin;

        const scaleAmount = 1.002; // Even more subtle: 0.2% expansion
        const duration = 100;    // Quicker: 100ms for expand, 100ms for contract

        const origins = ['left center', 'right center', 'center top', 'center bottom', 'center center'];
        const chosenOrigin = origins[Math.floor(Math.random() * origins.length)];
        
        let transformProperty = '';
        const axisRoll = Math.random();

        if (chosenOrigin.includes('left') || chosenOrigin.includes('right') || axisRoll < 0.4) {
            transformProperty = `scaleX(${scaleAmount})`;
        } else if (chosenOrigin.includes('top') || chosenOrigin.includes('bottom') || axisRoll < 0.8) {
            transformProperty = `scaleY(${scaleAmount})`;
        } else { 
            transformProperty = `scale(${scaleAmount})`;
        }
        
        element.style.transformOrigin = chosenOrigin;
        element.style.transition = `transform ${duration}ms ease-in-out`;
        
        const existingTransform = originalTransform && !originalTransform.includes('scale') ? originalTransform : '';
        element.style.transform = `${existingTransform} ${transformProperty}`.trim();

        setTimeout(() => {
            element.style.transform = originalTransform || ''; 
            setTimeout(() => {
                element.style.transition = originalTransition;
                element.style.transformOrigin = originalTransformOrigin;
            }, duration);
        }, duration);
    }

    function setupCustomCursor() {
        desktop.style.cursor = 'none'; // Hide default OS cursor over the desktop area
        
        customCursorElement = document.createElement('div');
        customCursorElement.id = 'custom-cursor';
        // Style it like a standard pointer. Adjust as needed.
        customCursorElement.style.position = 'fixed'; // Use fixed to position relative to viewport
        customCursorElement.style.width = '12px'; // Standard pointer width-ish
        customCursorElement.style.height = '19px'; // Standard pointer height-ish
        customCursorElement.style.backgroundImage = "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2219%22%3E%3Cpath%20fill%3D%22white%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20d%3D%22M0%2C0%20L0%2C15.5%20L3.6%2C12.5%20L6.5%2C18.5%20L8%2C17.5%20L5%2C11.5%20L10.5%2C11.5%20L0%2C0%20Z%22%2F%3E%3C%2Fsvg%3E')";
        customCursorElement.style.backgroundRepeat = 'no-repeat';
        customCursorElement.style.pointerEvents = 'none'; // So it doesn't interfere with clicks on other elements
        customCursorElement.style.zIndex = '99999'; // Ensure it's on top
        document.body.appendChild(customCursorElement);

        document.addEventListener('mousemove', (e) => {
            if (customCursorElement) {
                customCursorElement.style.left = e.clientX + 'px';
                customCursorElement.style.top = e.clientY + 'px';
            }
        });

        // Hide custom cursor if mouse leaves the window (optional, but good practice)
        document.addEventListener('mouseout', (e) => {
            if (customCursorElement && !e.relatedTarget && !e.toElement) {
                customCursorElement.style.display = 'none';
            }
        });
        document.addEventListener('mouseover', () => {
             if (customCursorElement) customCursorElement.style.display = 'block';
        });
    }

    function glitchEffect_cursorStutter() {
        if (!customCursorElement || !document.hasFocus()) return; // Only glitch if window is focused
        const originalTransform = customCursorElement.style.transform;
        const offsetX = Math.floor(Math.random() * 5) - 2; // -2 to +2 pixels
        const offsetY = Math.floor(Math.random() * 5) - 2; // -2 to +2 pixels
        
        customCursorElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        
        setTimeout(() => {
            if (customCursorElement) {
                customCursorElement.style.transform = originalTransform;
            }
        }, Math.random() * 50 + 50); // Stutter for 50-100ms
    }

    function selectRandomVisibleTextElement() {
        const selectors = [
            '.window-title:not(#generic-dialog .window-title):not(#cmd-dialog .window-title):not(#password-prompt-dialog .window-title)', // Active window titles (excluding generic dialogs for now)
            '.file-item .file-icon-name', // File names in explorer or recycle bin
            '#fe-address-bar', // File explorer address bar (value)
            '#taskbar-clock', // The clock
            // Potentially dialog titles/messages if they are visible and not error messages
            // '#dialog-title', '#dialog-message' (if genericDialog is visible and not an error)
        ];
        const candidateElements = [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Check if element is visible and has text content (or value for input)
                const isVisible = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
                const textContent = (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') ? el.value : el.textContent;
                if (isVisible && textContent && textContent.trim().length > 1) { // Ensure some text and not just whitespace or single char
                    // Avoid glitching already glitched text if it contains spans (like from previous glitches)
                    if (!el.querySelector('.glitch-char')) {
                         candidateElements.push(el);
                    }
                }
            });
        });

        if (candidateElements.length > 0) {
            return candidateElements[Math.floor(Math.random() * candidateElements.length)];
        }
        return null;
    }

    function glitchEffect_wrongCharFlicker(element) {
        if (!element || !document.hasFocus()) return; // Only glitch if window is focused

        const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
        const originalText = isInput ? element.value : element.textContent;

        if (!originalText || originalText.trim().length <= 1) return; // Need some text to glitch

        const charIndex = Math.floor(Math.random() * originalText.length);
        
        // Ensure we don't pick a space or a character that's part of an HTML entity if using innerHTML
        // For textContent/value, this is less of an issue. Let's stick to non-space characters.
        if (originalText[charIndex] === ' ') return; 

        const originalChar = originalText[charIndex];
        let glitchChar = getRandomGlitchChar();
        // Ensure glitchChar is different and not empty if original isn't space
        while (glitchChar === originalChar || (glitchChar === '' && originalChar !== ' ')) {
            glitchChar = getRandomGlitchChar();
        }

        const newText = originalText.substring(0, charIndex) + glitchChar + originalText.substring(charIndex + 1);

        if (isInput) {
            element.value = newText;
        } else {
            element.textContent = newText;
        }

        setTimeout(() => {
            if (isInput) {
                element.value = originalText;
            } else {
                element.textContent = originalText;
            }
        }, Math.random() * 100 + 75); // Flicker for 75-175ms
    }

    function setupRareGlitches() {
        setInterval(() => {
            if (!document.hasFocus()) return; // Don't run glitches if window not focused

            // Cursor Stutter
            if (Math.random() < 0.01) { // Rare: 1% chance every 5 seconds
                glitchEffect_cursorStutter();
                logSystemEvent("Subtle system instability detected (cursor).");
            }

            // Wrong Character Flicker
            if (Math.random() < 0.008) { // Rare: 0.8% chance every 5 seconds
                const targetElement = selectRandomVisibleTextElement();
                if (targetElement) {
                    glitchEffect_wrongCharFlicker(targetElement);
                    logSystemEvent(`Subtle system instability detected (text flicker on ${targetElement.id || targetElement.className || targetElement.tagName}).`);
                }
            }

            // Window Edge Breathe
            if (Math.random() < 0.007) { // Rare: 0.7% chance
                const targetElement = selectRandomVisibleWindowOrTaskbar();
                if (targetElement) {
                    glitchEffect_windowBreathe(targetElement);
                    logSystemEvent(`Subtle system instability detected (window breathe on ${targetElement.id || targetElement.className}).`);
                }
            }
            // etc.

        }, 5000); // Check for glitches every 5 seconds
    }

    // --- Event Listener Setup ---
    function setupEventListeners() {
        clickToStartScreen.addEventListener('click', () => {
            soundEnabled = true;
            clickToStartScreen.classList.add('hidden');
            logSystemEvent("Audio enabled by user interaction.");
            startBootSequence();
        }, { once: true });

        let mystHdIconClickTimeout = null;
        // Single click on MYSTERIUM_HD icon (selects it)
        mystHdIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent desktop click from deselecting immediately
            playSound('click');
            if (selectedFileElement) {
                selectedFileElement.classList.remove('selected-icon');
                if (selectedFileElement.querySelector('span')) {
                    selectedFileElement.querySelector('span').classList.remove('selected-icon');
                }
            }
            mystHdIcon.classList.add('selected-icon');
            mystHdIcon.querySelector('span').classList.add('selected-icon');
            selectedFileElement = mystHdIcon;

            // Handle single vs double click
            if (clickTimeout) { // Double click
                clearTimeout(clickTimeout);
                clickTimeout = null;
                playSound('doubleClick');
                logSystemEvent("MYSTERIUM_HD icon double-clicked.");
                currentPath = "MYSTERIUM_HD:/";
                openWindow(fileExplorerWindow);
                renderFileExplorer(); // This function needs its full implementation
            } else { // First click of a potential double click
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    // Single click action (if any, besides selection) can go here
                    logSystemEvent("MYSTERIUM_HD icon single-clicked (selected).");
                }, DOUBLE_CLICK_THRESHOLD);
            }
        });
        // Explicit dblclick for accessibility or if click logic is too complex
        mystHdIcon.addEventListener('dblclick', () => {
            // This might be redundant if the click handler handles double clicks,
            // but can serve as a fallback.
            clearTimeout(clickTimeout); // Clear any pending single-click action
            clickTimeout = null;
            playSound('doubleClick');
            logSystemEvent("MYSTERIUM_HD icon double-clicked (dblclick event).");
            currentPath = "MYSTERIUM_HD:/";
            openWindow(fileExplorerWindow);
            renderFileExplorer(); // This function needs its full implementation
        });


        let recycleBinIconClickTimeout = null;
        // Single click on Recycle Bin icon (selects it)
        recycleBinIconDesktop.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('click');
            if (selectedFileElement) {
                selectedFileElement.classList.remove('selected-icon');
                 if (selectedFileElement.querySelector('span')) {
                    selectedFileElement.querySelector('span').classList.remove('selected-icon');
                 }
            }
            recycleBinIconDesktop.classList.add('selected-icon');
            recycleBinIconDesktop.querySelector('span').classList.add('selected-icon');
            selectedFileElement = recycleBinIconDesktop;

            if (recycleBinIconClickTimeout) { // Double click
                clearTimeout(recycleBinIconClickTimeout);
                recycleBinIconClickTimeout = null;
                playSound('doubleClick');
                logSystemEvent("Recycle Bin icon double-clicked.");
                openRecycleBinWindow(); // This function needs its full implementation
            } else { // First click
                recycleBinIconClickTimeout = setTimeout(() => {
                    recycleBinIconClickTimeout = null;
                    logSystemEvent("Recycle Bin icon single-clicked (selected).");
                }, DOUBLE_CLICK_THRESHOLD);
            }
        });
        // Explicit dblclick for Recycle Bin
        recycleBinIconDesktop.addEventListener('dblclick', () => {
            clearTimeout(recycleBinIconClickTimeout);
            recycleBinIconClickTimeout = null;
            playSound('doubleClick');
            logSystemEvent("Recycle Bin icon double-clicked (dblclick event).");
            openRecycleBinWindow(); // This function needs its full implementation
        });

        desktop.addEventListener('contextmenu', (e) => showContextMenu(e, 'desktop'));
        desktop.addEventListener('click', (event) => {
            // Deselect logic...
            if (selectedFileElement && selectedFileElement.classList.contains('desktop-icon') && event.target === desktop ) {
                selectedFileElement.classList.remove('selected-icon');
                 if(selectedFileElement.querySelector('span')) {
                    selectedFileElement.querySelector('span').classList.remove('selected-icon');
                 }
                selectedFileElement = null;
            }
            if (selectedFileElement && selectedFileElement.classList.contains('file-item')) {
                if (!event.target.closest('#file-listing') && !event.target.closest('#recycle-bin-listing') && !event.target.closest('.file-item')) {
                    selectedFileElement.classList.remove('selected-file');
                    if(selectedFileElement.querySelector('.file-icon-name')) {
                       selectedFileElement.querySelector('.file-icon-name').classList.remove('selected-file');
                    }
                    selectedFileElement = null;
                    selectedRecycleBinItemElement = null;
                }
            }
            // Hide context menus (Start Menu handled by its own logic now for outside clicks)
            if (!event.target.closest('#start-menu') && event.target !== taskbarStartButton && !taskbarStartButton.contains(event.target)) {
                 if (!desktopContextMenu.classList.contains('hidden')) desktopContextMenu.classList.add('hidden');
                 if (!fileContextMenu.classList.contains('hidden')) fileContextMenu.classList.add('hidden');
            }
        });

        makeDraggable(fileExplorerWindow);
        feCloseButton.addEventListener('click', () => { playSound('click'); closeWindow(fileExplorerWindow); });
        feUpButton.addEventListener('click', () => {
            playSound('click');
            logSystemEvent("File Explorer Up button clicked.");

            if (currentPath === "MYSTERIUM_HD:/") {
                // Already at root, do nothing or disable button (visual feedback later)
                logSystemEvent("Already at root. Up button has no effect.");
                return;
            }

            // Remove trailing slash for consistent parsing, unless it's the root itself
            let pathWithoutTrailingSlash = currentPath.endsWith('/') && currentPath.length > "MYSTERIUM_HD:/".length ? currentPath.slice(0, -1) : currentPath;
            
            const lastSlashIndex = pathWithoutTrailingSlash.lastIndexOf('/');
            
            if (lastSlashIndex > 0) { // Found a slash, and it's not the one in "MYSTERIUM_HD:/"
                currentPath = pathWithoutTrailingSlash.substring(0, lastSlashIndex + 1);
            } else if (pathWithoutTrailingSlash.startsWith("MYSTERIUM_HD:") && pathWithoutTrailingSlash !== "MYSTERIUM_HD:/") {
                 // Handles cases like "MYSTERIUM_HD:/SYSTEM" going up to "MYSTERIUM_HD:/"
                currentPath = "MYSTERIUM_HD:/";
            }
            // If lastSlashIndex is 0 or -1, it implies we are at a root or invalid path,
            // but the initial check for "MYSTERIUM_HD:/" should catch the root case.

            renderFileExplorer();
        });
        fileExplorerWindow.addEventListener('mousedown', () => bringToFront(fileExplorerWindow));

        makeDraggable(recycleBinWindow);
        rbCloseButton.addEventListener('click', () => { playSound('click'); closeWindow(recycleBinWindow); });
        rbRestoreButton.addEventListener('click', () => { 
            playSound('click');
            restoreSelectedItemFromRecycleBin(); 
        });
        rbEmptyButton.addEventListener('click', () => { 
            playSound('click');
            emptyRecycleBin(); 
        });
        recycleBinWindow.addEventListener('mousedown', () => bringToFront(recycleBinWindow));

        makeDraggable(cmdDialog);
        cmdDialogCloseButton.addEventListener('click', () => { playSound('click'); closeWindow(cmdDialog); });
        cmdDialog.addEventListener('mousedown', () => bringToFront(cmdDialog));

        makeDraggable(passwordPromptDialog);
        passwordPromptOkButton.addEventListener('click', handlePasswordUnlock);
        passwordPromptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handlePasswordUnlock();
            }
        });
        passwordPromptCancelButton.addEventListener('click', () => { playSound('click'); closeWindow(passwordPromptDialog); });
        passwordPromptCloseButton.addEventListener('click', () => { playSound('click'); closeWindow(passwordPromptDialog); });
        passwordPromptDialog.addEventListener('mousedown', () => bringToFront(passwordPromptDialog));

        makeDraggable(genericDialog);
        dialogOkButton.addEventListener('click', () => { playSound('click'); closeWindow(genericDialog); });
        dialogCloseButton.addEventListener('click', () => { playSound('click'); closeWindow(genericDialog); });
        genericDialog.addEventListener('mousedown', () => bringToFront(genericDialog));

        document.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                handleContextMenuAction(e.target.dataset.action);
            });
        });

        // MODIFIED Taskbar Start Button
        taskbarStartButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent desktop click from immediately closing it
            toggleStartMenu();
        });

        // Add event listeners for Start Menu items
        document.querySelectorAll('#start-menu .start-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                handleStartMenuItemClick(item.dataset.action);
            });
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!startMenu.classList.contains('hidden')) { // Close Start Menu with Escape
                    playSound('click'); // Or no sound
                    startMenu.classList.add('hidden');
                    taskbarStartButton.classList.remove('active');
                } else if (!passwordPromptDialog.classList.contains('hidden')) {
                    playSound('click');
                    closeWindow(passwordPromptDialog);
                } else if (!genericDialog.classList.contains('hidden')) {
                    playSound('click');
                    closeWindow(genericDialog);
                } else if (!cmdDialog.classList.contains('hidden')) {
                    playSound('click');
                    closeWindow(cmdDialog);
                } else if (!fileContextMenu.classList.contains('hidden') || !desktopContextMenu.classList.contains('hidden')) {
                    hideAllContextMenus();
                } else if (!recycleBinWindow.classList.contains('hidden')) {
                    closeWindow(recycleBinWindow);
                } else if (!fileExplorerWindow.classList.contains('hidden')) {
                    closeWindow(fileExplorerWindow);
                }
            }
        });
    }
    setupEventListeners();
});
