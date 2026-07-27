import React, { useState, useEffect } from 'react';
import type { Project, SubProject, EnvironmentUrl } from '../../types/project';

interface CreateSubProjectModalProps {
  isOpen: boolean;
  projects: Project[];
  selectedParentId?: string;
  onClose: () => void;
  onCreateSubProject: (parentId: string, newSubProject: SubProject) => void;
}

export const CreateSubProjectModal: React.FC<CreateSubProjectModalProps> = ({
  isOpen,
  projects,
  selectedParentId,
  onClose,
  onCreateSubProject,
}) => {
  const [parentId, setParentId] = useState(selectedParentId || projects[0]?.id || '');
  const [name, setName] = useState('');
  const [type, setType] = useState('Web Application');
  const [desc, setDesc] = useState('');
  const [urls, setUrls] = useState<EnvironmentUrl[]>([]);

  useEffect(() => {
    if (selectedParentId) {
      setParentId(selectedParentId);
    } else if (projects.length > 0) {
      setParentId(projects[0].id);
    }
  }, [selectedParentId, projects]);

  if (!isOpen) return null;

  const currentParent = projects.find((p) => p.id === parentId) || projects[0];

  const handleUrlChange = (index: number, field: 'env' | 'url', value: string) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addUrlRow = () => {
    setUrls([...urls, { env: '', url: '' }]);
  };

  const removeUrlRow = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a sub-project name.');
      return;
    }

    if (!parentId) {
      alert('Please select a valid parent project.');
      return;
    }

    const validUrls = urls.filter((u) => u.url.trim() !== '');

    const newSub: SubProject = {
      id: `${parentId}_${Date.now()}`,
      name: name.trim(),
      desc: desc.trim(),
      type: type,
      icon: type.includes('Mobile') ? 'smartphone' : type.includes('API') ? 'api' : 'web',
      createdAt: new Date().toISOString(),
      urls: validUrls,
    };

    onCreateSubProject(parentId, newSub);
    setName('');
    setDesc('');
    setUrls([]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <h3>Create Sub Project</h3>
        <p>
          Configure a targeted sub-project workspace under{' '}
          <strong style={{ color: 'var(--teal)' }}>{currentParent?.name || 'Parent Project'}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Parent Project Name *</label>
            <select
              className="proj-dropdown"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Sub Project Name *</label>
              <input
                type="text"
                placeholder="e.g. Mobile Banking App"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Sub Project Type</label>
              <select className="proj-dropdown" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Web Application">Web Application</option>
                <option value="Mobile App (iOS/Android)">Mobile App (iOS/Android)</option>
                <option value="Core REST / GraphQL API">Core REST / GraphQL API</option>
                <option value="Cloud Engine Service">Cloud Engine Service</option>
                <option value="Microservice">Microservice</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Sub Project Description</label>
            <input
              type="text"
              placeholder="Short description of this subproject..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ margin: 0 }}>Environment URLs</label>
              <button
                type="button"
                className="btn-sm btn-ghost"
                style={{ fontSize: '11px', padding: '3px 8px' }}
                onClick={addUrlRow}
              >
                + Add URL
              </button>
            </div>

            {urls.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic', padding: '6px 0' }}>
                No URLs added yet. Click "+ Add URL" to define dev, staging, or production endpoints.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {urls.map((row, idx) => (
                  <div key={idx} className="url-row">
                    <input
                      type="text"
                      placeholder="Env (Dev/Stage/Prod)"
                      value={row.env}
                      onChange={(e) => handleUrlChange(idx, 'env', e.target.value)}
                      style={{
                        width: '130px',
                        padding: '8px 10px',
                        fontSize: '12px',
                        border: '1.5px solid var(--border)',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    />
                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={row.url}
                      onChange={(e) => handleUrlChange(idx, 'url', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        fontSize: '12px',
                        border: '1.5px solid var(--border)',
                        borderRadius: '6px',
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        color: 'var(--danger)',
                        background: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      onClick={() => removeUrlRow(idx)}
                      title="Remove URL"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-sm btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-sm btn-teal">
              Create Sub Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
