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
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import {useCart} from "../../context/CartContext.jsx";
import {ENV} from "../../App.jsx";

export default function Profile() {
  const {user, setUser, showMessage} = useCart();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

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
            height: '100%',
            px: 4,
            pt: 4,
            pb: 0,
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
                    src={editedUser?.profilePic}
                    alt={editedUser?.name}
                    sx={{width: 90, height: 90}}
                />
              }
              title={<Typography variant="h4">{editMode ? 'Edit Profile' : 'Profile'}</Typography>}
              subheader={<Typography variant="subtitle1"
                                     color="text.secondary">{editedUser?.isAdmin ? "Admin" : "User"}</Typography>}
              action={
                  !editMode && (
                      <IconButton onClick={() => setEditMode(true)}>
                        <EditIcon/>
                      </IconButton>
                  )
              }
              sx={{pb: 2}}
          />

          <CardContent sx={{pt: 0, pb: 0}}>  {/* removed mt and pb */}
            <Grid container spacing={4}>
              {/* Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={editedUser?.name}
                    onChange={handleChange}
                    InputProps={{readOnly: !editMode}}
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
                          value={editedUser?.gender}
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
                        value={editedUser?.gender}
                        InputProps={{readOnly: true}}
                    />
                )}
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={editedUser?.email}
                    onChange={handleChange}
                    InputProps={{readOnly: !editMode}}
                />
              </Grid>
            </Grid>
          </CardContent>

          {editMode && (
              <CardActions sx={{justifyContent: 'flex-end', px: 3, pb: 2}}>
                <Button startIcon={<CancelIcon/>} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="contained" startIcon={<SaveIcon/>} onClick={handleSave}>
                  Save
                </Button>
              </CardActions>
          )}
        </Card>
      </Box>
  );
}
