import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

export const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

// Create a theme instance.
const theme = createTheme({
    cssVariables: true,
    colorSchemes: {
        dark: true,
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});

export default theme;
