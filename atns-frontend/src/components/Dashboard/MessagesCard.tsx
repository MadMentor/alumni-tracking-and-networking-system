// @ts-ignore
import React from "react";

interface Message {
    id: number;
    from: string;
    preview: string;
}

interface Props {
    newMessages: number;
    recentMessages: Message[];
}

export default function MessagesCard({ newMessages, recentMessages }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Messages</h3>
            <p>New Messages: <strong>{newMessages}</strong></p>
            <ul>
                {recentMessages.map(msg => (
                    <li key={msg.id} className="border-b py-1">
                        <strong>{msg.from}</strong>: {msg.preview}
                    </li>
                ))}
            </ul>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Go to Inbox
            </button>
        </div>
    );
}
