import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, EditNote as EditNoteIcon } from '@mui/icons-material';
import type { Project } from '../../types/project';

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSaveProject: (updatedProject: Project) => void;
}

const CATEGORIES = ['General', 'Banking & Finance', 'Utilities & Energy', 'Healthcare', 'E-Commerce', 'SaaS Platform'];
const ICON_OPTIONS = ['folder', 'account_balance', 'electric_bolt', 'medical_services', 'shopping_cart', 'cloud', 'terminal', 'code', 'hub'];

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSaveProject,
}) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [status, setStatus] = useState('Ongoing');
  const [icon, setIcon] = useState('folder');
  const [category, setCategory] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDesc(project.desc || '');
      setBaseUrl(project.baseUrl || '');
      setStatus(project.status || 'Ongoing');
      setIcon(project.icon || 'folder');
      setCategory(project.category || 'General');
      setTagsInput(project.tags ? project.tags.join(', ') : '');
      setError('');
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updated: Project = {
      ...project,
      name: name.trim(),
      desc: desc.trim(),
      baseUrl: baseUrl.trim(),
      status,
      icon,
      category,
      tags,
      updatedAt: new Date().toISOString(),
    };

    onSaveProject(updated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: 'rgba(2, 128, 144, 0.12)',
              border: '1px solid rgba(2, 128, 144, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#028090',
            }}
          >
            <EditNoteIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0B1740', lineHeight: 1.2 }}>
              Edit Project
            </Typography>
            <Typography variant="caption" sx={{ color: '#64708A' }}>
              Update details for {project.name}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ py: 2.5 }}>
          {error ? (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
              {error}
            </Alert>
          ) : null}

          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Project Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Enterprise Banking Platform"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Project Base URL (Optional)
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="url"
              placeholder="e.g. https://api.myproject.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Project Description (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter project description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={status} onChange={(e) => setStatus(e.target.value as string)}>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Pending BRD">Pending BRD</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Project Icon
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={icon} onChange={(e) => setIcon(e.target.value as string)}>
                  {ICON_OPTIONS.map((ic) => (
                    <MenuItem key={ic} value={ic}>
                      {ic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              backgroundColor: '#34b9cb',
              '&:hover': { backgroundColor: '#028090' },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
