import { useForm } from '../context/FormContext';
import '../Form.css';

export const PageOne = () => {
  const { formData, updateField, updateNestedField } = useForm();

  return (
    <div className="page-container">
      <div className="form-container-inner">
        <div className="form-header">Wound Assessment Log</div>
        
        {/* Top Patient Info Section - 3 Lines Left, Date/Time Right */}
        <div className="top-header">
            <div className="top-header-left">
                {/* Line 1: Bed/Room#, Patient Name, ID/MRN */}
                <div className="inline-fields">
                    <div className="inline-field">
                        <span className="field-label">Bed/Room#:</span>
                        <input 
                          type="text" 
                          className="field-input short" 
                          value={formData.bedRoom}
                          onChange={(e) => updateField('bedRoom', e.target.value)}
                        />
                    </div>
                    <div className="inline-field" style={{ flex: 1 }}>
                        <span className="field-label">Patient Name:</span>
                        <input 
                          type="text" 
                          className="field-input" 
                          value={formData.patientName}
                          onChange={(e) => updateField('patientName', e.target.value)}
                        />
                    </div>
                    <div className="inline-field">
                        <span className="field-label">ID/MRN:</span>
                        <input 
                          type="text" 
                          className="field-input medium" 
                          value={formData.idMrn}
                          onChange={(e) => updateField('idMrn', e.target.value)}
                        />
                    </div>
                </div>
                {/* Line 2: Age, Sex, Address */}
                <div className="inline-fields">
                    <div className="inline-field">
                        <span className="field-label">Age:</span>
                        <input 
                          type="text" 
                          className="field-input short" 
                          value={formData.age}
                          onChange={(e) => updateField('age', e.target.value)}
                        />
                    </div>
                    <div className="inline-field">
                        <span className="field-label">Sex:</span>
                        <input 
                          type="text" 
                          className="field-input short" 
                          value={formData.sex}
                          onChange={(e) => updateField('sex', e.target.value)}
                        />
                    </div>
                    <div className="inline-field" style={{ flex: 1 }}>
                        <span className="field-label">Address:</span>
                        <input 
                          type="text" 
                          className="field-input" 
                          value={formData.address}
                          onChange={(e) => updateField('address', e.target.value)}
                        />
                    </div>
                </div>
                {/* Line 3: Contact Info */}
                <div className="field-row">
                    <span className="field-label">Contact Information:</span>
                    <input 
                      type="text" 
                      className="field-input" 
                      value={formData.contactInfo}
                      onChange={(e) => updateField('contactInfo', e.target.value)}
                    />
                </div>
            </div>
            
            <div className="top-header-right">
                <div className="field-row">
                    <span className="field-label">Date:</span>
                    <input 
                      type="date" 
                      className="field-input" 
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                    />
                </div>
                <div className="days-row">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div 
                            key={i} 
                            className={`day ${formData.selectedDay === i ? 'selected' : ''}`} 
                            onClick={() => updateField('selectedDay', formData.selectedDay === i ? null : i)}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="field-row" style={{ marginTop: '6px' }}>
                    <span className="field-label">Time:</span>
                    <input 
                      type="time" 
                      className="field-input" 
                      value={formData.time}
                      onChange={(e) => updateField('time', e.target.value)}
                    />
                    <select 
                      className="field-input short" 
                      style={{ width: 'auto' }}
                      value={formData.timeAmPm}
                      onChange={(e) => updateField('timeAmPm', e.target.value as 'am' | 'pm')}
                    >
                        <option value="am">am</option>
                        <option value="pm">pm</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="form-body-custom">
            {/* Left Column - Narrower */}
            <div className="left-column">
                <div className="section">
                    <div className="section-title">Medical History / Allergies</div>
                    <textarea 
                      className="text-area-field"
                      value={formData.medicalHistory}
                      onChange={(e) => updateField('medicalHistory', e.target.value)}
                    ></textarea>
                </div>
                
                <div className="section">
                    <div className="section-title">Substance Abuse</div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="alcohol" 
                            checked={formData.substanceAbuse.alcohol}
                            onChange={(e) => updateNestedField('substanceAbuse', 'alcohol', e.target.checked)}
                          />
                          <label htmlFor="alcohol">Alcohol</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="tobacco" 
                            checked={formData.substanceAbuse.tobacco}
                            onChange={(e) => updateNestedField('substanceAbuse', 'tobacco', e.target.checked)}
                          />
                          <label htmlFor="tobacco">Tobacco</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="drugs" 
                            checked={formData.substanceAbuse.drugs}
                            onChange={(e) => updateNestedField('substanceAbuse', 'drugs', e.target.checked)}
                          />
                          <label htmlFor="drugs">Drugs</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="inhalants" 
                            checked={formData.substanceAbuse.inhalants}
                            onChange={(e) => updateNestedField('substanceAbuse', 'inhalants', e.target.checked)}
                          />
                          <label htmlFor="inhalants">Inhalants</label>
                        </div>
                    </div>
                    <div className="other-field">
                        <span className="field-label">Other:</span>
                        <input 
                          type="text" 
                          className="field-input" 
                          value={formData.substanceAbuse.other}
                          onChange={(e) => updateNestedField('substanceAbuse', 'other', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="section">
                    <div className="section-title">Interventions and Treatments</div>
                    <div className="field-row">
                      <span className="field-label">Cleansing:</span>
                      <input 
                        type="text" 
                        className="field-input" 
                        value={formData.interventions.cleansing}
                        onChange={(e) => updateNestedField('interventions', 'cleansing', e.target.value)}
                      />
                    </div>
                    <div className="field-row">
                      <span className="field-label">Debridement:</span>
                      <input 
                        type="text" 
                        className="field-input" 
                        value={formData.interventions.debridement}
                        onChange={(e) => updateNestedField('interventions', 'debridement', e.target.value)}
                      />
                    </div>
                    <div className="field-row">
                      <span className="field-label">Dressing:</span>
                      <input 
                        type="text" 
                        className="field-input" 
                        value={formData.interventions.dressing}
                        onChange={(e) => updateNestedField('interventions', 'dressing', e.target.value)}
                      />
                    </div>
                    <div className="field-row">
                      <span className="field-label">Adjunctive:</span>
                      <input 
                        type="text" 
                        className="field-input" 
                        value={formData.interventions.adjunctive}
                        onChange={(e) => updateNestedField('interventions', 'adjunctive', e.target.value)}
                      />
                    </div>
                    <div className="other-field">
                        <span className="field-label">Other:</span>
                        <input 
                          type="text" 
                          className="field-input" 
                          value={formData.interventions.other}
                          onChange={(e) => updateNestedField('interventions', 'other', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="section">
                    <div className="section-title">Patient Education</div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="wound-care" 
                            checked={formData.patientEducation.woundCare}
                            onChange={(e) => updateNestedField('patientEducation', 'woundCare', e.target.checked)}
                          />
                          <label htmlFor="wound-care">Wound care</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="nutrition" 
                            checked={formData.patientEducation.nutrition}
                            onChange={(e) => updateNestedField('patientEducation', 'nutrition', e.target.checked)}
                          />
                          <label htmlFor="nutrition">Nutrition</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="smoking" 
                            checked={formData.patientEducation.smoking}
                            onChange={(e) => updateNestedField('patientEducation', 'smoking', e.target.checked)}
                          />
                          <label htmlFor="smoking">Smoking</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="offloading" 
                            checked={formData.patientEducation.offloading}
                            onChange={(e) => updateNestedField('patientEducation', 'offloading', e.target.checked)}
                          />
                          <label htmlFor="offloading">Offloading</label>
                        </div>
                        <div className="inline-field">
                            <span className="field-label">Other:</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '120px' }} 
                              value={formData.patientEducation.other}
                              onChange={(e) => updateNestedField('patientEducation', 'other', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="section-title">Signs of Infection</div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="increased-pain" 
                            checked={formData.signsOfInfection.increasedPain}
                            onChange={(e) => updateNestedField('signsOfInfection', 'increasedPain', e.target.checked)}
                          />
                          <label htmlFor="increased-pain">Increased pain</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="erythema" 
                            checked={formData.signsOfInfection.erythema}
                            onChange={(e) => updateNestedField('signsOfInfection', 'erythema', e.target.checked)}
                          />
                          <label htmlFor="erythema">Erythema</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="edema" 
                            checked={formData.signsOfInfection.edema}
                            onChange={(e) => updateNestedField('signsOfInfection', 'edema', e.target.checked)}
                          />
                          <label htmlFor="edema">Edema</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="warmth" 
                            checked={formData.signsOfInfection.warmth}
                            onChange={(e) => updateNestedField('signsOfInfection', 'warmth', e.target.checked)}
                          />
                          <label htmlFor="warmth">Warmth</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="fever" 
                            checked={formData.signsOfInfection.fever}
                            onChange={(e) => updateNestedField('signsOfInfection', 'fever', e.target.checked)}
                          />
                          <label htmlFor="fever">Fever</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="purulent" 
                            checked={formData.signsOfInfection.purulent}
                            onChange={(e) => updateNestedField('signsOfInfection', 'purulent', e.target.checked)}
                          />
                          <label htmlFor="purulent">Purulent drainage</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="delayed" 
                            checked={formData.signsOfInfection.delayed}
                            onChange={(e) => updateNestedField('signsOfInfection', 'delayed', e.target.checked)}
                          />
                          <label htmlFor="delayed">Delayed healing</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="friable" 
                            checked={formData.signsOfInfection.friable}
                            onChange={(e) => updateNestedField('signsOfInfection', 'friable', e.target.checked)}
                          />
                          <label htmlFor="friable">Friable granulation</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="foul" 
                            checked={formData.signsOfInfection.foul}
                            onChange={(e) => updateNestedField('signsOfInfection', 'foul', e.target.checked)}
                          />
                          <label htmlFor="foul">Foul odor</label>
                        </div>
                        <div className="inline-field">
                            <span className="field-label">Other:</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '120px' }} 
                              value={formData.signsOfInfection.other}
                              onChange={(e) => updateNestedField('signsOfInfection', 'other', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>Photographed</span>
                            <div className="checkbox-item">
                              <input 
                                type="checkbox" 
                                id="photo-no" 
                                checked={formData.photographed}
                                onChange={(e) => updateField('photographed', e.target.checked)}
                              />
                              <label htmlFor="photo-no">No</label>
                            </div>
                            <span className="field-label" style={{ marginLeft: '8px' }}>Date:</span>
                            <input 
                              type="date" 
                              className="field-input" 
                              style={{ width: 'auto' }} 
                              value={formData.photographedDate}
                              onChange={(e) => updateField('photographedDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>FOLLOW-UP / NEXT STEPS:</span>
                            <div className="checkbox-item">
                                <input 
                                  type="checkbox" 
                                  id="continue" 
                                  checked={formData.followUp.continue}
                                  onChange={(e) => updateNestedField('followUp', 'continue', e.target.checked)}
                                />
                                <label htmlFor="continue" style={{ fontSize: '11px' }}>Cont. current treatment</label>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                        <div className="inline-fields" style={{ gap: '8px' }}>
                            <div className="inline-field" style={{ flex: 1 }}>
                                <div className="checkbox-item">
                                    <input 
                                      type="checkbox" 
                                      id="modify" 
                                      checked={formData.followUp.modify}
                                      onChange={(e) => updateNestedField('followUp', 'modify', e.target.checked)}
                                    />
                                    <label htmlFor="modify" style={{ fontSize: '11px' }}>Modify:</label>
                                </div>
                                <input 
                                  type="text" 
                                  className="field-input" 
                                  value={formData.followUp.modifyText}
                                  onChange={(e) => updateNestedField('followUp', 'modifyText', e.target.value)}
                                />
                            </div>
                            <div className="inline-field" style={{ flex: 1 }}>
                                <div className="checkbox-item">
                                    <input 
                                      type="checkbox" 
                                      id="consult" 
                                      checked={formData.followUp.consult}
                                      onChange={(e) => updateNestedField('followUp', 'consult', e.target.checked)}
                                    />
                                    <label htmlFor="consult" style={{ fontSize: '11px' }}>Consult:</label>
                                </div>
                                <input 
                                  type="text" 
                                  className="field-input" 
                                  value={formData.followUp.consultText}
                                  onChange={(e) => updateNestedField('followUp', 'consultText', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="inline-fields" style={{ gap: '8px' }}>
                            <div className="inline-field" style={{ flex: 1 }}>
                                <div className="checkbox-item">
                                    <input 
                                      type="checkbox" 
                                      id="labs" 
                                      checked={formData.followUp.labs}
                                      onChange={(e) => updateNestedField('followUp', 'labs', e.target.checked)}
                                    />
                                    <label htmlFor="labs" style={{ fontSize: '11px' }}>Labs:</label>
                                </div>
                                <input 
                                  type="text" 
                                  className="field-input" 
                                  value={formData.followUp.labsText}
                                  onChange={(e) => updateNestedField('followUp', 'labsText', e.target.value)}
                                />
                            </div>
                            <div className="inline-field" style={{ flex: 1 }}>
                                <span className="field-label" style={{ fontSize: '11px' }}>Other:</span>
                                <input 
                                  type="text" 
                                  className="field-input" 
                                  value={formData.followUp.other}
                                  onChange={(e) => updateNestedField('followUp', 'other', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>Next Assessment:</span>
                            <input 
                              type="datetime-local" 
                              className="field-input" 
                              value={formData.nextAssessment}
                              onChange={(e) => updateField('nextAssessment', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Wider */}
            <div className="right-column">
                <div className="section">
                    <div className="field-row">
                        <span className="field-label">Date of Injury:</span>
                        <input 
                          type="date" 
                          className="field-input" 
                          value={formData.dateOfInjury}
                          onChange={(e) => updateField('dateOfInjury', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="section">
                    <div className="section-title">Type of Wound</div>
                    <div className="wound-type-grid">
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="chronic" 
                            checked={formData.woundType.chronic}
                            onChange={(e) => updateNestedField('woundType', 'chronic', e.target.checked)}
                          />
                          <label htmlFor="chronic">Chronic wound</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="abrasion" 
                            checked={formData.woundType.abrasion}
                            onChange={(e) => updateNestedField('woundType', 'abrasion', e.target.checked)}
                          />
                          <label htmlFor="abrasion">Abrasion</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="acute" 
                            checked={formData.woundType.acute}
                            onChange={(e) => updateNestedField('woundType', 'acute', e.target.checked)}
                          />
                          <label htmlFor="acute">Acute wound</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="arterial" 
                            checked={formData.woundType.arterial}
                            onChange={(e) => updateNestedField('woundType', 'arterial', e.target.checked)}
                          />
                          <label htmlFor="arterial">Arterial ulcer</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="infected" 
                            checked={formData.woundType.infected}
                            onChange={(e) => updateNestedField('woundType', 'infected', e.target.checked)}
                          />
                          <label htmlFor="infected">Infected wound</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="burn" 
                            checked={formData.woundType.burn}
                            onChange={(e) => updateNestedField('woundType', 'burn', e.target.checked)}
                          />
                          <label htmlFor="burn">Burn</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="diabetic" 
                            checked={formData.woundType.diabetic}
                            onChange={(e) => updateNestedField('woundType', 'diabetic', e.target.checked)}
                          />
                          <label htmlFor="diabetic">Diabetic ulcer</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="laceration" 
                            checked={formData.woundType.laceration}
                            onChange={(e) => updateNestedField('woundType', 'laceration', e.target.checked)}
                          />
                          <label htmlFor="laceration">Laceration</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="surgical" 
                            checked={formData.woundType.surgical}
                            onChange={(e) => updateNestedField('woundType', 'surgical', e.target.checked)}
                          />
                          <label htmlFor="surgical">Surgical wound</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="pressure" 
                            checked={formData.woundType.pressure}
                            onChange={(e) => updateNestedField('woundType', 'pressure', e.target.checked)}
                          />
                          <label htmlFor="pressure">Pressure ulcer</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="puncture" 
                            checked={formData.woundType.puncture}
                            onChange={(e) => updateNestedField('woundType', 'puncture', e.target.checked)}
                          />
                          <label htmlFor="puncture">Puncture</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="venous" 
                            checked={formData.woundType.venous}
                            onChange={(e) => updateNestedField('woundType', 'venous', e.target.checked)}
                          />
                          <label htmlFor="venous">Venous ulcer</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="traumatic" 
                            checked={formData.woundType.traumatic}
                            onChange={(e) => updateNestedField('woundType', 'traumatic', e.target.checked)}
                          />
                          <label htmlFor="traumatic">Traumatic wound</label>
                        </div>
                        <div className="inline-field" style={{ gridColumn: 'span 3' }}>
                            <span className="field-label">Other:</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '100%' }} 
                              value={formData.woundType.other}
                              onChange={(e) => updateNestedField('woundType', 'other', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field" style={{ flex: 1 }}>
                            <span className="section-title" style={{ marginBottom: 0 }}>Wound Location:</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '100%' }} 
                              value={formData.woundLocation}
                              onChange={(e) => updateField('woundLocation', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>Dimensions (cm):</span>
                        </div>
                        <div className="inline-field">
                            <span className="field-label">L:</span>
                            <input 
                              type="number" 
                              className="field-input short" 
                              value={formData.dimensions.length}
                              onChange={(e) => updateNestedField('dimensions', 'length', e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        <div className="inline-field">
                            <span className="field-label">W:</span>
                            <input 
                              type="number" 
                              className="field-input short" 
                              value={formData.dimensions.width}
                              onChange={(e) => updateNestedField('dimensions', 'width', e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        <div className="inline-field">
                            <span className="field-label">D:</span>
                            <input 
                              type="number" 
                              className="field-input short" 
                              value={formData.dimensions.depth}
                              onChange={(e) => updateNestedField('dimensions', 'depth', e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="section-title">Appearance (% & Color)</div>
                    <div className="tissue-row">
                        <div className="tissue-field">
                          <input 
                            type="number" 
                            value={formData.appearance.epithelial}
                            onChange={(e) => updateNestedField('appearance', 'epithelial', e.target.value === '' ? '' : Number(e.target.value))}
                          />
                          <span>Epithelial</span>
                        </div>
                        <div className="tissue-field">
                          <input 
                            type="number" 
                            value={formData.appearance.granulation}
                            onChange={(e) => updateNestedField('appearance', 'granulation', e.target.value === '' ? '' : Number(e.target.value))}
                          />
                          <span>Granulation</span>
                        </div>
                        <div className="tissue-field">
                          <input 
                            type="number" 
                            value={formData.appearance.slough}
                            onChange={(e) => updateNestedField('appearance', 'slough', e.target.value === '' ? '' : Number(e.target.value))}
                          />
                          <span>Slough</span>
                        </div>
                        <div className="tissue-field">
                          <input 
                            type="number" 
                            value={formData.appearance.necrotic}
                            onChange={(e) => updateNestedField('appearance', 'necrotic', e.target.value === '' ? '' : Number(e.target.value))}
                          />
                          <span>Necrotic</span>
                        </div>
                    </div>
                    <div className="color-row">
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="pink" 
                            checked={formData.appearance.pink}
                            onChange={(e) => updateNestedField('appearance', 'pink', e.target.checked)}
                          />
                          <label htmlFor="pink">Pink</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="red" 
                            checked={formData.appearance.red}
                            onChange={(e) => updateNestedField('appearance', 'red', e.target.checked)}
                          />
                          <label htmlFor="red">Red</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="yellow" 
                            checked={formData.appearance.yellow}
                            onChange={(e) => updateNestedField('appearance', 'yellow', e.target.checked)}
                          />
                          <label htmlFor="yellow">Yellow</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="black" 
                            checked={formData.appearance.black}
                            onChange={(e) => updateNestedField('appearance', 'black', e.target.checked)}
                          />
                          <label htmlFor="black">Black</label>
                        </div>
                        <div className="inline-field">
                            <span className="field-label">Other:</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '80px' }} 
                              value={formData.appearance.other}
                              onChange={(e) => updateNestedField('appearance', 'other', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="section-title">Edges & Exudate</div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="well-defined" 
                            checked={formData.edges.wellDefined}
                            onChange={(e) => updateNestedField('edges', 'wellDefined', e.target.checked)}
                          />
                          <label htmlFor="well-defined">Well-defined</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="irregular" 
                            checked={formData.edges.irregular}
                            onChange={(e) => updateNestedField('edges', 'irregular', e.target.checked)}
                          />
                          <label htmlFor="irregular">Irregular</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="rolled" 
                            checked={formData.edges.rolled}
                            onChange={(e) => updateNestedField('edges', 'rolled', e.target.checked)}
                          />
                          <label htmlFor="rolled">Rolled</label>
                        </div>
                    </div>
                    <div className="field-row" style={{ marginTop: '4px' }}>
                        <span className="field-label">Exudate:</span>
                        <select 
                          className="field-input"
                          value={formData.exudate}
                          onChange={(e) => updateField('exudate', e.target.value as any)}
                        >
                            <option value="None">None</option>
                            <option value="Light">Light</option>
                            <option value="Mod">Mod</option>
                            <option value="Heavy">Heavy</option>
                        </select>
                    </div>
                </div>

                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>Odor:</span>
                            <select 
                              className="field-input short"
                              value={formData.odor}
                              onChange={(e) => updateField('odor', e.target.value as any)}
                            >
                              <option value="None">None</option>
                              <option value="Mild">Mild</option>
                              <option value="Mod">Mod</option>
                              <option value="Strong">Strong</option>
                            </select>
                        </div>
                        <div className="inline-field">
                            <span className="field-label">Characteristics:</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '80px' }} 
                              value={formData.odorCharacteristics}
                              onChange={(e) => updateField('odorCharacteristics', e.target.value)}
                            />
                        </div>
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>Pain:</span>
                            <input 
                              type="number" 
                              className="field-input short" 
                              placeholder="0-10" 
                              value={formData.painLevel}
                              onChange={(e) => updateField('painLevel', e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="section-title">Periwound Skin</div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="intact" 
                            checked={formData.periwoundSkin.intact}
                            onChange={(e) => updateNestedField('periwoundSkin', 'intact', e.target.checked)}
                          />
                          <label htmlFor="intact">Intact</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="peri-erythema" 
                            checked={formData.periwoundSkin.erythema}
                            onChange={(e) => updateNestedField('periwoundSkin', 'erythema', e.target.checked)}
                          />
                          <label htmlFor="peri-erythema">Erythema</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="macerated" 
                            checked={formData.periwoundSkin.macerated}
                            onChange={(e) => updateNestedField('periwoundSkin', 'macerated', e.target.checked)}
                          />
                          <label htmlFor="macerated">Macerated</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="indurated" 
                            checked={formData.periwoundSkin.indurated}
                            onChange={(e) => updateNestedField('periwoundSkin', 'indurated', e.target.checked)}
                          />
                          <label htmlFor="indurated">Indurated</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="excoriated" 
                            checked={formData.periwoundSkin.excoriated}
                            onChange={(e) => updateNestedField('periwoundSkin', 'excoriated', e.target.checked)}
                          />
                          <label htmlFor="excoriated">Excoriated</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="dry" 
                            checked={formData.periwoundSkin.dry}
                            onChange={(e) => updateNestedField('periwoundSkin', 'dry', e.target.checked)}
                          />
                          <label htmlFor="dry">Dry/Flaky</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="callused" 
                            checked={formData.periwoundSkin.callused}
                            onChange={(e) => updateNestedField('periwoundSkin', 'callused', e.target.checked)}
                          />
                          <label htmlFor="callused">Callused</label>
                        </div>
                        <div className="checkbox-item">
                          <input 
                            type="checkbox" 
                            id="hyper" 
                            checked={formData.periwoundSkin.hyperPigmented}
                            onChange={(e) => updateNestedField('periwoundSkin', 'hyperPigmented', e.target.checked)}
                          />
                          <label htmlFor="hyper">Hyper-pigmented</label>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>Tunneling:</span>
                            <span className="field-label">Location</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '80px' }} 
                              value={formData.tunneling.location}
                              onChange={(e) => updateNestedField('tunneling', 'location', e.target.value)}
                            />
                            <span className="field-label">Depth</span>
                            <input 
                              type="number" 
                              className="field-input" 
                              style={{ width: '50px' }} 
                              step="0.1" 
                              value={formData.tunneling.depth}
                              onChange={(e) => updateNestedField('tunneling', 'depth', e.target.value === '' ? '' : Number(e.target.value))}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>cm</span>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="inline-fields">
                        <div className="inline-field">
                            <span className="section-title" style={{ marginBottom: 0 }}>Undermining:</span>
                            <span className="field-label">Location</span>
                            <input 
                              type="text" 
                              className="field-input" 
                              style={{ width: '80px' }} 
                              value={formData.undermining.location}
                              onChange={(e) => updateNestedField('undermining', 'location', e.target.value)}
                            />
                            <span className="field-label">Depth</span>
                            <input 
                              type="number" 
                              className="field-input" 
                              style={{ width: '50px' }} 
                              step="0.1" 
                              value={formData.undermining.depth}
                              onChange={(e) => updateNestedField('undermining', 'depth', e.target.value === '' ? '' : Number(e.target.value))}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>cm</span>
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="inline-fields" style={{ width: '100%' }}>
                        <div className="inline-field" style={{ alignItems: 'flex-start', width: '100%' }}>
                            <span className="section-title" style={{ marginBottom: 0, marginRight: '12px' }}>Notes:</span>
                            <div style={{ flex: 1 }}>
                                <textarea 
                                  className="notes-area" 
                                  style={{ height: '140px', width: '100%' }} 
                                  placeholder="Additional observations and notes..."
                                  value={formData.notes}
                                  onChange={(e) => updateField('notes', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
