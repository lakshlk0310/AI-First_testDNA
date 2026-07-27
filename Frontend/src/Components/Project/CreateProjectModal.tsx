import React, { useState } from 'react';
import type { Project } from '../../types/project';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProject: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [tags, setTags] = useState('');
  const [icon, setIcon] = useState('folder');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a project name.');
      return;
    }

    const id = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const finalCategory = category === 'Other' ? customCategory.trim() : category.trim();

    const parsedTags = tags.trim()
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const newProj: Project = {
      id,
      name: name.trim(),
      desc: desc.trim(),
      category: finalCategory,
      tags: parsedTags,
      icon: icon || 'folder',
      createdAt: new Date().toISOString(),
      subProjects: [], // Empty subprojects array — no hardcoded defaults
    };

    onCreateProject(newProj);
    setName('');
    setDesc('');
    setCategory('');
    setCustomCategory('');
    setTags('');
    setIcon('folder');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Create New Project</h3>
        <p>Define a new main project workspace to organize test cases, execution runs, and environments.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Project Name *</label>
            <input
              type="text"
              placeholder="e.g. Enterprise Banking Platform"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              placeholder="Enter project scope, key deliverables, or system architecture notes..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{ minHeight: '75px' }}
            />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Industry Category</label>
              <select
                className="proj-dropdown"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                <option value="FinTech & Banking">FinTech &amp; Banking</option>
                <option value="Utility & Energy">Utility &amp; Energy</option>
                <option value="Healthcare & EHR">Healthcare &amp; EHR</option>
                <option value="AI Platform & ML">AI Platform &amp; ML</option>
                <option value="E-Commerce & Retail">E-Commerce &amp; Retail</option>
                <option value="Enterprise SaaS">Enterprise SaaS</option>
                <option value="Other">Other / Custom</option>
              </select>
            </div>

            <div className="field">
              <label>Icon Symbol</label>
              <select className="proj-dropdown" value={icon} onChange={(e) => setIcon(e.target.value)}>
                <option value="folder">Folder Icon</option>
                <option value="account_balance">Bank / Finance</option>
                <option value="bolt">Energy / Utility</option>
                <option value="medical_services">Healthcare</option>
                <option value="memory">AI / Technology</option>
                <option value="shopping_cart">E-Commerce</option>
                <option value="cloud">Cloud Service</option>
              </select>
            </div>
          </div>

          {category === 'Other' && (
            <div className="field">
              <label>Custom Category Name</label>
              <input
                type="text"
                placeholder="e.g. Telecommunications"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label>Project Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Core, Critical, API, Web"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-sm btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-sm btn-teal">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
