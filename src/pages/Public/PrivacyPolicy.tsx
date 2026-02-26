import Navbar from '../../components/layout/Navbar'
import Logo from '../../components/ui/Logo'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#fafbfc' }}>
            <Navbar />

            <div style={{ paddingTop: '100px', paddingBottom: 'var(--space-20)' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    <div className="card-neumorphic policy-card" style={{ background: 'white', borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--color-gray-900)', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
                        <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-10)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Effective Date: February 25, 2026</p>

                        <div className="policy-content" style={{ color: 'var(--color-gray-700)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-base)' }}>
                                <strong>Kangaroo Systems Ltd.</strong> ("Company", "we", "us", or "our") operates <strong>Granto</strong>, a university grant tracking and management platform (the "Service"). This Privacy Policy explains how we collect, use, disclose, store, and protect your personal information when you use the Service.
                            </p>

                            <p style={{ marginBottom: 'var(--space-8)', fontSize: 'var(--text-base)' }}>
                                By using Granto, you agree to the collection and use of information as described in this Privacy Policy. If you do not agree, please discontinue use of the Service.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>1. Information We Collect</h2>

                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>1.1 Information You Provide</h3>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li><strong>Account Information:</strong> Name, email address, and password when you register, or profile data provided through Google Sign-In.</li>
                                <li><strong>Profile Information:</strong> Role (Lecturer, Administrator, Viewer), institutional affiliation, and department.</li>
                                <li><strong>Grant Data:</strong> Grant titles, funding body details, award amounts, dates, status updates, and internal notes.</li>
                                <li><strong>Documents:</strong> Files uploaded to the Service, including grant proposals, contracts, and reports.</li>
                            </ul>

                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>1.2 Information Collected Automatically</h3>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li><strong>Usage Data:</strong> Pages visited, features used, timestamps, and interaction patterns.</li>
                                <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                                <li><strong>Log Data:</strong> IP address, access times, and error logs.</li>
                            </ul>

                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>1.3 Information from Third Parties</h3>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li><strong>Google:</strong> Authentication details as authorized through your Google account.</li>
                                <li><strong>Paystack:</strong> Transaction confirmation details (we do not store full payment card information).</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>2. Legal Basis for Processing</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                We process personal data based on:
                            </p>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li><strong>Contractual Necessity:</strong> To provide and operate the Service.</li>
                                <li><strong>Legitimate Interests:</strong> To improve security, performance, and user experience.</li>
                                <li><strong>Consent:</strong> Where you explicitly provide authorization (e.g., third-party authentication).</li>
                                <li><strong>Legal Obligations:</strong> Where required by applicable laws or regulations.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>3. How We Use Your Information</h2>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li>Provide, operate, and maintain the Service.</li>
                                <li>Authenticate users and manage accounts.</li>
                                <li>Enable grant tracking, reporting, and collaboration.</li>
                                <li>Send service-related communications.</li>
                                <li>Improve functionality and performance.</li>
                                <li>Detect, prevent, and respond to security incidents.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>4. Data Sharing and Disclosure</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                We do not sell your personal data. We may share information only:
                            </p>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li>With trusted service providers necessary to operate the platform (e.g., cloud hosting, payment processing).</li>
                                <li>With your institution where required for grant administration.</li>
                                <li>When required by law or to protect legal rights and security.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>5. Data Retention</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                We retain personal data only for as long as necessary to provide the Service, fulfill contractual obligations, resolve disputes, enforce agreements, and comply with legal requirements. Upon account deletion, associated data will be securely removed or anonymized within a reasonable timeframe unless retention is legally required.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>6. Data Storage and Security</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                Data is stored using secure cloud infrastructure. We implement industry-standard safeguards including encryption in transit (TLS/SSL), encryption at rest, role-based access controls, and continuous monitoring.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>7. International Data Transfers</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                Your information may be processed in jurisdictions outside your country of residence. Where such transfers occur, we implement appropriate safeguards to ensure compliance with applicable data protection laws.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>8. Your Rights</h2>
                            <ul style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-6)', listStyleType: 'disc' }}>
                                <li>Access personal data we hold about you.</li>
                                <li>Request correction of inaccurate data.</li>
                                <li>Request deletion of your account and associated information.</li>
                                <li>Restrict or object to certain processing activities.</li>
                            </ul>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>9. Children's Privacy</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                The Service is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>10. Changes to This Privacy Policy</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                We may update this Privacy Policy from time to time. Significant changes will be communicated through the Service or via email. Continued use of the Service after updates constitutes acceptance of the revised policy.
                            </p>

                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>11. Contact Us</h2>
                            <p style={{ marginBottom: 'var(--space-6)' }}>
                                If you have questions or requests regarding this Privacy Policy:
                                <br /><br />
                                <strong>Kangaroo Systems Ltd.</strong><br />
                                Email: <a href="mailto:support@granto.app" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>support@granto.app</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer style={{ padding: 'var(--space-12) 0', borderTop: '1px solid var(--color-gray-100)', background: 'var(--color-white)' }}>
                <div className="container footer-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Logo size={32} showText={true} />
                        </Link>
                    </div>
                    <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', margin: 0 }}>
                            &copy; 2026 Kangaroo Systems Ltd. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
