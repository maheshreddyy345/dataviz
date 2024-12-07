import React, { useState } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ onSubmit, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <div className="text-input-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text data here..."
          rows={5}
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || !text.trim()}>
          {disabled ? 'Processing...' : 'Generate Visualization'}
        </button>
      </form>
    </div>
  );
};
