
// Background Service Worker for DrawToChat
// Handles cross-origin requests to Lemon Squeezy to avoid CORS issues in content scripts.

const LS_API_URL = 'https://api.lemonsqueezy.com/v1/licenses/activate';
const LS_API_VALIDATE_URL = 'https://api.lemonsqueezy.com/v1/licenses/validate';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'ACTIVATE_LICENSE') {
        handleActivation(request.key, request.instanceName).then(sendResponse);
        return true; // Indicates async response
    }
    if (request.action === 'VALIDATE_LICENSE') {
        handleValidation(request.key).then(sendResponse);
        return true; // Indicates async response
    }
});

async function handleActivation(key, instanceName) {
    try {
        const formData = new FormData();
        formData.append('license_key', key);
        formData.append('instance_name', instanceName);

        const response = await fetch(LS_API_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Background: Activation error', error);
        return { success: false, error: error.message };
    }
}

async function handleValidation(key) {
    try {
        const formData = new FormData();
        formData.append('license_key', key);

        const response = await fetch(LS_API_VALIDATE_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Background: Validation error', error);
        return { success: false, error: error.message };
    }
}
