import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import { useAuth } from '../../useContext/context'
import { useLogoutAccount } from '../../hooks/useAuth'
import { getUserInitials } from '../../utils/user'

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { mutateAsync: logoutMutation } = useLogoutAccount()

    const handleLogout = async () => {
        try {
            await logoutMutation()
            logout() // Immediately clear AuthContext state
            navigate('/login')
        } catch (error) {
            console.error(error)
        }
    }

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
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <Logo showText={true} className="navbar-logo" />
                </Link>

                <div className="navbar-links">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'var(--color-primary-light)',
                                    color: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: 'var(--text-xs)'
                                }}>
                                    {getUserInitials(user)}
                                </div>
                                <span className="hide-mobile" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                                    {user.name}
                                </span>
                            </div>
                            <Button variant="ghost" onClick={handleLogout} size="sm">Log Out</Button>
                        </div>
                    ) : location.pathname !== '/portal' && (
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="hide-mobile">Log In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
