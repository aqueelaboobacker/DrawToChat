import React from 'react';
import ReactDOM from 'react-dom/client';
import DrawingModal from './DrawingModal';
import './styles.css';

// 1. Configuration for different sites
const SITE_CONFIG = [
    {
        domain: 'chatgpt.com',
        // Updated ChatGPT selectors
        containerSelector: '#prompt-textarea',
        appendMethod: 'dropdown-menu',
        inputSelector: '#prompt-textarea'
    },
    {
        domain: 'chat.openai.com',
        containerSelector: '#prompt-textarea',
        appendMethod: 'dropdown-menu',
        inputSelector: '#prompt-textarea'
    },
    {
        domain: 'claude.ai',
        // Claude usually has a clear input container
        containerSelector: '.ProseMirror',
        appendMethod: 'dropdown-menu', // Updated to dropdown
        inputSelector: '[contenteditable="true"]'
    },
    {
        domain: 'gemini.google.com',
        containerSelector: '.input-area', // logic to find the input area
        appendMethod: 'dropdown-menu',
        inputSelector: '[contenteditable="true"]'
    }
    // Add others here...
];

let currentConfig = null;

function initialize() {
    const currentDomain = window.location.hostname;
    currentConfig = SITE_CONFIG.find(cfg => currentDomain.includes(cfg.domain));

    if (!currentConfig) {
        // Fallback for subdomains or variations?
        // For now, strict matching on what we know.
        // Try to match generic contenteditable if nothing else?
        // console.log("Draw Extension: Site not strictly matched, continuing with generic fallback is risky.");

        // Let's try to match by partial domain if exact match fails
        const partialMatch = SITE_CONFIG.find(cfg => {
            const baseDomain = cfg.domain.replace('www.', '').replace('chat.', '');
            return currentDomain.includes(baseDomain);
        });

        if (partialMatch) {
            currentConfig = partialMatch;
        } else {
            console.log("Draw Extension: Site not supported.");
            return;
        }
    }

    console.log("Draw Extension: Initialized for", currentConfig.domain);

    // AI sites are SPAs, elements load dynamically.
    const observer = new MutationObserver(handleDomMutation);
    // Observe body for subtree changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case it's already there
    handleDomMutation();
}


function handleDomMutation() {
    if (!currentConfig) return;

    // Use a more generic approach to find the "input area" wrapper
    // Because IDs change.

    let container = null;
    let targetForButton = null;

    // --- Specific Domain Logic for Generic Injection (Legacy/Fallback) ---
    // Only run this if we are NOT using a special UI method
    if (currentConfig.appendMethod !== 'dropdown-menu' && currentConfig.appendMethod !== 'toolbar-button') {

        if (currentConfig.domain.includes('claude')) {
            const editor = document.querySelector('[contenteditable="true"]');
            if (editor) {
                const parent = editor.closest('.flex.flex-col');
                if (parent) {
                    targetForButton = parent.querySelector('.flex.items-center.gap-2.min-w-0');
                    if (!targetForButton) targetForButton = editor.parentElement;
                }
            }
        } else if (currentConfig.domain.includes('openai') || currentConfig.domain.includes('chatgpt')) {
            const textarea = document.getElementById('prompt-textarea');
            if (textarea) {
                targetForButton = textarea.parentElement;
            }
        } else if (currentConfig.domain.includes('gemini') || currentConfig.domain.includes('bard')) {
            const editor = document.querySelector('.rich-textarea');
            if (editor) {
                targetForButton = editor.parentElement;
            }
        }

        // Fallback generic selector
        if (!targetForButton && currentConfig.containerSelector) {
            targetForButton = document.querySelector(currentConfig.containerSelector);
        }

        // Inject if target found
        if (targetForButton && !targetForButton.querySelector('.my-draw-extension-trigger-btn')) {
            injectButton(targetForButton);
        }

    } else {
        // --- Special UI Methods ---
        if (currentConfig.domain.includes('chatgpt') && currentConfig.appendMethod === 'dropdown-menu') {
            handleChatGPTDropdown();
        } else if (currentConfig.domain.includes('gemini') || currentConfig.domain.includes('bard')) {
            handleGeminiDropdown();
        } else if (currentConfig.domain.includes('claude')) {
            // User requested dropdown for Claude too (based on screenshot showing "Add files or photos")
            handleClaudeDropdown();
        }
    }
}

