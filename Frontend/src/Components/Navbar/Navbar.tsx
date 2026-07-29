import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import type { UserProfile } from '../../types/project';

interface NavbarProps {
  title?: string;
  user: UserProfile;
  onSignOut?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = 'AI First Test DNA',
  user,
  onSignOut,
  showBackButton = false,
  onBack,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = () => {
    handleCloseMenu();
    onSignOut?.();
  };

  return (
    <Box
      component="nav"
      sx={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1.5px solid #E2E8F0',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Left Section: Back Button + Brand Logo & Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
        {showBackButton && (
          <Tooltip title="Back to Project Workspace">
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                color: '#475569',
                border: '1.5px solid #E2E8F0',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#E0F2FE',
                  color: '#028090',
                  borderColor: 'rgba(52, 185, 203, 0.5)',
                },
              }}
              aria-label="Back"
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          {/* Restored Old Stacked Layers Logo Icon */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: '#028090',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" width="18" height="18">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              fontSize: '17px',
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Right Section: User Profile Dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          onClick={handleOpenMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            padding: '4px 10px 4px 6px',
            borderRadius: '24px',
            backgroundColor: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#F1F5F9',
              borderColor: '#CBD5E1',
            },
          }}
          title={user.name}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: '#34b9cb',
              color: '#ffffff',
            }}
          >
            {user.initials}
          </Avatar>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '13px', lineHeight: 1.1 }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '11px', display: 'block' }}>
              {user.role}
            </Typography>
          </Box>

          <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#64748B' }} />
        </Box>

        {/* User Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
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
              borderRadius: 14,
              minWidth: 200,
              padding: '4px 0',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
              border: '1.5px solid #E2E8F0',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {user.email || user.role}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem onClick={handleSignOutClick} sx={{ py: 1, color: '#EF4444', fontWeight: 600 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 32 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '13.5px', fontWeight: 600 }} />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
