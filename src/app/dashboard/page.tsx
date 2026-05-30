'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Skeleton,
  CardActionArea,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/utils/constants';
import api from '@/services/api';

interface StatsData {
  totalUsers: number | null;
  totalProducts: number | null;
  loading: boolean;
}

export default function DashboardHome() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<StatsData>({
    totalUsers: null,
    totalProducts: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, productsRes] = await Promise.all([
          api.get('/users?limit=0&select=id'),
          api.get('/products?limit=0&select=id'),
        ]);
        setStats({
          totalUsers: usersRes.data.total,
          totalProducts: productsRes.data.total,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }
    fetchStats();
  }, []);

  const loginTime = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(new Date()),
    []
  );

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome back{user ? `, ${user.firstName}` : ''}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Here&apos;s what&apos;s happening with your dashboard today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            elevation={0}
            sx={{
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
                  : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
              borderLeft: '4px solid #6366f1',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Users
                  </Typography>
                  {stats.loading ? (
                    <Skeleton width={80} height={48} />
                  ) : (
                    <Typography variant="h3" sx={{ fontWeight: 700 }} color="primary">
                      {stats.totalUsers ?? '—'}
                    </Typography>
                  )}
                </Box>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'primary.main',
                    opacity: 0.9,
                  }}
                >
                  <PeopleIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            elevation={0}
            sx={{
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #4a1942 100%)'
                  : 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
              borderLeft: '4px solid #ec4899',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Products
                  </Typography>
                  {stats.loading ? (
                    <Skeleton width={80} height={48} />
                  ) : (
                    <Typography variant="h3" sx={{ fontWeight: 700 }} color="secondary">
                      {stats.totalProducts ?? '—'}
                    </Typography>
                  )}
                </Box>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'secondary.main',
                    opacity: 0.9,
                  }}
                >
                  <ShoppingCartIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Navigation */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Quick Navigation
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card elevation={0} sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardActionArea component={Link} href={ROUTES.USERS}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Manage Users
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View, search, and manage all user accounts
                  </Typography>
                </Box>
                <ArrowForwardIcon color="action" />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card elevation={0} sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardActionArea component={Link} href={ROUTES.PRODUCTS}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <ShoppingCartIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Manage Products
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse, filter, and manage product catalog
                  </Typography>
                </Box>
                <ArrowForwardIcon color="action" />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Login Info */}
      {user && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Session Information
          </Typography>
          <Card elevation={0}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={user.image} alt={user.firstName} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user.username}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">Gender: {user.gender}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Last login: {loginTime}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
