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
        handleFileIngestion,
        ingestStatus,
    } = useChat();

  return (
    <div className="flex h-dvh bg-slate-200 text-slate-90">
      <Sidebar file={file} handleFileIngestion={handleFileIngestion} ingestStatus={ingestStatus} />

      <div className="flex flex-col flex-1 h-full overflow-hidden"> 
        <MessagesContainer messages={messages} isLoading={isLoading} error={error} retry={retry} />
        <Composer value={input} onChange={setInput} onSend={sendMessage} model={model} onModelChange={setModel} />
      </div>
    </div>
  )
}

export default App
