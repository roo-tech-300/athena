interface SidebarItemProps {
    icon: any
    label: string
    isActive: boolean
    onClick: () => void
    isCollapsed: boolean
}


export const SidebarItem = ({ icon: Icon, label, isActive, onClick, isCollapsed }: SidebarItemProps) => (
    <button
        onClick={onClick}
        title={isCollapsed ? label : undefined}
        style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: isCollapsed ? '0' : 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: isActive ? 'var(--color-primary-light)' : 'transparent',
            color: isActive ? 'var(--color-primary)' : 'var(--color-gray-500)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: 'var(--space-1)',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            overflow: 'hidden'
        }}
    >
        <div style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}>
            <Icon size={20} />
        </div>
        {!isCollapsed && (
            <span style={{
                fontWeight: isActive ? 600 : 500,
                fontSize: 'var(--text-sm)',
                whiteSpace: 'nowrap',
                opacity: 1,
                transition: 'opacity 0.2s ease'
            }}>
                {label}
            </span>
        )}
    </button>
)