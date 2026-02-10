import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useCreateAccount } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'

export default function SignUp() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { addToast } = useToast()
    const { mutateAsync: signupMutation, isPending: loading } = useCreateAccount()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) {
            addToast("Please select a title", "warning");
            return;
        }
        try {
            await signupMutation({ title, firstName, lastName, email, password });
            navigate('/portal');
        } catch (error) {
            console.error("Error creating account:", error);
            addToast("Failed to create account", "error");
        }
    }
    return (
        <div className="auth-page">
            {/* Split Screen Layout */}
            <div className="auth-sidebar">
                <img src="/auth-bg.png" alt="Athena Intelligence" className="auth-sidebar-img" style={{ transform: 'scaleX(-1)' }} />
                <div className="auth-sidebar-overlay">
                    <div style={{ maxWidth: '400px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: 'var(--space-8)'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '20px'
                            }}>A</div>
                            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Athena</span>
                        </div>
                        <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)', fontWeight: 700, lineHeight: 1.2 }}>
                            Empowering Researcher Independence.
                        </h2>
                    </div>
                </div>
            </div>

            <div className="auth-content">
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
                            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Create Account</h1>
                            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
                                Set up your workspace in less than 2 minutes.
                            </p>
                        </div>

                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="input-group">
                                <label className="input-label">Academic Title</label>
                                <select
                                    className="input-field"
                                    style={{ background: 'white', cursor: 'pointer' }}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Title</option>
                                    <option value="Prof.">Prof.</option>
                                    <option value="Dr.">Dr.</option>
                                    <option value="Engr.">Engr.</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Barr.">Barr.</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="input-group">
                                    <label className="input-label">First Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }}>
                                            <User size={16} />
                                        </span>
                                        <input type="text" placeholder="Jane" className="input-field" style={{ paddingLeft: '40px' }} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Last Name</label>
                                    <input type="text" placeholder="Doe" className="input-field" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }}>
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="j.doe@university.edu"
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: 'var(--space-8)' }}>
                                <label className="input-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }}>
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button size="lg" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}>
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                            Already managing research? <br />
                            <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Sign in to Athena</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