function handleGeminiDropdown() {
    // Gemini text: "Upload files" (from user screenshot)
    const menuItems = Array.from(document.querySelectorAll('span, div, li')).filter(el =>
        (el.textContent === 'Upload files' || el.textContent === 'Upload image') && el.offsetParent !== null
    );

    if (menuItems.length === 0) return;

    const textElement = menuItems[0];
    const menuRow = textElement.closest('[role="menuitem"]') || textElement.closest('li') || textElement.closest('button') || textElement.parentElement;

    if (!menuRow) return;

    const menuContainer = menuRow.parentElement;
    if (menuContainer.querySelector('.my-draw-extension-menu-item')) return;

    const clonedRow = menuRow.cloneNode(true);
    clonedRow.classList.add('my-draw-extension-menu-item');

    // Replace text
    replaceTextInNode(clonedRow, 'Upload files', 'Draw with Excalidraw');
    replaceTextInNode(clonedRow, 'Upload image', 'Draw with Excalidraw');

    // Replace Icon
    const svg = clonedRow.querySelector('svg');
    if (svg) {
        const newSvg = document.createElement('span');
        newSvg.innerHTML = `
         <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" class="${svg.getAttribute('class')}">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
         </svg>
         `;
        if (newSvg.firstElementChild) svg.replaceWith(newSvg.firstElementChild);
    }

    clonedRow.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDrawingModal();
    };

    menuContainer.appendChild(clonedRow);
}

function handleClaudeDropdown() {
    // Claude text: "Add files or photos" (from user screenshot)
    const menuItems = Array.from(document.querySelectorAll('div, li, button')).filter(el =>
        el.textContent === 'Add files or photos' && el.offsetParent !== null
    );

    if (menuItems.length === 0) return;

    const textElement = menuItems[0];
    const menuRow = textElement.closest('[role="menuitem"]') || textElement.closest('button') || textElement.parentElement;

    if (!menuRow) return;

    const menuContainer = menuRow.parentElement;
    if (menuContainer.querySelector('.my-draw-extension-menu-item')) return;

    const clonedRow = menuRow.cloneNode(true);
    clonedRow.classList.add('my-draw-extension-menu-item');

    replaceTextInNode(clonedRow, 'Add files or photos', 'Draw with Excalidraw');

    // Replace Icon
    const svg = clonedRow.querySelector('svg');
    if (svg) {
        const newSvg = document.createElement('span');
        newSvg.innerHTML = `
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${svg.getAttribute('class')}">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
         </svg>
         `;
        if (newSvg.firstElementChild) svg.replaceWith(newSvg.firstElementChild);
    }

    clonedRow.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDrawingModal();
    };

    menuContainer.appendChild(clonedRow);
}



