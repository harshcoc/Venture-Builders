'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore, useSnackbarStore } from '@/store/uiStore';
import { ROUTES } from '@/utils/constants';

const DRAWER_WIDTH_MIN = 260;
const DRAWER_WIDTH_MAX = 500;
const DRAWER_WIDTH_DEFAULT = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'Users', href: ROUTES.USERS, icon: <PeopleIcon /> },
  { label: 'Products', href: ROUTES.PRODUCTS, icon: <ShoppingCartIcon /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH_DEFAULT);
  const [isResizing, setIsResizing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { mode, toggleTheme } = useThemeStore();
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar);

  // Load drawer state from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem('drawerWidth');
    const savedOpen = localStorage.getItem('desktopOpen');
    if (savedWidth) setDrawerWidth(Math.min(Math.max(parseInt(savedWidth), DRAWER_WIDTH_MIN), DRAWER_WIDTH_MAX));
    if (savedOpen !== null) setDesktopOpen(JSON.parse(savedOpen));
  }, []);

  // Save drawer state to localStorage
  useEffect(() => {
    localStorage.setItem('drawerWidth', drawerWidth.toString());
    localStorage.setItem('desktopOpen', JSON.stringify(desktopOpen));
  }, [drawerWidth, desktopOpen]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleDesktopDrawerToggle = useCallback(() => {
    setDesktopOpen((prev) => !prev);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      setIsResizing(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || isMobile) return;
      const newWidth = e.clientX;
      if (newWidth >= DRAWER_WIDTH_MIN && newWidth <= DRAWER_WIDTH_MAX) {
        setDrawerWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing, isMobile]);

  const handleLogout = useCallback(async () => {
    logout();
    await signOut({ redirect: false });
    showSnackbar('Logged out successfully.', 'info');
    router.push('/login');
  }, [logout, showSnackbar, router]);

  const isActive = useCallback(
    (href: string) => {
      if (href === ROUTES.DASHBOARD) return pathname === ROUTES.DASHBOARD;
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const drawerContent = useMemo(
    () => (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              flex: 1,
            }}
          >
            AdminPanel
          </Typography>
          {!isMobile && (
            <Tooltip title="Close sidebar">
              <IconButton
                size="small"
                onClick={handleDesktopDrawerToggle}
                sx={{ ml: 'auto' }}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <Divider />
        <List sx={{ px: 1, flex: 1, overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={isActive(item.href)}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        {user && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={user.image}
              alt={user.firstName}
              sx={{ width: 36, height: 36 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    ),
    [isActive, isMobile, user, handleDesktopDrawerToggle]
  );

  const currentDrawerWidth = isMobile ? DRAWER_WIDTH_DEFAULT : (desktopOpen ? drawerWidth : 0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { xs: 0, md: `${currentDrawerWidth}px` },
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {!isMobile && (
            <Tooltip title={desktopOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
              <IconButton
                onClick={handleDesktopDrawerToggle}
                sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}
              >
                {desktopOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {NAV_ITEMS.find((item) => isActive(item.href))?.label || 'Dashboard'}
          </Typography>
          <IconButton onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={user.image}
                alt={user.firstName}
                sx={{ width: 32, height: 32, display: { xs: 'none', sm: 'flex' } }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}
              >
                {user.firstName}
              </Typography>
            </Box>
          )}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Logout
            </Box>
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH_DEFAULT },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: desktopOpen ? drawerWidth : 0,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
          },
        }}
        open={desktopOpen}
      >
        {drawerContent}
      </Drawer>

      {/* Resize Handle (Desktop only) */}
      {!isMobile && desktopOpen && (
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            width: '4px',
            cursor: 'col-resize',
            bgcolor: 'divider',
            '&:hover': {
              bgcolor: 'primary.main',
            },
            transition: 'background-color 0.2s',
            display: { xs: 'none', md: 'block' },
          }}
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: 'calc(100%)',
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          transition: 'width 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
