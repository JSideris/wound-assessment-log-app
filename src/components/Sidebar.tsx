import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from '../context/FormContext';
import type { WoundAssessment } from '../types/form';
import { ConfirmationModal } from './ConfirmationModal';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { savedForms, loadForm, deleteSavedForm, createFollowup } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedEncounters, setExpandedEncounters] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Close menu when clicking anywhere else
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    // Use capture to ensure it runs even if propagation is stopped internally
    // but wait, toggleMenu stops propagation to prevent triggering the card click.
    // We want the document to catch it.
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const groupedForms = useMemo(() => {
    const groups: { [key: string]: WoundAssessment[] } = {};
    
    savedForms.forEach(form => {
      const eId = form.encounterId || form.id!;
      if (!groups[eId]) groups[eId] = [];
      groups[eId].push(form);
    });

    return Object.entries(groups).map(([eId, forms]) => {
      const sortedForms = [...forms].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
      return {
        encounterId: eId,
        latestForm: sortedForms[0],
        allForms: sortedForms,
      };
    }).sort((a, b) => (b.latestForm.lastModified || 0) - (a.latestForm.lastModified || 0));
  }, [savedForms]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groupedForms;
    
    const term = searchTerm.toLowerCase();
    return groupedForms.filter(group => {
      return group.allForms.some(form => 
        (form.patientName || '').toLowerCase().includes(term) ||
        (form.idMrn || '').toLowerCase().includes(term)
      );
    });
  }, [groupedForms, searchTerm]);

  const toggleEncounter = (e: React.MouseEvent, encounterId: string) => {
    e.stopPropagation();
    setExpandedEncounters(prev => {
      const next = new Set(prev);
      if (next.has(encounterId)) next.delete(encounterId);
      else next.add(encounterId);
      return next;
    });
  };

  const mapSex = (sex: string): string => {
    const s = (sex || '').toLowerCase().trim();
    if (!s) return '?';
    if (['m', 'male', 'man', 'mab'].includes(s)) return 'M';
    if (['f', 'female', 'w', 'woman', 'fab'].includes(s)) return 'F';
    if (['mtf', 'm2f', 'ftm', 'f2m', 'trans', 'x'].some(v => s.includes(v))) return 'X';
    return s.charAt(0).toUpperCase();
  };

  const truncate = (str: string, n: number) => {
    const s = str || '';
    return s.length > n ? s.slice(0, n - 1) + '...' : s;
  };

  const getDisplayDate = (formDate?: string, lastModified?: number) => {
    if (formDate && formDate.trim() !== '') {
      const d = new Date(formDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString();
      }
    }
    if (lastModified) {
      return new Date(lastModified).toLocaleDateString();
    }
    return '';
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteSavedForm(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3>Past Forms</h3>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search name or MRN..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="sidebar-content">
        {filteredGroups.length === 0 ? (
          <div className="no-forms">No forms found</div>
        ) : (
          filteredGroups.map(group => {
            const { latestForm, encounterId, allForms } = group;
            const isExpanded = expandedEncounters.has(encounterId);
            const isAnyMenuOpen = allForms.some(f => f.id === openMenuId);

            return (
              <div 
                key={encounterId} 
                className={`encounter-group ${isExpanded ? 'expanded' : ''} ${isAnyMenuOpen ? 'menu-open' : ''}`}
              >
                <div 
                  className={`form-card main-card ${openMenuId === latestForm.id ? 'menu-open' : ''}`}
                  onClick={() => loadForm(latestForm.id!)}
                >
                  <div className="card-header">
                    <div className="patient-info">
                      {truncate(latestForm.patientName || 'No Name', 18)} / {latestForm.age || '?'} / {mapSex(latestForm.sex || '')}
                    </div>
                    <div className="menu-container">
                      <button 
                        className="menu-button"
                        onClick={(e) => toggleMenu(e, latestForm.id!)}
                      >
                        ⋮
                      </button>
                      {openMenuId === latestForm.id && (
                        <div className="dropdown-menu">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              createFollowup(latestForm.id!);
                              setOpenMenuId(null);
                            }}
                            className="followup-btn"
                          >
                            Create Followup
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClick(e, latestForm.id!)}
                          >
                            Delete Followup
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card-details-row">
                    <div className="card-bed">
                      <span className="card-label">Room/Bed:</span>
                      {latestForm.bedRoom || '-'}
                    </div>
                    <div className="card-date">
                      {getDisplayDate(latestForm.date, latestForm.lastModified)}
                    </div>
                  </div>
                  {allForms.length > 1 && (
                    <button 
                      className="expand-toggle"
                      onClick={(e) => toggleEncounter(e, encounterId)}
                    >
                      {isExpanded ? '▴ Hide History' : `▾ View History (${allForms.length - 1} more)`}
                    </button>
                  )}
                </div>
                
                {isExpanded && (
                  <div className="history-list">
                    {allForms.slice(1).map(form => (
                      <div 
                        key={form.id} 
                        className={`form-card history-card ${openMenuId === form.id ? 'menu-open' : ''}`}
                        onClick={() => loadForm(form.id!)}
                      >
                        <div className="card-header">
                          <div className="patient-info">
                            {getDisplayDate(form.date, form.lastModified)}
                          </div>
                          <div className="menu-container">
                            <button 
                              className="menu-button"
                              onClick={(e) => toggleMenu(e, form.id!)}
                            >
                              ⋮
                            </button>
                            {openMenuId === form.id && (
                              <div className="dropdown-menu">
                                <button 
                                  onClick={(e) => handleDeleteClick(e, form.id!)}
                                >
                                  Delete Past Log
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="card-details-row">
                          <div className="card-bed">
                            {form.isFollowup ? 'Followup Assessment' : 'Initial Assessment'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Confirm Deletion"
        message="Are you sure you want to delete this assessment? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        type="danger"
      />
    </aside>
  );
};
