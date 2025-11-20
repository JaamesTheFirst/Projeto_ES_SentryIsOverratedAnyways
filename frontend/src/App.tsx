import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ErrorsPage } from './pages/ErrorsPage';
import { ErrorDetailPage } from './pages/ErrorDetailPage';
import { RegisterIncidentPage } from './pages/RegisterIncidentPage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';
import './styles/common.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/errors" element={<ErrorsPage />} />
                <Route path="/error-detail" element={<ErrorDetailPage />} />
                <Route path="/register-incident" element={<RegisterIncidentPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
