import Navbar from '../../components/layout/Navbar'
import Logo from '../../components/ui/Logo'
import { Link, useNavigate } from 'react-router-dom'
import { Linkedin, Twitter, Mail, ChevronRight } from 'lucide-react'
import { teamMembers } from '../../constants/team'
import { Helmet } from 'react-helmet-async'

export default function Team() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', paddingBottom: 'var(--space-16)' }}>
            <Helmet>
                <title>Granto Teams</title>
            </Helmet>
            <div className="liquid-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <Navbar />

            <div style={{ paddingTop: '120px' }}>
                <section className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                        <span style={{
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            fontSize: 'var(--text-xs)',
                            marginBottom: 'var(--space-4)',
                            display: 'block'
                        }}>Our Leadership</span>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 800,
                            marginBottom: 'var(--space-6)',
                            lineHeight: 1.1
                        }}>
                            Meet the <span className="text-gradient">Visionaries</span>
                        </h1>
                        <p style={{
                            color: 'var(--color-gray-600)',
                            fontSize: 'var(--text-lg)',
                            maxWidth: '700px',
                            marginInline: 'auto',
                            lineHeight: 1.6
                        }}>
                            We are a team of researchers, engineers, and visionaries dedicated to simplifying the academic grant lifecycle through innovation and clarity.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--space-8)',
                        marginTop: 'var(--space-12)'
                    }}>
                        {teamMembers.map((member, index) => {
                            return (
                                <div key={index} className="card-neumorphic hover-lift" style={{
                                    padding: 0,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '350px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '50%',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            padding: 'var(--space-6)'
                                        }}>
                                            <div>
                                                <h3 style={{ color: 'white', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-1)' }}>{member.name}</h3>
                                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{member.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <p style={{
                                                color: 'var(--color-gray-600)',
                                                fontSize: 'var(--text-sm)',
                                                lineHeight: 1.6,
                                                marginBottom: 'var(--space-6)',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {member.bio}
                                            </p>

                                            <button
                                                onClick={() => navigate(`/team/${member.slug}`)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--color-primary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 700,
                                                    padding: '4px 0',
                                                    marginBottom: 'var(--space-4)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = 'var(--color-primary-dark)';
                                                    e.currentTarget.style.transform = 'translateX(4px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = 'var(--color-primary)';
                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                }}
                                            >
                                                Learn more about {member.name.split(' ')[0]} <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
                                            <a href={member.linkedin} style={{ color: 'var(--color-primary)', transition: 'transform 0.2s' }} className="hover-scale">
                                                <Linkedin size={20} />
                                            </a>
                                            <a href={member.twitter} style={{ color: 'var(--color-primary)', transition: 'transform 0.2s' }} className="hover-scale">
                                                <Twitter size={20} />
                                            </a>
                                            <a href={`mailto:${member.email}`} style={{ color: 'var(--color-primary)', transition: 'transform 0.2s' }} className="hover-scale">
                                                <Mail size={20} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

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
