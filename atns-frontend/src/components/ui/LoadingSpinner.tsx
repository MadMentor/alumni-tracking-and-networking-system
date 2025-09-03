interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white' | 'gray';
    text?: string;
}

export default function LoadingSpinner({ 
    size = 'md', 
    color = 'primary',
    text 
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colorClasses = {
        primary: 'border-blue-200 border-t-blue-600',
        white: 'border-white/30 border-t-white',
        gray: 'border-gray-200 border-t-gray-600'
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div 
                className={`${sizeClasses[size]} border-2 rounded-full animate-spin ${colorClasses[color]}`}
                role="status"
                aria-label="Loading"
            />
            {text && (
                <p className="mt-2 text-sm text-gray-600">{text}</p>
            )}
        </div>
    );
} 