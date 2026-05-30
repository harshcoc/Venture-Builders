'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useDebounce } from '@/hooks/useDebounce';
import SearchBar from '@/components/common/SearchBar';
import PageHeader from '@/components/common/PageHeader';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import PaginationComponent from '@/components/common/PaginationComponent';
import TableSkeleton from '@/components/common/TableSkeleton';
import UserTable from '@/components/users/UserTable';

function UsersPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    users,
    loading,
    error,
    total,
    limit,
    fetchUsers,
    searchUsers,
    setPage,
    clearError,
  } = useUserStore();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput);

  // Parse current page from URL
  const currentPage = Number(searchParams.get('page')) || 1;

  // Fetch users on mount and when page changes
  useEffect(() => {
    const skip = (currentPage - 1) * limit;
    if (debouncedSearch) {
      searchUsers(debouncedSearch, limit, skip);
    } else {
      fetchUsers(limit, skip);
    }
  }, [currentPage, debouncedSearch, limit, fetchUsers, searchUsers]);

  // Sync page state with store
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage, setPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(page));
      router.push(`/dashboard/users?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      // Reset to page 1 when searching
      if (value !== searchInput) {
        router.push('/dashboard/users?page=1');
      }
    },
    [searchInput, router]
  );

  const handleRetry = useCallback(() => {
    clearError();
    fetchUsers(limit, (currentPage - 1) * limit, true);
  }, [clearError, fetchUsers, limit, currentPage]);

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle={`${total} users total`}
      />

      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search users by name..."
        />
      </Box>

      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {loading ? (
        <TableSkeleton rows={10} columns={6} />
      ) : users.length === 0 ? (
        <EmptyState
          message={
            debouncedSearch
              ? `No users found for "${debouncedSearch}"`
              : 'No users available.'
          }
        />
      ) : (
        <>
          <UserTable users={users} />
          <PaginationComponent
            total={total}
            limit={limit}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}

export default function UsersPage() {
  return (
    <React.Suspense fallback={<TableSkeleton rows={10} columns={6} />}>
      <UsersPageClient />
    </React.Suspense>
  );
}
