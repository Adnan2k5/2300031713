import { Box, Button, MenuItem, Paper, Stack, TextField } from '@mui/material'

const FiltersBar = ({
    type,
    onTypeChange,
    limit,
    onLimitChange,
    types,
    limitOptions,
    onRefresh,
    rightSlot,
}) => {
    return (
        <Paper className="filters-bar">
            <Stack direction="row" spacing={2} className="filters-stack">
                <TextField
                    select
                    size="small"
                    label="Type"
                    value={type}
                    onChange={(event) => onTypeChange(event.target.value)}
                    className="filter-field"
                >
                    <MenuItem value="All">All</MenuItem>
                    {types.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    size="small"
                    label="Limit"
                    value={limit}
                    onChange={(event) => onLimitChange(Number(event.target.value))}
                    className="filter-field"
                >
                    {limitOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="outlined" size="small" onClick={onRefresh}>
                    Refresh
                </Button>
            </Stack>
            {rightSlot ? <Box className="filters-right">{rightSlot}</Box> : null}
        </Paper>
    )
}

export default FiltersBar
