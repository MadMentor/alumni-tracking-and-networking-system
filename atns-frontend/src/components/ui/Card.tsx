import React from "react";

interface CardProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Card({ title, icon, children, footer }: CardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow w-full">
            {title && (
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    {icon}
                    {title}
                </h3>
            )}
            <div>{children}</div>
            {footer && <div className="mt-4">{footer}</div>}
        </div>
    );
}
