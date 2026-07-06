
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export type { Message };

