import { useRef, useState } from "react";
import { ArrowUp01Icon, ChevronDownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ComposerProps {
    value: string;
    onChange: (content: string) => void;
    onSend: (content: string) => void;
    model: string;
    onModelChange: (model: string) => void;
}

const MODELS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "openai/gpt-oss-120b"];

export default function Composer({ value, onChange, onSend, model, onModelChange }: ComposerProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [modelOpen, setModelOpen] = useState(false);

    const resize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    };

    const handleSend = () => {
        if (value.trim() === "") return;
        onSend(value);
        requestAnimationFrame(() => {
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        });
    };

    return (
        <div className="mx-4 mb-6 sm:mx-8">
            <div className="mx-auto flex max-w-2xl flex-col gap-2 rounded-3xl bg-[var(--paper-card)] p-3 shadow-[0_2px_16px_rgba(27,33,48,0.08)] ring-1 ring-[var(--paper-line)]">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        resize();
                    }}
                    placeholder="Type your message..."
                    rows={1}
                    className="composer-textarea w-full bg-transparent px-2 pt-1 text-[15px] leading-6 text-[var(--ink-text)] outline-none placeholder:text-[var(--muted-text)]"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                <div className="flex items-center justify-between px-1">
                    {/* custom model dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setModelOpen((o) => !o)}
                            className="font-mono flex items-center gap-1.5 rounded-full bg-[var(--paper)] px-3 py-1.5 text-xs text-[var(--muted-text)] ring-1 ring-[var(--paper-line)] transition-colors hover:text-[var(--ink-text)] cursor-pointer"
                        >
                            {model}
                            <HugeiconsIcon icon={ChevronDownIcon} size={13} />
                        </button>

                        {modelOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setModelOpen(false)}
                                />
                                <div className="absolute bottom-full left-0 z-20 mb-2 w-56 overflow-hidden rounded-xl bg-[var(--ink)] py-1 shadow-lg">
                                    {MODELS.map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                onModelChange(m);
                                                setModelOpen(false);
                                            }}
                                            className={`font-mono block w-full px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                                                m === model
                                                    ? "bg-[var(--ink-soft)] text-[var(--gold-soft)]"
                                                    : "text-[#c8c3b3] hover:bg-[var(--ink-soft)]"
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        disabled={value.trim() === ""}
                        onClick={handleSend}
                        aria-label="Send message"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--ink)] transition-all hover:bg-[var(--gold-hover)] disabled:cursor-not-allowed disabled:bg-[var(--paper-line)] disabled:text-[var(--muted-text)] cursor-pointer"
                    >
                        <HugeiconsIcon icon={ArrowUp01Icon} size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}