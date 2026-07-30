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
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon, LayersOutlined as LayersOutlinedIcon } from '@mui/icons-material';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!name.trim() || !parentId) return;

    setIsSubmitting(true);
    const validUrls = urls.filter((u) => u.url.trim() !== '');

    const newSub: SubProject = {
      id: `${parentId}_${Date.now()}`,
      name: name.trim(),
      desc: desc.trim(),
      type: type,
      createdAt: new Date().toISOString(),
      urls: validUrls,
      userStoriesCount: 0,
      testCasesCount: 0,
      scriptsCount: 0,
    };

    onCreateSubProject(parentId, newSub);
    setName('');
    setDesc('');
    setUrls([]);
    setCreationMethod('direct');
    setIsSubmitting(false);
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
            <LayersOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', color: '#0F172A', lineHeight: 1.2 }}>
              Create Sub-Project
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '13px', display: 'block', mt: 0.3 }}>
              Configure a targeted workspace under <strong style={{ color: '#028090' }}>{currentParent?.name || 'Parent Workspace'}</strong>
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
          {/* Creation Method Option Cards */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Creation Method <span style={{ color: '#EF4444' }}>*</span>
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {/* Option 1: Direct */}
              <Box
                onClick={() => setCreationMethod('direct')}
                sx={{
                  border: '1.5px solid',
                  borderColor: creationMethod === 'direct' ? '#34b9cb' : '#E5E7EB',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  backgroundColor: creationMethod === 'direct' ? '#F0FDFA' : '#FFFFFF',
                  boxShadow: creationMethod === 'direct' ? '0 2px 8px rgba(52, 185, 203, 0.15)' : 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { borderColor: '#34b9cb' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TestDNAIcon size={24} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                      Create in TestDNA
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '12px', display: 'block' }}>
                      Quick manual setup
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Option 2: Jira (Disabled - In Progress) */}
              <Box
                sx={{
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'not-allowed',
                  backgroundColor: '#F8FAFC',
                  opacity: 0.75,
                  userSelect: 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: '#94A3B8',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '11px',
                      }}
                    >
                      J
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', color: '#64748B' }}>
                        Import from Jira
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '12px', display: 'block' }}>
                        Sync board epic or project
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="In Progress"
                    size="small"
                    sx={{
                      backgroundColor: '#FEF3C7',
                      color: '#D97706',
                      border: '1px solid #FDE68A',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: 22,
                      borderRadius: '12px',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Parent Project (Readonly) */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Parent Workspace <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={currentParent?.name || 'Default Workspace'}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 44,
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#F8FAFC',
                  color: '#334155',
                  fontWeight: 600,
                  cursor: 'not-allowed',
                  '& fieldset': { borderColor: '#E5E7EB' },
                  '&:hover fieldset': { borderColor: '#E5E7EB' },
                },
              }}
            />
          </Box>

          {/* Sub Project Name */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Sub-Project Name <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              autoFocus
              placeholder="e.g. Mobile Banking App (iOS / Android)"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Provide details about the target application scope..."
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

          {/* Environment URLs Section */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>
                Environment Endpoints <Typography component="span" sx={{ color: '#94A3B8', fontSize: '12px' }}>(Optional)</Typography>
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={addUrlRow}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '13px', color: '#028090' }}
              >
                Add Endpoint
              </Button>
            </Box>

            {urls.map((row, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <FormControl size="small" sx={{ width: 110 }}>
                  <Select
                    value={row.env}
                    onChange={(e) => handleUrlChange(index, 'env', e.target.value as string)}
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
                  value={row.url}
                  onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                  variant="outlined"
                  sx={inputStyles}
                />

                <IconButton size="small" onClick={() => removeUrlRow(index)} sx={{ color: '#EF4444' }}>
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
            disabled={!name.trim() || !parentId || isSubmitting}
            startIcon={<AddIcon />}
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
            {isSubmitting ? 'Creating...' : 'Create Sub Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
