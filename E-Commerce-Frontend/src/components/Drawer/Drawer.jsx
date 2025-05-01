import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const ResponsiveDrawer = ( {children} ) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            {windowWidth <= 652 ? (
                <>
                    <Button variant="contained" onClick={() => setDrawerOpen(true)} className="col-lg-12 col-lg-8 mt-4">
                        <FilterAltIcon />
                        Filter
                    </Button>
                    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                        <Box sx={{ width: 280, padding: 2 }} role="presentation">
                            {children}
                        </Box>
                    </Drawer>
                </>
            ) : (
                <div className="col-lg-12 col-lg-4 mt-4 d-flex flex-column">
                    {children}
                </div>
            )}
        </div>
    );
}

export default ResponsiveDrawer