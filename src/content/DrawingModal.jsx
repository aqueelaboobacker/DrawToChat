import React, { useState, useRef, useEffect } from 'react';
import { Excalidraw, exportToBlob, MainMenu, loadFromBlob, serializeAsJSON } from "@excalidraw/excalidraw";
import PaywallModal from './PaywallModal';
import { licenseManager } from './license';

const modalStyles = {
    // ... (unchanged previous styles) ...
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

const proBadgeStyles = {
    padding: '4px 8px',
    backgroundColor: '#ffd43b',
    color: '#000',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: 'auto'
};

const freeBadgeStyles = {
    padding: '4px 8px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: 'auto'
};

export default function DrawingModal({ onClose, onInsertDrawing }) {
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const excalidrawWrapperRef = useRef(null);
    const [isPro, setIsPro] = useState(false);
    const [remainingFree, setRemainingFree] = useState(5);
    const [showPaywall, setShowPaywall] = useState(false);
    const fileInputRef = useRef(null);

    // Prevent scrolling of background body when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Check license status
        const checkStatus = async () => {
            const pro = await licenseManager.isPro();
            setIsPro(pro);
            if (!pro) {
                const remaining = await licenseManager.getRemainingFree();
                setRemainingFree(remaining);
            }
        };
        checkStatus();

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleSave = async () => {
        if (!excalidrawAPI) return;

        // Check License Limits
        if (!isPro && remainingFree <= 0) {
            setShowPaywall(true);
            return;
        }

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
                    exportScale: 3,
                },
                files: excalidrawAPI.getFiles(),
            });

            // Increment usage if not pro
            if (!isPro) {
                await licenseManager.incrementUsage();
            }

            onInsertDrawing(blob);
            onClose();
        } catch (error) {
            console.error("Error exporting drawing:", error);
            alert("Failed to export drawing. Please try again.");
        }
    };

    const handlePaywallSuccess = () => {
        setIsPro(true);
        setShowPaywall(false);
        alert("License Activated! You are now a Pro user.");
    };

    const handleLoadFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const data = await loadFromBlob(file, null, null);
            if (excalidrawAPI) {
                excalidrawAPI.updateScene({
                    elements: data.elements,
                    appState: data.appState,
                    commitToHistory: true, // Allows user to Undo after loading
                });
            }
        } catch (error) {
            console.error("Error loading Excalidraw file:", error);
            alert("Failed to load file. It might be corrupted or not an Excalidraw file (.excalidraw).");
        }

        // Reset the file input so the same file can be loaded again if needed
        e.target.value = '';
    };

    const handleSaveFile = async (e) => {
        if (!excalidrawAPI) return;
        const elements = excalidrawAPI.getSceneElements();
        const appState = excalidrawAPI.getAppState();
        const files = excalidrawAPI.getFiles();

        const jsonString = serializeAsJSON(elements, appState, files, "local");
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `DrawToChat-${new Date().toISOString().split('T')[0]}.excalidraw`;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 10000);
    };

    const handleResetCanvas = () => {
        if (!excalidrawAPI) return;
        excalidrawAPI.updateScene({
            elements: [],
            commitToHistory: true,
        });
    };

    return (
        <div style={modalStyles} onClick={(e) => {
            // Close if clicked on overlay (outside container)
            if (e.target === e.currentTarget) onClose();
        }}>
            <div style={containerStyles}>
                <div style={{ flex: 1, position: 'relative' }} ref={excalidrawWrapperRef}>
                    {/* Hidden file input that safely intercepts ChatGPT clicks without breaking Excalidraw */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".excalidraw,.json"
                        onClick={(e) => e.stopPropagation()}
                        onChange={handleLoadFile}
                    />
                    <Excalidraw
                        excalidrawAPI={(api) => setExcalidrawAPI(api)}
                        theme="light"
                    >
                        <MainMenu>
                            <MainMenu.Item
                                onSelect={() => fileInputRef.current?.click()}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                }
                            >
                                Open Scene (.excalidraw)
                            </MainMenu.Item>

                            <MainMenu.Item
                                onSelect={handleSaveFile}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                }
                            >
                                Save Scene (.excalidraw)
                            </MainMenu.Item>

                            <MainMenu.Separator />

                            <MainMenu.Item
                                onSelect={handleResetCanvas}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                }
                            >
                                Reset Canvas
                            </MainMenu.Item>

                            <MainMenu.Separator />
                            <MainMenu.DefaultItems.ToggleTheme />
                            <MainMenu.DefaultItems.ChangeCanvasBackground />
                        </MainMenu>
                    </Excalidraw>
                    {showPaywall && (
                        <PaywallModal
                            onClose={() => setShowPaywall(false)}
                            onSuccess={handlePaywallSuccess}
                        />
                    )}
                </div>
                <div style={toolbarStyles}>
                    {isPro ? (
                        <div style={proBadgeStyles}>PRO MEMBER</div>
                    ) : (
                        <div style={freeBadgeStyles}>
                            {remainingFree} free drawings left
                        </div>
                    )}

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
