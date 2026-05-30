'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box } from '@mui/material';
import { useUserStore } from '@/store/userStore';
import BackButton from '@/components/common/BackButton';
import ErrorMessage from '@/components/common/ErrorMessage';
import ContentSkeleton from '@/components/common/ContentSkeleton';
import UserDetailCard from '@/components/users/UserDetailCard';

export default function UserDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { selectedUser, loading, error, fetchUserById, clearSelectedUser, clearError } =
    useUserStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
    return () => {
      clearSelectedUser();
    };
  }, [id, fetchUserById, clearSelectedUser]);

  return (
    <Box>
      <BackButton href="/dashboard/users" label="Back to Users" />

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            fetchUserById(id);
          }}
        />
      )}

      {loading ? (
        <ContentSkeleton />
      ) : selectedUser ? (
        <UserDetailCard user={selectedUser} />
      ) : (
        !error && <ContentSkeleton />
      )}
    </Box>
  );
}
