
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ message, setMessage }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Wiadomość</h3>
      <Textarea 
        placeholder="Dodaj wiadomość dla organizacji..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[120px] resize-none"
      />
    </div>
  );
};

export default MessageInput;
