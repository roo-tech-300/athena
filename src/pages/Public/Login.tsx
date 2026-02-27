import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Logo from '../../components/ui/Logo'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useLoginAccount } from '../../hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/ui/Toast'
import Loader from '../../components/ui/Loader'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { addToast } = useToast()
    const { mutateAsync: loginMutation, isPending: loading } = useLoginAccount()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await loginMutation({ email, password })
            navigate('/portal')
        } catch (error) {
            console.error(error)
            addToast("Failed to sign in. Please check your credentials.", "error")
        }
    }
    return (
        <div className="auth-page">
            {/* Split Screen Layout */}
            <div className="auth-sidebar">
                <img src="/auth-bg.png" alt="Granto Intelligence" className="auth-sidebar-img" />
                <div className="auth-sidebar-overlay">
                    <div style={{ maxWidth: '400px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: 'var(--space-8)'
                        }}>
                            <Logo size={40} showText={true} textColor="white" />
                        </div>
                        <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)', fontWeight: 700, lineHeight: 1.2 }}>
                            Strategic Wisdom for Academic Excellence.
                        </h2>
                    </div>
                </div>
            </div>

            <div className="auth-content">
                {/* Back Link Overlay for Mobile */}
                <Link to="/" style={{
                    position: 'absolute',
                    top: "15px",
                    right: 'var(--space-8)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-500)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    Back to home <ArrowRight size={14} />
                </Link>

                <div className="auth-card" style={{ paddingTop: '20px' }}>
                    <div className="card-neumorphic" style={{ padding: '20px', border: 'none', background: 'white' }}>
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Sign In</h1>
                            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-base)' }}>
                                Enter your institutional credentials below.
                            </p>
                        </div>

                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }}>
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="professor@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: 'var(--space-8)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                    <label className="input-label" style={{ margin: 0 }}>Password</label>
                                    {/* <a href="#" style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Recovery Options</a> */}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }}>
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        placeholder="Passsword"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                    />
                                </div>
                            </div>

                            <Button size="lg" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}>
                                {
                                    loading ? <Loader /> : 'Sign In'
                                }
                            </Button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: 'var(--space-10)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                            Don't have an account? <Link to="/signup" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>   Sign Up</Link>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 'var(--space-8)', fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', lineHeight: 1.5 }}>
                        By signing in, you agree to our <Link to="/terms-of-service" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms of Service</Link> <br /> and <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>Academic Data Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    )
}
