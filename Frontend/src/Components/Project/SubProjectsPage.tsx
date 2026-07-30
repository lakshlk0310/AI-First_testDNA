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
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Close as CloseIcon,
  AutoStories as AutoStoriesIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
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

  const getAccentColor = (index: number = 0) => {
    const palette = ['#34b9cb', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return palette[index % palette.length];
  };

  return (
    <Box sx={{ padding: { xs: '20px', md: '28px 36px' }, maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header & Breadcrumb Bar */}
      <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Back Icon Button */}
          <Tooltip title="Back to Project Workspace">
            <IconButton
              onClick={onBackToProjects}
              size="small"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: '#475569',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#E0F2FE',
                  color: '#028090',
                  borderColor: '#34b9cb',
                },
              }}
              aria-label="Back"
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '20px', color: '#0F172A', lineHeight: 1.2, margin: 0 }}>
                {parentProject.name}
              </Typography>
              <Chip
                label={`${(parentProject.subProjects || []).length} Sub-Projects`}
                size="small"
                sx={{
                  backgroundColor: '#E0F2FE',
                  color: '#028090',
                  fontWeight: 600,
                  fontSize: '12px',
                  height: 24,
                  borderRadius: '16px',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '13px', display: 'block', mt: 0.3 }}>
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
          padding: '14px 20px',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          mb: 3.5,
        }}
      >
        {/* Search Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 280, maxWidth: 420 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search sub-projects by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
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
            onClick={onCreateSubProjectClick}
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
            Create Sub Project
          </Button>
        </Box>
      </Box>

      {/* Empty State */}
      {!loading && filteredSubProjects.length === 0 ? (
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
            No Sub Projects Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', fontSize: '14px', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.5 }}>
            {searchQuery
              ? `No sub-projects match "${searchQuery}". Try clearing your search.`
              : `No sub-project workspaces configured under ${parentProject.name} yet.`}
          </Typography>
          {searchQuery ? (
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
              sx={{ textTransform: 'none', borderRadius: '10px', height: 40, px: 2.5, fontWeight: 600, borderColor: '#CBD5E1', color: '#334155' }}
            >
              Clear Search
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateSubProjectClick}
              sx={{ textTransform: 'none', borderRadius: '10px', height: 42, fontWeight: 600, px: 3, backgroundColor: '#34b9cb', '&:hover': { backgroundColor: '#028090' } }}
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
              gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: '24px',
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
                  {/* Glowing Top Accent Line */}
                  <Box
                    sx={{
                      height: 4,
                      width: '100%',
                      background: `linear-gradient(90deg, ${accentColor} 0%, rgba(52, 185, 203, 0.4) 100%)`,
                    }}
                  />

                  <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Top Row: Icon + Title + Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
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
                            {sp.icon || 'layers'}
                          </span>
                        </Box>

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
                            flex: 1,
                            minWidth: 0,
                          }}
                          title={sp.name}
                        >
                          {sp.name}
                        </Typography>
                      </Box>

                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, sp)}>
                        <MoreVertIcon sx={{ color: '#64748B', fontSize: 19 }} />
                      </IconButton>
                    </Box>

                    {/* Meta Row: Type + Endpoints Chip */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.2 }}>
                      <Typography variant="caption" sx={{ color: '#028090', fontWeight: 500, fontSize: '13px' }}>
                        {sp.type || 'Sub-Project Workspace'}
                      </Typography>

                      <Chip
                        label={`${sp.urls ? sp.urls.length : 0} Endpoints`}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          backgroundColor: '#D1FAE5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          fontWeight: 600,
                          fontSize: '11.5px',
                          height: 22,
                          borderRadius: '16px',
                        }}
                      />
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
                      {sp.desc || 'No sub-project description provided.'}
                    </Typography>

                    {/* Environment Badges */}
                    {sp.urls && sp.urls.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                        {sp.urls.map((u, i) => (
                          <Chip
                            key={i}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <LanguageIcon sx={{ fontSize: 13, color: '#028090' }} />
                                <strong>{u.env}:</strong> {u.url}
                              </Box>
                            }
                            size="small"
                            component="a"
                            href={u.url.startsWith('http') ? u.url : `https://${u.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              backgroundColor: '#F0FDF4',
                              color: '#166534',
                              border: '1px solid #DCFCE7',
                              fontWeight: 500,
                              fontSize: '12px',
                              height: 26,
                              borderRadius: '8px',
                              maxWidth: '100%',
                              cursor: 'pointer',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: '#DCFCE7',
                                borderColor: '#86EFAC',
                                color: '#15803D',
                              },
                              '& .MuiChip-label': {
                                px: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    ) : null}

                    {/* Metrics Row: Stories, Cases, Scripts (Single Line, No Wrap) */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        mb: 1.5,
                        py: 1,
                        px: 1.5,
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #F1F5F9',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <AutoStoriesIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12.5px', color: '#475569' }}>
                          <strong style={{ color: '#0F172A', fontWeight: 700 }}>{sp.userStoriesCount ?? 0}</strong> Stories
                        </Typography>
                      </Box>

                      <Box sx={{ height: 14, width: '1px', backgroundColor: '#CBD5E1' }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <DescriptionIcon sx={{ fontSize: 16, color: '#10B981' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12.5px', color: '#475569' }}>
                          <strong style={{ color: '#0F172A', fontWeight: 700 }}>{sp.testCasesCount ?? 0}</strong> Cases
                        </Typography>
                      </Box>

                      <Box sx={{ height: 14, width: '1px', backgroundColor: '#CBD5E1' }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <CodeIcon sx={{ fontSize: 16, color: '#8B5CF6' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12.5px', color: '#475569' }}>
                          <strong style={{ color: '#0F172A', fontWeight: 700 }}>{sp.scriptsCount ?? 0}</strong> Scripts
                        </Typography>
                      </Box>
                    </Box>

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
                        <span>Created {formatCreatedDate(sp.createdAt || parentProject?.createdAt)}</span>
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

      {/* Delete Confirmation Modal */}
      {subProjectToDelete ? (
        <Dialog
          open={Boolean(subProjectToDelete)}
          onClose={() => setSubProjectToDelete(null)}
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
                Delete Sub-Project
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '12px' }}>
                This action cannot be undone
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 2.5, py: 1 }}>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '14px', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0F172A' }}>{subProjectToDelete.name}</strong>? All associated test suites and execution logs will be permanently removed.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setSubProjectToDelete(null)}
              variant="outlined"
              color="inherit"
              sx={{ textTransform: 'none', borderRadius: '10px', height: 40, px: 2.5, fontWeight: 600, borderColor: '#CBD5E1' }}
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
