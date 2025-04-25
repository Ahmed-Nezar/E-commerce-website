import * as React from 'react';
import Slider from '@mui/material/Slider';

function valuetext(value) {
    return `${value}°C`;
}

const minDistance = 10;

const MinimumDistanceSlider = ({min, max, rangeText, sx}) => {
    const [value1, setValue1] = React.useState([min, max]);
    const marks = [
        {
            value: min,
            label: `${min} ${rangeText}`,
        },
        {
            value: max,
            label: `${max} ${rangeText}`,
        },
    ]

    const handleChange1 = (event, newValue, activeThumb) => {
        if (activeThumb === 0) {
            setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
        } else {
            setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
        }
    };

    return (
        <Slider
            value={value1}
            onChange={handleChange1}
            valueLabelDisplay="auto"
            disableSwap
            min={min}
            max={max}
            marks={marks}
            sx={sx}
        />
    );
}

export default MinimumDistanceSlider