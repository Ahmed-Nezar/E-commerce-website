import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import {NavLink} from "react-router-dom";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: (theme.vars || theme).palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(theme.palette.grey[100], 0.06),
            ...theme.applyStyles('dark', {
                backgroundColor: emphasize(theme.palette.grey[800], 0.06),
            }),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[100], 0.12),
            ...theme.applyStyles('dark', {
                backgroundColor: emphasize(theme.palette.grey[800], 0.12),
            }),
        },
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    };
});

const CustomBreadcrumbs = ({locations}) => {

    return (
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
                <StyledBreadcrumb
                    component= {NavLink}
                    to = "/"
                    label="Home"
                    icon={<HomeIcon fontSize="small" />}
                />
                {
                    locations.map((location, index) => (
                        <StyledBreadcrumb component={NavLink} to={`/${location.route}`} label={`${location.title}`}/>
                    ))
                }
            </Breadcrumbs>
        </div>
    );
}

export default CustomBreadcrumbs;
