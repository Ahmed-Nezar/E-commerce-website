// src/components/Settings/Profile.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import {useCart} from "../../context/CartContext.jsx";
import {toast} from "react-toastify";
import {ENV} from "../../App.jsx";

export default function Profile() {
  const initialUser = {
    name: 'John Doe',
    gender: 'Male',
    email: 'john.doe@example.com',
    profilePic: 'https://i.pravatar.cc/150?img=12',
    role: 'Admin'
  };

  const {user, setUser} = useCart();
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((u) => ({ ...u, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ENV.VITE_BACKEND_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(localUser),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error updating profile');
      }

      setUser(data.user);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setUser(initialUser);
    setEditMode(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        px: 4,
        pt: 4,    // top padding only
        pb: 0,    // removed bottom padding
        background: 'linear-gradient(to right, #7AA1ED, #A1C4FD)',
      }}
    >
      <Card
        sx={{
          width: '100%',
          minHeight: 200,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={user.profilePic}
              alt={user.name}
              sx={{ width: 90, height: 90 }}
            />
          }
          title={<Typography variant="h4">{editMode ? 'Edit Profile' : 'Profile'}</Typography>}
          subheader={<Typography variant="subtitle1" color="text.secondary">{user.role}</Typography>}
          action={
            !editMode && (
              <IconButton onClick={() => setEditMode(true)}>
                <EditIcon />
              </IconButton>
            )
          }
          sx={{ pb: 2 }}
        />

        <CardContent sx={{ pt: 0, pb: 0 }}>  {/* removed mt and pb */}
          <Grid container spacing={4}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={user.name}
                onChange={handleChange}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              {editMode ? (
                <FormControl fullWidth>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    name="gender"
                    value={user.gender}
                    label="Gender"
                    onChange={handleChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Gender"
                  value={user.gender}
                  InputProps={{ readOnly: true }}
                />
              )}
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={user.email}
                onChange={handleChange}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
          </Grid>
        </CardContent>

        {editMode && (
          <CardActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
            <Button startIcon={<CancelIcon />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Save
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
}
