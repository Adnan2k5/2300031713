import {
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Stack,
    Typography,
} from '@mui/material'
import { formatDate } from '../utils/format'

const NotificationCard = ({ item, isViewed, onMarkViewed }) => {
    const title = item.title || 'Untitled notification'
    const message = item.message || 'No details provided.'
    const type =
        item.type || item.notification_type || item.notificationType || 'General'
    const status = item.status || (isViewed ? 'read' : 'unread')

    return (
        <Card className={`notification-card ${isViewed ? 'is-viewed' : 'is-new'}`}>
            <CardContent>
                <Stack spacing={1.2}>
                    <Typography variant="h6" className="notification-title">
                        {title}
                    </Typography>
                    <Typography variant="body2" className="notification-message">
                        {message}
                    </Typography>
                    <Stack direction="row" spacing={1} className="meta-row">
                        <Chip label={type} size="small" className="chip-type" />
                        <Chip
                            label={isViewed ? 'Viewed' : 'New'}
                            size="small"
                            color={isViewed ? 'default' : 'secondary'}
                        />
                        {status ? (
                            <Chip
                                label={status}
                                size="small"
                                variant="outlined"
                                className="chip-status"
                            />
                        ) : null}
                    </Stack>
                    <Typography variant="caption" className="meta-row">
                        {formatDate(item.createdAt || item.created_at)}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions className="card-actions">
                <Button
                    variant={isViewed ? 'outlined' : 'contained'}
                    size="small"
                    onClick={onMarkViewed}
                    disabled={isViewed}
                >
                    {isViewed ? 'Viewed' : 'Mark viewed'}
                </Button>
            </CardActions>
        </Card>
    )
}

export default NotificationCard
