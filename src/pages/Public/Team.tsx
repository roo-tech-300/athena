import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Logo from '../../components/ui/Logo'
import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import ceoImg from '../../assets/images/ceo.png'
import cooImg from '../../assets/images/coo.png'
import ctoImg from '../../assets/images/cto.png'
import cmoImg from '../../assets/images/cmo.png'

const teamMembers = [
    {
        name: "Dr. Ibrahim Abdullahi",
        role: "Chief Executive Officer",
        image: ceoImg,
        bio: "Dr. Abdullahi is a Computer Engineer and researcher with over a decade of academic and technical leadership experience. He holds a PhD in Computer Engineering from the Federal University of Technology, Minna, where he has risen through the ranks to Senior Lecturer. His work spans Artificial Intelligence, IoT, Intelligent Embedded Systems, and Cybersecurity, with research grants totalling over ₦150 million attracted from TETFUND and the NCC. He is the inventor of two patented optimization algorithms — the Pastoralist Optimization Algorithm (POA) and the Nomadic Pastoralist Optimization Algorithm (NPOA) — and has published extensively in both international and national journals. A registered engineer with COREN and member of the Nigerian Society of Engineers, Dr. Abdullahi brings deep technical expertise and a strong innovation track record to his leadership role.",
        linkedin: "#",
        twitter: "#",
        email: "amibrahim@futminna.edu.ng"
    },
    {
        name: "Eluzia Ameh-Ako",
        role: "Chief Operating Officer",
        image: cooImg,
        bio: "Eluzia is a Computer Engineer at the Federal University of Technology, Minna, with hands-on experience in software development, operations management, and technical instruction. He has built practical expertise in frontend development using modern web technologies including React and TypeScript, and has led real-world projects such as a ticketing platform for campus events and a postgraduate management system. His operational background includes managing day-to-day business functions, inventory, and customer service at Global Computer Technologies, where he also taught web development. Eluzia brings a blend of technical skill, leadership, and a self-driven approach to his role overseeing the company's operations.",
        linkedin: "#",
        twitter: "#",
        email: "elena@granto.ai"
    },
    {
        name: "Gabriel Godwin",
        role: "Chief Technology Officer",
        image: ctoImg,
        bio: "Gabriel is a Mechatronics Engineer at the Federal University of Technology, Minna, with a foundation across software development, embedded systems, and IoT. His multidisciplinary background bridges hardware and software — from Arduino-based prototypes to frontend web development and blockchain exposure through the Solana All-Star Program. He has also undergone structured technical training via the ESRIG Cohort, gaining experience in programming, version control, and collaborative development. Gabriel's creativity, curiosity, and cross-domain technical interests position him well to drive the company's technology vision and product development.",
        linkedin: "#",
        twitter: "#",
        email: "eluziaako@gmail.com"
    },
    {
        name: "Emmanuel John",
        role: "Chief Marketting Officer",
        image: cmoImg,
        bio: "Emmanuel is a Geologist by training whose true passion lies in marketing, branding, and human connection. He built his foundation in marketing at Sure Foundation Integrated Concept as a Junior Marketing Officer, and further sharpened his skills at Taberah Glory Foundation, where he worked alongside seasoned professionals. His breakthrough came at Made by Boski, a fashion brand where he led marketing efforts and delivered outstanding results — proving his ability to drive growth in creative, fast-moving industries. Emmanuel's greatest strengths are his natural ability to network, build relationships, and craft compelling campaigns that resonate. He brings energy, creativity, and a unique cross-disciplinary perspective to the team as CMO.",
        linkedin: "#",
        twitter: "#",
        email: "eluziaako@gmail.com"
    }
]

export default function Team() {
    const [expandedBios, setExpandedBios] = useState<Record<number, boolean>>({})

    const toggleBio = (index: number) => {
        setExpandedBios(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

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
                        {teamMembers.map((member, index) => {
                            const isExpanded = expandedBios[index]
                            const shouldShowToggle = member.bio.length > 200

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
                                                marginBottom: shouldShowToggle ? 'var(--space-2)' : 'var(--space-6)',
                                                display: '-webkit-box',
                                                WebkitLineClamp: isExpanded ? 'unset' : 4,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {member.bio}
                                            </p>
                                            {shouldShowToggle && (
                                                <button
                                                    onClick={() => toggleBio(index)}
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
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-dark)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                                                >
                                                    {isExpanded ? (
                                                        <>Show less <ChevronUp size={14} /></>
                                                    ) : (
                                                        <>Read more <ChevronDown size={14} /></>
                                                    )}
                                                </button>
                                            )}
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
