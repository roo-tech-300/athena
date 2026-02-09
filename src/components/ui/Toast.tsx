import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'

// --- Types ---
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
    onClick?: () => void
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (message: string, type: ToastType, duration?: number, onClick?: () => void) => void
    removeToast: (id: string) => void
}

// --- Context ---
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// --- Hook ---
export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// --- Component: Toast Item ---
const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
    const [isExiting, setIsExiting] = useState(false)

    // Handle auto-dismiss
    React.useEffect(() => {
        const timer = setTimeout(() => {
            handleRemove()
        }, toast.duration || 5000)

        return () => clearTimeout(timer)
    }, [toast.id, toast.duration])

    const handleRemove = () => {
        setIsExiting(true)
        setTimeout(() => {
            onRemove(toast.id)
        }, 300) // Match animation duration
    }

    const icons = {
        success: <CheckCircle size={20} color="var(--color-success)" />,
        error: <AlertCircle size={20} color="var(--color-error)" />,
        warning: <AlertTriangle size={20} color="var(--color-warning)" />,
        info: <Info size={20} color="var(--color-info)" />
    }

    const borderColors = {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)'
    }

    return (
        <div
            className="glass"
            onClick={() => {
                if (toast.onClick) {
                    toast.onClick()
                    handleRemove()
                }
            }}
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '10px',
                minWidth: '300px',
                maxWidth: '400px',
                borderLeft: `4px solid ${borderColors[toast.type]}`,
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                animation: isExiting ? 'slideOut 0.3s ease-in forwards' : 'slideIn 0.3s ease-out forwards',
                position: 'relative',
                overflow: 'hidden',
                cursor: toast.onClick ? 'pointer' : 'default'
            }}
        >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {icons[toast.type]}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-gray-900)', lineHeight: '1.4' }}>
                    {toast.message}
                </p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    color: 'var(--color-gray-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <X size={16} />
            </button>

            {/* Animation Styles */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `}</style>
        </div>
    )
}

// --- Provider ---
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, type: ToastType, duration = 5000, onClick?: () => void) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts(prev => [...prev, { id, message, type, duration, onClick }])
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}
