import { useForm } from '../context/FormContext';

export const Header = () => {
  const { resetForm, setIsWorkflowActive, setIsPrinting } = useForm();

  const handlePrint = () => {
    setIsPrinting(true);
    // Give time for DOM to update and layout to shift before print dialog
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  return (
    <header className="app-header">
      <div className="header-actions">
        <button 
          className="workflow-btn" 
          onClick={() => setIsWorkflowActive(true)}
          style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white',
            fontWeight: 'bold',
            marginRight: 'auto' 
          }}
        >
          Start Guided Assessment
        </button>
        <button onClick={resetForm}>New Form / Clear</button>
        <button onClick={handlePrint}>Print Form</button>
      </div>
    </header>
  );
};
