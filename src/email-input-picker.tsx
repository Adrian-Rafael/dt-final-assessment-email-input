import { useState, useRef, useEffect } from 'react';
import './email-input-picker.css';
import { emails as suggestionList } from './email';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

type EmailEntry = { text: string; valid: boolean };

const EmailInputPicker = () => {
  const [input, setInput] = useState('');
  const [emailTags, setEmailTags] = useState<EmailEntry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const updateSuggestions = (value: string) => {
    if (!value.trim()) return setSuggestions([]);
    const filtered = suggestionList.filter(email =>
      email.toLowerCase().startsWith(value.toLowerCase()) &&
      !emailTags.some(tag => tag.text === email)
    );
    setSuggestions(filtered.slice(0, 5));
  };

  const addEmail = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setEmailTags([...emailTags, { text: trimmed, valid: isValidEmail(trimmed) }]);
    setInput('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      addEmail(input);
    }
  };

  const handleSuggestionClick = (email: string) => {
    addEmail(email);
  };

  const removeEmail = (index: number) => {
    setEmailTags(emailTags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    updateSuggestions(input);
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="simple-email-input" ref={wrapperRef}>
      {emailTags.map((tag, i) => (
        <span key={i} className={`tag ${tag.valid ? '' : 'invalid'}`}>
          {tag.text}
          <button onClick={() => removeEmail(i)}>&times;</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        placeholder="Enter Recipients..."
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="dropdown">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSuggestionClick(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailInputPicker;