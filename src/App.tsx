import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthPage } from "./pages/AuthPage"
import { DashboardPage } from "./pages/DashboardPage"
import { SchedulerPage } from "./pages/SchedulerPage"
import { ProfilePage } from "./pages/ProfilePage"
import { CheckupsPage } from "./pages/CheckupsPage"
import { VaccinationsPage } from "./pages/VaccinationsPage"
import { SharedViewPage } from "./pages/SharedViewPage"
import { AppLayout } from "./components/layout/AppLayout"
import { LanguageProvider } from "./contexts/LanguageContext"

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/share/:id" element={<SharedViewPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scheduler" element={<SchedulerPage />} />
            <Route path="/checkups" element={<CheckupsPage />} />
            <Route path="/vaccinations" element={<VaccinationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
