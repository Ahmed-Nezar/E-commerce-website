import { Box, Typography, CardMedia } from '@mui/material';

function NoResultsPlaceholder() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="60vh"
            textAlign="center"
        >
            <CardMedia
                component="img"
                image="/images/logos/no-results.webp" // Ensure this path points to your downloaded image
                alt="No Results Found"
                sx={{ maxWidth: 300, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
                No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search terms.
            </Typography>
        </Box>
    );
}

export default NoResultsPlaceholder;