function handleChatGPTDropdown() {
    // 1. Look for the dropdown menu. It usually appears as a popover/portal.
    // We can identify it by looking for text "Add photos & files" or "Create image".
    // This is a bit expensive so we should be careful.

    // Using a specific selector if possible, searching for menu items.
    // Menu items often have role="menuitem" or specific classes.
    // Let's look for a container containing "Add photos & files"

    // Find all elements containing the text
    const menuItems = Array.from(document.querySelectorAll('div, li, button')).filter(el =>
        el.textContent === 'Add photos & files' && el.offsetParent !== null // Visible
    );

    if (menuItems.length === 0) return;

    // The element we found is likely the text label. We need the clickable row container.
    // Iterate up until we find the row.
    const textElement = menuItems[0];
    // Usually the row is a few parents up, or the element itself if it's a button.
    // Let's assume the row is the element with role="menuitem" or closest block.
    const menuRow = textElement.closest('[role="menuitem"]') || textElement.closest('button') || textElement.parentElement;

    if (!menuRow) return;

    // The container of the rows (the menu itself)
    const menuContainer = menuRow.parentElement;

    // Check if we already injected our "Draw" item
    if (menuContainer.querySelector('.my-draw-extension-menu-item')) return;

    // Clone the row to copy styles exactly
    const clonedRow = menuRow.cloneNode(true);
    clonedRow.classList.add('my-draw-extension-menu-item');

    // Update the text
    // We need to find the text node/element inside the clone and replace it.
    // A simple approach is recursive text replacement or just setting innerHTML if structure is simple.
    // But cloning is better to keep icons structure. Let's try to update "Add photos & files" text in the clone.

    // Change text
    replaceTextInNode(clonedRow, 'Add photos & files', 'Draw with Excalidraw');
    replaceTextInNode(clonedRow, 'Create image', 'Draw with Excalidraw'); // In case we cloned that one

    // Update Icon
    // Look for the SVG and replace it
    const svg = clonedRow.querySelector('svg');
    if (svg) {
        const newSvg = document.createElement('span'); // Wrapper
        newSvg.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" class="${svg.getAttribute('class')}">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
        </svg>
        `;
        // Replace old svg
        svg.replaceWith(newSvg.firstElementChild);
    }

    // Add click listener
    clonedRow.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close the menu if possible? usually clicking an item closes it.
        // We can simulate a click on the menu overlay or let the user close it.
        // Actually, let's just open our modal.
        openDrawingModal();

        // Try to close the menu by simulating Escape? 
        // Or finding the close trigger. 
        // For now, let's just open the modal.
    };

    // Append to the menu
    menuContainer.appendChild(clonedRow);
}

function replaceTextInNode(node, searchText, replacementText) {
    if (node.nodeType === 3) { // Text node
        if (node.nodeValue.includes(searchText)) {
            node.nodeValue = node.nodeValue.replace(searchText, replacementText);
        }
    } else {
        node.childNodes.forEach(child => replaceTextInNode(child, searchText, replacementText));
    }
}

function injectButton(container) {
    const buttonBtn = document.createElement('button');
    buttonBtn.className = 'my-draw-extension-trigger-btn';
    buttonBtn.title = "Draw and Insert Image";
    // Simple Pencil SVG
    buttonBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
    </svg>
    `;

    buttonBtn.onclick = (e) => {
        // Prevent submission if inside a form
        e.preventDefault();
        e.stopPropagation();
        openDrawingModal();
    };

    // Style adjustments for specific sites
    if (currentConfig.domain.includes('chatgpt')) {
        // Fallback for ChatGPT if dropdown logic fails or configured otherwise
        buttonBtn.style.position = 'absolute';
        buttonBtn.style.left = '10px';
        buttonBtn.style.bottom = '10px';
        buttonBtn.style.zIndex = '10';
    }

    container.style.position = 'relative'; // Ensure container is relative for absolute positioning if used
    container.appendChild(buttonBtn);
}

// --- Modal Handling ---

let modalRoot = null;
let reactRoot = null;

function openDrawingModal() {
    if (document.getElementById('my-draw-extension-modal-root')) return;

    modalRoot = document.createElement('div');
    modalRoot.id = 'my-draw-extension-modal-root';
    document.body.appendChild(modalRoot);

    reactRoot = ReactDOM.createRoot(modalRoot);
    reactRoot.render(
        <DrawingModal
            onClose={closeDrawingModal}
            onInsertDrawing={handleInsertDrawing}
        />
    );
}

function closeDrawingModal() {
    if (reactRoot) {
        reactRoot.unmount();
        reactRoot = null;
    }
    if (modalRoot) {
        modalRoot.remove();
        modalRoot = null;
    }
}

// --- The Core Logic: Injecting the Image ---

// --- Toast Notification ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = type === 'error' ? '#fa5252' : '#228be6';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '2147483647';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.fontFamily = 'sans-serif';
    toast.style.fontSize = '14px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}


async function handleInsertDrawing(imageBlob) {
    console.log("Draw Extension: Handle Insert Drawing", imageBlob);

    // 1. Find the input again
    let inputElement = null;
    if (currentConfig.inputSelector) {
        inputElement = document.querySelector(currentConfig.inputSelector);
    }

    if (!inputElement) {
        inputElement = document.querySelector('[contenteditable="true"]');
    }

    if (!inputElement) {
        console.error("Draw Extension: Could not find input element.");
        showToast("Could not find chat input box!", "error");
        return;
    }

    console.log("Draw Extension: Found input element", inputElement);

    // 2. Focus the input
    inputElement.focus();

    try {
        // 3. Create clipboard item
        const data = [new ClipboardItem({ [imageBlob.type]: imageBlob })];

        // 4. Write to clipboard
        await navigator.clipboard.write(data);
        console.log("Draw Extension: Image written to clipboard.");

        showToast("Image copied to clipboard! Paste it into the chat if it doesn't appear.");

        // 5. Trigger paste
        const pasteSuccess = document.execCommand('paste');
        console.log("Draw Extension: execCommand paste success?", pasteSuccess);

        if (!pasteSuccess) {
            console.warn("execCommand('paste') failed. Attempting manual dispatch.");

            // Dispatch a Paste Event manually with DataTransfer
            try {
                const dataTransfer = new DataTransfer();
                const file = new File([imageBlob], "drawing.png", { type: "image/png" });
                dataTransfer.items.add(file);

                const pasteEvent = new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true,
                    clipboardData: dataTransfer
                });

                inputElement.dispatchEvent(pasteEvent);
                console.log("Draw Extension: Manual paste event dispatched with DataTransfer.");
                showToast("Image inserted via event simulation!");
            } catch (e) {
                console.error("Failed to dispatch manual paste:", e);
                showToast("Auto-paste failed. Please Ctrl+V.", "error");
            }
        }

    } catch (err) {
        console.error('Draw Extension: Failed to paste image:', err);
        showToast('Failed to access clipboard. See console.', 'error');
    }
}


// Start
initialize();
