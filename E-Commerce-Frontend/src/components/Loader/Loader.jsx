import { Box, CircularProgress } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #091540, #3D518C)',
          opacity: 0.1,
          animation: 'pulse 2s infinite',
        },
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 0.1,
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: 0.05,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 0.1,
          },
        },
      }}
    >
      <CircularProgress
        size={50}
        thickness={4}
        sx={{
          color: '#3D518C',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
    </Box>
  );
};

export default Loader;