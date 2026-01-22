import { useForm } from '../context/FormContext';
import './AutoSaveStatus.css';

export const AutoSaveStatus = () => {
  const { isSaving, isDirty, hasBeenSaved } = useForm();
  
  if (!isSaving && !isDirty && !hasBeenSaved) return null;
  
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
