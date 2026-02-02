import { useState } from 'react'
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line
} from 'recharts'
import {
    TrendingUp,
    Calendar,
    Target,
    Activity,
    Zap,
    Award
} from 'lucide-react'

// Monthly spending data
const MONTHLY_SPENDING = [
    { month: 'Oct', spent: 0, projected: 18000, budget: 25000 },
    { month: 'Nov', spent: 0, projected: 15000, budget: 25000 },
    { month: 'Dec', spent: 5000, projected: 12000, budget: 25000 },
    { month: 'Jan', spent: 17300, projected: 22000, budget: 25000 },
    { month: 'Feb', spent: 0, projected: 28000, budget: 25000 },
    { month: 'Mar', spent: 0, projected: 35000, budget: 25000 },
]

// Category breakdown with more details
const CATEGORY_DATA = [
    { name: 'Personnel', value: 120000, color: '#6366f1', percentage: 48 },
    { name: 'Hardware', value: 85000, color: '#8b5cf6', percentage: 34 },
    { name: 'Computing', value: 25000, color: '#10b981', percentage: 10 },
    { name: 'Supplies', value: 15000, color: '#f59e0b', percentage: 6 },
    { name: 'Admin', value: 5000, color: '#6b7280', percentage: 2 },
]

// Performance metrics for radar chart
const PERFORMANCE_DATA = [
    { metric: 'Budget Utilization', value: 89, fullMark: 100 },
    { metric: 'Timeline Adherence', value: 95, fullMark: 100 },
    { metric: 'Cost Efficiency', value: 92, fullMark: 100 },
    { metric: 'Resource Allocation', value: 78, fullMark: 100 },
    { metric: 'ROI Projection', value: 85, fullMark: 100 },
]

