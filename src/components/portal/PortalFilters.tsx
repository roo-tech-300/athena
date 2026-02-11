import React, { useState, useRef, useEffect } from 'react'
import { Search, Filter, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'

interface PortalFiltersProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    filterStatus: string
    setFilterStatus: (status: string) => void
    onJoin: () => void
    onCreate: () => void
}

const PortalFilters: React.FC<PortalFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    onJoin,
    onCreate
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const filterRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-10)', alignItems: 'center' }}>
            {/* Pill Search Bar */}
            <div style={{ position: 'relative', flex: 1 }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} size={18} />
                <input
                    type="text"
                    placeholder="Search by title, department or grant type..."
                    style={{
                        width: '100%',
                        padding: '14px 24px 14px 52px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: 'white',
                        fontSize: 'var(--text-sm)',
                        boxShadow: 'var(--shadow-sm)',
                        outline: 'none',
                        transition: 'all 0.2s'
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-pill"
                />
            </div>

            {/* Pill Filter Dropdown */}
            <div style={{ position: 'relative' }} ref={filterRef}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-full)',
                        background: filterStatus !== 'All' ? 'var(--color-primary)' : 'white',
                        color: filterStatus !== 'All' ? 'white' : 'var(--color-gray-700)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Filter size={16} />
                    <span>{filterStatus === 'All' ? 'Filter' : filterStatus}</span>
                    <ChevronDown size={14} style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>

                {isFilterOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        width: '180px',
                        background: 'white',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        padding: 'var(--space-2)',
                        zIndex: 100,
                        border: '1px solid rgba(0,0,0,0.05)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        {['All', 'Accepted', 'Pending'].map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilterStatus(status)
                                    setIsFilterOpen(false)
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 16px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: filterStatus === status ? 'var(--color-primary-light)' : 'transparent',
                                    color: filterStatus === status ? 'var(--color-primary)' : 'var(--color-gray-600)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button variant="outline" size="md" onClick={onJoin} style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }}>Join Grant</Button>
                <Button variant="primary" size="md" onClick={onCreate} style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }}>+ Create Grant</Button>
            </div>
        </div>
    )
}

export default PortalFilters
