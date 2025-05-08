import {styled} from "@mui/material/styles";
import {alpha, Box, IconButton, InputBase, useMediaQuery} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";
import { useSearch } from "../../context/SearchContext"; // adjust path as needed


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.45),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.55),
    },
    margin: '0 2rem',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        // marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '21ch',
            },
        },
    },
}));

const SearchBar = () => {
    const { searchInput, setSearchInput } = useSearch();
    const isMobile = useMediaQuery('(max-width:600px)');
    const [showOverlaySearch, setShowOverlaySearch] = useState(false);
    return (
        <>
            <Box sx={{ position: 'relative' }}>
                {!isMobile ? (
                    // Desktop search bar
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            autoFocus
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchInput}
                            onInput={(e) => setSearchInput(e.target.value)}
                        />
                    </Search>
                ) : (
                    // Mobile search icon
                    <>
                        <IconButton onClick={() => setShowOverlaySearch(prev => !prev)} color="inherit">
                            <SearchIcon />
                        </IconButton>
                        {showOverlaySearch && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#fff',
                                    boxShadow: 3,
                                    zIndex: 10,
                                    p: 1,
                                }}
                            >
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        autoFocus
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        value={searchInput}
                                        onInput={(e) => setSearchInput(e.target.value)}
                                    />
                                </Search>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    )

}

export default SearchBar;