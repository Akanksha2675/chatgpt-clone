import type { Message } from "../types";
import { useEffect } from "react";
import markdownit from "markdown-it";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

const md = markdownit();

interface MessagesContainerProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    retry: () => void;
}

export default function MessagesContainer({ messages, isLoading, error, retry }: MessagesContainerProps) {
    useEffect(() => {
        const messagesEnd = document.getElementById("messages-end");
        if (messagesEnd) {
            messagesEnd.scrollIntoView(true);
        }
    });

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            {messages.length === 0 ? (
                <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--paper-card)] shadow-sm ring-1 ring-[var(--paper-line)]">
                        <HugeiconsIcon icon={BookOpen01Icon} size={22} className="text-[var(--gold)]" />
                    </div>
                    <h1 className="font-display text-3xl text-[var(--ink)]">
                        What can I help you with?
                    </h1>
                    <p className="max-w-sm text-sm text-[var(--muted-text)]">
                        Add a PDF or a link on the left, then ask away — I'll ground my answers in what you give me.
                    </p>
                </div>
            ) : (
                <div className="mx-auto flex max-w-2xl flex-col gap-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`msg-in flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-6 ${
                                    message.role === "user"
                                        ? "bg-[var(--ink)] text-[#f3efe3] rounded-br-sm"
                                        : "bg-[var(--paper-card)] text-[var(--ink-text)] ring-1 ring-[var(--paper-line)] rounded-bl-sm"
                                }`}
                            >
                                <div
                                    className="prose-chat"
                                    dangerouslySetInnerHTML={{ __html: md.render(message.content) }}
                                />
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="msg-in flex justify-start">
                            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-[var(--paper-card)] px-4 py-3.5 ring-1 ring-[var(--paper-line)]">
                                <span className="typing-dot h-2 w-2 rounded-full" />
                                <span className="typing-dot h-2 w-2 rounded-full" />
                                <span className="typing-dot h-2 w-2 rounded-full" />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--error-bg)] px-4 py-3">
                            <span className="text-sm text-[var(--error)]">{error}</span>
                            <button
                                onClick={retry}
                                className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-[#f3efe3] transition-colors hover:bg-[var(--ink-soft)] cursor-pointer"
                            >
                                <HugeiconsIcon icon={RefreshIcon} size={13} />
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div id="messages-end" />
        </div>
    );
}