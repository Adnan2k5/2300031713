import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import AllNotifications from './pages/AllNotifications'
import PriorityInbox from './pages/PriorityInbox'

function App() {
    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<AllNotifications />} />
                <Route path="/priority" element={<PriorityInbox />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppShell>
    )
}

export default App
