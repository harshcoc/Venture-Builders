'use client';
import React, { memo, useCallback } from 'react';
import { Box, Pagination } from '@mui/material';

interface PaginationComponentProps {
  total: number;
  limit: number;
  page: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent = memo(function PaginationComponent({
  total,
  limit,
  page,
  onPageChange,
}: PaginationComponentProps) {
  const count = Math.ceil(total / limit);

  const handleChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      onPageChange(value);
    },
    [onPageChange]
  );

  if (count <= 1) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <Pagination
        count={count}
        page={page}
        onChange={handleChange}
        color="primary"
        showFirstButton
        showLastButton
        size="large"
      />
    </Box>
  );
});

export default PaginationComponent;
