import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Building2,
    ArrowLeft,
    Layers,
    TrendingUp,
    CreditCard,
    Info,
    CheckCircle2,
    Clock,
    DollarSign,
    ShieldCheck,
    Check
} from 'lucide-react'
import Navbar from '../../../components/layout/Navbar'
import Button from '../../../components/ui/Button'
import Loader from '../../../components/ui/Loader'
import Modal from '../../../components/ui/Modal'
import StatCard from '../../../components/portal/StatCard'
import GrantCard from '../../../components/portal/GrantCard'
import { useDepartment, useUpdateDepartment } from '../../../hooks/useDepartments'
import { useDepartmentGrants } from '../../../hooks/useGrants'
import { toast } from 'react-toastify'
import { useAuth } from '../../../useContext/context'
import { initializeSubscription, verifyTransaction } from '../../../lib/paystack/subscriptions'
import { SUBSCRIPTION_PLANS } from '../../../constants/plans'

export default function DeptPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'grants' | 'financials'>('grants')
    const [initializing, setInitializing] = useState(false)
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)

    const { data: dept, isLoading: deptLoading } = useDepartment(id!)
    const { data: grants = [], isLoading: grantsLoading } = useDepartmentGrants(id!)
    const { mutateAsync: updateDept, isPending: updating } = useUpdateDepartment()
    const { user } = useAuth()

    const currentStatus = dept?.subscriptionStatus || 'Inactive'
    const currentPlan = dept?.plan || 'Free'

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const reference = query.get('reference');

        if (reference && (currentStatus === 'Inactive' || currentPlan === 'Free')) {
            const checkPayment = async () => {
                try {
                    const data = await verifyTransaction(reference);
                    if (data.status === 'success') {
                        await updateDept({
                            deptId: id!,
                            data: {
                                subscriptionStatus: 'Active',
                                plan: 'Standard'
                            }
                        });
                        toast.success("Payment verified! Subscription activated.");
                        // Clean up URL
                        navigate(`/department/${id}`, { replace: true });
                    }
                } catch (error) {
                    console.error("Verification error:", error);
                    toast.error("Could not verify payment status.");
                }
            };
            checkPayment();
        }
    }, [id, currentStatus, currentPlan, updateDept, navigate]);

    if (deptLoading || grantsLoading) {
        return <Loader fullPage label="Retrieving institutional records..." />
    }

    if (!dept) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <h2>Department not found</h2>
                <Button onClick={() => navigate('/portal')}>Back to Portal</Button>
            </div>
        )
    }

    const plan = dept.plan || 'Free'
    const status = dept.subscriptionStatus || 'Inactive'
    const limit = plan === 'Free' ? 1 : 5
    const isInactive = status === 'Inactive' || plan === 'Free'


    const handleActivateSubscription = async () => {
        if (!user?.email) {
            toast.error("User email not found. Please log in again.");
            return;
        }

        try {
            setInitializing(true);
            const planCode = import.meta.env.VITE_PAYSTACK_PLAN_ID_STANDARD;
            if (!planCode) {
                toast.error("Subscription plan not configured.");
                setInitializing(false);
                return;
            }

            const data = await initializeSubscription(user.email, planCode);

            // Redirect to Paystack's secure payment page
            if (data?.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error("Failed to generate payment link");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to initialize payment");
            setInitializing(false);
        }
    }

    const totalFunding = grants.reduce((acc: number, g: any) => acc + (g.expectedFunding || 0), 0)
    const activeGrants = grants.filter((g: any) => g.status === 'Accepted').length

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
            <Navbar />

            <div style={{ paddingTop: '100px', paddingBottom: 'var(--space-20)' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-10)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <button
                                onClick={() => navigate('/portal')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-primary)',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: 'var(--text-sm)'
                                }}
                            >
                                <ArrowLeft size={16} /> Back to Portal
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: 'var(--radius-2xl)',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-primary)',
                                    boxShadow: 'var(--shadow-lg)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <Building2 size={40} />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '4px' }}>{dept.name}</h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', fontWeight: 600 }}>ID: {dept.$id}</span>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-gray-300)' }} />
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: 800,
                                            color: 'var(--color-success)',
                                            background: 'var(--color-success-light)',
                                            padding: '2px 8px',
                                            borderRadius: 'var(--radius-full)',
                                            textTransform: 'uppercase'
                                        }}>Verified Institution</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 'var(--space-6)',
                        marginBottom: 'var(--space-12)',
                        marginTop: 'var(--space-6)'
                    }}>
                        <StatCard label="Total Grants" value={grants.length} icon={Layers} color="var(--color-primary)" />
                        <StatCard label="Active Portfolio" value={activeGrants} icon={CheckCircle2} color="var(--color-success)" />
                        <StatCard label="Total Funding" value={`₦${totalFunding.toLocaleString()}`} icon={TrendingUp} color="var(--color-accent-indigo)" />
                    </div>

                    {/* Navigation Tabs */}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-1)',
                        background: 'rgba(0,0,0,0.03)',
                        padding: '4px',
                        borderRadius: 'var(--radius-xl)',
                        width: 'fit-content',
                        marginBottom: 'var(--space-8)'
                    }}>
                        <button
                            onClick={() => setActiveTab('grants')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 'var(--radius-lg)',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: 'var(--text-sm)',
                                cursor: 'pointer',
                                background: activeTab === 'grants' ? 'white' : 'transparent',
                                color: activeTab === 'grants' ? 'var(--color-primary)' : 'var(--color-gray-500)',
                                boxShadow: activeTab === 'grants' ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            Grants Portfolio
                        </button>
                        <button
                            onClick={() => setActiveTab('financials')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 'var(--radius-lg)',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: 'var(--text-sm)',
                                cursor: 'pointer',
                                background: activeTab === 'financials' ? 'white' : 'transparent',
                                color: activeTab === 'financials' ? 'var(--color-primary)' : 'var(--color-gray-500)',
                                boxShadow: activeTab === 'financials' ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            Payment & Financials
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                        {activeTab === 'grants' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                {grants.length >= limit && (
                                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                        <Info size={18} />
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>You've reached your {plan} plan limit of {limit} grants. Upgrade to Standard for more.</span>
                                        <Button variant="primary" size="sm" style={{ marginLeft: 'auto' }} onClick={() => setActiveTab('financials')}>Upgrade Now</Button>
                                    </div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
                                    {grants.length === 0 ? (
                                        <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: 'var(--space-20)', background: 'white', borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <h3 style={{ color: 'var(--color-gray-400)' }}>No grants recorded for this department.</h3>
                                        </div>
                                    ) : grants.map((g: any) => (
                                        <GrantCard
                                            key={g.$id}
                                            grant={{
                                                id: g.$id,
                                                title: g.name,
                                                status: g.status || 'Accepted',
                                                type: g.type,
                                                role: 'Member', // Internal view
                                                deadline: '2026-12-31',
                                                completion: g.completion || 0,
                                                description: g.description,
                                                expectedFunding: g.expectedFunding,
                                                departmentName: dept.name
                                            }}
                                            onDetails={() => { }}
                                            onWorkspace={(id) => navigate(`/grant/${id}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-8)' }}>

                                {/* Subscription Management Card */}
                                <div className="card-neumorphic" style={{ padding: 'var(--space-8)', position: 'relative' }}>
                                    {isInactive && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(255,255,255,0.7)',
                                            backdropFilter: 'blur(4px)',
                                            zIndex: 5,
                                            borderRadius: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            gap: 'var(--space-6)',
                                            padding: 'var(--space-10)',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
                                                <DollarSign size={32} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '8px' }}>Subscription Inactive</h3>
                                                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', maxWidth: '300px' }}>Your department access is currently limited. Pay for the Standard plan to unlock 5 grants and full governance features.</p>
                                            </div>
                                            <Button variant="primary" size="lg" onClick={() => setIsPlanModalOpen(true)} disabled={initializing || updating}>
                                                {initializing || updating ? <Loader /> : 'Pay & Activate Monthly Access'}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Plan Selection Modal */}
                                    <Modal
                                        isOpen={isPlanModalOpen}
                                        onClose={() => setIsPlanModalOpen(false)}
                                        title="Choose a Subscription Plan"
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                                                Select the best plan for your institution to manage grants and enforce governance.
                                            </p>

                                            {SUBSCRIPTION_PLANS.map(plan => (
                                                <div
                                                    key={plan.id}
                                                    style={{
                                                        border: '2px solid var(--color-primary)',
                                                        borderRadius: 'var(--radius-xl)',
                                                        padding: 'var(--space-6)',
                                                        background: 'var(--color-primary-light)',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        background: 'var(--color-primary)',
                                                        color: 'white',
                                                        padding: '4px 12px',
                                                        fontSize: '10px',
                                                        fontWeight: 800,
                                                        borderBottomLeftRadius: 'var(--radius-lg)'
                                                    }}>
                                                        RECOMMENDED
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                                        <div>
                                                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{plan.name}</h3>
                                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700 }}>{plan.grantLimit} Grants Allowance</p>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900 }}>{plan.currency}{plan.price.toLocaleString()}</div>
                                                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)' }}>per month</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--space-8)' }}>
                                                        {plan.features.map((feature, i) => (
                                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                                                                <Check size={16} color="var(--color-success)" strokeWidth={3} />
                                                                {feature}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        variant="primary"
                                                        style={{ width: '100%' }}
                                                        onClick={handleActivateSubscription}
                                                        disabled={initializing || updating}
                                                    >
                                                        {initializing ? <Loader size="sm" /> : `Subscribe to ${plan.name}`}
                                                    </Button>
                                                </div>
                                            ))}

                                            <p style={{ fontSize: '10px', color: 'var(--color-gray-400)', textAlign: 'center' }}>
                                                Payments are securely processed by Paystack. You can cancel your subscription at any time from this dashboard.
                                            </p>
                                        </div>
                                    </Modal>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ShieldCheck size={20} />
                                        </div>
                                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Subscription Management</h2>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                                        <div>
                                            <label style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Current Plan</label>
                                            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginTop: '4px' }}>{plan} Plan</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Billing Cycle</label>
                                            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginTop: '4px' }}>Monthly</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Grants Allowance</label>
                                            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginTop: '4px', letterSpacing: '0.1em' }}>{grants.length} / {limit}</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Status</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isInactive ? 'var(--color-error)' : 'var(--color-success)' }} />
                                                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                        <Info size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>
                                            {plan === 'Free' ? "You are currently on the Free plan. Standard members get up to 5 grants and prioritized institutional support." : "Your Standard subscription is active. You have full access to management tools."}
                                        </p>
                                    </div>

                                    <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-4)' }}>
                                        <Button variant="primary" onClick={() => toast.info("Upgrade coming soon")}>Upgrade Seats</Button>
                                        <Button variant="outline">View Invoices</Button>
                                    </div>
                                </div>

                                {/* Billing Status Card */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                    <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)' }}>
                                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={16} color="var(--color-warning)" /> Next Billing Date
                                        </h3>
                                        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '2px' }}>{isInactive ? 'N/A' : 'March 15, 2026'}</div>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Estimated Amount: {plan === 'Free' ? '₦0' : '₦45,000'}</p>

                                        <div style={{ marginTop: 'var(--space-6)', height: '4px', background: 'var(--color-gray-100)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: isInactive ? '0%' : '35%', height: '100%', background: 'var(--color-success)' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-400)' }}>
                                            <span>Current Cycle</span>
                                            <span>{isInactive ? '0%' : '35%'} Complete</span>
                                        </div>
                                    </div>

                                    <div className="card-neumorphic" style={{ padding: 'var(--space-6)', opacity: isInactive ? 0.5 : 1 }}>
                                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <DollarSign size={16} color="var(--color-success)" /> Payment Method
                                        </h3>
                                        {isInactive ? (
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>No payment method on file</p>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                                                    <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <CreditCard size={24} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Visa •••• 4242</p>
                                                        <p style={{ fontSize: '10px', color: 'var(--color-gray-500)' }}>Expires 12/28</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-primary)', fontWeight: 700 }}>Update Payment Method</Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
