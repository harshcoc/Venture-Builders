'use client';
import React, { memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import WcIcon from '@mui/icons-material/Wc';
import BadgeIcon from '@mui/icons-material/Badge';
import { User } from '@/types';
import { getFullName, formatDate, maskCardNumber } from '@/utils/formatters';

interface UserDetailCardProps {
  user: User;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow = memo(function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <ListItem disableGutters sx={{ py: 0.5 }}>
      <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        }
        secondary={
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {value}
          </Typography>
        }
      />
    </ListItem>
  );
});

const UserDetailCard = memo(function UserDetailCard({
  user,
}: UserDetailCardProps) {
  const fullName = getFullName(user.firstName, user.lastName);

  return (
    <Box>
      {/* Profile Header */}
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Avatar
              src={user.image}
              alt={fullName}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phone}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                <InfoRow
                  icon={<BadgeIcon fontSize="small" color="action" />}
                  label="Full Name"
                  value={fullName}
                />
                <InfoRow
                  icon={<CakeIcon fontSize="small" color="action" />}
                  label="Age"
                  value={`${user.age} years old`}
                />
                <InfoRow
                  icon={<WcIcon fontSize="small" color="action" />}
                  label="Gender"
                  value={user.gender}
                />
                <InfoRow
                  icon={<CakeIcon fontSize="small" color="action" />}
                  label="Birth Date"
                  value={formatDate(user.birthDate)}
                />
                <InfoRow
                  icon={<BloodtypeIcon fontSize="small" color="action" />}
                  label="Blood Group"
                  value={user.bloodGroup}
                />
                <InfoRow
                  icon={<EmailIcon fontSize="small" color="action" />}
                  label="Email"
                  value={user.email}
                />
                <InfoRow
                  icon={<PhoneIcon fontSize="small" color="action" />}
                  label="Phone"
                  value={user.phone}
                />
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Address */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Address
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                <InfoRow
                  icon={<LocationOnIcon fontSize="small" color="action" />}
                  label="Address"
                  value={user.address.address}
                />
                <InfoRow
                  icon={<LocationOnIcon fontSize="small" color="action" />}
                  label="City"
                  value={user.address.city}
                />
                <InfoRow
                  icon={<LocationOnIcon fontSize="small" color="action" />}
                  label="State"
                  value={user.address.state}
                />
                <InfoRow
                  icon={<LocationOnIcon fontSize="small" color="action" />}
                  label="Country"
                  value={user.address.country}
                />
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Company */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BusinessIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Company
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                <InfoRow
                  icon={<BusinessIcon fontSize="small" color="action" />}
                  label="Company Name"
                  value={user.company.name}
                />
                <InfoRow
                  icon={<BusinessIcon fontSize="small" color="action" />}
                  label="Department"
                  value={user.company.department}
                />
                <InfoRow
                  icon={<BadgeIcon fontSize="small" color="action" />}
                  label="Title"
                  value={user.company.title}
                />
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Bank Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CreditCardIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Bank Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                <InfoRow
                  icon={<CreditCardIcon fontSize="small" color="action" />}
                  label="Card Number"
                  value={maskCardNumber(user.bank.cardNumber)}
                />
                <InfoRow
                  icon={<CreditCardIcon fontSize="small" color="action" />}
                  label="Card Type"
                  value={user.bank.cardType}
                />
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default UserDetailCard;
