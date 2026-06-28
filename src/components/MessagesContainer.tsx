import type { Message } from "../types";
import { useEffect } from "react";
import markdownit from 'markdown-it'
const md = markdownit()

interface MessagesContainerProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    retry: () => void;
}

export default function MessagesContainer( { messages, isLoading, error, retry }: MessagesContainerProps ) {

    useEffect(() => {
        const messagesEnd = document.getElementById("messages-end");
        if (messagesEnd) {
            messagesEnd.scrollIntoView(true);
        }
    })

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
                <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
                    What can i help you with?
                </div>
            ) : <div className="flex flex-col gap-4">
                {
                    messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-emerald-700 text-white rounded-full" : "text-slate-800 rounded-2xl"}`}>
                                <div
                                    dangerouslySetInnerHTML={{ __html: md.render(message.content)}}
                                  />
                                
                            </div>
                        </div>
                    ))
                }
                </div>
            }

            {isLoading && (
                <div className="flex justify-start p-4 gap-1 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
            )}
            
            {error && (
                <div className="flex items-center justify-between rounded-full max-w-[60%] p-2 bg-white ">
                    <div className="text-red-700 px-4 py-2">
                        {error}
                    </div>
                    <button 
                        onClick={retry} 
                        className="ml-2 bg-black text-white px-4 py-2 rounded-full"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div id="messages-end" />
        </div>
    )
}