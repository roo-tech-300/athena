import Navbar from '../../components/layout/Navbar'
import Logo from '../../components/ui/Logo'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#fafbfc' }}>
            <Navbar />

            <div style={{ paddingTop: '100px', paddingBottom: 'var(--space-20)' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    <div className="card-neumorphic" style={{ padding: 'var(--space-12)', background: 'white', borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--color-gray-900)', letterSpacing: '-0.02em' }}>Terms of Service</h1>
                        <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-10)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Effective Date: February 25, 2026</p>

                        <div className="policy-content" style={{ color: 'var(--color-gray-700)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-base)' }}>
                                Welcome to <strong>Granto</strong>, a university grant tracking and management platform operated by <strong>Kangaroo Systems Ltd.</strong> ("Company", "we", "us", or "our"). By accessing or using Granto (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Service.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>1. Definitions</h2>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>"Service"</strong> refers to the Granto web application and all related features, tools, and APIs.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>"User"</strong> refers to any individual who accesses or uses the Service.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>"Organisation"</strong> refers to a university, department, or research group registered on the Service.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>"Content"</strong> refers to all data, documents, and materials uploaded to the Service.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>2. Eligibility</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                You must be at least 18 years of age and affiliated with an accredited educational institution or research body to use the Service. By using Granto, you represent that you meet these requirements.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>3. Use of the Service</h2>
                            <p style={{ marginBottom: 'var(--space-4)' }}>The Service is provided for lawful, university-related grant management purposes. You agree not to:</p>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Use the Service for any unlawful or fraudulent purpose.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Upload malicious software, viruses, or harmful code.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Attempt to gain unauthorized access to other accounts or systems.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Misrepresent your identity, institutional affiliation, or role.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>4. Grant Data and Content</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                You retain ownership of all Content you submit to the Service. By uploading Content, you grant Kangaroo Systems Ltd. a limited license to store, process, and display your Content solely for the purpose of providing the Service to you and your Organisation.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>5. Intellectual Property</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                The Service, including its design, source code, logos, trademarks, and documentation, is the intellectual property of Kangaroo Systems Ltd. and is protected by applicable laws. You may not copy or redistribute any part of the Service without our consent.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>6. Limitation of Liability</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                To the maximum extent permitted by applicable law, Kangaroo Systems Ltd. and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>7. Termination</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                We reserve the right to suspend or terminate your access to the Service if you breach these Terms or engage in conduct that we reasonably believe is harmful to the Service or other Users.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>8. Contact Us</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                If you have any questions about these Terms, please contact us at:
                                <br /><br />
                                <strong>Kangaroo Systems Ltd.</strong><br />
                                Email: <a href="mailto:support@granto.app" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>support@granto.app</a>
                            </p>

                            <p style={{ marginTop: 'var(--space-12)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-6)' }}>
                                Read our <Link to="/privacy-policy" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer style={{ padding: 'var(--space-12) 0', borderTop: '1px solid var(--color-gray-100)', background: 'var(--color-white)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Logo size={32} showText={true} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', margin: 0 }}>
                            &copy; 2026 Kangaroo Systems Ltd. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
