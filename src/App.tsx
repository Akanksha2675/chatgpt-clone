import Composer from "./components/Composer";
import MessagesContainer from "./components/MessagesContainer";
import useChat from "./hooks/useChat";

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
        setModel
    } = useChat();

  return (
    <div className="flex h-dvh flex-col bg-emerald-100 text-slate-90">
      <MessagesContainer messages={messages} isLoading={isLoading} error={error} retry={retry} />
      <Composer value={input} onChange={setInput} onSend={sendMessage} model={model} onModelChange={setModel} />
    </div>
  )
}

export default App
