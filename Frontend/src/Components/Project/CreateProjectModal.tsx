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
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, FolderOutlined as FolderOutlinedIcon } from '@mui/icons-material';
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
  const [creationMethod, setCreationMethod] = useState<'direct' | 'jira'>('direct');
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [icon, setIcon] = useState('folder');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
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
            <FolderOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', color: '#0F172A', lineHeight: 1.2 }}>
              Create Project
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '13px', display: 'block', mt: 0.3 }}>
              Configure your main workspace details to organize test suites and assets
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} aria-label="close" sx={{ color: '#64748B' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: '28px 32px' }}>
          {/* Project Name */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
              Project Name <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              autoFocus
              placeholder="e.g. Enterprise Banking Workspace"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="https://api.myproject.com"
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
              placeholder="Provide a brief summary of this workspace..."
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

          {/* Category & Icon */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            {/* <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
                Category
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as string)}
                  sx={{
                    height: 44,
                    borderRadius: '10px',
                    fontSize: '14px',
                    '& fieldset': { borderColor: '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                  }}
                >
                  <MenuItem value="General">General Workspace</MenuItem>
                  <MenuItem value="FinTech & Banking">FinTech & Banking</MenuItem>
                  <MenuItem value="Utility & Energy">Utility & Energy</MenuItem>
                  <MenuItem value="Healthcare & EHR">Healthcare & EHR</MenuItem>
                  <MenuItem value="AI Platform & ML">AI Platform & ML</MenuItem>
                  <MenuItem value="E-Commerce & Retail">E-Commerce & Retail</MenuItem>
                  <MenuItem value="Enterprise SaaS">Enterprise SaaS</MenuItem>
                </Select>
              </FormControl>
            </Box> */}

            {/* <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', mb: 1 }}>
                Icon Symbol
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
                  <MenuItem value="folder">Folder</MenuItem>
                  <MenuItem value="account_balance">Bank / Finance</MenuItem>
                  <MenuItem value="bolt">Energy / Utility</MenuItem>
                  <MenuItem value="medical_services">Healthcare</MenuItem>
                  <MenuItem value="memory">AI / Technology</MenuItem>
                  <MenuItem value="shopping_cart">E-Commerce</MenuItem>
                  <MenuItem value="cloud">Cloud Service</MenuItem>
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
            disabled={!name.trim() || isSubmitting}
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
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
