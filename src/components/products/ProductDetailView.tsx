'use client';
import React, { memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Rating,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Product } from '@/types';
import { formatCurrency, getDiscountedPrice } from '@/utils/formatters';

interface ProductDetailViewProps {
  product: Product;
}

const ProductDetailView = memo(function ProductDetailView({
  product,
}: ProductDetailViewProps) {
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? getDiscountedPrice(product.price, product.discountPercentage)
    : product.price;

  const stockColor =
    product.availabilityStatus === 'In Stock'
      ? 'success'
      : product.availabilityStatus === 'Low Stock'
        ? 'warning'
        : 'error';

  return (
    <Grid container spacing={3}>
      {/* Image Gallery */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Card elevation={0} sx={{ p: 2 }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={product.images.length > 1}
            style={{ borderRadius: 8 }}
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`${product.title} - Image ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 500,
                    objectFit: 'contain',
                    display: 'block',
                    mx: 'auto',
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Card>
      </Grid>

      {/* Product Info */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Card elevation={0}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              {product.title}
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              gutterBottom
            >
              Brand: {product.brand || 'N/A'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={product.category} color="secondary" size="small" />
              <Chip
                label={product.availabilityStatus}
                color={stockColor as 'success' | 'warning' | 'error'}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating
                value={product.rating}
                readOnly
                precision={0.5}
                size="medium"
              />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {product.rating.toFixed(1)}
              </Typography>
            </Box>

            {/* Price Section */}
            <Box sx={{ mb: 2 }}>
              {hasDiscount && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatCurrency(product.price)}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }} color="primary">
                  {formatCurrency(discountedPrice)}
                </Typography>
                {hasDiscount && (
                  <Chip
                    label={`-${Math.round(product.discountPercentage)}%`}
                    color="success"
                    size="small"
                  />
                )}
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Stock: {product.stock} units
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Additional Information */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Additional Information
            </Typography>
            <List dense>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <VerifiedUserIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Warranty"
                  secondary={product.warrantyInformation}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LocalShippingIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Shipping"
                  secondary={product.shippingInformation}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AssignmentReturnIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Return Policy"
                  secondary={product.returnPolicy}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ShoppingCartIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Minimum Order"
                  secondary={`${product.minimumOrderQuantity} units`}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InventoryIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Availability"
                  secondary={product.availabilityStatus}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
});

export default ProductDetailView;
