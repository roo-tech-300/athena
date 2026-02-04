import { Clock, ShieldAlert, Rocket, MessageSquare, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

export default function PendingAccess({ grantName }: { grantName: string }) {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: 'var(--space-6)'
        }}>
            <div className="card-neumorphic" style={{
                maxWidth: '600px',
                width: '100%',
                background: 'white',
                padding: 'var(--space-12)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'var(--color-primary-light)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    opacity: 0.4
                }} />

                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-2) auto',
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
                    animation: 'pulse 2s infinite'
                }}>
                    <Clock size={40} color="white" />
                </div>

                <h1 style={{
                    fontSize: 'var(--text-4xl)',
                    fontWeight: 800,
                    marginBottom: 'var(--space-4)',
                    background: 'linear-gradient(to right, var(--color-gray-900), var(--color-gray-600))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Access Pending Review
                </h1>

                <p style={{
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-gray-500)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-10)'
                }}>
                    Your request to join <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{grantName}</span> is currently being reviewed by the Principal Investigator.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                    <Button
                        size="lg"
                        onClick={() => navigate('/portal')}
                        style={{ width: '100%', justifyContent: 'center', display: "flex", alignItems: "center" }}
                    >
                        <ArrowLeft size={18} style={{ marginRight: '10px' }} /> Return to Portal
                    </Button>

                    <button style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-gray-400)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px'
                    }}>
                        <MessageSquare size={14} />
                        Need help? Contact support
                    </button>
                </div>

                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3); }
                        50% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(139, 92, 246, 0.4); }
                        100% { transform: scale(1); box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3); }
                    }
                `}</style>
            </div>
        </div>
    )
}
