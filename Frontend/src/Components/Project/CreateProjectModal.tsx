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