// Quarterly comparison
const QUARTERLY_COMPARISON = [
    { quarter: 'Q3 2025', actual: 0, target: 50000, variance: -50000 },
    { quarter: 'Q4 2025', actual: 5000, target: 60000, variance: -55000 },
    { quarter: 'Q1 2026', actual: 17300, target: 70000, variance: -52700 },
    { quarter: 'Q2 2026', actual: 0, target: 70000, variance: -70000 },
]

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
                <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '12px' }}>{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color, fontSize: '11px', margin: '4px 0' }}>
                        {entry.name}: ${entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export default function FinanceCharts() {
    const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'performance' | 'forecast'>('overview')

    const totalBudget = 250000
    const totalSpent = 22300
    const projectedEndOfYear = 142000

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Header with KPIs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '4px' }}>
                        Finance Analytics Dashboard
                    </h2>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                        Advanced budget visualization and forecasting
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div className="card-neumorphic glass" style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={18} color="var(--color-primary)" />
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Health Score</div>
                                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-success)' }}>
                                    A+
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-neumorphic glass" style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={18} color="var(--color-warning)" />
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Efficiency</div>
                                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                                    92%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="card-neumorphic" style={{ padding: 'var(--space-2)', display: 'flex', gap: 'var(--space-2)' }}>
                {[
                    { id: 'overview', label: 'Spending Overview', icon: TrendingUp },
                    { id: 'categories', label: 'Category Breakdown', icon: Target },
                    { id: 'performance', label: 'Performance Metrics', icon: Award },
                    { id: 'forecast', label: 'Budget Forecast', icon: Calendar }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            flex: 1,
                            padding: 'var(--space-3) var(--space-4)',
                            background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--color-gray-600)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Chart Sections */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Monthly Spending Trend */}
                    <div className="card-neumorphic" style={{ gridColumn: 'span 8', padding: 'var(--space-6)' }}>
                        <div style={{ marginBottom: 'var(--space-6)' }}>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '4px' }}>
                                Monthly Spending Trend
                            </h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                                Actual vs. projected expenditure over time
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={MONTHLY_SPENDING}>
                                <defs>
                                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                                    iconType="circle"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="spent"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fill="url(#colorSpent)"
                                    name="Actual Spent"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="projected"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fill="url(#colorProjected)"
                                    name="Projected"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="budget"
                                    stroke="#ef4444"
                                    strokeWidth={1}
                                    fill="none"
                                    name="Budget Limit"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Stats */}
                    <div className="card-neumorphic glass" style={{ gridColumn: 'span 4', padding: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                            Spending Summary
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                                    Current Month (Jan)
                                </div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                                    $17,300
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                                    78.6% of monthly budget
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: '78.6%', height: '100%', background: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }} />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 'var(--space-4)' }}>
                                <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                                    Year to Date
                                </div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                                    $22,300
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                                    8.9% of total budget
                                </div>
                            </div>

                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <TrendingUp size={14} color="#10b981" />
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>ON TRACK</span>
                                </div>
                                <div style={{ fontSize: '10px', color: '#059669' }}>
                                    Spending pace is optimal for grant timeline
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Burn Rate Chart */}
                    <div className="card-neumorphic" style={{ gridColumn: 'span 12', padding: 'var(--space-6)' }}>
                        <div style={{ marginBottom: 'var(--space-6)' }}>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '4px' }}>
                                Quarterly Budget vs Actual
                            </h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                                Target allocation compared to actual spending
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={QUARTERLY_COMPARISON}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="quarter"
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Bar dataKey="target" fill="#d1d5db" name="Target Budget" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="actual" fill="#6366f1" name="Actual Spent" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Pie Chart */}
                    <div className="card-neumorphic" style={{ gridColumn: 'span 6', padding: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                            Budget Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={CATEGORY_DATA}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name} ${entry.percent}%`}
                                    outerRadius={120}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={2}
                                >
                                    {CATEGORY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div style={{
                                                    background: 'rgba(255, 255, 255, 0.98)',
                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                }}>
                                                    <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
                                                        {payload[0].name}
                                                    </p>
                                                    <p style={{ fontSize: '11px', color: '#6b7280' }}>
                                                        ${payload[0].value?.toLocaleString()}
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Details */}
                    <div className="card-neumorphic glass" style={{ gridColumn: 'span 6', padding: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                            Category Breakdown
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            {CATEGORY_DATA.map((cat, index) => (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '3px',
                                                background: cat.color
                                            }} />
                                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                                {cat.name}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                                                ${cat.value.toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>
                                                {cat.percentage}% of total
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '8px',
                                        background: 'var(--color-gray-100)',
                                        borderRadius: 'var(--radius-full)',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${cat.percentage}%`,
                                            height: '100%',
                                            background: cat.color,
                                            borderRadius: 'var(--radius-full)',
                                            transition: 'width 1s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            marginTop: 'var(--space-6)',
                            paddingTop: 'var(--space-6)',
                            borderTop: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Total Allocated</span>
                                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
                                    ${CATEGORY_DATA.reduce((sum, cat) => sum + cat.value, 0).toLocaleString()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                                    100% of grant budget
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'performance' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Radar Chart */}
                    <div className="card-neumorphic" style={{ padding: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                            Financial Health Radar
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <RadarChart data={PERFORMANCE_DATA}>
                                <PolarGrid stroke="rgba(0,0,0,0.1)" />
                                <PolarAngleAxis
                                    dataKey="metric"
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                />
                                <PolarRadiusAxis
                                    angle={90}
                                    domain={[0, 100]}
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                />
                                <Radar
                                    name="Performance"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.4}
                                    strokeWidth={2}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Performance Metrics */}
                    <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                            Key Performance Indicators
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            {PERFORMANCE_DATA.map((metric, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                            {metric.metric}
                                        </span>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: metric.value >= 85 ? 'var(--color-success)' : metric.value >= 70 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                                            {metric.value}%
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '10px',
                                        background: 'var(--color-gray-100)',
                                        borderRadius: 'var(--radius-full)',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${metric.value}%`,
                                            height: '100%',
                                            background: metric.value >= 85 ? 'var(--color-success)' : metric.value >= 70 ? 'var(--color-warning)' : 'var(--color-error)',
                                            borderRadius: 'var(--radius-full)',
                                            transition: 'width 1s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            marginTop: 'var(--space-8)',
                            padding: 'var(--space-5)',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'white'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', padding: 'var(--space-2)' }}>
                                <Award size={24} />
                                <div>
                                    <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>
                                        Overall Score
                                    </div>
                                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                                        87.8%
                                    </div>
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', opacity: 0.9}}>
                                Excellent financial management. Grant execution is proceeding optimally.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'forecast' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Forecast Line Chart */}
                    <div className="card-neumorphic" style={{ gridColumn: 'span 12', padding: 'var(--space-6)' }}>
                        <div style={{ marginBottom: 'var(--space-6)' }}>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '4px' }}>
                                12-Month Budget Forecast
                            </h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                                Projected spending trajectory with confidence intervals
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={[
                                    { month: 'Jan', actual: 17300, forecast: 17300, upper: 20000, lower: 15000 },
                                    { month: 'Feb', actual: null, forecast: 39300, upper: 45000, lower: 35000 },
                                    { month: 'Mar', actual: null, forecast: 74300, upper: 82000, lower: 68000 },
                                    { month: 'Apr', actual: null, forecast: 99300, upper: 110000, lower: 90000 },
                                    { month: 'May', actual: null, forecast: 124300, upper: 138000, lower: 112000 },
                                    { month: 'Jun', actual: null, forecast: 149300, upper: 166000, lower: 134000 },
                                    { month: 'Jul', actual: null, forecast: 174300, upper: 194000, lower: 156000 },
                                    { month: 'Aug', actual: null, forecast: 199300, upper: 222000, lower: 178000 },
                                    { month: 'Sep', actual: null, forecast: 224300, upper: 245000, lower: 205000 },
                                    { month: 'Oct', actual: null, forecast: 237300, upper: 250000, lower: 225000 },
                                    { month: 'Nov', actual: null, forecast: 243800, upper: 250000, lower: 235000 },
                                    { month: 'Dec', actual: null, forecast: 250000, upper: 250000, lower: 240000 },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Line
                                    type="monotone"
                                    dataKey="upper"
                                    stroke="#d1d5db"
                                    strokeWidth={1}
                                    strokeDasharray="3 3"
                                    dot={false}
                                    name="Upper Bound"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="lower"
                                    stroke="#d1d5db"
                                    strokeWidth={1}
                                    strokeDasharray="3 3"
                                    dot={false}
                                    name="Lower Bound"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="forecast"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', r: 4 }}
                                    name="Forecast"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ fill: '#6366f1', r: 5 }}
                                    name="Actual"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Forecast Summary Cards */}
                    <div className="card-neumorphic glass" style={{ gridColumn: 'span 4', padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                            End of Year Projection
                        </h4>
                        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                            $250,000
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-6)' }}>
                            Expected completion: Dec 2026
                        </div>
                        <div style={{ fontSize: '11px', padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                            Based on current spending patterns and planned allocations
                        </div>
                    </div>

                    <div className="card-neumorphic glass" style={{ gridColumn: 'span 4', padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                            Confidence Level
                        </h4>
                        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-success)', marginBottom: '8px' }}>
                            94%
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-6)' }}>
                            High confidence in projection accuracy
                        </div>
                        <div style={{ fontSize: '11px', padding: 'var(--space-4)', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: '#059669' }}>
                            Stable spending patterns detected
                        </div>
                    </div>

                    <div className="card-neumorphic glass" style={{ gridColumn: 'span 4', padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                            Risk Assessment
                        </h4>
                        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-success)', marginBottom: '8px' }}>
                            Low
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-6)' }}>
                            Minimal probability of overrun
                        </div>
                        <div style={{ fontSize: '11px', padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                            All major expenses accounted for
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
