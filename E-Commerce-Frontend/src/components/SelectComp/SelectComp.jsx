import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect() {
    const [sortVal, setSortVal] = React.useState('');

    const handleChange = (event) => {
        setSortVal(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortVal}
                    onChange={handleChange}
                >
                    <MenuItem>Price: Low to High</MenuItem>
                    <MenuItem>Price: High to Low</MenuItem>
                    <MenuItem>Name: A - Z</MenuItem>
                    <MenuItem>Name: Z - A</MenuItem>
                    <MenuItem>Ratings: Highest</MenuItem>
                    <MenuItem>Ratings: Lowest</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
