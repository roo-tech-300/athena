import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--color-gray-50)'
        }}>
            {/* Liquid Background */}
            <div className="liquid-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div
                    className="card-neumorphic glass"
                    style={{
                        maxWidth: '500px',
                        margin: '0 auto',
                        padding: 'var(--space-12) var(--space-8)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-xl)',
                        background: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-8)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <Compass size={40} className="pulse" />
                    </div>

                    <h1 style={{
                        fontSize: 'var(--text-6xl)',
                        fontWeight: 900,
                        margin: 0,
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-indigo) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>404</h1>

                    <h2 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 700,
                        marginTop: 'var(--space-4)',
                        marginBottom: 'var(--space-2)'
                    }}>Route Not Found</h2>

                    <p style={{
                        color: 'var(--color-gray-500)',
                        marginBottom: 'var(--space-10)',
                        fontSize: 'var(--text-base)',
                        lineHeight: 1.6
                    }}>
                        It seems you've wandered off the mapped research path. The page you are looking for has been moved or doesn't exist.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', width: '100%', marginTop: 'var(--space-8)' }}>
                        <Link to="/" style={{ flex: 1 }}>
                            <Button variant="outline" style={{ width: '100%', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowLeft size={18} /> Back to Landing
                            </Button>
                        </Link>
                        <Link to="/portal" style={{ flex: 1 }}>
                            <Button style={{ width: '100%' }}>Go to Portal</Button>
                        </Link>
                    </div>

                    <div style={{
                        marginTop: 'var(--space-10)',
                        paddingTop: 'var(--space-6)',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <div style={{ width: '24px', height: '24px', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>A</div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Athena Intelligence</span>
                    </div>
                </div>
            </div>

            <style>{`
                .pulse {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
