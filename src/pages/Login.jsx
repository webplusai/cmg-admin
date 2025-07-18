import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, FormControl, FormLabel, Image, Text, useMediaQuery } from '@chakra-ui/react';
import CMGButton from '../components/CMGButton';
import { useAuthContext } from '../contexts/AuthContext';
import Immoshoot from '../assets/png/immoshoot.png';
import CMGInput from '../components/CMGInput';
import { useAlertContext } from '../contexts/AlertContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    login({ username, password })
      .then(() => {
        window.open('/', '_self');
      })
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
        });
      })
  }

  const navigateToRegister = () => {
    navigate('/auth/register');
  }

  return (
    <Flex direction="column" height="100vh" width="100vw" gap="20px" justifyContent="center" alignItems="center">
      <Image src={Immoshoot} />
      <Box border="1px solid #cccfdb" width={isGreaterThan800 ? '460px' : '95vw'}>
        <Box borderBottom="1px solid #cccfdb" padding="20px" width="100%">
          <Text align="left">Connection</Text>
        </Box>
        <Box padding="29px">
          <form onSubmit={handleLogin}>
            <FormControl className="form-group" marginBottom="20px">
              <FormLabel>Username</FormLabel>
              <CMGInput
                type="text"
                name="username"
                value={username}
                onChange={handleInputChange}
                placeholder='Enter your email address'
                required
              />
            </FormControl>
            <FormControl className="form-group" marginBottom="20px">
              <FormLabel>Password</FormLabel>
              <CMGInput
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder='Enter your password'
                required
              />
            </FormControl>
            <CMGButton background="#1b71ff" textColor="#fff" type="submit" text="Login" width="100%" style={{ marginTop: '70px' }} />
          </form>
          <Flex justifyContent="space-between">
            <CMGButton onClick={navigateToRegister} text="Register" marginTop="10px" />
            <CMGButton text="Forgot password" marginTop="10px" />
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default Login;