import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    children: ReactNode
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]'

    // Since we might not have tailwind fully functional yet, I'll use a mix of class names 
    // and inline styles or just rely on the CSS classes I'll define in a component-specific CSS file
    // or add them to globals.css. 
    // For now, I'll define the classes in globals.css for simplicity as per the design system.

    const variantStyles = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
    }

    const sizeStyles = {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
    }

    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    )
}
