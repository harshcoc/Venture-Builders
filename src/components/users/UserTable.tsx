'use client';
import React, { memo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { getFullName } from '@/utils/formatters';

interface UserTableProps {
  users: User[];
}

const UserTable = memo(function UserTable({ users }: UserTableProps) {
  const router = useRouter();

  const handleViewDetails = useCallback(
    (id: number) => {
      router.push(`/dashboard/users/${id}`);
    },
    [router]
  );

  return (
    <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                fontWeight: 700,
                bgcolor: 'action.hover',
                fontSize: '0.875rem',
              },
            }}
          >
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Company</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{ '&:last-child td': { border: 0 } }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={user.image}
                    alt={user.firstName}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {getFullName(user.firstName, user.lastName)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{user.email}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={user.gender}
                  size="small"
                  variant="outlined"
                  color={user.gender === 'female' ? 'secondary' : 'primary'}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{user.phone}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{user.company.name}</Typography>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(user.id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default UserTable;
