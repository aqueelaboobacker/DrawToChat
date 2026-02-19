
import React, { useState } from 'react';
import { licenseManager } from './license';

const overlayStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
    color: '#333'
};

const inputStyles = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '250px',
    marginBottom: '10px',
    fontSize: '14px'
};

const buttonStyles = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#228be6',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
};

const linkStyles = {
    color: '#228be6',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '15px',
    display: 'block'
};

const BUY_LINK = "https://test.checkout.dodopayments.com/buy/pdt_0NYpQ921YgiMHl5riH0Qy?quantity=1";


export default function PaywallModal({ onClose, onSuccess }) {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [priceLabel, setPriceLabel] = useState('$9.99 Lifetime'); // Default fallback

    // Simplified: No dynamic pricing fetch for now
    React.useEffect(() => {
        // Optional: Implement Dodo product fetch if needed later
    }, []);

    const handleActivate = async () => {
        if (!key) return;
        setLoading(true);
        setError('');

        const result = await licenseManager.activateLicense(key);

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div style={overlayStyles}>
            <h2 style={{ margin: '0 0 10px' }}>Free Limit Reached</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>
                You've used your 3 free drawings. <br />
                Upgrade to Pro for unlimited access!
            </p>

            <input
                type="text"
                placeholder="Enter License Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                style={inputStyles}
            />

            {error && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px' }}>{error}</p>}

            <button
                onClick={handleActivate}
                style={buttonStyles}
                disabled={loading}
            >
                {loading ? 'Verifying...' : 'Activate Pro'}
            </button>

            <a href={BUY_LINK} target="_blank" rel="noopener noreferrer" style={linkStyles}>
                Get a License ({priceLabel})
            </a>

            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#999',
                    marginTop: '20px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                }}
            >
                Close
            </button>
        </div>
    );
}
