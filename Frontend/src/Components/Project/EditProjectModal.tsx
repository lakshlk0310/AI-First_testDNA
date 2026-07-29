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

const ICON_OPTIONS = [
  'folder',
  'account_balance',
  'electric_bolt',
  'medical_services',
  'shopping_cart',
  'cloud',
  'terminal',
  'code',
  'hub',
];

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
  const [isSaving, setIsSaving] = useState(false);

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

    setIsSaving(true);
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
    setIsSaving(false);
    onClose();
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      height: 44,
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: '#FFFFFF',
      transition: 'all 0.2s ease-in-out',
      '& fieldset': { borderColor: '#E5E7EB' },
      '&:hover fieldset': { borderColor: '#CBD5E1' },
      '&.Mui-focused fieldset': {
        borderColor: '#3B82F6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
      },
    },
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxWidth: '720px',
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: '#E0F2FE',
              color: '#028090',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <EditNoteIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', color: '#0F172A', lineHeight: 1.2 }}>
              Edit Project
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '13px', display: 'block', mt: 0.3 }}>
              Update workspace settings for {project.name}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} aria-label="close" sx={{ color: '#64748B' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: '28px 32px' }}>
          {error ? (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
              {error}
            </Alert>
          ) : null}

          {/* Project Name */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Project Name <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              autoFocus
              placeholder="e.g. Enterprise Banking Platform"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
              variant="outlined"
              sx={inputStyles}
            />
          </Box>

          {/* Project Base URL */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Project Base URL <Typography component="span" sx={{ color: '#94A3B8', fontSize: '12px' }}>(Optional)</Typography>
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="url"
              placeholder="e.g. https://api.myproject.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              variant="outlined"
              sx={inputStyles}
            />
          </Box>

          {/* Project Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Project Description <Typography component="span" sx={{ color: '#94A3B8', fontSize: '12px' }}>(Optional)</Typography>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter project description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  minHeight: '80px',
                  transition: 'all 0.2s ease-in-out',
                  '& fieldset': { borderColor: '#E5E7EB' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3B82F6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
                  },
                },
              }}
            />
          </Box>

          {/* Status & Icon */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            {/* <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
                Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as string)}
                  sx={{
                    height: 44,
                    borderRadius: '10px',
                    fontSize: '14px',
                    '& fieldset': { borderColor: '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                  }}
                >
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Pending BRD">Pending BRD</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box> */}

            {/* <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
                Project Icon
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value as string)}
                  sx={{
                    height: 44,
                    borderRadius: '10px',
                    fontSize: '14px',
                    '& fieldset': { borderColor: '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                  }}
                >
                  {ICON_OPTIONS.map((ic) => (
                    <MenuItem key={ic} value={ic}>
                      {ic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box> */}
          </Box>
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions sx={{ p: '20px 32px', borderTop: '1px solid #F1F5F9', gap: 1.5 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              height: 42,
              px: 2.5,
              fontWeight: 600,
              fontSize: '14px',
              borderColor: '#CBD5E1',
              color: '#334155',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!name.trim() || isSaving}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              height: 42,
              px: 3,
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: '#34b9cb',
              boxShadow: '0 2px 8px rgba(52, 185, 203, 0.3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#028090',
                boxShadow: '0 4px 12px rgba(2, 128, 144, 0.35)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#E2E8F0',
                color: '#94A3B8',
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
