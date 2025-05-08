// src/components/Profile/Profile.jsx
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
  Chip,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Place as PlaceIcon,
  Public as PublicIcon,
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import {useCart} from "../../context/CartContext.jsx";

export default function Profile() {
    const {user, setUser} = useCart();
    const [editMode, setEditMode] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((u) => ({...u, [name]: value}));
    };

    const handleSave = () => {
        // TODO: send `user` to your API
        console.log('Saved profile:', user);
        setEditMode(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                pt: 8,
                px: 2,
                background: 'linear-gradient(to right, #7AA1ED, #A1C4FD)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
        >
            <Card sx={{maxWidth: 400, width: '100%', boxShadow: 6, borderRadius: 3}}>
                <CardHeader
                    sx={{
                        background: 'linear-gradient(to right, #A1C4FD, #C2E9FB)',
                        color: '#fff',
                        textAlign: 'center',
                        '& .MuiCardHeader-avatar': {mx: 'auto'},
                    }}
                    avatar={
                        <Avatar
                            src={user.profilePic}
                            alt={user.name}
                            sx={{width: 80, height: 80, border: '2px solid #fff'}}
                        />
                    }
                    title={
                        <Typography variant="h6">
                            {editMode ? 'Edit Profile' : 'Profile'}
                        </Typography>
                    }
                    subheader={
                        <Chip
                            label={user.isAdmin ? 'Admin' : 'User'}
                            color={user.isAdmin ? 'warning' : 'default'}
                            size="small"
                        />
                    }
                    action={
                        <IconButton
                            onClick={() => {
                                if (editMode) setUser(user);
                                setEditMode((m) => !m);
                            }}
                            sx={{color: '#fff'}}
                        >
                            {editMode ? <CancelIcon/> : <EditIcon/>}
                        </IconButton>
                    }
                />

                <CardContent>
                    <Grid container spacing={2}>
                        {/* Name */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="name"
                                label="Name"
                                value={user.name}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: !editMode,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email"
                                value={user.email}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: !editMode,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        {/* Phone */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="phone"
                                label="Phone"
                                value={user.phone}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: !editMode,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        {/* Address */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="address"
                                label="Address"
                                value={user.address}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: !editMode,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PlaceIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        {/* Country & City */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="country"
                                label="Country"
                                value={user.country}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: !editMode,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PublicIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="city"
                                label="City"
                                value={user.city}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: !editMode,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationCityIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        {/* Password (only in edit) */}
                        {editMode && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="New Password"
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                        )}
                    </Grid>
                </CardContent>

                {editMode && (
                    <CardActions sx={{justifyContent: 'flex-end', pr: 2, pb: 2}}>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            startIcon={<SaveIcon/>}
                            size="small"
                        >
                            Save
                        </Button>
                    </CardActions>
                )}
            </Card>
        </Box>
    );
}
