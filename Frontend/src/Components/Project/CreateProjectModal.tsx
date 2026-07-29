import React, { useState } from 'react';
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
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import type { Project } from '../../types/project';
import { TestDNAIcon } from './TestDNAIcon';

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
  const [creationMethod, setCreationMethod] = useState<'direct' | 'jira'>('direct');
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('General');
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
    const parsedTags = tags.trim()
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const newProj: Project = {
      id,
      name: name.trim(),
      desc: desc.trim(),
      baseUrl: baseUrl.trim(),
      creationMethod,
      status: 'Ongoing',
      userStoriesCount: 0,
      testCasesCount: 0,
      scriptsCount: 0,
      category: category.trim() || 'General',
      tags: parsedTags,
      icon: icon || 'folder',
      createdAt: new Date().toISOString(),
      subProjects: [],
    };

    onCreateProject(newProj);
    setName('');
    setBaseUrl('');
    setDesc('');
    setCategory('General');
    setTags('');
    setIcon('folder');
    setCreationMethod('direct');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0B1740', letterSpacing: '-0.3px', margin: 0 }}>
            Create Project
          </Typography>
          <Typography variant="caption" sx={{ color: '#64708A' }}>
            Configure your main workspace details to organize test suites and assets
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
                      Start from scratch and build your project your way
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
                      Directly import tasks, tickets, and data from Jira and start working instantly
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Project Name */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Project Name <span style={{ color: '#D90429' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter project name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
            />
          </Box>

          {/* Project Base URL */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Project Base URL (Optional)
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="url"
              placeholder="Enter project base URL (optional)..."
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              variant="outlined"
            />
          </Box>

          {/* Project Description */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
              Project Description (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter project description (optional)..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              variant="outlined"
            />
          </Box>

          {/* Category & Icon */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Category
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={category} onChange={(e) => setCategory(e.target.value as string)}>
                  <MenuItem value="General">General Workspace</MenuItem>
                  <MenuItem value="FinTech & Banking">FinTech & Banking</MenuItem>
                  <MenuItem value="Utility & Energy">Utility & Energy</MenuItem>
                  <MenuItem value="Healthcare & EHR">Healthcare & EHR</MenuItem>
                  <MenuItem value="AI Platform & ML">AI Platform & ML</MenuItem>
                  <MenuItem value="E-Commerce & Retail">E-Commerce & Retail</MenuItem>
                  <MenuItem value="Enterprise SaaS">Enterprise SaaS</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B1740', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                Icon Symbol
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={icon} onChange={(e) => setIcon(e.target.value as string)}>
                  <MenuItem value="folder">Folder</MenuItem>
                  <MenuItem value="account_balance">Bank / Finance</MenuItem>
                  <MenuItem value="bolt">Energy / Utility</MenuItem>
                  <MenuItem value="medical_services">Healthcare</MenuItem>
                  <MenuItem value="memory">AI / Technology</MenuItem>
                  <MenuItem value="shopping_cart">E-Commerce</MenuItem>
                  <MenuItem value="cloud">Cloud Service</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
            Create Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
