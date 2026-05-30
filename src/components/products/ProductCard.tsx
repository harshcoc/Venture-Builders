'use client';
import React, { memo } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import { Product } from '@/types';
import { formatCurrency, getDiscountedPrice } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? getDiscountedPrice(product.price, product.discountPercentage)
    : product.price;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(99, 102, 241, 0.15)'
              : '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardMedia
        component="img"
        height={200}
        image={product.thumbnail}
        alt={product.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
          {product.title}
        </Typography>
        <Chip
          label={product.category}
          size="small"
          color="secondary"
          variant="outlined"
          sx={{ mt: 0.5, mb: 1 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {hasDiscount && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {formatCurrency(product.price)}
            </Typography>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700 }} color="primary">
            {formatCurrency(discountedPrice)}
          </Typography>
          {hasDiscount && (
            <Chip
              label={`-${Math.round(product.discountPercentage)}%`}
              size="small"
              color="success"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating
            value={product.rating}
            readOnly
            precision={0.5}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            ({product.rating.toFixed(1)})
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          component={Link}
          href={`/dashboard/products/${product.id}`}
          variant="contained"
          fullWidth
          startIcon={<VisibilityIcon />}
          size="small"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
});

export default ProductCard;
