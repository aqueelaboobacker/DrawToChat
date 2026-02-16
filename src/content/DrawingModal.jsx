import React, { useState, useRef, useEffect } from 'react';
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";

const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 2147483647,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif'
};

const containerStyles = {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};

const toolbarStyles = {
    height: '60px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px',
    background: '#f8f9fa',
    borderTop: '1px solid #e9ecef'
};

const buttonBaseStyles = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
};

const cancelBtnStyles = {
    ...buttonBaseStyles,
    backgroundColor: '#e9ecef',
    color: '#495057'
};

const insertBtnStyles = {
    ...buttonBaseStyles,
    backgroundColor: '#228be6',
    color: 'white'
};

export default function DrawingModal({ onClose, onInsertDrawing }) {
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const excalidrawWrapperRef = useRef(null);

    // Prevent scrolling of background body when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleSave = async () => {
        if (!excalidrawAPI) return;

        const elements = excalidrawAPI.getSceneElements();
        if (!elements || elements.length === 0) {
            onClose();
            return;
        }

        try {
            const blob = await exportToBlob({
                elements: elements,
                mimeType: "image/png",
                appState: {
                    ...excalidrawAPI.getAppState(),
                    exportWithDarkMode: false,
                    exportBackground: true,
                },
                files: excalidrawAPI.getFiles(),
            });

            onInsertDrawing(blob);
            onClose();
        } catch (error) {
            console.error("Error exporting drawing:", error);
            alert("Failed to export drawing. Please try again.");
        }
    };

    return (
        <div style={modalStyles} onClick={(e) => {
            // Close if clicked on overlay (outside container)
            if (e.target === e.currentTarget) onClose();
        }}>
            <div style={containerStyles}>
                <div style={{ flex: 1, position: 'relative' }} ref={excalidrawWrapperRef}>
                    <Excalidraw
                        excalidrawAPI={(api) => setExcalidrawAPI(api)}
                        theme="light"
                    />
                </div>
                <div style={toolbarStyles}>
                    <button
                        onClick={onClose}
                        style={cancelBtnStyles}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dee2e6'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#e9ecef'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={insertBtnStyles}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1c7ed6'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#228be6'}
                    >
                        Insert to Chat
                    </button>
                </div>
            </div>
        </div>
    );
}
