import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/ui/Button'
import Logo from '../../components/ui/Logo'
import { Landmark, Briefcase } from 'lucide-react'

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            {/* Liquid Background */}
            <div className="liquid-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <Navbar />

            <div style={{ paddingTop: '72px' }}>
                {/* Hero Section - PRD Focus: University Grant Lifecycle */}
                <section className="hero" style={{
                    background: 'transparent',
                    borderBottom: 'none',
                    padding: 'var(--space-16) 0 var(--space-8)'
                }}>
                    <div className="container" style={{ maxWidth: '950px' }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            marginBottom: 'var(--space-6)',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            fontWeight: 700
                        }}>
                            Academic Excellence <br />
                            <span className="text-gradient">Through Grant Clarity</span>
                        </h1>
                        <p style={{
                            fontSize: 'var(--text-xl)',
                            color: 'var(--color-gray-700)',
                            marginBottom: 'var(--space-8)',
                            maxWidth: '750px',
                            marginInline: 'auto',
                            fontWeight: 'var(--font-medium)',
                            lineHeight: 1.6
                        }}>
                            Granto streamlines the grant lifecycle for university lecturers and administrators. From proposal tracking to funding analytics, manage your research portfolio with futuristic precision.
                        </p>
                        <div className="cta-buttons" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/signup">
                                <Button size="lg" className="btn-responsive" style={{ paddingInline: 'var(--space-12)' }}>Begin Grant Tracking</Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="btn-responsive" style={{ paddingInline: 'var(--space-12)' }}>Platform Overview</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Live Modular Dashboard Preview */}
                <section className="section-padding" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                            <span style={{
                                color: 'var(--color-primary)',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: 'var(--text-xs)'
                            }}>Institutional Dashboard</span>
                            <h2 style={{ fontSize: 'var(--text-3xl)', marginTop: 'var(--space-2)' }}>Centralized Grant Management</h2>
                        </div>

                        {/* Dashboard Simulation Container - Visual Hierarchy in Action */}
                        <div className="landing-grid-12" style={{
                            maxWidth: '1200px',
                            margin: '0 auto',
                            background: 'rgba(255, 255, 255, 0.4)',
                            padding: 'var(--space-6)',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.05)',
                            border: '1px solid white'
                        }}>

                            {/* 1. Primary Focus: Grant Overview (Top Left) */}
                            <div className="card-neumorphic tablet-span-2" style={{ gridColumn: 'span 8', gridRow: 'span 1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                    <h3 style={{ fontSize: 'var(--text-xl)' }}>Portfolio Status</h3>
                                    <span style={{ padding: '4px 12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Lecturer View</span>
                                </div>
                                <div className="metric-grid">
                                    {[
                                        { label: 'Submitted', value: '13', color: '#3B82F6', prog: '75%' },
                                        { label: 'Review', value: '6', color: '#F59E0B', prog: '45%' },
                                        { label: 'Approved', value: '24', color: '#10B981', prog: '90%' },
                                        { label: 'Completed', value: '5', color: '#6366F1', prog: '20%' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ textAlign: 'center' }}>
                                            <div className="metric-ring" style={{ margin: '0 auto var(--space-3)', ['--progress' as any]: item.prog }}>
                                                <span className="metric-value" style={{ color: item.color }}>{item.value}</span>
                                            </div>
                                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)' }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Tertiary: Collaboration Tools (Top Right) */}
                            <div className="card-neumorphic glass tablet-span-1" style={{ gridColumn: 'span 4' }}>
                                <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', fontWeight: 700 }}>Activity Log</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {[
                                        { name: 'Grant Admin', action: 'Uploaded proposal draft v2', time: '5m' },
                                        { name: 'Group Lead', action: 'Approved budget request', time: '1h' },
                                        { name: 'System', action: 'Reminder: NSF Deadline', time: '1d' }
                                    ].map((collab, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-md)', background: i === 2 ? 'var(--color-warning)' : 'var(--color-primary-light)' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{collab.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>{collab.action}</div>
                                            </div>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--color-gray-400)' }}>{collab.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Secondary Focus: Reporting & Funding Trends (PRD Section 4) */}
                            <div className="card-neumorphic tablet-span-2" style={{ gridColumn: 'span 7' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                    <h3 style={{ fontSize: 'var(--text-lg)' }}>Funding Distribution</h3>
                                    <select style={{ border: 'none', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', padding: '2px 8px' }}>
                                        <option>Academic Year 2026</option>
                                    </select>
                                </div>
                                <div style={{ height: '140px', width: '100%', position: 'relative', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                    {/* Simulated Bar Chart for Departments */}
                                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%', padding: '20px 10px' }}>
                                        {[60, 85, 45, 75, 95].map((h, i) => (
                                            <div key={i} style={{ width: 'clamp(10px, 4vw, 25px)', height: `${h}%`, background: i === 1 ? 'var(--color-primary)' : 'var(--color-primary-light)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                                <span style={{ position: 'absolute', top: '-15px', left: '0', fontSize: '8px', width: '100%', textAlign: 'center' }}>{['CS', 'BIO', 'ENG', 'ART', 'MED'][i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Tertiary: Organisation Management (PRD Section 2) */}
                            <div className="card-neumorphic tablet-span-1" style={{ gridColumn: 'span 5' }}>
                                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Research Group</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <div style={{ padding: 'var(--space-3)', background: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>Active Group</div>
                                            <div style={{ fontWeight: 600 }}>Faculty of Science</div>
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xl)' }}><Landmark size={24} /></div>
                                    </div>
                                    <div className="glass" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Archived</div>
                                            <div style={{ fontWeight: 600 }}>Medical Research Center</div>
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xl)', opacity: 0.5 }}><Briefcase size={24} /></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Core Features Section - Based on PRD Phasing */}
                <section className="section-padding">
                    <div className="container" id="features">
                        <div className="features-grid">
                            <div>
                                <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>01. Structured Grant Tracking</h4>
                                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>Full lifecycle management from Draft to Completed. Support for funding bodies, document attachments, and strict deadline monitoring.</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>02. Role-Based Governance</h4>
                                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>Secure access control for Lecturers, Administrators, and Viewers. Manage research group onboarding with university-wide multi-tenancy.</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>03. Advanced Reporting</h4>
                                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>Integrated analytics for research group heads. Automate success rate visualizations and funding trend exports with one click.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-padding" style={{ paddingBottom: 'var(--space-16)' }}>
                    <div className="container">
                        <div className="glass-dark" style={{
                            padding: 'clamp(var(--space-8), 10vw, var(--space-16)) var(--space-6)',
                            borderRadius: 'var(--radius-xl)',
                            textAlign: 'center',
                            background: 'var(--color-gray-900)',
                            color: 'white',
                            boxShadow: '0 50px 100px rgba(0, 0, 0, 0.2)'
                        }}>
                            <h2 style={{ fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', marginBottom: 'var(--space-6)', color: 'white' }}>Streamline University Research</h2>
                            <p style={{ color: 'var(--color-gray-400)', marginBottom: 'var(--space-8)', maxWidth: '650px', marginInline: 'auto', fontSize: 'var(--text-lg)' }}>
                                Bring your research group into the future of management. Designed for technical and non-technical staff alike.
                            </p>
                            <Link to="/signup">
                                <Button size="lg" className="btn-responsive" style={{ background: 'white', color: 'var(--color-gray-900)', fontWeight: 'bold', paddingInline: 'var(--space-16)' }}>Deploy Granto for Your Institution</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <footer style={{ padding: 'var(--space-8) 0', borderTop: '1px solid var(--color-gray-100)', background: 'var(--color-white)' }}>
                <div className="container footer-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Logo size={32} showText={true} />
                    </div>
                    <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', margin: 0 }}>
                            &copy; 2026 Kangaroo Systems Ltd. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link to="/terms-of-service" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', textDecoration: 'none' }}>Terms of Service</Link>
                            <span style={{ fontSize: '10px', color: 'var(--color-gray-300)' }}>&middot;</span>
                            <Link to="/privacy-policy" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', textDecoration: 'none' }}>Privacy Policy</Link>
                            <span style={{ fontSize: '10px', color: 'var(--color-gray-300)' }}>&middot;</span>
                            <span style={{ fontSize: '10px', color: 'var(--color-gray-300)' }}>Kangaroo Technologies</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
