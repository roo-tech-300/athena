import Navbar from '../../components/layout/Navbar'
import Logo from '../../components/ui/Logo'
import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Mail } from 'lucide-react'
import ceoImg from '../../assets/images/ceo.png'
import cooImg from '../../assets/images/coo.png'
import ctoImg from '../../assets/images/cto.png'

// Placeholder image paths - these will be replaced with the actual generated images
const teamMembers = [
    {
        name: "Dr. Ibrahim Abdullahi",
        role: "Chief Executive Officer",
        image: ceoImg,
        bio: "Visionary leader with 15+ years in academic administration and tech innovation.",
        linkedin: "#",
        twitter: "#",
        email: "amibrahim@futminna.edu.ng"
    },
    {
        name: "Emmanuel John",
        role: "Chief Operating Officer",
        image: cooImg,
        bio: "Strategic operations expert focused on scaling research infrastructure worldwide.",
        linkedin: "#",
        twitter: "#",
        email: "elena@granto.ai"
    },
    {
        name: "Eluzia Ameh-Ako",
        role: "Chief Technology Officer",
        image: ctoImg,
        bio: "Former research scientist dedicated to building the future of grant management systems.",
        linkedin: "#",
        twitter: "#",
        email: "eluziaako@gmail.com"
    }
]

export default function Team() {
    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', paddingBottom: 'var(--space-16)' }}>
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
                        {teamMembers.map((member, index) => (
                            <div key={index} className="card-neumorphic hover-lift" style={{
                                padding: 0,
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                background: 'rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '350px',
                                    overflow: 'hidden',
                                    position: 'relative'
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
                                <div style={{ padding: 'var(--space-6)' }}>
                                    <p style={{
                                        color: 'var(--color-gray-600)',
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.5,
                                        marginBottom: 'var(--space-6)'
                                    }}>
                                        {member.bio}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
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
                        ))}
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
