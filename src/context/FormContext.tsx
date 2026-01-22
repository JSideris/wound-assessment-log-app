import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { WoundAssessment } from '../types/form';
import * as db from '../utils/db';

interface FormContextType {
  formData: WoundAssessment;
  isDirty: boolean;
  isSaving: boolean;
  hasBeenSaved: boolean;
  savedForms: WoundAssessment[];
  updateField: <T extends keyof WoundAssessment>(
    field: T,
    value: WoundAssessment[T] | ((prev: WoundAssessment[T]) => WoundAssessment[T])
  ) => void;
  updateNestedField: <T extends keyof WoundAssessment, K extends keyof WoundAssessment[T]>(
    parentField: T,
    childField: K,
    value: WoundAssessment[T][K]
  ) => void;
  resetForm: () => void;
  saveCurrentForm: () => Promise<void>;
  loadForm: (id: string) => Promise<void>;
  deleteSavedForm: (id: string) => Promise<void>;
  createFollowup: (prevId: string) => Promise<void>;
  isFollowupMode: boolean;
  setIsFollowupMode: (mode: boolean) => void;
  isWorkflowActive: boolean;
  setIsWorkflowActive: (active: boolean) => void;
  isPrinting: boolean;
  setIsPrinting: (printing: boolean) => void;
}

const initialData: WoundAssessment = {
  bedRoom: '',
  patientName: '',
  idMrn: '',
  age: '',
  sex: '',
  address: '',
  contactInfo: '',
  date: '',
  selectedDay: null,
  time: '',
  timeAmPm: 'am',
  medicalHistory: '',
  substanceAbuse: {
    alcohol: false,
    tobacco: false,
    drugs: false,
    inhalants: false,
    other: '',
  },
  interventions: {
    cleansing: '',
    debridement: '',
    dressing: '',
    adjunctive: '',
    other: '',
  },
  patientEducation: {
    woundCare: false,
    nutrition: false,
    smoking: false,
    offloading: false,
    other: '',
  },
  signsOfInfection: {
    increasedPain: false,
    erythema: false,
    edema: false,
    warmth: false,
    fever: false,
    purulent: false,
    delayed: false,
    friable: false,
    foul: false,
    other: '',
  },
  photographed: false,
  photographedDate: '',
  followUp: {
    continue: false,
    modify: false,
    modifyText: '',
    consult: false,
    consultText: '',
    labs: false,
    labsText: '',
    other: '',
  },
  nextAssessment: '',
  dateOfInjury: '',
  woundType: {
    chronic: false,
    abrasion: false,
    acute: false,
    arterial: false,
    infected: false,
    burn: false,
    diabetic: false,
    laceration: false,
    surgical: false,
    pressure: false,
    puncture: false,
    venous: false,
    traumatic: false,
    other: '',
  },
  woundLocation: '',
  dimensions: {
    length: '',
    width: '',
    depth: '',
  },
  appearance: {
    epithelial: '',
    granulation: '',
    slough: '',
    necrotic: '',
    pink: false,
    red: false,
    yellow: false,
    black: false,
    other: '',
  },
  edges: {
    wellDefined: false,
    irregular: false,
    rolled: false,
  },
  exudate: 'None',
  odor: 'None',
  odorCharacteristics: '',
  painLevel: '',
  periwoundSkin: {
    intact: false,
    erythema: false,
    macerated: false,
    indurated: false,
    excoriated: false,
    dry: false,
    callused: false,
    hyperPigmented: false,
  },
  tunneling: {
    location: '',
    depth: '',
  },
  undermining: {
    location: '',
    depth: '',
  },
  notes: '',
};

