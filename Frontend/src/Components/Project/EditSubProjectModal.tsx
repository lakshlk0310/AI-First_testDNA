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
import { Close as CloseIcon, EditNote as EditNoteIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { SubProject, EnvironmentUrl } from '../../types/project';

interface EditSubProjectModalProps {
  isOpen: boolean;
  parentProjectId: string;
  subProject: SubProject | null;
  onClose: () => void;
  onSaveSubProject: (parentId: string, updatedSubProject: SubProject) => void;
}

const SUB_TYPES = ['Web Application', 'Mobile App (iOS/Android)', 'Core REST / GraphQL API', 'Cloud Engine Service', 'Microservice'];
const ICON_OPTIONS = ['layers', 'language', 'smartphone', 'api', 'database', 'terminal', 'dashboard'];

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

    const updated: SubProject = {
      ...subProject,
      name: name.trim(),
      desc: desc.trim(),
      icon,
      type,
      urls: urls.filter((u) => u.url.trim().length > 0),
    };

    onSaveSubProject(parentProjectId, updated);
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
              Edit Sub-Project
            </Typography>
            <Typography variant="caption" sx={{ color: '#64708A' }}>
              Update details for {subProject.name}
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

          {/* Sub Project Name * */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Sub-Project Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Mobile Banking App"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
              variant="outlined"
            />
          </Box>

          {/* Description */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Sub-Project Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Brief summary of sub-project application..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              variant="outlined"
            />
          </Box>

          {/* Type & Icon */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Application Type
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={type} onChange={(e) => setType(e.target.value as string)}>
                  {SUB_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Icon Symbol
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

          {/* Environment Endpoints */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', textTransform: 'uppercase' }}>
                Environment Endpoints
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddUrl}
                sx={{ textTransform: 'none', borderRadius: '6px', fontSize: '12px', py: 0.3 }}
              >
                + Add Endpoint
              </Button>
            </Box>

            {urls.length === 0 ? (
              <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic', display: 'block', py: 1 }}>
                No environment endpoints added. Click "+ Add Endpoint" to add STG, QA, or PROD URLs.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 180, overflowY: 'auto', pr: 0.5 }}>
                {urls.map((u, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="ENV (e.g. STG)"
                      value={u.env}
                      onChange={(e) => handleUrlChange(i, 'env', e.target.value)}
                      sx={{ width: 110 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="https://app.dewa.gov.ae/stg"
                      value={u.url}
                      onChange={(e) => handleUrlChange(i, 'url', e.target.value)}
                    />
                    <IconButton size="small" onClick={() => handleRemoveUrl(i)} sx={{ color: '#EF4444' }}>
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
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
