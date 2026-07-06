import { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    SidebarLeftIcon,
    CloudUploadIcon,
    Pdf01Icon,
    Link01Icon,
    Delete02Icon,
} from "@hugeicons/core-free-icons";

interface SidebarProps {
    file: File | null;
    url: string;
    onUrlChange: (nextUrl: string) => void;
    handleFileSelect: (nextFile: File | null) => void;
    handleIngestSubmit: () => void;
    ingestStatus: string | null;
    collapsed: boolean;
    onToggleCollapsed: () => void;
}

export default function Sidebar({
    file,
    url,
    onUrlChange,
    handleFileSelect,
    handleIngestSubmit,
    ingestStatus,
    collapsed,
    onToggleCollapsed,
}: SidebarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isIngesting = ingestStatus === "Ingesting...";
    const isSuccess = ingestStatus === "Ingestion successful";
    const isFailure = ingestStatus === "Ingestion failed";

    const statusColor = isSuccess
        ? "text-emerald-600"
        : isFailure
        ? "text-red-400"
        : "text-[var(--gold)]";

    return (
        <div
            className={`relative flex flex-col shrink-0 bg-[var(--ink)] text-[#e9e6da] transition-[width] duration-300 ease-in-out ${
                collapsed ? "w-16" : "w-72"
            }`}
        >
            {/* Toggle */}
            <div className={`flex items-center px-4 pt-5 pb-2 ${collapsed ? "justify-center" : "justify-between"}`}>
                {!collapsed && (
                    <span className="font-display text-[15px] tracking-wide text-[#f3efe3]">
                        Archive
                    </span>
                )}
                <button
                    onClick={onToggleCollapsed}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="rounded-md p-1.5 text-[#c8c3b3] transition-colors hover:bg-[var(--ink-soft)] hover:text-[var(--gold-soft)] cursor-pointer"
                >
                    <HugeiconsIcon icon={SidebarLeftIcon} size={18} />
                </button>
            </div>

            {collapsed ? (
                /* Collapsed rail: just an icon affordance to reopen + add knowledge */
                <button
                    onClick={onToggleCollapsed}
                    className="mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-[var(--ink-line)] text-[#c8c3b3] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-soft)] cursor-pointer"
                    aria-label="Add knowledge"
                >
                    <HugeiconsIcon icon={CloudUploadIcon} size={18} />
                </button>
            ) : (
                <div className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-2 overflow-y-auto">
                    <div>
                        <h2 className="font-display text-xl text-[#f3efe3]">Add Knowledge</h2>
                        <p className="mt-1 text-[13px] leading-5 text-[#9a9686]">
                            Ground responses in a PDF or a page from the web.
                        </p>
                    </div>

                    {/* Upload */}
                    <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--ink-line)] bg-[var(--ink-soft)]/60 px-4 py-6 text-center transition-colors hover:border-[var(--gold)]">
                        <HugeiconsIcon
                            icon={CloudUploadIcon}
                            size={22}
                            className="text-[#a79f86] transition-colors group-hover:text-[var(--gold-soft)]"
                        />
                        <span className="text-sm font-medium text-[#e9e6da]">
                            Click to upload PDF
                        </span>
                        <span className="text-xs text-[#83806f]">or drag a file here</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(event) => {
                                const selectedFile = event.target.files?.[0] || null;
                                handleFileSelect(selectedFile);
                            }}
                        />
                    </label>

                    {file && (
                        <div className="flex items-center gap-2 rounded-lg bg-[var(--ink-soft)] px-3 py-2 text-sm">
                            <HugeiconsIcon icon={Pdf01Icon} size={16} className="shrink-0 text-[var(--gold-soft)]" />
                            <span className="flex-1 truncate text-[#e9e6da]">{file.name}</span>
                            <button
                                onClick={() => {
                                    handleFileSelect(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                aria-label="Remove file"
                                className="shrink-0 text-[#83806f] hover:text-red-400 cursor-pointer"
                            >
                                <HugeiconsIcon icon={Delete02Icon} size={14} />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#63604f]">
                        <span className="h-px flex-1 bg-[var(--ink-line)]" />
                        or
                        <span className="h-px flex-1 bg-[var(--ink-line)]" />
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-2 rounded-lg border border-[var(--ink-line)] bg-[var(--ink-soft)]/60 px-3 py-2 focus-within:border-[var(--gold)]">
                        <HugeiconsIcon icon={Link01Icon} size={16} className="shrink-0 text-[#83806f]" />
                        <input
                            type="url"
                            placeholder="Paste a URL"
                            value={url}
                            onChange={(event) => onUrlChange(event.target.value)}
                            className="w-full bg-transparent text-sm text-[#e9e6da] placeholder:text-[#6b6858] outline-none"
                        />
                    </div>

                    <button
                        onClick={handleIngestSubmit}
                        disabled={isIngesting}
                        className="mt-1 w-full cursor-pointer rounded-lg bg-[var(--gold)] py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--gold-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isIngesting ? "Ingesting…" : "Ingest"}
                    </button>

                    <p className="text-center text-xs text-[#6b6858]">
                        Provide a PDF, a URL, or both.
                    </p>

                    {ingestStatus && (
                        <p className={`text-center text-sm font-medium ${statusColor}`}>{ingestStatus}</p>
                    )}
                </div>
            )}
        </div>
    );
}