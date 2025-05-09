import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {useEffect, useState} from 'react';
const ResponsiveDrawer = ( {children, triggerButton, anchor, breakpoint, defaultView, menuOpen, setMenuOpen} ) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const showDrawer = windowWidth <= breakpoint

    useEffect(() => {
        setDrawerOpen(menuOpen);
    }, [menuOpen]);

    return (
        <>
            {showDrawer || menuOpen ? (
                <>
                    {showDrawer ? (
                        <div onClick={() => setDrawerOpen(true)}>
                            {triggerButton}
                        </div>
                    ):(
                        <></>
                    )}
                    <Drawer anchor={anchor} open={drawerOpen} onClose={() => {
                        setDrawerOpen(false)
                        setMenuOpen(false)
                    }}>
                        <Box sx={{ width: 280, padding: 2 }} role="presentation" style={{backgroundColor: 'rgba(171, 210, 250, 0.65)', height:'inherit'}}>
                            {children}
                        </Box>
                    </Drawer>
                </>
            ) : defaultView ? (
                <div className="col-lg-12 col-lg-4 mt-4 d-flex flex-column">
                    {children}
                </div>
            ): (<></>)}
        </>
    );
}

export default ResponsiveDrawer