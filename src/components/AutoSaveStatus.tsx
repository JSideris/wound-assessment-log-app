import { useEffect, useState } from 'react';
import { useForm } from '../context/FormContext';
import './AutoSaveStatus.css';

export const AutoSaveStatus = () => {
  const { isSaving, isDirty, hasBeenSaved, isPrinting } = useForm();
  const [showSaved, setShowSaved] = useState(false);
  
  // Logic to show "All changes saved" temporarily
  useEffect(() => {
    if (!isSaving && !isDirty && hasBeenSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSaved(false);
    }
  }, [isSaving, isDirty, hasBeenSaved]);

  if (isPrinting) return null;
  if (!isSaving && !isDirty && !showSaved) return null;
  
  return (
    <div className={`autosave-status ${isSaving ? 'saving' : isDirty ? 'dirty' : 'saved'}`}>
      <span className="status-icon">
        {isSaving ? '⏳' : isDirty ? '●' : '✓'}
      </span>
      <span className="status-text">
        {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : 'All changes saved'}
      </span>
    </div>
  );
};
