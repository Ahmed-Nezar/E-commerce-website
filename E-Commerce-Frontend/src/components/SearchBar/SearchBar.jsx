import { styled } from "@mui/material/styles";
import {
    alpha,
    Box,
    IconButton,
    InputBase,
    useMediaQuery,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    ClickAwayListener, CircularProgress
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, useRef } from "react";
import { useSearch } from "../../context/SearchContext";
import { ENV } from "../../App.jsx";
import { useNavigate, useLocation } from "react-router-dom";


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.45),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.55),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
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
    const [suggestions, setSuggestions] = useState([]);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [showOverlaySearch, setShowOverlaySearch] = useState(false);
    const navigate = useNavigate();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const location = useLocation();
    const wrapperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const isProductPage = location.pathname.includes('/products/');

    useEffect(() => {
        setShowOverlaySearch(false); // Hide the overlay on route change
    }, [location.pathname]);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            const query = searchInput.trim();

            if (query.length < 1) {
                setSuggestions([]);
                setHasSearched(false);
                return;
            }

            setIsLoading(true);
            setHasSearched(false);

            try {
                const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/products?keyword=${query}&limit=6`);
                const data = await response.json();
                if (data.data) {
                    setSuggestions(data.data.map(p => ({
                        id: p._id,
                        name: p.name,
                        image: p.image,
                        price: p.price
                    })));
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
                setHasSearched(true); // only set true after fetch completes
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (productId) => {
        setSuggestions([]);
        setSearchInput('');
        navigate(`/productDetails/${productId}`);
    };

    const SearchWithSuggestions = (
        <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
        <Box sx={{ width: '100%', position: 'relative' }} ref={wrapperRef}>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    autoFocus
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchInput}
                    onInput={(e) => {
                        setSearchInput(e.target.value)
                        setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                />
            </Search>
            {!isProductPage && (
                <Paper
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 99,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        mt: 0.5,
                    }}
                >
                    {isLoading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                padding: 2,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : showSuggestions && searchInput.trim() && hasSearched ? (
                        suggestions.length > 0 ? (
                            <List>
                                {suggestions.map((suggestion) => (
                                    <ListItem disablePadding key={suggestion.id}>
                                        <ListItemButton onClick={() => handleSelect(suggestion.id)}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <img
                                                        src={suggestion.image}
                                                        alt={suggestion.name}
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            objectFit: 'cover',
                                                            borderRadius: 4,
                                                        }}
                                                    />
                                                    <Typography>{suggestion.name}</Typography>
                                                </Box>
                                                <Typography sx={{ fontWeight: 500 }}>${suggestion.price}</Typography>
                                            </Box>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    padding: 2,
                                }}
                            >
                                No Results Found
                            </Box>
                        )
                    ) : null}
                </Paper>
            )}
        </Box>
        </ClickAwayListener>
    );

    return (
        <>
            <Box sx={{ position: 'relative', width: isMobile ? 'auto' : '35%' }}>
                {!isMobile ? (
                    SearchWithSuggestions
                ) : (
                    // Mobile search icon
                    <>
                        <IconButton onClick={() => setShowOverlaySearch(prev => !prev)} color="#3D518C" style={{height: '100%'}}>
                            <SearchIcon />
                        </IconButton>
                        {showOverlaySearch && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '49px',
                                    right: '0',
                                    backgroundColor: 'rgba(171, 210, 250, 0.65)',
                                    boxShadow: 3,
                                    zIndex: 10,
                                    width: '50vw',
                                    borderRadius: '4px'
                                }}
                            >
                                {SearchWithSuggestions}
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    )
}

export default SearchBar;