interface CardProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export default function Card({ title, icon, children, footer, className = "" }: CardProps) {
    return (
        <div className={`card ${className}`}>
            {title && (
                <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        {icon && (
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                {icon}
                            </div>
                        )}
                        {title}
                    </h3>
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
}
