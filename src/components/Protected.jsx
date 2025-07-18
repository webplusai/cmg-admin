import { Box } from '@chakra-ui/react';
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { UserProvider } from "../contexts/UserContext";
import Layout from './Layout';
import { useNavContext } from '../contexts/NavContext';

const Protected = () => {
  const { isSignedIn } = useAuthContext();
  const location = useLocation()
  const { setIsSideOpened } = useNavContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/auth/login');
    }
  }, [isSignedIn])

  const Style = (path) => ({
    color: location.pathname === path ? '#777' : 'initial'
  })

  const closeNav = () => {
    setIsSideOpened(false)
  }

  return (
    <UserProvider>
      <Box bgColor="#fff" width="100vw">
        <Layout
          sideLinks={
            <>
              <Link onClick={closeNav} to="/" style={Style('/')}>Performance</Link>
              <Link onClick={closeNav} to="/spaces" style={Style('/spaces')}>Space</Link>
              <Link onClick={closeNav} to="/users" style={Style('/users')}>Users</Link>
              <Link onClick={closeNav} to="/reservations" style={Style('/reservations')}>Reservations</Link>
              <Link onClick={closeNav} to="/map" style={Style('/map')}>Map</Link>
            </>
          }
          content={<Outlet />}
        />
      </Box>
    </UserProvider>
  )
}

export default Protected