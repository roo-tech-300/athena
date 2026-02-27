import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Logo from '../../components/ui/Logo'
import { Linkedin, Twitter, Mail, ArrowLeft } from 'lucide-react'
import { teamMembers } from '../../constants/team'
import { Helmet } from 'react-helmet-async'

export default function TeamMemberDetail() {
    const { slug } = useParams<{ slug: string }>()
    const member = teamMembers.find(m => m.slug === slug)

    if (!member) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1>Member not found</h1>
                <Link to="/team">Back to Team</Link>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', paddingBottom: 'var(--space-16)' }}>
            <Helmet>
                <title>{member.name} | Granto Team</title>
                <meta name="description" content={`Meet ${member.name}, ${member.role} at Granto. ${member.bio.substring(0, 150)}...`} />
            </Helmet>

            <div className="liquid-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2" style={{ top: '40%', right: '-10%' }}></div>
            </div>

            <Navbar />

            <main style={{ paddingTop: '120px' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <Link to="/team" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        marginBottom: 'var(--space-8)',
                        textDecoration: 'none',
                        transition: 'transform 0.2s'
                    }} className="hover-lift">
                        <ArrowLeft size={18} /> Back to Team
                    </Link>

                    <div className="card-neumorphic" style={{
                        padding: 'var(--space-8)',
                        background: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: 'var(--radius-2xl)'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 'var(--space-12)',
                            alignItems: 'start'
                        }}>
                            {/* Profile Image Column */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    borderRadius: 'var(--radius-2xl)',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                    aspectRatio: '4/5',
                                    background: 'var(--color-gray-100)'
                                }}>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-4)',
                                    marginTop: 'var(--space-6)',
                                    justifyContent: 'center'
                                }}>
                                    <a href={member.linkedin} style={{
                                        width: '44px', height: '44px', borderRadius: '50%', background: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)',
                                        transition: 'all 0.2s'
                                    }} className="hover-lift">
                                        <Linkedin size={20} />
                                    </a>
                                    <a href={member.twitter} style={{
                                        width: '44px', height: '44px', borderRadius: '50%', background: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)',
                                        transition: 'all 0.2s'
                                    }} className="hover-lift">
                                        <Twitter size={20} />
                                    </a>
                                    <a href={`mailto:${member.email}`} style={{
                                        width: '44px', height: '44px', borderRadius: '50%', background: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)',
                                        transition: 'all 0.2s'
                                    }} className="hover-lift">
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>

                            {/* Info Column */}
                            <div>
                                <span style={{
                                    color: 'var(--color-primary)',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: 'var(--text-xs)',
                                    display: 'block',
                                    marginBottom: 'var(--space-2)'
                                }}>{member.role === 'Chief Executive Officer' ? 'Founder & CEO' : 'Executive Leadership'}</span>

                                <h1 style={{
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    fontWeight: 800,
                                    marginBottom: 'var(--space-1)',
                                    lineHeight: 1.1
                                }}>{member.name}</h1>

                                <p style={{
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 600,
                                    color: 'var(--color-gray-500)',
                                    marginBottom: 'var(--space-8)'
                                }}>{member.role}</p>

                                <div style={{
                                    height: '2px',
                                    width: '60px',
                                    background: 'var(--color-primary)',
                                    marginBottom: 'var(--space-8)',
                                    borderRadius: 'full'
                                }}></div>

                                <div style={{
                                    fontSize: 'var(--text-base)',
                                    lineHeight: 1.8,
                                    color: 'var(--color-gray-700)',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {member.bio}
                                </div>

                                <div style={{ marginTop: 'var(--space-12)' }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Contact Information</h4>
                                    <div style={{ display: 'flex', flexFlow: 'column', gap: 'var(--space-3)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-gray-600)' }}>
                                            <Mail size={16} />
                                            <span>{member.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ marginTop: 'var(--space-20)', padding: 'var(--space-8) 0', borderTop: '1px solid var(--color-gray-100)', background: 'var(--color-white)' }}>
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
                            <Link to="/" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', textDecoration: 'none' }}>Back to Home</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
