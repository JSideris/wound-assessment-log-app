import { Header } from './components/Header';
import { PageOne } from './pages/PageOne';
import { Sidebar } from './components/Sidebar';
import { AssessmentWorkflow } from './components/AssessmentWorkflow';
import { AutoSaveStatus } from './components/AutoSaveStatus';
import { FormProvider, useForm } from './context/FormContext';
import './App.css';
import { useState } from 'react';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isWorkflowActive, isPrinting } = useForm();

  return (
    <div className={`app-layout ${isPrinting ? 'print-mode' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="main-wrapper">
        <button 
          className="sidebar-tab" 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Show Past Forms" : "Hide Past Forms"}
        >
          {sidebarCollapsed ? "≫" : "≪"}
        </button>
        <Header />
        <main className="main-content">
          <PageOne />
        </main>
      </div>
      <AutoSaveStatus />
      {isWorkflowActive && <AssessmentWorkflow />}
    </div>
  );
}

function App() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
}

export default App;
