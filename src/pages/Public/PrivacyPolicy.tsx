import Navbar from '../../components/layout/Navbar'
import Logo from '../../components/ui/Logo'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#fafbfc' }}>
            <Navbar />

            <div style={{ paddingTop: '100px', paddingBottom: 'var(--space-20)' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    <div className="card-neumorphic" style={{ padding: 'var(--space-12)', background: 'white', borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--color-gray-900)', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
                        <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-10)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Effective Date: February 25, 2026</p>

                        <div className="policy-content" style={{ color: 'var(--color-gray-700)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-base)' }}>
                                <strong>Kangaroo Systems Ltd.</strong> ("Company", "we", "us", or "our") operates <strong>Granto</strong>, a university grant tracking and management platform (the "Service"). This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use the Service.
                            </p>
                            <p style={{ marginBottom: 'var(--space-8)', fontSize: 'var(--text-base)' }}>
                                By using Granto, you agree to the collection and use of information as described in this policy. If you do not agree, please do not use the Service.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>1. Information We Collect</h2>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>1.1 Information You Provide</h3>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Account Information:</strong> Name, email address, and password when you register, or profile data provided through Google Sign-In.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Profile Information:</strong> Your role (Lecturer, Administrator, Viewer), institutional affiliation, and department.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Grant Data:</strong> Grant titles, funding body details, award amounts, dates, status updates, and internal notes.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Documents:</strong> Files you upload to the Service, including grant proposals, contracts, and reports.</li>
                            </ul>

                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>1.2 Information Collected Automatically</h3>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Usage Data:</strong> Pages visited, features used, timestamps, and interaction patterns.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Log Data:</strong> IP address, access times, and error logs.</li>
                            </ul>

                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>1.3 Information from Third Parties</h3>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Google:</strong> Authentication details as authorized by your Google account.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Paystack:</strong> Transaction confirmation details (we do not store full payment card information).</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>2. How We Use Your Information</h2>
                            <p style={{ marginBottom: 'var(--space-4)' }}>We use the information we collect to:</p>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Provide, operate, and maintain the Service.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Authenticate your identity and manage your account.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Enable grant tracking, reporting, and collaboration features.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Send service-related notifications and updates.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Improve the Service based on usage patterns and feedback.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Detect, prevent, and address security issues or abuse.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>3. Data Storage and Security</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                Your data is stored using <strong>Appwrite</strong> cloud infrastructure. We implement industry-standard security measures to protect your information, including:
                            </p>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Encryption of data in transit (TLS/SSL) and at rest.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Role-based access controls within the application.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Regular security monitoring and audits.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>4. Your Rights</h2>
                            <p style={{ marginBottom: 'var(--space-4)' }}>You have the right to:</p>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Access the personal data we hold about you.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Request correction of inaccurate or incomplete data.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Request deletion of your account and associated data.</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Object to or restrict the processing of your information.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>5. Contact Us</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                                <br /><br />
                                <strong>Kangaroo Systems Ltd.</strong><br />
                                Email: <a href="mailto:support@granto.app" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>support@granto.app</a>
                            </p>

                            <p style={{ marginTop: 'var(--space-12)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-6)' }}>
                                View our <Link to="/terms-of-service" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>.
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
