import type { Message } from "../types";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const BASE = "http://localhost:3000";

const getChatResponse = async(messages: Message[], model: string) => {

    // throw new Error("getChatResponse function is not implemented yet.");
    
    const response = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messages, model: model })
    });

    const content = await response.json();
    console.log("response", content);
    console.log("content", content.response);

    return content.response;
}

export { getChatResponse };

export const getChatStreamResponse = async(messages: Message[], model: string, onMessage: (data: string) => void) => {
    
    try {
        await fetchEventSource(`${BASE}/chat-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages,
                model: model
            }),
            onmessage(event) {
                const data = JSON.parse(event.data);
                console.log("Streamed data:", data);
                onMessage(data);
            }
        });

    } catch (error) {
        console.error("Error in getChatStreamResponse:", error);
    }
}