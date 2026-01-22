import { useState, useEffect } from 'react';
import { useForm } from '../context/FormContext';
import './AssessmentWorkflow.css';

interface Step {
  id: string;
  label: string;
}

const STEPS: Step[] = [
  { id: 'patientInfo', label: 'Patient Information' },
  { id: 'medicalHistory', label: 'Medical History' },
  { id: 'substanceAbuse', label: 'Substance Abuse' },
  { id: 'interventions', label: 'Interventions' },
  { id: 'education', label: 'Patient Education' },
  { id: 'infection', label: 'Signs of Infection' },
  { id: 'photo', label: 'Photographed' },
  { id: 'woundType', label: 'Type of Wound' },
  { id: 'locationDimensions', label: 'Location & Dimensions' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'edgesExudate', label: 'Edges & Exudate' },
  { id: 'odorPain', label: 'Odor & Pain' },
  { id: 'periwound', label: 'Periwound Skin' },
  { id: 'tunnelingUndermining', label: 'Tunneling & Undermining' },
  { id: 'followUp', label: 'Follow-up & Steps' },
  { id: 'notes', label: 'Additional Notes' },
];

export const AssessmentWorkflow = () => {
  const { formData, updateField, updateNestedField, setIsWorkflowActive, isFollowupMode } = useForm();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const SKIPPED_STEPS_FOLLOWUP = ['medicalHistory', 'substanceAbuse', 'woundType', 'locationDimensions'];

  const isStepSkipped = (stepId: string) => {
    return isFollowupMode && SKIPPED_STEPS_FOLLOWUP.includes(stepId);
  };

  // Skip administrative stuff if already complete
  useEffect(() => {
    const isPatientInfoComplete = 
      formData.patientName && 
      formData.idMrn && 
      formData.age && 
      formData.sex;
    
    if (isPatientInfoComplete && currentStepIndex === 0) {
      if (isFollowupMode) {
        // Find first non-skipped step after patient info
        let nextIndex = 1;
        while (nextIndex < STEPS.length - 1 && isStepSkipped(STEPS[nextIndex].id)) {
          nextIndex++;
        }
        setCurrentStepIndex(nextIndex);
      } else {
        setCurrentStepIndex(1);
      }
    }
  }, []);

  const currentStep = STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      let nextIndex = currentStepIndex + 1;
      // If in followup mode, skip steps that are unlikely to change
      if (isFollowupMode) {
        while (nextIndex < STEPS.length - 1 && isStepSkipped(STEPS[nextIndex].id)) {
          nextIndex++;
        }
      }
      setCurrentStepIndex(nextIndex);
    } else {
      setIsWorkflowActive(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      let prevIndex = currentStepIndex - 1;
      // If in followup mode, skip steps that are unlikely to change
      if (isFollowupMode) {
        while (prevIndex > 0 && isStepSkipped(STEPS[prevIndex].id)) {
          prevIndex--;
        }
      }
      setCurrentStepIndex(prevIndex);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const renderShortcut = (label: string, value: any, field: any, nestedParent?: string) => (
    <button 
      className="shortcut-btn" 
      onClick={() => {
        if (nestedParent) {
          updateNestedField(nestedParent as any, field, value);
        } else {
          updateField(field, value);
        }
      }}
    >
      {label}
    </button>
  );

  const renderReset = (field: any, defaultValue: any, nestedParent?: string) => (
    <button 
      className="reset-btn"
      onClick={() => {
        if (nestedParent) {
          updateNestedField(nestedParent as any, field, defaultValue);
        } else {
          updateField(field, defaultValue);
        }
      }}
    >
      Reset Answer
    </button>
  );

  const renderContent = () => {
    switch (currentStep.id) {
      case 'patientInfo':
        return (
          <div className="workflow-input-group">
            <div className="workflow-field">
              <label>Bed/Room#</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.bedRoom}
                onChange={(e) => updateField('bedRoom', e.target.value)}
              />
            </div>
            <div className="workflow-field">
              <label>Patient Name</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.patientName}
                onChange={(e) => updateField('patientName', e.target.value)}
              />
            </div>
            <div className="workflow-field">
              <label>ID/MRN</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.idMrn}
                onChange={(e) => updateField('idMrn', e.target.value)}
              />
            </div>
            <div className="workflow-field">
              <label>Age</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.age}
                onChange={(e) => updateField('age', e.target.value)}
              />
            </div>
            <div className="workflow-field">
              <label>Sex</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.sex}
                onChange={(e) => updateField('sex', e.target.value)}
              />
            </div>
          </div>
        );

      case 'medicalHistory':
        return (
          <div className="workflow-field">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label>Medical History / Allergies</label>
                {renderReset('medicalHistory', '')}
            </div>
            <textarea 
              className="workflow-textarea"
              value={formData.medicalHistory}
              onChange={(e) => updateField('medicalHistory', e.target.value)}
              placeholder="Enter patient medical history and allergies..."
            ></textarea>
            <div className="shortcut-buttons">
              {renderShortcut('Mark "None"', 'None', 'medicalHistory')}
            </div>
          </div>
        );

      case 'substanceAbuse':
        return (
          <div className="workflow-checkbox-grid">
            {Object.keys(formData.substanceAbuse).map((key) => {
              if (key === 'other') return null;
              const typedKey = key as keyof typeof formData.substanceAbuse;
              return (
                <div 
                  key={key}
                  className={`workflow-checkbox-item ${formData.substanceAbuse[typedKey] ? 'selected' : ''}`}
                  onClick={() => updateNestedField('substanceAbuse', typedKey as any, !formData.substanceAbuse[typedKey])}
                >
                  <input type="checkbox" checked={!!formData.substanceAbuse[typedKey]} readOnly />
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                </div>
              );
            })}
            <div className="workflow-field" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <label>Other Substance Abuse</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.substanceAbuse.other}
                onChange={(e) => updateNestedField('substanceAbuse', 'other', e.target.value)}
              />
            </div>
          </div>
        );

      case 'interventions':
        return (
          <div className="workflow-input-group">
            {['cleansing', 'debridement', 'dressing', 'adjunctive', 'other'].map((field) => (
              <div className="workflow-field" key={field}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {renderReset(field as any, '', 'interventions')}
                </div>
                <input 
                  type="text" 
                  className="workflow-text-input" 
                  value={(formData.interventions as any)[field]}
                  onChange={(e) => updateNestedField('interventions', field as any, e.target.value)}
                />
                <div className="shortcut-buttons">
                  {renderShortcut('Mark "None"', 'None', field as any, 'interventions')}
                </div>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="workflow-checkbox-grid">
            {[
              { id: 'woundCare', label: 'Wound Care' },
              { id: 'nutrition', label: 'Nutrition' },
              { id: 'smoking', label: 'Smoking' },
              { id: 'offloading', label: 'Offloading' },
            ].map((item) => (
              <div 
                key={item.id}
                className={`workflow-checkbox-item ${(formData.patientEducation as any)[item.id] ? 'selected' : ''}`}
                onClick={() => updateNestedField('patientEducation', item.id as any, !(formData.patientEducation as any)[item.id])}
              >
                <input type="checkbox" checked={!!(formData.patientEducation as any)[item.id]} readOnly />
                <label>{item.label}</label>
              </div>
            ))}
            <div className="workflow-field" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <label>Other Education</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.patientEducation.other}
                onChange={(e) => updateNestedField('patientEducation', 'other', e.target.value)}
              />
            </div>
          </div>
        );

      case 'infection':
        return (
          <div className="workflow-checkbox-grid">
            {[
              { id: 'increasedPain', label: 'Increased Pain' },
              { id: 'erythema', label: 'Erythema' },
              { id: 'edema', label: 'Edema' },
              { id: 'warmth', label: 'Warmth' },
              { id: 'fever', label: 'Fever' },
              { id: 'purulent', label: 'Purulent Drainage' },
              { id: 'delayed', label: 'Delayed Healing' },
              { id: 'friable', label: 'Friable Granulation' },
              { id: 'foul', label: 'Foul Odor' },
            ].map((item) => (
              <div 
                key={item.id}
                className={`workflow-checkbox-item ${(formData.signsOfInfection as any)[item.id] ? 'selected' : ''}`}
                onClick={() => updateNestedField('signsOfInfection', item.id as any, !(formData.signsOfInfection as any)[item.id])}
              >
                <input type="checkbox" checked={!!(formData.signsOfInfection as any)[item.id]} readOnly />
                <label>{item.label}</label>
              </div>
            ))}
            <div className="workflow-field" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <label>Other Signs of Infection</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.signsOfInfection.other}
                onChange={(e) => updateNestedField('signsOfInfection', 'other', e.target.value)}
              />
            </div>
          </div>
        );

      case 'photo':
        return (
          <div className="workflow-input-group">
            <div 
              className={`workflow-checkbox-item ${formData.photographed ? 'selected' : ''}`}
              onClick={() => updateField('photographed', !formData.photographed)}
              style={{ width: 'fit-content' }}
            >
              <input type="checkbox" checked={formData.photographed} readOnly />
              <label>Photographed</label>
            </div>
            {formData.photographed && (
              <div className="workflow-field">
                <label>Date Photographed</label>
                <input 
                  type="date" 
                  className="workflow-text-input" 
                  value={formData.photographedDate}
                  onChange={(e) => updateField('photographedDate', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 'woundType':
        return (
          <div className="workflow-checkbox-grid">
            {[
              { id: 'chronic', label: 'Chronic Wound' },
              { id: 'abrasion', label: 'Abrasion' },
              { id: 'acute', label: 'Acute Wound' },
              { id: 'arterial', label: 'Arterial Ulcer' },
              { id: 'infected', label: 'Infected Wound' },
              { id: 'burn', label: 'Burn' },
              { id: 'diabetic', label: 'Diabetic Ulcer' },
              { id: 'laceration', label: 'Laceration' },
              { id: 'surgical', label: 'Surgical Wound' },
              { id: 'pressure', label: 'Pressure Ulcer' },
              { id: 'puncture', label: 'Puncture' },
              { id: 'venous', label: 'Venous Ulcer' },
              { id: 'traumatic', label: 'Traumatic Wound' },
            ].map((item) => (
              <div 
                key={item.id}
                className={`workflow-checkbox-item ${(formData.woundType as any)[item.id] ? 'selected' : ''}`}
                onClick={() => updateNestedField('woundType', item.id as any, !(formData.woundType as any)[item.id])}
              >
                <input type="checkbox" checked={!!(formData.woundType as any)[item.id]} readOnly />
                <label>{item.label}</label>
              </div>
            ))}
            <div className="workflow-field" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <label>Other Wound Type</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.woundType.other}
                onChange={(e) => updateNestedField('woundType', 'other', e.target.value)}
              />
            </div>
          </div>
        );

      case 'locationDimensions':
        return (
          <div className="workflow-input-group">
            <div className="workflow-field">
              <label>Date of Injury</label>
              <input 
                type="date" 
                className="workflow-text-input" 
                value={formData.dateOfInjury}
                onChange={(e) => updateField('dateOfInjury', e.target.value)}
              />
            </div>
            <div className="workflow-field">
              <label>Wound Location</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.woundLocation}
                onChange={(e) => updateField('woundLocation', e.target.value)}
              />
            </div>
            <div className="workflow-field" style={{ gridColumn: '1 / -1' }}>
              <label>Dimensions (cm)</label>
              <div className="dimensions-workflow-row">
                <div className="dimension-workflow-field">
                  <label>Length</label>
                  <input 
                    type="number" 
                    className="workflow-text-input"
                    value={formData.dimensions.length}
                    onChange={(e) => updateNestedField('dimensions', 'length', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="dimension-workflow-field">
                  <label>Width</label>
                  <input 
                    type="number" 
                    className="workflow-text-input"
                    value={formData.dimensions.width}
                    onChange={(e) => updateNestedField('dimensions', 'width', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="dimension-workflow-field">
                  <label>Depth</label>
                  <input 
                    type="number" 
                    className="workflow-text-input"
                    value={formData.dimensions.depth}
                    onChange={(e) => updateNestedField('dimensions', 'depth', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="workflow-input-group">
            <div className="workflow-field" style={{ gridColumn: '1 / -1' }}>
              <label>Appearance Percentage</label>
              <div className="dimensions-workflow-row">
                {[
                  { id: 'epithelial', label: 'Epithelial' },
                  { id: 'granulation', label: 'Granulation' },
                  { id: 'slough', label: 'Slough' },
                  { id: 'necrotic', label: 'Necrotic' },
                ].map(item => (
                  <div className="dimension-workflow-field" key={item.id}>
                    <label>{item.label} %</label>
                    <input 
                      type="number" 
                      className="workflow-text-input"
                      value={(formData.appearance as any)[item.id]}
                      onChange={(e) => updateNestedField('appearance', item.id as any, e.target.value === '' ? '' : Number(e.target.value))}
                    />
                    <div className="shortcut-buttons">
                      {renderShortcut('100%', 100, item.id as any, 'appearance')}
                      {renderShortcut('0%', 0, item.id as any, 'appearance')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="workflow-field" style={{ gridColumn: '1 / -1' }}>
              <label>Colors Observed</label>
              <div className="workflow-checkbox-grid">
                {['pink', 'red', 'yellow', 'black'].map(color => (
                  <div 
                    key={color}
                    className={`workflow-checkbox-item ${(formData.appearance as any)[color] ? 'selected' : ''}`}
                    onClick={() => updateNestedField('appearance', color as any, !(formData.appearance as any)[color])}
                  >
                    <input type="checkbox" checked={!!(formData.appearance as any)[color]} readOnly />
                    <label>{color.charAt(0).toUpperCase() + color.slice(1)}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="workflow-field" style={{ gridColumn: '1 / -1' }}>
              <label>Other Appearance Details</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.appearance.other}
                onChange={(e) => updateNestedField('appearance', 'other', e.target.value)}
              />
            </div>
          </div>
        );

      case 'edgesExudate':
        return (
          <div className="workflow-input-group">
            <div className="workflow-field">
              <label>Edges</label>
              <div className="workflow-checkbox-grid">
                {[
                  { id: 'wellDefined', label: 'Well-defined' },
                  { id: 'irregular', label: 'Irregular' },
                  { id: 'rolled', label: 'Rolled' },
                ].map(item => (
                  <div 
                    key={item.id}
                    className={`workflow-checkbox-item ${(formData.edges as any)[item.id] ? 'selected' : ''}`}
                    onClick={() => updateNestedField('edges', item.id as any, !(formData.edges as any)[item.id])}
                  >
                    <input type="checkbox" checked={!!(formData.edges as any)[item.id]} readOnly />
                    <label>{item.label}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="workflow-field">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Exudate</label>
                  {renderReset('exudate', 'None')}
              </div>
              <div className="radio-group">
                {['None', 'Light', 'Mod', 'Heavy'].map(val => (
                  <div 
                    key={val}
                    className={`workflow-checkbox-item ${formData.exudate === val ? 'selected' : ''}`}
                    onClick={() => updateField('exudate', val as any)}
                  >
                    <input type="radio" checked={formData.exudate === val} readOnly />
                    <label>{val}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'odorPain':
        return (
          <div className="workflow-input-group">
            <div className="workflow-field">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Odor</label>
                  {renderReset('odor', 'None')}
              </div>
              <div className="radio-group">
                {['None', 'Mild', 'Mod', 'Strong'].map(val => (
                  <div 
                    key={val}
                    className={`workflow-checkbox-item ${formData.odor === val ? 'selected' : ''}`}
                    onClick={() => updateField('odor', val as any)}
                  >
                    <input type="radio" checked={formData.odor === val} readOnly />
                    <label>{val}</label>
                  </div>
                ))}
              </div>
              <div className="workflow-field" style={{ marginTop: '1rem' }}>
                <label>Odor Characteristics</label>
                <input 
                  type="text" 
                  className="workflow-text-input" 
                  value={formData.odorCharacteristics}
                  onChange={(e) => updateField('odorCharacteristics', e.target.value)}
                />
              </div>
            </div>
            <div className="workflow-field">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Pain Level (0-10)</label>
                  {renderReset('painLevel', '')}
              </div>
              <div className="pain-scale-grid">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <button 
                    key={level}
                    className={`pain-btn ${formData.painLevel === level ? 'selected' : ''}`}
                    onClick={() => updateField('painLevel', level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'periwound':
        return (
          <div className="workflow-checkbox-grid">
            {[
              { id: 'intact', label: 'Intact' },
              { id: 'erythema', label: 'Erythema' },
              { id: 'macerated', label: 'Macerated' },
              { id: 'indurated', label: 'Indurated' },
              { id: 'excoriated', label: 'Excoriated' },
              { id: 'dry', label: 'Dry/Flaky' },
              { id: 'callused', label: 'Callused' },
              { id: 'hyperPigmented', label: 'Hyper-pigmented' },
            ].map((item) => (
              <div 
                key={item.id}
                className={`workflow-checkbox-item ${(formData.periwoundSkin as any)[item.id] ? 'selected' : ''}`}
                onClick={() => updateNestedField('periwoundSkin', item.id as any, !(formData.periwoundSkin as any)[item.id])}
              >
                <input type="checkbox" checked={!!(formData.periwoundSkin as any)[item.id]} readOnly />
                <label>{item.label}</label>
              </div>
            ))}
          </div>
        );

      case 'tunnelingUndermining':
        return (
          <div className="workflow-input-group">
            <div className="workflow-field" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Tunneling</label>
                  {renderReset('tunneling', { location: '', depth: '' })}
              </div>
              <div className="dimensions-workflow-row">
                <div className="dimension-workflow-field" style={{ flex: 3 }}>
                  <label>Location (Clockwise)</label>
                  <input 
                    type="text" 
                    className="workflow-text-input" 
                    placeholder="e.g. 3 o'clock"
                    value={formData.tunneling.location}
                    onChange={(e) => updateNestedField('tunneling', 'location', e.target.value)}
                  />
                </div>
                <div className="dimension-workflow-field" style={{ flex: 1 }}>
                  <label>Depth (cm)</label>
                  <input 
                    type="number" 
                    className="workflow-text-input" 
                    step="0.1"
                    value={formData.tunneling.depth}
                    onChange={(e) => updateNestedField('tunneling', 'depth', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="workflow-field" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label>Undermining</label>
                  {renderReset('undermining', { location: '', depth: '' })}
              </div>
              <div className="dimensions-workflow-row">
                <div className="dimension-workflow-field" style={{ flex: 3 }}>
                  <label>Location (Clockwise)</label>
                  <input 
                    type="text" 
                    className="workflow-text-input" 
                    placeholder="e.g. 12 to 3 o'clock"
                    value={formData.undermining.location}
                    onChange={(e) => updateNestedField('undermining', 'location', e.target.value)}
                  />
                </div>
                <div className="dimension-workflow-field" style={{ flex: 1 }}>
                  <label>Depth (cm)</label>
                  <input 
                    type="number" 
                    className="workflow-text-input" 
                    step="0.1"
                    value={formData.undermining.depth}
                    onChange={(e) => updateNestedField('undermining', 'depth', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'followUp':
        return (
          <div className="workflow-input-group">
            <div 
              className={`workflow-checkbox-item ${formData.followUp.continue ? 'selected' : ''}`}
              onClick={() => updateNestedField('followUp', 'continue', !formData.followUp.continue)}
            >
              <input type="checkbox" checked={formData.followUp.continue} readOnly />
              <label>Continue current treatment</label>
            </div>
            
            <div className="workflow-field">
              <div 
                className={`workflow-checkbox-item ${formData.followUp.modify ? 'selected' : ''}`}
                onClick={() => updateNestedField('followUp', 'modify', !formData.followUp.modify)}
                style={{ marginBottom: '0.5rem' }}
              >
                <input type="checkbox" checked={formData.followUp.modify} readOnly />
                <label>Modify Treatment</label>
              </div>
              {formData.followUp.modify && (
                <input 
                  type="text" 
                  className="workflow-text-input" 
                  placeholder="How to modify?"
                  value={formData.followUp.modifyText}
                  onChange={(e) => updateNestedField('followUp', 'modifyText', e.target.value)}
                />
              )}
            </div>

            <div className="workflow-field">
              <div 
                className={`workflow-checkbox-item ${formData.followUp.consult ? 'selected' : ''}`}
                onClick={() => updateNestedField('followUp', 'consult', !formData.followUp.consult)}
                style={{ marginBottom: '0.5rem' }}
              >
                <input type="checkbox" checked={formData.followUp.consult} readOnly />
                <label>Consult</label>
              </div>
              {formData.followUp.consult && (
                <input 
                  type="text" 
                  className="workflow-text-input" 
                  placeholder="Who to consult?"
                  value={formData.followUp.consultText}
                  onChange={(e) => updateNestedField('followUp', 'consultText', e.target.value)}
                />
              )}
            </div>

            <div className="workflow-field">
              <div 
                className={`workflow-checkbox-item ${formData.followUp.labs ? 'selected' : ''}`}
                onClick={() => updateNestedField('followUp', 'labs', !formData.followUp.labs)}
                style={{ marginBottom: '0.5rem' }}
              >
                <input type="checkbox" checked={formData.followUp.labs} readOnly />
                <label>Labs</label>
              </div>
              {formData.followUp.labs && (
                <input 
                  type="text" 
                  className="workflow-text-input" 
                  placeholder="Which labs?"
                  value={formData.followUp.labsText}
                  onChange={(e) => updateNestedField('followUp', 'labsText', e.target.value)}
                />
              )}
            </div>

            <div className="workflow-field">
              <label>Other Follow-up</label>
              <input 
                type="text" 
                className="workflow-text-input" 
                value={formData.followUp.other}
                onChange={(e) => updateNestedField('followUp', 'other', e.target.value)}
              />
            </div>

            <div className="workflow-field">
              <label>Next Assessment Date/Time</label>
              <input 
                type="datetime-local" 
                className="workflow-text-input" 
                value={formData.nextAssessment}
                onChange={(e) => updateField('nextAssessment', e.target.value)}
              />
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="workflow-field">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label>Additional Observations & Notes</label>
                {renderReset('notes', '')}
            </div>
            <textarea 
              className="workflow-textarea"
              style={{ minHeight: '300px' }}
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Enter any additional observations..."
            ></textarea>
            <div className="shortcut-buttons">
              {renderShortcut('Mark "No changes"', 'No significant changes observed.', 'notes')}
              {renderShortcut('Mark "Wound stable"', 'Wound appears stable with no signs of distress.', 'notes')}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="workflow-overlay">
      <header className="workflow-header">
        <div className="header-title-group">
          <h2>ASSESSMENT WORKFLOW</h2>
          {isFollowupMode && <span className="followup-badge">FOLLOW-UP MODE</span>}
        </div>
        <div className="header-buttons">
          <div className="progress-container">
            <div className="progress-text">Step {currentStepIndex + 1} of {STEPS.length}</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <button className="exit-btn" onClick={() => setIsWorkflowActive(false)}>EXIT</button>
        </div>
      </header>

      <div className="workflow-container">
        <aside className="workflow-sidebar">
          {STEPS.map((step, index) => {
            const skipped = isStepSkipped(step.id);
            return (
              <div 
                key={step.id}
                className={`step-item ${index === currentStepIndex ? 'active' : ''} ${index < currentStepIndex ? 'completed' : ''} ${skipped ? 'skipped' : ''}`}
                onClick={() => goToStep(index)}
              >
                <div className="step-number">{skipped ? '↷' : index + 1}</div>
                <div className="step-label-container">
                  <span>{step.label}</span>
                  {skipped && <span className="skipped-tag">Unlikely to change</span>}
                </div>
              </div>
            );
          })}
        </aside>

        <main className="workflow-main">
          <div className="question-card">
            <div className="question-label">{currentStep.label}</div>
            <div className="question-content">
              {renderContent()}
            </div>
          </div>

          <div className="navigation-footer">
            <button 
              className="nav-btn prev" 
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              ← PREVIOUS
            </button>
            <button 
              className={`nav-btn ${currentStepIndex === STEPS.length - 1 ? 'finish' : 'next'}`}
              onClick={handleNext}
            >
              {currentStepIndex === STEPS.length - 1 ? 'FINISH & SAVE' : 'NEXT STEP →'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
