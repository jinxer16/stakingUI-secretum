import { Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Container, AppBar, Toolbar} from '@mui/material';
import { useSelector } from 'store';
import { drawerWidth } from 'store/constant';


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            //marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            //padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            //marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            //padding: '16px',
            //marginRight: '10px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            //marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            //marginLeft: '10px'
        }
    })
}));


const MinimalLayout = () => {
    const theme = useTheme();    
    const { drawerOpen } = useSelector((state) => state.menu);

    return (
    <>
        <Box sx={{ display: 'flex' }}>
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: drawerOpen ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar>

                </Toolbar>
            </AppBar>
            <Main theme={theme} open={drawerOpen}>
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </Main>
        </Box>
    </>
    );
}

export default MinimalLayout;
