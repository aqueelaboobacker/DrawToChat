
// Dodo Payments API handled in background.js
const FREE_LIMIT = 3; // 3 free drawings to get them hooked

export const licenseManager = {
    // ... items above ...

    async isPro() {
        const data = await chrome.storage.local.get(['licenseKey', 'licenseStatus', 'lastValidated']);
        
        // Periodic Re-validation (every 24h)
        const now = Date.now();
        const lastValidated = data.lastValidated || 0;
        const oneDay = 24 * 60 * 60 * 1000;

        if (data.licenseStatus === 'active' && (now - lastValidated > oneDay)) {
             // Validate in background
             this.validateLicense(data.licenseKey);
        }

        return data.licenseStatus === 'active';
    },

    // ... getUsage, incrementUsage, getRemainingFree ...

    async getUsage() {
        const data = await chrome.storage.local.get(['usageCount']);
        return data.usageCount || 0;
    },

    async incrementUsage() {
        const usage = await this.getUsage();
        await chrome.storage.local.set({ usageCount: usage + 1 });
        return usage + 1;
    },

    async getRemainingFree() {
        if (await this.isPro()) return Infinity;
        const usage = await this.getUsage();
        return Math.max(0, FREE_LIMIT - usage);
    },

    async activateLicense(key, instanceName = 'DrawToChat-Extension') {
        // Delegate to background script to avoid CORS
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'ACTIVATE_LICENSE',
                key,
                instanceName
            });

            if (!response || !response.success) {
                 return { success: false, error: response?.error || 'Network error occurred' };
            }

            const data = response.data;

            if (response.success && data) {
                 await chrome.storage.local.set({
                    licenseKey: key,
                    licenseStatus: 'active',
                    instanceId: data.id,
                    lastValidated: Date.now()
                });
                return { success: true };
            } else {
                return { success: false, error: data?.error || 'Invalid license key' };
            }
        } catch (error) {
            console.error('License activation error:', error);
            return { success: false, error: 'Extension error occurred' };
        }
    },

    async validateLicense(key) {
        try {
             // Delegate to background script
             const response = await chrome.runtime.sendMessage({
                 action: 'VALIDATE_LICENSE',
                 key
             });
             
             if (!response || !response.success) return; // Silent fail on network error

             const data = response.data;
             
             if (data.valid) {
                 await chrome.storage.local.set({ 
                     licenseStatus: 'active',
                     lastValidated: Date.now()
                 });
                 console.log("License re-validated successfully");
             } else {
                 console.warn("License no longer valid, downgrading to free.");
                 await chrome.storage.local.set({ licenseStatus: 'inactive' });
             }
        } catch (e) {
            console.error("Re-validation failed (network?)", e);
        }
    }
};
