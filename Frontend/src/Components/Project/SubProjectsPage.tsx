import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
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
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
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
  Launch as LaunchIcon,
} from '@mui/icons-material';

import type { Project, SubProject } from '../../types/project';

interface SubProjectsPageProps {
  parentProject: Project;
  loading?: boolean;
  onSelectSubProject: (subProject: SubProject) => void;
  onCreateSubProjectClick: () => void;
  onEditSubProject?: (parentId: string, subProject: SubProject) => void;
  onDeleteSubProject?: (projectId: string, subProjectId: string) => void;
  onBackToProjects: () => void;
}

export const SubProjectsPage: React.FC<SubProjectsPageProps> = ({
  parentProject,
  loading = false,
  onSelectSubProject,
  onCreateSubProjectClick,
  onEditSubProject,
  onDeleteSubProject,
  onBackToProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Popover state for 3-dot icon-only dropdown menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeSubProject, setActiveSubProject] = useState<SubProject | null>(null);

  // Delete modal state
  const [subProjectToDelete, setSubProjectToDelete] = useState<SubProject | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, sp: SubProject) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveSubProject(sp);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveSubProject(null);
  };

  const filteredSubProjects = (parentProject.subProjects || []).filter((sp) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      sp.name.toLowerCase().includes(q) ||
      (sp.desc && sp.desc.toLowerCase().includes(q)) ||
      sp.id.toLowerCase().includes(q) ||
      (sp.type && sp.type.toLowerCase().includes(q))
    );
  });

  const getAccentColor = (index: number = 0) => {
    const palette = ['#34b9cb', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return palette[index % palette.length];
  };

  return (
    <Box sx={{ padding: '24px 28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header & Breadcrumb Bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBackToProjects}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              color: '#475569',
              borderColor: '#CBD5E1',
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#F8FAFC',
                borderColor: '#94A3B8',
              },
            }}
          >
            Back to Projects
          </Button>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', margin: 0 }}>
                {parentProject.name}
              </Typography>
              <Chip
                label={`${(parentProject.subProjects || []).length} Sub-Projects`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(2, 128, 144, 0.1)',
                  color: '#028090',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  height: 24,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Select a sub-project workspace application to enter the testing suite
            </Typography>
          </Box>
        </Box>
      </Box>

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
        {/* Search Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 260, maxWidth: 420 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search sub-projects by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
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
            onClick={onCreateSubProjectClick}
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
            Create Sub Project
          </Button>
        </Box>
      </Box>

      {/* Empty State */}
      {!loading && filteredSubProjects.length === 0 ? (
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
            No Sub Projects Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.5 }}>
            {searchQuery
              ? `No sub-projects match "${searchQuery}". Try clearing your search.`
              : `No sub-project workspaces configured under ${parentProject.name} yet.`}
          </Typography>
          {searchQuery ? (
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Clear Search
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateSubProjectClick}
              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700, backgroundColor: '#34b9cb' }}
            >
              Create Sub Project
            </Button>
          )}
        </Box>
      ) : (
        /* Sub-Projects Cards Layout */
        !loading && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '22px',
            }}
          >
            {filteredSubProjects.map((sp, idx) => {
              const accentColor = getAccentColor(idx);

              return (
                <Card
                  key={sp.id}
                  onClick={() => onSelectSubProject(sp)}
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
                  {/* Glowing Top Accent Line */}
                  <Box
                    sx={{
                      height: 4,
                      width: '100%',
                      background: `linear-gradient(90deg, ${accentColor} 0%, rgba(52, 185, 203, 0.4) 100%)`,
                    }}
                  />

                  <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Header Row: Type Icon + Title + Endpoints Count + Three Dot */}
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
                            {sp.icon || 'layers'}
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
                            title={sp.name}
                          >
                            {sp.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#028090', fontWeight: 700, display: 'block', mt: 0.2 }}>
                            {sp.type || 'Sub-Project Workspace'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Endpoint Badge & Three-Dot Menu */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        <Chip
                          label={`${sp.urls ? sp.urls.length : 0} Endpoints`}
                          size="small"
                          sx={{
                            backgroundColor: '#D1FAE5',
                            color: '#047857',
                            border: '1px solid #A7F3D0',
                            fontWeight: 700,
                            fontSize: '10.5px',
                            height: 24,
                          }}
                        />

                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, sp)}>
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
                      {sp.desc || 'No sub-project description provided.'}
                    </Typography>

                    {/* Environment Badges */}
                    {sp.urls && sp.urls.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                        {sp.urls.map((u, i) => (
                          <Chip
                            key={i}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <strong style={{ color: '#028090' }}>{u.env}:</strong>
                                <span>{u.url.replace(/^https?:\/\//, '')}</span>
                              </Box>
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              backgroundColor: '#F8FAFC',
                              borderColor: '#E2E8F0',
                              fontSize: '11px',
                              height: 22,
                            }}
                          />
                        ))}
                      </Box>
                    ) : null}

                    {/* Footer Row: Metrics & Launch Action */}
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
                            <span>12</span>
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
                            <span>45</span>
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
                            <span>18</span>
                          </Box>
                        </Tooltip>
                      </Box>

                      {/* Launch Action Link */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#028090',
                        }}
                      >
                        <span>Launch Suite</span>
                        <LaunchIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )
      )}

      {/* ICON-ONLY Popover Menu (No Text!) */}
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
        <Tooltip title="Edit Sub-Project">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (activeSubProject && onEditSubProject) {
                onEditSubProject(parentProject.id, activeSubProject);
              }
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

        <Tooltip title="Delete Sub-Project">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (activeSubProject) setSubProjectToDelete(activeSubProject);
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

      {/* Delete Confirmation Modal (MUI Dialog) */}
      {subProjectToDelete ? (
        <Dialog open={Boolean(subProjectToDelete)} onClose={() => setSubProjectToDelete(null)} maxWidth="xs" fullWidth>
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
                Delete Sub-Project
              </Typography>
              <Typography variant="caption" sx={{ color: '#64708A' }}>
                This action cannot be undone
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 2, pt: 0 }}>
            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0B1740' }}>{subProjectToDelete.name}</strong>? All associated test suites and execution logs will be permanently removed.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setSubProjectToDelete(null)}
              variant="outlined"
              color="inherit"
              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (onDeleteSubProject && subProjectToDelete) {
                  onDeleteSubProject(parentProject.id, subProjectToDelete.id);
                }
                setSubProjectToDelete(null);
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
