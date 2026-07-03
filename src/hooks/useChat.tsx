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

  const handleFileIngestion = async (nextFile: File | null) => {
    setFile(nextFile);
    setIngestStatus(null);

    try {
      const formData = new FormData();
      formData.append('pdf-file', nextFile as Blob);

      setIngestStatus("Ingesting file...");

      const response = await fetch('http://localhost:3000/documents/ingest', {
        method: 'POST',
        body: formData,
      })

      
      if (!response.ok) {
        throw new Error(`Failed to ingest file: ${response.statusText}`);
      }

      setIngestStatus("Ingestion successful")

    } catch (error) {
      console.log("Error ingesting file:", error);
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
  };
}
