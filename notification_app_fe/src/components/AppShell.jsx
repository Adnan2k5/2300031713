import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { Link, matchPath, useLocation } from 'react-router-dom'

const navItems = [
    {
        to: '/',
        label: 'All Notifications',
    },
    {
        to: '/priority',
        label: 'Priority Inbox',
    },
]

const AppShell = ({ children }) => {
    const location = useLocation()

    return (
        <Box className="app-shell">
            <AppBar position="sticky" color="transparent" elevation={0} className="app-bar">
                <Container maxWidth="lg">
                    <Toolbar className="toolbar" disableGutters>
                        <Box className="brand">
                            <span className="brand-mark" />
                            <Typography variant="h6" className="brand-title">
                                Campus Notifications
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} className="nav-links">
                            {navItems.map((item) => {
                                const isActive = Boolean(
                                    matchPath(
                                        { path: item.to, end: item.to === '/' },
                                        location.pathname,
                                    ),
                                )

                                return (
                                    <Button
                                        key={item.to}
                                        component={Link}
                                        to={item.to}
                                        className={
                                            isActive
                                                ? 'nav-link nav-link-active'
                                                : 'nav-link'
                                        }
                                    >
                                        {item.label}
                                    </Button>
                                )
                            })}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="main" className="app-main">
                <Container maxWidth="lg">{children}</Container>
            </Box>
        </Box>
    )
}

export default AppShell
