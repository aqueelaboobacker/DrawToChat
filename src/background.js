
// Background Service Worker for DrawToChat
// Handles cross-origin requests to Dodo Payments to avoid CORS issues in content scripts.

const DODO_API_URL = 'https://live.dodopayments.com/licenses/activate';
const DODO_API_VALIDATE_URL = 'https://live.dodopayments.com/licenses/validate';

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
        const response = await fetch(DODO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                license_key: key,
                name: instanceName
            })
        });

        const data = await response.json();

        if (!response.ok) {
             throw new Error(data.message || 'Activation failed');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Background: Activation error', error);
        return { success: false, error: error.message };
    }
}

async function handleValidation(key) {
    try {
        const response = await fetch(DODO_API_VALIDATE_URL, {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                license_key: key
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Validation failed');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Background: Validation error', error);
        return { success: false, error: error.message };
    }
}
