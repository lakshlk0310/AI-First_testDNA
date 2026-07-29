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
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  AutoStories as AutoStoriesIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
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
    if (status === 'Ongoing') return { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
    if (status === 'Pending BRD') return { bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5' };
    if (status === 'In Progress') return { bg: '#DBEAFE', color: '#1D4ED8', border: '#BFDBFE' };
    if (status === 'Completed') return { bg: '#D1FAE5', color: '#047857', border: '#A7F3D0' };
    return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  };

  return (
    <Box sx={{ padding: '24px 28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Controls Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flex: 1 }}>
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
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
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
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as string)}
              sx={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#334155',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px', gap: '2px' }}>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                borderRadius: '6px',
                backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#028090' : '#64748B',
              }}
            >
              <GridViewIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                borderRadius: '6px',
                backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#028090' : '#64748B',
              }}
            >
              <FormatListBulletedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateProjectClick}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              px: 2.5,
              py: 1,
              backgroundColor: '#34b9cb',
              boxShadow: '0 2px 8px rgba(52, 185, 203, 0.25)',
              '&:hover': {
                backgroundColor: '#028090',
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
            py: 7,
            px: 2,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '2px dashed #CBD5E1',
          }}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              color: '#34b9cb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <FolderOpenIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            No Projects Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.5 }}>
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
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Reset Filters
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateProjectClick}
              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700, backgroundColor: '#34b9cb' }}
            >
              Add new project
            </Button>
          )}
        </Box>
      ) : (
        /* Unique Cards Layout */
        !loading && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '22px',
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
                    border: '1.5px solid #E2E8F0',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 36px rgba(15, 23, 42, 0.1)',
                      borderColor: 'rgba(52, 185, 203, 0.5)',
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
                    {/* Top Header Row */}
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
                            border: `1.5px solid ${accentColor}30`,
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
                              fontWeight: 800,
                              color: '#0F172A',
                              lineHeight: 1.2,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={proj.name}
                          >
                            {proj.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#028090', fontWeight: 700, display: 'block', mt: 0.2 }}>
                            {proj.category || 'General Workspace'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Status Badge & Three-Dot Menu */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
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
                            fontWeight: 700,
                            fontSize: '11px',
                            height: 24,
                          }}
                        />

                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, proj)}>
                          <MoreVertIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#475569',
                        mt: 1.5,
                        mb: 2,
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

                    {/* Base URL */}
                    {proj.baseUrl ? (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.6,
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #DCFCE7',
                          px: 1,
                          py: 0.3,
                          borderRadius: '8px',
                          color: '#166534',
                          fontSize: '11.5px',
                          fontFamily: 'monospace',
                          mb: 1.5,
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <LinkIcon sx={{ fontSize: 14, color: '#028090' }} />
                        <span>{proj.baseUrl}</span>
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
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Metrics Pills */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="User Stories">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              px: 1.2,
                              py: 0.4,
                              borderRadius: '20px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              color: '#1E293B',
                            }}
                          >
                            <AutoStoriesIcon sx={{ fontSize: 15, color: '#028090' }} />
                            <span>{proj.userStoriesCount ?? (proj.subProjects?.length ? proj.subProjects.length * 5 : 0)}</span>
                          </Box>
                        </Tooltip>

                        <Tooltip title="Test Cases">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              px: 1.2,
                              py: 0.4,
                              borderRadius: '20px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              color: '#1E293B',
                            }}
                          >
                            <DescriptionIcon sx={{ fontSize: 15, color: '#028090' }} />
                            <span>{proj.testCasesCount ?? 0}</span>
                          </Box>
                        </Tooltip>

                        <Tooltip title="Scripts">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              px: 1.2,
                              py: 0.4,
                              borderRadius: '20px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              color: '#1E293B',
                            }}
                          >
                            <CodeIcon sx={{ fontSize: 15, color: '#028090' }} />
                            <span>{proj.scriptsCount ?? 0}</span>
                          </Box>
                        </Tooltip>
                      </Box>

                      {/* Created Date */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#64748B',
                          backgroundColor: '#F1F5F9',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: '12px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <ScheduleIcon sx={{ fontSize: 13 }} />
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
        PaperProps={{
          style: {
            borderRadius: 20,
            padding: '4px 6px',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.14)',
            border: '1.5px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
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
        <Dialog open={Boolean(projectToDelete)} onClose={() => setProjectToDelete(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
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
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0B1740', lineHeight: 1.2 }}>
                Delete Project
              </Typography>
              <Typography variant="caption" sx={{ color: '#64708A' }}>
                This action cannot be undone
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 2, pt: 0 }}>
            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0B1740' }}>{projectToDelete.name}</strong>? All associated sub-projects and test data will be permanently removed.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setProjectToDelete(null)}
              variant="outlined"
              color="inherit"
              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
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
                borderRadius: '8px',
                fontWeight: 700,
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
