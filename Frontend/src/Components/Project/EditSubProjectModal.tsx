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
import { Close as CloseIcon, EditNote as EditNoteIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import type { SubProject, EnvironmentUrl } from '../../types/project';

interface EditSubProjectModalProps {
  isOpen: boolean;
  parentProjectId: string;
  subProject: SubProject | null;
  onClose: () => void;
  onSaveSubProject: (parentId: string, updatedSubProject: SubProject) => void;
}

export const EditSubProjectModal: React.FC<EditSubProjectModalProps> = ({
  isOpen,
  parentProjectId,
  subProject,
  onClose,
  onSaveSubProject,
}) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('layers');
  const [type, setType] = useState('Web Application');
  const [urls, setUrls] = useState<EnvironmentUrl[]>([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (subProject) {
      setName(subProject.name || '');
      setDesc(subProject.desc || '');
      setIcon(subProject.icon || 'layers');
      setType(subProject.type || 'Web Application');
      setUrls(subProject.urls ? [...subProject.urls] : []);
      setError('');
    }
  }, [subProject, isOpen]);

  if (!isOpen || !subProject) return null;

  const handleAddUrl = () => {
    setUrls([...urls, { env: 'STG', url: 'https://' }]);
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, field: 'env' | 'url', value: string) => {
    const next = [...urls];
    next[index][field] = value;
    setUrls(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Sub-project name is required.');
      return;
    }

    setIsSaving(true);
    const updated: SubProject = {
      ...subProject,
      name: name.trim(),
      desc: desc.trim(),
      icon,
      type,
      urls: urls.filter((u) => u.url.trim().length > 0),
    };

    onSaveSubProject(parentProjectId, updated);
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
            maxHeight: '88vh',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            display: 'flex',
            flexDirection: 'column',
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
          flexShrink: 0,
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
              Edit Sub-Project
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '13px', display: 'block', mt: 0.3 }}>
              Update workspace settings for {subProject.name}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} aria-label="close" sx={{ color: '#64748B' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <DialogContent
          sx={{
            p: '28px 32px',
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F1F5F9',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#CBD5E1',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: '#94A3B8',
              },
            },
          }}
        >
          {error ? (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
              {error}
            </Alert>
          ) : null}

          {/* Sub Project Name */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Sub-Project Name <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              autoFocus
              placeholder="e.g. Mobile Banking App"
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

          {/* Type Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Application Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as string)}
                sx={{
                  height: 44,
                  borderRadius: '10px',
                  fontSize: '14px',
                  '& fieldset': { borderColor: '#E5E7EB' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                  '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                }}
              >
                <MenuItem value="Web Application">Web Application</MenuItem>
                <MenuItem value="Mobile App (iOS/Android)">Mobile App (iOS/Android)</MenuItem>
                <MenuItem value="Core REST / GraphQL API">Core REST / GraphQL API</MenuItem>
                <MenuItem value="Cloud Engine Service">Cloud Engine Service</MenuItem>
                <MenuItem value="Microservice">Microservice</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Sub-Project Description <Typography component="span" sx={{ color: '#94A3B8', fontSize: '12px' }}>(Optional)</Typography>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter sub-project description..."
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

          {/* Environment Endpoints */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>
                Environment Endpoints <Typography component="span" sx={{ color: '#94A3B8', fontSize: '12px' }}>(Optional)</Typography>
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddUrl}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '13px', color: '#028090' }}
              >
                Add Endpoint
              </Button>
            </Box>

            {urls.map((u, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <FormControl size="small" sx={{ width: 110 }}>
                  <Select
                    value={u.env}
                    onChange={(e) => handleUrlChange(i, 'env', e.target.value as string)}
                    sx={{
                      height: 44,
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      '& fieldset': { borderColor: '#E5E7EB' },
                    }}
                  >
                    <MenuItem value="DEV">DEV</MenuItem>
                    <MenuItem value="STG">STG</MenuItem>
                    <MenuItem value="QA">QA</MenuItem>
                    <MenuItem value="UAT">UAT</MenuItem>
                    <MenuItem value="PROD">PROD</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://staging.app.com"
                  value={u.url}
                  onChange={(e) => handleUrlChange(i, 'url', e.target.value)}
                  variant="outlined"
                  sx={inputStyles}
                />

                <IconButton size="small" onClick={() => handleRemoveUrl(i)} sx={{ color: '#EF4444' }}>
                  <DeleteIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions sx={{ p: '20px 32px', borderTop: '1px solid #F1F5F9', gap: 1.5, flexShrink: 0 }}>
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
