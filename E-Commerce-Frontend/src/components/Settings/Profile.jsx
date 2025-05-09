// src/components/Settings/Profile.jsx
import React, {useEffect, useRef, useState} from 'react';
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
  MenuItem, useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import {useCart} from "../../context/CartContext.jsx";
import {ENV} from "../../App.jsx";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const {user, setUser, showMessage} = useCart();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 600px)');
  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user])

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditedUser(u => ({...u, [name]: value}));
  };

  const handleSave = async () => {
    try {
      const body = {
        name: editedUser.name,
        email: editedUser.email,
        gender: editedUser.gender,
      };
      const res = await fetch(`${ENV.VITE_BACKEND_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // include auth token if needed:
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message || 'Save failed');
      // update context with returned user
      setUser(prev => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
        gender: data.user.gender,
        profilePic: data.user.profilePic
      }));
      setEditMode(false);
      showMessage('Profile updated successfully', false);
    } catch (err) {
      showMessage(err.message || 'Error saving profile', true);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedUser(user);
    showMessage('Edit cancelled', null);
  };

  return (
      <Box
          sx={{
            width: '100%',
            minHeight: '100%',
            px: { xs: 2, sm: 4 },
            pt: { xs: 2, sm: 4 },
            pb: 0,
            background: 'linear-gradient(to right, #7AA1ED, #A1C4FD)',
          }}
      >
        <Card
            sx={{
              maxWidth: 700,
              width: '100%',
              mx: 'auto',
              boxShadow: 3,
              borderRadius: 2,
            }}
        >
          <CardHeader
              avatar={
                <Avatar
                    src={editedUser?.profilePic}
                    alt={editedUser?.name}
                    sx={{
                      width: { xs: 56, sm: 90 },     // smaller avatar on xs
                      height: { xs: 56, sm: 90 },
                    }}
                />
              }
              title={
                <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {editMode ? 'Edit Profile' : 'Profile'}
                </Typography>
              }
              subheader={
                <Typography variant="subtitle2" color="text.secondary">
                  {editedUser?.isAdmin ? 'Admin' : 'User'}
                </Typography>
              }
              action={
                  !editMode && (
                      <IconButton onClick={() => setEditMode(true)}>
                        <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                  )
              }
              sx={{
                pb: 2,
                '& .MuiCardHeader-content': {
                  ml: { xs: 1, sm: 2 }        // tighten spacing on xs
                }
              }}
          />

          <CardContent sx={{ pt: 0, pb: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={editedUser?.name || ''}
                    onChange={handleChange}
                    InputProps={{ readOnly: !editMode }}
                    InputLabelProps={{ shrink: Boolean(editedUser?.name) }}
                    size={isMobile ? 'small' : 'medium'}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {editMode ? (
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                          labelId="gender-label"
                          name="gender"
                          value={editedUser?.gender || ''}
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
                        value={editedUser?.gender || ''}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ shrink: Boolean(editedUser?.gender) }}
                        size={isMobile ? 'small' : 'medium'}
                    />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={editedUser?.email || ''}
                    onChange={handleChange}
                    InputProps={{ readOnly: !editMode }}
                    InputLabelProps={{ shrink: Boolean(editedUser?.email) }}
                    size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions sx={{ justifyContent: 'flex-end', px: { xs: 1, sm: 3 }, pb: 2 }}>
            <Button size={isMobile ? 'small' : 'medium'} onClick={() => navigate('/me/change-password')}>
              Change Password
            </Button>
          </CardActions>

          {editMode && (
              <CardActions sx={{ justifyContent: 'flex-end', px: { xs: 1, sm: 3 }, pb: 2, gap: 1 }}>
                <Button
                    startIcon={<CancelIcon fontSize={isMobile ? 'small' : 'medium'} />}
                    size={isMobile ? 'small' : 'medium'}
                    onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon fontSize={isMobile ? 'small' : 'medium'} />}
                    size={isMobile ? 'small' : 'medium'}
                    onClick={handleSave}
                >
                  Save
                </Button>
              </CardActions>
          )}
        </Card>
      </Box>

  );
}
