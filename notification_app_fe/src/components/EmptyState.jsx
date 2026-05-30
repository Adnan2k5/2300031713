import { Paper, Typography } from '@mui/material'

const EmptyState = ({ title, subtitle }) => {
    return (
        <Paper className="empty-state">
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2">{subtitle}</Typography>
        </Paper>
    )
}

export default EmptyState
