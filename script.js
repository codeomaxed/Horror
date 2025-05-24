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


    const ICONS = {
        folder: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGQjMwMCI+PHBhdGggZD0iTTEwIDRIMkMtMS4xIDQgMCA1LjEgMCA2djEyYzAgMS4xLjk0IDIgMiAyaDIwYzEuMSAwIDItLjkgMi0yVjhjMC0xLjEtLjktMi0yLTJoLThsLTItMnoiLz48L3N2Zz4=",
        file: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0VFRUVFRSI+PHBhdGggZD0iTTYgMmg4bDYgNnYxMmMwIDEuMS0uOSAyLTIgMkg2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJ6bTcgNXY1LjVoNVY3SDExeiIvPjwvc3ZnPg==",
        text: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0EwQTBBMCI+PHBhdGggZD0iTTYgMmg4bDYgNnYxMmMwIDEuMS0uOSAyLTIgMkg2Yy0xLjEgMC0yLS4xLTItMlY0YzAtMS4xLjktMiAyLTJ6bTcgN1Y3SDd2MTBoMTBWMTNINzVIOVYxMXoiLz48L3N2Zz4=",
        video: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzZGQUFGMyI+PHBhdGggZD0iTTE4IDNINkMxLjggMyAwIDQuOCAwIDd2MTBjMCAyLjIgMS44IDQgNCA0aDEyYzIuMiAwIDQtMS44IDQtNFY3YzAtMi4yLTEuOC00LTQtNHptLTYgMTJoLTUgTDEzIDEybC01IDNabTYtN2MwIDEuMS0uOSAyLTItMnMtLjktMi0yLTItMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6Ii8+PC9zdmc+",
        log: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRDQUNBQyI+PHBhdGggZD0iTTE0IDJINmMyLjIgMCA0IDEuOCA0IDR2MTJjMCAyLjIgMS44IDQgNCA0aDEyYzIuMiAwIDQtMS44IDQtNFY4bC02LTZ6bS0yIDE2SDh2LTJoNG0wLTRIOThtNC03aC04djJoOFY5eiIvPjwvc3ZnPg==",
        config: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzg4ODg4OCI+PHBhdGggZD0iTTE5LjQyIDEyLjkxYy4wMy0uMjMuMDUtLjQ2LjA1Ljc5czAtLjU2LS4wNS0uNzlMMjEgMTFoLTEuNThsLS43MS0xLjY4Yy0uMy0uNzItLjY5LTEuNDUtMS4xMS0xLjk3bDEuMi0xLjM1TDExIDEyLjQybC0xLjM1IDEuMmMtLjUyLS40MS0xLjI1LS44MS0xLjk3LTEuMTFMOSAzSDcuMDNsLTEuNjggLjcxYy0uNzIgLjMtMS40NSAuNjktMS45NyAxLjExTDIsNi44NyA2Ljg3IDJsMS4xMSAxLjk3Yy40Mi41My44MSAxLjI2IDEuMTQgMS45N0wzIDlsMS42OC43MWMuMy43Mi42OSAxLjQ1IDEuMTEgMS45N0wyIDExLjU4IDEyLjQyIDEzbDEuOTcgMS4xMWMuNTMtLjQyIDEuMjYtLjggMS45Ny0xLjE0TDE1IDIxdi0xLjkybDcuMS0xLjY4Yy43Mi0uMyAxLjQ1LS42OSAxLjk3LTEuMTFsMS4zNS0xLjJMMTggOWwtMS4yIDEuMzVjLS40MS0uNTMtLjgtMS4yNi0xLjE0LTEuOTd6TTEyIDE1Yy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3oiLz48L3N2Zz4=",
        batch: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNjY2NjY2IiBkPSJNNCwySDEybDEsMUgxMWwtMSwxSDEwTDksNEg4TDcsNUg2TDUsNkg0VjIwSDIwVjRIMTRMMTMsM0gxMkwxMSwySDRNNSw1SDE5VjE5SDVWNVoiLz48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNNiw3SDE4VjhINk02LDlIMThWMTBINk02LDExSDE4VjEySDZNMTAsMTNIMTRWMTRIOTZNMTAsMTVIMTRWMThIOTYiLz48L3N2Zz4=",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQzNDM0MzIiBkPSJNMjEsMyBDMjEuNTUsMyAyMiwzLjQ1IDIyLDQgTDIyLDIwIEMyMiwyMC41NSAyMS41NSwyMSAyMSwyMSBMMywyMSBDMi40NSwyMSAyLDIwLjU1IDIsMjAgTDIsNCBDMiwzLjQ1IDIuNDUsMyAzLDMgTDIxLDNNMjAsNUgzVjE5IEwyMCw1TTgsOSBDNi45LDkgNiw5LjkgNiwxMSBDNiwxMi4xIDYuOSwxMyA4LDEzIEM5LjEsMTMgMTAsMTIuMSAxMCwxMSBDMTAsOS45IDkuMSw5IDgsOU0xOSw5IEwxMywxNSBMMTAsMTIgTDUsMTcgTDE5LDE3IEwxOSw5WiIvPjwvc3ZnPg==",
        archive: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkZCMDAwIiBkPSJNMTksM0g1QzMuOSwzIDMsMy45IDMsNVYxOUMzLDIwLjEgMy45LDIxIDUsMjFIMTlDMjAuMSwyMSAyMSwyMC4xIDIxLDE5VjVDMjEsMy45IDIwLjEsMyAxOSwzTTUsMTlWNUgxOVYxOUg1WiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMiwxMEgxMFYxMkg4VjEwSDZWOGgxMFYxMEgxNFYxMkgxMlpNMTcsOEgxNVYxMEgxN1Y4WiIvPjwvc3ZnPg==",
        unknown: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCIgZmlsbD0iIzgwODA4MCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVIOFYxM2gzVjRIMTJWMTd6bS0xLTRoLTR2LTRoNHY0eiIvPjwvc3ZnPg==",
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
                    "witness_statements.txt": { type: "file", extension: "txt", /* ... */ },
                    "EVP_Analysis_Subject_03.txt": { type: "file", extension: "txt", /* ... */ },
                    "encrypted_research.zip": { type: "file", extension: "zip", /* ... */ }
                }},
                "PROJECT_VERIDIAN": { type: "folder", corrupted: true, children: { /* ... */ }},
                "UTILS": { type: "folder", corrupted: false, children: {
                    "cleanup.bat": { type: "file", extension: "bat", /* ... */ },
                    "corrupted_image.jpg": { type: "file", extension: "jpg", corrupted: true, content: "This is a corrupted JPEG." },
                    "another_image.png": { type: "file", extension: "png", corrupted: false, content: "This is a non-corrupted PNG." }
                }},
                "K666_IRKALLA.log": { type: "file", extension: "log", /* ... */ },
                "CHC_VLOG_01_MOVE_IN_DAY.MP4": { type: "video", /* ... */ },
                "CHC_VLOG_02_FIRST_NIGHT.MP4": { type: "video", /* ... */ },
                "unknown_transmission_077.wav": { type: "file", extension: "wav", /* ... */ },
                "readme_IMPORTANT.txt": { type: "file", extension: "txt", /* ... */ },
                "system.log": { type: "log", corrupted: false},
                "corrupted_executable.exe": { type: "file", extension: "exe", /* ... */}
            }
        }
    };

    // --- Function Definitions (playSound, logSystemEvent, sleep, etc. - keep all existing ones) ---
    // ... (Keep ALL your existing functions like playSound, logSystemEvent, boot sequences, etc.)
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
            '▓', '▒', '░', '█', '�', '│', '─', '┼', '┐', '└', '├', 'µ', 'ß', '£', '§', ' ', '.', '_', '/', '\\'
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

    let dragOffsetX, dragOffsetY;
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

    function updateRecycleBinIcon() { /* ... (keep existing) ... */ }
    function openRecycleBinWindow() { /* ... (keep existing) ... */ }
    function renderRecycleBinContents() { /* ... (keep existing) ... */ }
    function deleteItem(itemPath, itemName, itemData) { /* ... (keep existing) ... */ }
    function restoreSelectedItemFromRecycleBin() { /* ... (keep existing) ... */ }
    function emptyRecycleBin() { /* ... (keep existing) ... */ }
    function renderFileExplorer() { /* ... (keep existing, check title logic) ... */ }
    function updateFakeFreeSpace() { /* ... (keep existing) ... */ }
    function createFileItemElement(name, data, context = 'fileExplorer', uniqueId = null) { /* ... (keep existing) ... */ }
    async function runBatchFile(name, lines) { /* ... (keep existing) ... */ }
    function handleOpenItem(name, data) { /* ... (keep existing) ... */ }
    function openFile(name, data) { /* ... (keep existing) ... */ }
    function promptForPassword(fileName, fileData, filePath) { /* ... (keep existing) ... */ }
    function handlePasswordUnlock() { /* ... (keep existing) ... */ }
    function extractArchiveContents(archiveName, archiveData, archiveDirPath) { /* ... (keep existing) ... */ }
    function showContextMenu(event, type, targetElement = null) { /* ... (keep existing) ... */ }
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
        contextMenuTarget = null;
    }
    function handleContextMenuAction(action) { /* ... (keep existing) ... */ }
    function showDialog(titleText, messageText, type = 'info') { /* ... (keep existing) ... */ }
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


    // --- Event Listener Setup ---
    function setupEventListeners() {
        clickToStartScreen.addEventListener('click', () => {
            soundEnabled = true;
            clickToStartScreen.classList.add('hidden');
            logSystemEvent("Audio enabled by user interaction.");
            startBootSequence();
        }, { once: true });

        let mystHdIconClickTimeout = null;
        mystHdIcon.addEventListener('click', (e) => { /* ... (keep existing) ... */ });
        mystHdIcon.addEventListener('dblclick', () => { /* ... (keep existing) ... */ });

        let recycleBinIconClickTimeout = null;
        recycleBinIconDesktop.addEventListener('click', (e) => { /* ... (keep existing) ... */ });
        recycleBinIconDesktop.addEventListener('dblclick', () => { /* ... (keep existing) ... */ });

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
        feUpButton.addEventListener('click', () => { /* ... (keep existing) ... */ });
        fileExplorerWindow.addEventListener('mousedown', () => bringToFront(fileExplorerWindow));

        makeDraggable(recycleBinWindow);
        rbCloseButton.addEventListener('click', () => { playSound('click'); closeWindow(recycleBinWindow); });
        rbRestoreButton.addEventListener('click', () => { /* ... (keep existing) ... */ });
        rbEmptyButton.addEventListener('click', () => { /* ... (keep existing) ... */ });
        recycleBinWindow.addEventListener('mousedown', () => bringToFront(recycleBinWindow));

        makeDraggable(cmdDialog);
        cmdDialogCloseButton.addEventListener('click', () => { /* ... (keep existing) ... */ });
        cmdDialog.addEventListener('mousedown', () => bringToFront(cmdDialog));

        makeDraggable(passwordPromptDialog);
        passwordPromptOkButton.addEventListener('click', handlePasswordUnlock);
        passwordPromptInput.addEventListener('keypress', (e) => { /* ... (keep existing) ... */ });
        passwordPromptCancelButton.addEventListener('click', () => { /* ... (keep existing) ... */ });
        passwordPromptCloseButton.addEventListener('click', () => { /* ... (keep existing) ... */ });
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