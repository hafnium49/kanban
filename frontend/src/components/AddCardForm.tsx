"use client";

import { useState, useRef, useEffect } from "react";

interface AddCardFormProps {
  onSave: (title: string, details: string) => void;
  onCancel: () => void;
}

export default function AddCardForm({ onSave, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, details.trim());
    setTitle("");
    setDetails("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="add-card-form" onKeyDown={handleKeyDown}>
      <form onSubmit={handleSubmit}>
        <div className="add-card-form-card">
          <input
            ref={inputRef}
            className="add-card-input"
            type="text"
            placeholder="Card title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="add-card-title-input"
          />
          <textarea
            className="add-card-textarea"
            placeholder="Details (optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            data-testid="add-card-details-input"
          />
          <div className="add-card-actions">
            <button type="submit" className="btn-save" data-testid="add-card-save">
              Save
            </button>
            <button type="button" className="btn-cancel" onClick={onCancel} data-testid="add-card-cancel">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
