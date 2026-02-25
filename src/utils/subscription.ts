export interface DepartmentSubscription {
    $id?: string
    name?: string
    plan?: 'Free' | 'Standard'
    subscriptionStatus?: 'Active' | 'Inactive'
}

/**
 * Check if a department has access to premium features
 * Premium features require a Standard plan with Active subscription
 */
export function isPremiumFeatureAllowed(department?: DepartmentSubscription): boolean {
    if (!department) return false

    const status = department.subscriptionStatus || 'Inactive'

    // Premium features are only blocked if status is 'Inactive'
    return status !== 'Inactive'
}

/**
 * Get the message to display for restricted features
 */
export function getRestrictedFeatureMessage(featureName: string): string {
    return `${featureName} is a premium feature. Upgrade to the Standard Plan to unlock this feature.`
}

/**
 * List of premium features that require Standard plan
 */
export const PREMIUM_FEATURES = [
    'Budget tracker',
    'Milestones',
    'Deliverables',
    'Documents'
] as const

export type PremiumFeatureName = typeof PREMIUM_FEATURES[number]

/**
 * Check if a specific feature is premium
 */
export function isPremiumFeature(featureName: string): boolean {
    return (PREMIUM_FEATURES as readonly string[]).includes(featureName)
}
