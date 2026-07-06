import { useState } from "react";
import Composer from "./components/Composer";
import MessagesContainer from "./components/MessagesContainer";
import useChat from "./hooks/useChat";
import Sidebar from "./components/Sidebar";

function App() {
    const {
        messages,
        input,
        setInput,
        sendMessage,
        isLoading,
        error,
        retry,
        model,
        setModel,
        file,
        url,
        setUrl,
        handleFileSelect,
        handleIngestSubmit,
        ingestStatus,
    } = useChat();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-dvh bg-[var(--paper)] text-[var(--ink-text)]">
            <Sidebar
                file={file}
                url={url}
                onUrlChange={setUrl}
                handleFileSelect={handleFileSelect}
                handleIngestSubmit={handleIngestSubmit}
                ingestStatus={ingestStatus}
                collapsed={sidebarCollapsed}
                onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
            />

            <div className="flex flex-1 flex-col">
                <MessagesContainer
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                    retry={retry}
                />

                <Composer
                    value={input}
                    onChange={setInput}
                    onSend={sendMessage}
                    model={model}
                    onModelChange={setModel}
                    //isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default App