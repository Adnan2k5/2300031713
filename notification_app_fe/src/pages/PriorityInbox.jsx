import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import FiltersBar from '../components/FiltersBar'
import NotificationCard from '../components/NotificationCard'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import { usePriorityInbox } from '../hooks/usePriorityInbox'
import { useViewedNotifications } from '../hooks/useViewedNotifications'

const typeOptions = ['Event', 'Result', 'Placement']
const limitOptions = [3, 5, 8, 10]

const PriorityInbox = () => {
    const [limit, setLimit] = useState(8)
    const [type, setType] = useState('All')

    const { items, loading, error, reload } = usePriorityInbox({ limit, type })
    const { isViewed, markViewed, markAllViewed } = useViewedNotifications()

    const handleMarkAllViewed = () => {
        const ids = items.map((item) => item.id).filter(Boolean)
        markAllViewed(ids)
    }

    return (
        <Box>
            <PageHeader
                title="Priority Inbox"
                subtitle="Top notifications ranked by urgency and recency. Fine tune the list size and type."
            >
                <Button
                    variant="contained"
                    onClick={handleMarkAllViewed}
                    disabled={!items.length}
                >
                    Mark all viewed
                </Button>
            </PageHeader>

            <FiltersBar
                type={type}
                onTypeChange={setType}
                limit={limit}
                onLimitChange={setLimit}
                types={typeOptions}
                limitOptions={limitOptions}
                onRefresh={reload}
                rightSlot={
                    <Typography variant="body2" className="filters-hint">
                        Showing top {limit}
                    </Typography>
                }
            />

            {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            ) : null}

            {loading ? (
                <Box className="loading-state">
                    <CircularProgress size={28} />
                </Box>
            ) : items.length ? (
                <Box className="notice-grid">
                    {items.map((item) => (
                        <NotificationCard
                            key={item.id}
                            item={item}
                            isViewed={isViewed(item.id, item.status)}
                            onMarkViewed={() => markViewed(item.id)}
                        />
                    ))}
                </Box>
            ) : (
                <EmptyState
                    title="No priority alerts"
                    subtitle="Increase the limit or switch the type to explore more items."
                />
            )}
        </Box>
    )
}

export default PriorityInbox
