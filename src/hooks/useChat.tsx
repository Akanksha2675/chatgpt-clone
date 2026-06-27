import { useState } from "react";
import type { Message } from "../types";
import { getChatResponse } from "../api/chat";

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState("llama-3.3-70b-versatile");

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

      // call the Gemini API.
      const groqResponse: string = await getChatResponse(updatedMessages, model);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: groqResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

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
  };
}
