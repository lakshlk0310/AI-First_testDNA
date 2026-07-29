import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Popover,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FolderOpen as FolderOpenIcon,
  Warning as WarningIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import type { Project } from '../../types/project';

interface ProjectsPageProps {
  projects: Project[];
  loading?: boolean;
  onSelectProject: (project: Project) => void;
  onCreateProjectClick: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  loading = false,
  onSelectProject,
  onCreateProjectClick,
  onEditProject,
  onDeleteProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, proj: Project) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveProject(proj);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveProject(null);
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.desc && p.desc.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));

    const matchesStatus =
      statusFilter === 'All' ||
      (p.status && p.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const formatCreatedDate = (isoString?: string) => {
    if (!isoString) return 'Recently';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} @${hours}:${minutes}`;
    } catch {
      return isoString;
    }
  };

  const getAccentColor = (status?: string, index: number = 0) => {
    if (status === 'Ongoing') return '#F59E0B';
    if (status === 'Pending BRD') return '#EF4444';
    if (status === 'In Progress') return '#3B82F6';
    if (status === 'Completed') return '#10B981';
    const palette = ['#34b9cb', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return palette[index % palette.length];
  };

  const getStatusBadgeStyle = (status?: string) => {
    if (status === 'Ongoing') return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
    if (status === 'Pending BRD') return { bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' };
    if (status === 'In Progress') return { bg: '#DBEAFE', color: '#2563EB', border: '#BFDBFE' };
    if (status === 'Completed') return { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' };
    return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  };

  return (
    <Box sx={{ padding: { xs: '20px', md: '28px 36px' }, maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Controls Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '14px 20px',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          mb: 3.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Search by Project ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: 280,
              maxWidth: 420,
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: 44,
                borderRadius: '10px',
                backgroundColor: '#F9FAFB',
                fontSize: '14px',
                transition: 'all 0.2s ease-in-out',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#CBD5E1' },
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748B', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as string)}
              sx={{
                height: 44,
                borderRadius: '10px',
                backgroundColor: '#F9FAFB',
                fontWeight: 600,
                fontSize: '13px',
                color: '#334155',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#CBD5E1' },
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon sx={{ color: '#64748B', fontSize: 18 }} />
                </InputAdornment>
              }
            >
              <MenuItem value="All">All Projects</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Pending BRD">Pending BRD</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* View Switcher & Add Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '10px', padding: '4px', gap: '3px' }}>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                borderRadius: '7px',
                width: 36,
                height: 36,
                backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#028090' : '#64748B',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <GridViewIcon sx={{ fontSize: 19 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                borderRadius: '7px',
                width: 36,
                height: 36,
                backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#028090' : '#64748B',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <FormatListBulletedIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateProjectClick}
            sx={{
              textTransform: 'none',
              height: 44,
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              px: 2.8,
              backgroundColor: '#34b9cb',
              boxShadow: '0 2px 8px rgba(52, 185, 203, 0.3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#028090',
                boxShadow: '0 4px 12px rgba(2, 128, 144, 0.35)',
              },
            }}
          >
            Add new project
          </Button>
        </Box>
      </Box>

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '2px dashed #E2E8F0',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#E0F2FE',
              color: '#028090',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <FolderOpenIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#0F172A', mb: 1 }}>
            No Projects Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', fontSize: '14px', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.5 }}>
            {searchQuery || statusFilter !== 'All'
              ? 'No projects match your current filters. Try resetting your search parameters.'
              : 'You have not created any project workspace yet. Click below to add your first project!'}
          </Typography>
          {searchQuery || statusFilter !== 'All' ? (
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              sx={{ textTransform: 'none', borderRadius: '10px', height: 40, px: 2.5, fontWeight: 600, borderColor: '#CBD5E1', color: '#334155' }}
            >
              Reset Filters
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateProjectClick}
              sx={{ textTransform: 'none', borderRadius: '10px', height: 42, fontWeight: 600, px: 3, backgroundColor: '#34b9cb', '&:hover': { backgroundColor: '#028090' } }}
            >
              Add new project
            </Button>
          )}
        </Box>
      ) : (
        /* Cards Layout */
        !loading && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProjects.map((proj, idx) => {
              const accentColor = getAccentColor(proj.status, idx);
              const badgeStyle = getStatusBadgeStyle(proj.status || 'Ongoing');

              return (
                <Card
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    border: '1.5px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                      borderColor: '#34b9cb',
                    },
                  }}
                >
                  {/* Top Glowing Accent Line */}
                  <Box
                    sx={{
                      height: 4,
                      width: '100%',
                      background: `linear-gradient(90deg, ${accentColor} 0%, rgba(52, 185, 203, 0.4) 100%)`,
                    }}
                  />

                  <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Header Row */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                            border: `1px solid ${accentColor}30`,
                            flexShrink: 0,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            {proj.icon || 'folder'}
                          </span>
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#0F172A',
                              lineHeight: 1.3,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={proj.name}
                          >
                            {proj.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#028090', fontWeight: 500, fontSize: '13px', display: 'block', mt: 0.2 }}>
                            {proj.category || 'General Workspace'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Status Badge & Menu */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        <Chip
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: badgeStyle.color }} />
                              {proj.status || 'Ongoing'}
                            </Box>
                          }
                          size="small"
                          sx={{
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color,
                            border: `1px solid ${badgeStyle.border}`,
                            fontWeight: 600,
                            fontSize: '12px',
                            height: 24,
                            borderRadius: '16px',
                          }}
                        />

                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, proj)}>
                          <MoreVertIcon sx={{ color: '#64748B', fontSize: 19 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#475569',
                        fontSize: '14px',
                        mt: 1.5,
                        mb: 1.5,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1,
                      }}
                    >
                      {proj.desc || 'No project description provided.'}
                    </Typography>

                    {/* Base URL (Globe Icon + Clickable Link) */}
                    {proj.baseUrl ? (
                      <Box
                        component="a"
                        href={proj.baseUrl.startsWith('http') ? proj.baseUrl : `https://${proj.baseUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.8,
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #DCFCE7',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: '8px',
                          color: '#166534',
                          fontSize: '12px',
                          fontWeight: 500,
                          textDecoration: 'none',
                          mb: 1.5,
                          maxWidth: '100%',
                          width: 'fit-content',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: '#DCFCE7',
                            borderColor: '#86EFAC',
                            color: '#15803D',
                          },
                        }}
                      >
                        <LanguageIcon sx={{ fontSize: 15, color: '#028090' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {proj.baseUrl}
                        </span>
                      </Box>
                    ) : null}

                    {/* Footer */}
                    <Box
                      sx={{
                        borderTop: '1px dashed #E2E8F0',
                        pt: 1.5,
                        mt: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}
                    >
                      {/* Created Date */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.6,
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#64748B',
                          backgroundColor: '#F8FAFC',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: '8px',
                          border: '1px solid #F1F5F9',
                        }}
                      >
                        <ScheduleIcon sx={{ fontSize: 14 }} />
                        <span>Created {formatCreatedDate(proj.createdAt)}</span>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )
      )}

      {/* ICON-ONLY Popover Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              padding: '4px 6px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            },
          },
        }}
      >
        <Tooltip title="Edit Project">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (activeProject && onEditProject) onEditProject(activeProject);
              handleCloseMenu();
            }}
            sx={{
              color: '#64748B',
              '&:hover': { backgroundColor: '#E0F2FE', color: '#028090' },
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Project">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (activeProject) setProjectToDelete(activeProject);
              handleCloseMenu();
            }}
            sx={{
              color: '#64748B',
              '&:hover': { backgroundColor: '#FEE2E2', color: '#EF4444' },
            }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Popover>

      {/* Delete Confirmation Modal */}
      {projectToDelete ? (
        <Dialog
          open={Boolean(projectToDelete)}
          onClose={() => setProjectToDelete(null)}
          maxWidth="xs"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: '16px', p: 1 },
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <WarningIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#0F172A', lineHeight: 1.2 }}>
                Delete Project
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '12px' }}>
                This action cannot be undone
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 2.5, py: 1 }}>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '14px', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0F172A' }}>{projectToDelete.name}</strong>? All associated sub-projects and test data will be permanently removed.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setProjectToDelete(null)}
              variant="outlined"
              color="inherit"
              sx={{ textTransform: 'none', borderRadius: '10px', height: 40, px: 2.5, fontWeight: 600, borderColor: '#CBD5E1' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (onDeleteProject && projectToDelete) {
                  onDeleteProject(projectToDelete.id);
                }
                setProjectToDelete(null);
              }}
              variant="contained"
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                height: 40,
                fontWeight: 600,
                px: 2.5,
                backgroundColor: '#EF4444',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                '&:hover': {
                  backgroundColor: '#DC2626',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </Box>
  );
};