const getInitialData = (): WoundAssessment => {
  const now = new Date();
  
  // Format date: YYYY-MM-DD for <input type="date">
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  // Format time: HH:MM (24h format for <input type="time">)
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${String(hours).padStart(2, '0')}:${minutes}`;

  // AM/PM for the separate select
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Selected Day (M=0, T=1, W=2, T=3, F=4, S=5, S=6)
  // jsDay: 0=Sun, 1=Mon, ..., 6=Sat
  const jsDay = now.getDay();
  const selectedDay = (jsDay + 6) % 7;

  return {
    ...initialData,
    date: dateStr,
    time: timeStr,
    timeAmPm: ampm,
    selectedDay: selectedDay,
  };
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<WoundAssessment>(getInitialData);
  const [lastSavedData, setLastSavedData] = useState<WoundAssessment>(getInitialData);
  const [savedForms, setSavedForms] = useState<WoundAssessment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [isFollowupMode, setIsFollowupMode] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Keep a ref to the latest formData to avoid race conditions during async saves
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const refreshSavedForms = useCallback(async () => {
    const forms = await db.getForms();
    setSavedForms(forms.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0)));
  }, []);

  useEffect(() => {
    refreshSavedForms();
  }, [refreshSavedForms]);

  const updateField = useCallback(<T extends keyof WoundAssessment>(
    field: T,
    value: WoundAssessment[T] | ((prev: WoundAssessment[T]) => WoundAssessment[T])
  ) => {
    setFormData((prev) => {
      const newValue = typeof value === 'function' ? (value as Function)(prev[field]) : value;
      const updated = { ...prev, [field]: newValue };

      // Automatically update weekday if date changes
      if (field === 'date' && typeof newValue === 'string' && newValue) {
        // Use T00:00:00 to ensure it's treated as a local date for weekday calculation
        const d = new Date(newValue + 'T00:00:00');
        if (!isNaN(d.getTime())) {
          // jsDay: 0=Sun, 1=Mon, ..., 6=Sat
          // Form logic: M=0, T=1, W=2, T=3, F=4, S=5, S=6
          const jsDay = d.getDay();
          updated.selectedDay = (jsDay + 6) % 7;
        }
      }

      return updated;
    });
  }, []);

  const updateNestedField = useCallback(<T extends keyof WoundAssessment, K extends keyof WoundAssessment[T]>(
    parentField: T,
    childField: K,
    value: WoundAssessment[T][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as object),
        [childField]: value,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    const freshData = getInitialData();
    setFormData(freshData);
    setLastSavedData(freshData);
    setHasBeenSaved(false);
    setIsFollowupMode(false);
  }, []);

  const saveCurrentForm = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Use the latest data from the ref to avoid race conditions
      const currentData = formDataRef.current;
      const id = await db.saveForm(currentData);
      const lastModified = Date.now();
      const saved = { ...currentData, id, lastModified };
      
      setLastSavedData(saved);
      // Update formData with the new metadata to keep it in sync with lastSavedData
      // and prevent the "unsaved changes" flicker caused by lastModified mismatch.
      setFormData(prev => ({ ...prev, id, lastModified }));
      setHasBeenSaved(true);
      
      await refreshSavedForms();
    } catch (error) {
      console.error('Failed to save form:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, refreshSavedForms]);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(lastSavedData);

  useEffect(() => {
    if (!isDirty || isSaving) return;

    const delay = formData.id ? 1000 : 0;
    const timer = setTimeout(() => {
      saveCurrentForm();
    }, delay);

    return () => clearTimeout(timer);
  }, [isDirty, isSaving, formData.id, saveCurrentForm]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty || isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSaving]);

  const loadForm = useCallback(async (id: string) => {
    if (isDirty) {
      await saveCurrentForm();
    }
    
    const formToLoad = savedForms.find(f => f.id === id);
    if (!formToLoad) return;

    setFormData(formToLoad);
    setLastSavedData(formToLoad);
    setHasBeenSaved(true);
    setIsFollowupMode(!!formToLoad.isFollowup);
  }, [isDirty, saveCurrentForm, savedForms]);

  const deleteSavedForm = useCallback(async (id: string) => {
    await db.deleteForm(id);
    if (formData.id === id) {
      resetForm();
    }
    await refreshSavedForms();
  }, [formData.id, resetForm, refreshSavedForms]);

  const createFollowup = useCallback(async (prevId: string) => {
    if (isDirty) {
      await saveCurrentForm();
    }

    const prevForm = savedForms.find(f => f.id === prevId);
    if (!prevForm) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes}`;
    const ampm = hours >= 12 ? 'pm' : 'am';
    const jsDay = now.getDay();
    const selectedDay = (jsDay + 6) % 7;

    const followupForm: WoundAssessment = {
      ...prevForm,
      id: crypto.randomUUID(),
      encounterId: prevForm.encounterId || prevForm.id,
      isFollowup: true,
      lastModified: Date.now(),
      date: dateStr,
      time: timeStr,
      timeAmPm: ampm,
      selectedDay: selectedDay,
      // Wipe transient fields
      followUp: {
        continue: false,
        modify: false,
        modifyText: '',
        consult: false,
        consultText: '',
        labs: false,
        labsText: '',
        other: '',
      },
      nextAssessment: '',
      photographed: false,
      photographedDate: '',
      notes: '',
    };

    await db.saveForm(followupForm);
    await refreshSavedForms();
    setFormData(followupForm);
    setLastSavedData(followupForm);
    setHasBeenSaved(true);
    setIsFollowupMode(true);
    setIsWorkflowActive(true);
  }, [isDirty, saveCurrentForm, savedForms, refreshSavedForms]);

  return (
    <FormContext.Provider value={{ 
      formData, 
      isDirty, 
      isSaving,
      hasBeenSaved,
      savedForms, 
      updateField, 
      updateNestedField, 
      resetForm,
      saveCurrentForm,
      loadForm,
      deleteSavedForm,
      createFollowup,
      isFollowupMode,
      setIsFollowupMode,
      isWorkflowActive,
      setIsWorkflowActive,
      isPrinting,
      setIsPrinting
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
