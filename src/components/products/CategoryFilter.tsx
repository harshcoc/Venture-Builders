'use client';
import React, { memo, useCallback } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = memo(function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const handleChange = useCallback(
    (e: SelectChangeEvent) => {
      onCategoryChange(e.target.value);
    },
    [onCategoryChange]
  );

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={selectedCategory}
        onChange={handleChange}
        label="Category"
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.slug} value={cat.slug}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default CategoryFilter;
