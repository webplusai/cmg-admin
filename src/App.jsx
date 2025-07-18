import { Route, Routes } from 'react-router-dom'
import './App.css'
import Protected from './components/Protected'
import Login from './pages/Login'
import Register from './pages/Register'
import EditSpace from './pages/Space/Edit'
import ViewSpace from './pages/Space/View'
import Space from './pages/Space/index'
import UsersListPage from './pages/users/index'
import Reservations from './pages/Reservation'
import Performance from './pages/Performance'
import MapArea from './pages/Map'
import ExportSpace from './pages/Space/export'

const App = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/spaces/export/:id" element={<ExportSpace />} />
      <Route element={<Protected />}>
        <Route path="/" element={<Performance />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/spaces" element={<Space />} />
        <Route path="/spaces/:id" element={<ViewSpace />} />
        <Route path="/spaces/edit/:id" element={<EditSpace />} />
        <Route path="/spaces/create" element={<EditSpace />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/:id" element={<ViewSpace />} />
        <Route path="/map" element={<MapArea />} />
      </Route>
    </Routes>
  )
}

export default App
