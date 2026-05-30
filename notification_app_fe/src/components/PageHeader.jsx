import { Box, Stack, Typography } from '@mui/material'

const PageHeader = ({ title, subtitle, children }) => {
    return (
        <Box className="page-header">
            <Box className="page-text">
                <Typography variant="h3" className="page-title">
                    {title}
                </Typography>
                <Typography variant="body1" className="page-subtitle">
                    {subtitle}
                </Typography>
            </Box>
            {children ? (
                <Stack direction="row" spacing={1.5} className="page-actions">
                    {children}
                </Stack>
            ) : null}
        </Box>
    )
}

export default PageHeader
