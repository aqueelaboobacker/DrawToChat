
const LS_API_URL = 'https://api.lemonsqueezy.com/v1/licenses/activate';
const FREE_LIMIT = 5; // 5 free drawings to get them hooked

const LS_API_VALIDATE_URL = 'https://api.lemonsqueezy.com/v1/licenses/validate';

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
        try {
            const formData = new FormData();
            formData.append('license_key', key);
            formData.append('instance_name', instanceName);

            const response = await fetch(LS_API_URL, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.activated) {
                await chrome.storage.local.set({
                    licenseKey: key,
                    licenseStatus: 'active',
                    instanceId: data.instance.id,
                    lastValidated: Date.now()
                });
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Invalid license key' };
            }
        } catch (error) {
            console.error('License activation error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    },

    async validateLicense(key) {
        try {
             const formData = new FormData();
             formData.append('license_key', key);
             // Logic to use previously saved instance_id if possible, or just validate key
             
             const response = await fetch(LS_API_VALIDATE_URL, {
                 method: 'POST',
                 body: formData
             });
             
             const data = await response.json();
             
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
            // Optional: allow grace period if network fails?
        }
    }
};
