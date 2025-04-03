
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
}

const MessageInput = ({ message, onChange }: MessageInputProps) => {
  return (
    <div className="mb-4">
      <Textarea
        placeholder="Napisz wiadomość..."
        value={message}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-none"
      />
    </div>
  );
};

export default MessageInput;
