import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import FiltersBar from '../components/FiltersBar'
import NotificationCard from '../components/NotificationCard'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import { useNotifications } from '../hooks/useNotifications'
import { useViewedNotifications } from '../hooks/useViewedNotifications'

const typeOptions = ['Event', 'Result', 'Placement']
const limitOptions = [5, 10]

const AllNotifications = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [type, setType] = useState('All')

    const { items, loading, error, reload, hasNextPage } = useNotifications({
        page,
        limit,
        type,
    })
    const { isViewed, markViewed, markAllViewed } = useViewedNotifications()

    const handlePrev = () => setPage((current) => Math.max(1, current - 1))
    const handleNext = () => {
        if (hasNextPage) {
            setPage((current) => current + 1)
        }
    }

    const handleMarkPageViewed = () => {
        const ids = items.map((item) => item.id).filter(Boolean)
        markAllViewed(ids)
    }

    return (
        <Box>
            <PageHeader
                title="All Notifications"
                subtitle="Stay on top of campus updates. New items are highlighted and can be marked as viewed."
            >
                <Button
                    variant="contained"
                    onClick={handleMarkPageViewed}
                    disabled={!items.length}
                >
                    Mark page viewed
                </Button>
            </PageHeader>

            <FiltersBar
                type={type}
                onTypeChange={(value) => {
                    setType(value)
                    setPage(1)
                }}
                limit={limit}
                onLimitChange={(value) => {
                    setLimit(value)
                    setPage(1)
                }}
                types={typeOptions}
                limitOptions={limitOptions}
                onRefresh={reload}
                rightSlot={
                    <Typography variant="body2" className="filters-hint">
                        Page {page}
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
                    title="No notifications"
                    subtitle="Try a different filter or check back later."
                />
            )}

            <Stack direction="row" spacing={2} className="page-controls">
                <Button variant="outlined" onClick={handlePrev} disabled={page === 1}>
                    Previous
                </Button>
                <Typography className="page-info">Page {page}</Typography>
                <Button
                    variant="outlined"
                    onClick={handleNext}
                    disabled={!hasNextPage || loading || !items.length}
                >
                    Next
                </Button>
            </Stack>
        </Box>
    )
}

export default AllNotifications
