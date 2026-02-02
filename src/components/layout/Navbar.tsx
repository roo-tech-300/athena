import { Link, useLocation } from 'react-router-dom'
import Button from '../ui/Button'

export default function Navbar() {
    const location = useLocation()
    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        A
                    </div>
                    <span style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-gray-900)'
                    }}>
                        Athena
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                    {location.pathname !== '/portal' && (
                        <>
                            <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                                <Link to="/portal" style={{ color: 'var(--color-gray-700)', fontWeight: 'var(--font-medium)' }}>Portal</Link>
                                <a href="#features" style={{ color: 'var(--color-gray-700)', fontWeight: 'var(--font-medium)' }}>Features</a>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                <Link to="/login">
                                    <Button variant="ghost">Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
