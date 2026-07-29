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
  Chip,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Project, SubProject, EnvironmentUrl } from '../../types/project';
import { TestDNAIcon } from './TestDNAIcon';

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
  const [creationMethod, setCreationMethod] = useState<'direct' | 'jira'>('direct');
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
    setUrls([...urls, { env: 'STG', url: '' }]);
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
    setCreationMethod('direct');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0B1740', letterSpacing: '-0.3px', margin: 0 }}>
            Create Sub Project
          </Typography>
          <Typography variant="caption" sx={{ color: '#64708A' }}>
            Configure a targeted sub-project workspace under{' '}
            <strong style={{ color: '#028090' }}>{currentParent?.name || 'Parent Project'}</strong>
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ py: 2.5 }}>
          {/* Creation Method Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 1, textTransform: 'uppercase' }}>
              Creation method <span style={{ color: '#D90429' }}>*</span>
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {/* Option 1: Create in TestDNA */}
              <Box
                onClick={() => setCreationMethod('direct')}
                sx={{
                  border: '2px solid',
                  borderColor: creationMethod === 'direct' ? '#34b9cb' : '#E2E8F0',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  backgroundColor: creationMethod === 'direct' ? 'rgba(52, 185, 203, 0.04)' : '#ffffff',
                  boxShadow: creationMethod === 'direct' ? '0 4px 12px rgba(52, 185, 203, 0.12)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#34b9cb',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      backgroundColor: '#FEF2F2',
                      color: '#34b9cb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <TestDNAIcon size={24} variant="red" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0B1740' }}>
                        Create in TestDNA
                      </Typography>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: creationMethod === 'direct' ? '#34b9cb' : '#CBD5E1',
                          backgroundColor: creationMethod === 'direct' ? '#34b9cb' : 'transparent',
                          boxShadow: creationMethod === 'direct' ? 'inset 0 0 0 3px #ffffff' : 'none',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64708A', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
                      Build your sub-project workspace directly from scratch
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Option 2: Import from Jira (Disabled) */}
              <Box
                sx={{
                  border: '2px solid #F1F5F9',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'not-allowed',
                  backgroundColor: '#F8FAFC',
                  opacity: 0.7,
                }}
                title="Jira integration is coming soon!"
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      backgroundColor: '#E0F2FE',
                      color: '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.571 11.513H0a11.534 11.534 0 0 0 11.513 11.513V11.513zm.858-11.513v11.513H24A11.534 11.534 0 0 0 12.429 0zM12.429 12.429V24C18.788 24 24 18.788 24 12.429H12.429z" />
                    </svg>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748B' }}>
                        Import from Jira
                      </Typography>
                      <Chip
                        label="In Progress"
                        size="small"
                        sx={{
                          backgroundColor: '#FFF7ED',
                          color: '#C2410C',
                          border: '1px solid #FFEDD5',
                          fontWeight: 700,
                          fontSize: '10.5px',
                          height: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
                      Import tickets and epics directly from Jira workspace
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Parent Project Selector */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Parent Project Name <span style={{ color: '#D90429' }}>*</span>
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={parentId} onChange={(e) => setParentId(e.target.value as string)} required>
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Sub Project Name & Type */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Sub Project Name <span style={{ color: '#D90429' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Mobile Banking App"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Sub Project Type
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={type} onChange={(e) => setType(e.target.value as string)}>
                  <MenuItem value="Web Application">Web Application</MenuItem>
                  <MenuItem value="Mobile App (iOS/Android)">Mobile App (iOS/Android)</MenuItem>
                  <MenuItem value="Core REST / GraphQL API">Core REST / GraphQL API</MenuItem>
                  <MenuItem value="Cloud Engine Service">Cloud Engine Service</MenuItem>
                  <MenuItem value="Microservice">Microservice</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Sub Project Description */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Sub Project Description (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Short description of this sub-project application..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              variant="outlined"
            />
          </Box>

          {/* Environment URLs Section */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', textTransform: 'uppercase' }}>
                Environment Endpoints
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={addUrlRow}
                sx={{ textTransform: 'none', borderRadius: '6px', fontSize: '12px', py: 0.3 }}
              >
                + Add Endpoint
              </Button>
            </Box>

            {urls.length === 0 ? (
              <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic', display: 'block', py: 1 }}>
                No URLs added yet. Click "+ Add Endpoint" to define dev, staging, or production endpoints.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 180, overflowY: 'auto', pr: 0.5 }}>
                {urls.map((row, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Env (STG/QA/PROD)"
                      value={row.env}
                      onChange={(e) => handleUrlChange(idx, 'env', e.target.value)}
                      sx={{ width: 130 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="https://app.myproject.com/stg"
                      value={row.url}
                      onChange={(e) => handleUrlChange(idx, 'url', e.target.value)}
                    />
                    <IconButton size="small" onClick={() => removeUrlRow(idx)} sx={{ color: '#EF4444' }}>
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              px: 3,
              backgroundColor: '#34b9cb',
              '&:hover': { backgroundColor: '#028090' },
            }}
          >
            Create Sub Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
