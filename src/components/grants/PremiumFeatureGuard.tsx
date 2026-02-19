import { Lock, Sparkles } from 'lucide-react'
import { isPremiumFeatureAllowed, getRestrictedFeatureMessage, type DepartmentSubscription } from '../../utils/subscription'
import Button from '../ui/Button'
import { useNavigate, Link } from 'react-router-dom'

interface PremiumFeatureGuardProps {
    department?: DepartmentSubscription & { $id?: string }
    featureName: string
    children: React.ReactNode
}

export default function PremiumFeatureGuard({ department, featureName, children }: PremiumFeatureGuardProps) {
    const navigate = useNavigate()
    const hasAccess = isPremiumFeatureAllowed(department)

    if (hasAccess) {
        return <>{children}</>
    }

    return (
        <div style={{ 
            position: 'relative', 
            minHeight: 'calc(100vh - 72px)', /* Full height minus navbar */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(249, 250, 251, 0.98)', /* Almost opaque frost */
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}>
            {/* Completely hidden content - not rendered */}
            <div style={{ display: 'none' }}>
                {children}
            </div>

            {/* Modal - centered */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: 'var(--space-8)'
            }}>
                <div className="card-neumorphic" style={{
                    maxWidth: '500px',
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                    background: 'white',
                    border: '2px solid var(--color-primary-light)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #E0E7FF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--space-6)',
                        position: 'relative'
                    }}>
                        <Lock size={36} style={{ color: 'var(--color-primary)' }} />
                        <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'var(--color-warning)',
                            borderRadius: 'var(--radius-full)',
                            padding: '6px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <Sparkles size={16} style={{ color: 'white' }} />
                        </div>
                    </div>

                    <h2 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 800,
                        marginBottom: 'var(--space-3)',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-violet) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Premium Feature
                    </h2>

                    <p style={{
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-gray-700)',
                        marginBottom: 'var(--space-6)',
                        lineHeight: 1.6
                    }}>
                        {getRestrictedFeatureMessage(featureName)}
                    </p>

                    {department?.$id && (
                        <Link 
                            to={`/department/${department.$id}`}
                            style={{
                                display: 'inline-block',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-primary)',
                                fontWeight: 600,
                                marginBottom: 'var(--space-6)',
                                textDecoration: 'underline'
                            }}
                        >
                            View subscription options →
                        </Link>
                    )}

                    <div style={{
                        background: 'var(--color-gray-50)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-6)',
                        marginBottom: 'var(--space-6)'
                    }}>
                        <p style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            color: 'var(--color-gray-700)',
                            marginBottom: 'var(--space-3)'
                        }}>
                            Standard Plan includes:
                        </p>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)',
                            textAlign: 'left'
                        }}>
                            {[
                                'Up to 5 Active Grants',
                                'Budget Tracking & Financial Reporting',
                                'Milestones & Deliverables Management',
                                'Full Personnel Management',
                                'Priority Support'
                            ].map((feature, idx) => (
                                <li key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-gray-600)'
                                }}>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: 'var(--radius-full)',
                                        background: '#D1FAE5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <span style={{ color: 'var(--color-success)', fontSize: '10px' }}>✓</span>
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        onClick={() => department?.$id && navigate(`/department/${department.$id}`)}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-violet) 100%)',
                            border: 'none',
                            padding: 'var(--space-4) var(--space-6)',
                            fontSize: 'var(--text-base)',
                            fontWeight: 700,
                            boxShadow: 'var(--shadow-lg)',
                            color: 'white'
                        }}
                    >
                        Upgrade to Standard Plan
                    </Button>

                    <p style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-gray-500)',
                        marginTop: 'var(--space-4)'
                    }}>
                        ₦15,000/month • Cancel anytime
                    </p>
                </div>
            </div>
        </div>
    )
}
