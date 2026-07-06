import { useState } from "react";
import type { Message } from "../types";
import { getChatResponse, getChatStreamResponse } from "../api/chat";

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [file, setFile] = useState<File | null>(null);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  // Selecting a file (or typing a URL) just updates local state now;
  // the actual request goes out via handleIngestSubmit so both inputs
  // can be sent together.
  const handleFileSelect = (nextFile: File | null) => {
    setFile(nextFile);
    setIngestStatus(null);
  };

  const handleIngestSubmit = async () => {
    const trimmedUrl = url.trim();

    if (!file && !trimmedUrl) {
      setIngestStatus("Provide a PDF, a URL, or both.");
      return;
    }

    try {
      const formData = new FormData();
      if (file) formData.append('pdf-file', file);
      if (trimmedUrl) formData.append('url', trimmedUrl);

      setIngestStatus("Ingesting...");

      const response = await fetch('http://localhost:3000/documents/ingest', {
        method: 'POST',
        body: formData,
      })

      
      if (!response.ok) {
        throw new Error(`Failed to ingest: ${response.statusText}`);
      }

      setIngestStatus("Ingestion successful")

    } catch (error) {
      console.log("Error ingesting content:", error);
      setIngestStatus("Ingestion failed");
    }

  }

  const sendMessage = async () => {
    try {
      // create the userMessage
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
      };

      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);

      setInput("");

      setIsLoading(true);

      await getChatStreamResponse(updatedMessages, model, (data: string) => {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];

          if (lastMessage.role !== "assistant") {
            const assistantMessage: Message = {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data,
            }

            return [...messages, assistantMessage];

          } else {
            return [...messages.slice(0, messages.length-1), { ...lastMessage, content: lastMessage.content + data}]
          }  
        });
    })
      

    } catch (error) {
      console.error("Error sending message:", error);
      setError(`Failed to send message to groq.`);

    } finally {
      setIsLoading(false);
    }
  };

  const retry = async () => {
    try {

      setIsLoading(true);

      // call the Gemini API.
      const groqResponse: string = await getChatResponse(messages, model);

      // Craete the assistant message.
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: groqResponse,
      };

      setMessages((messages) => [...messages, assistantMessage]);

      setError(null);

    } catch (error) {
      console.error("Error retrying message:", error);
      setError(`Failed to retry message to groq: ${String(error)}`);

    } finally {
      setIsLoading(false);
    }
     
  }

  return {
    messages,
    url,
    setUrl,
    input,
    setInput,
    sendMessage,
    isLoading,
    error,
    retry,
    model,
    setModel,
    file,
    handleFileSelect,
    ingestStatus,
    handleIngestSubmit,
  };
}
