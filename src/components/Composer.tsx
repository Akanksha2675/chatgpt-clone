import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface ComposerProps {
    value: string;
    onChange: (content: string) => void;
    onSend: (content: string) => void;
    model: string;
    onModelChange: (model: string) => void;
}

export default function Composer({ value, onChange, onSend, model, onModelChange }: ComposerProps) {


    return (

        <div className="flex items-center bg-white rounded-full p-2 mx-4 mb-6"> 
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 pl-4 outline-none bg-transparent"
                type="text"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend(value);
                    }
                }}
            >
            </input>

            <select
                value={model}
                onChange={(e: any) => onModelChange(e.target.value)}
                className="outline-none bg-transparent text-black"
            >
                <option> llama-3.1-8b-instant </option>
                <option> llama-3.3-70b-versatile </option>
                <option> openai/gpt-oss-120b </option>

            </select>


            <button 
                disabled={value.trim() === ""}
                onClick={() => onSend(value)}
                className="ml-2 bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-full"
            >
                <HugeiconsIcon icon={ArrowUpRight01Icon} />
            </button>
            
        </div>
    )

}