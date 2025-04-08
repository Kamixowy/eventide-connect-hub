
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  required?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ message, setMessage, required = false }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        Wiadomość {required ? '<span className="text-red-500">*</span>' : '(opcjonalnie)'}
      </h3>
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
