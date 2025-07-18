import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, FormControl, FormLabel, Image, Text, useMediaQuery } from '@chakra-ui/react';
import Immoshoot from '../assets/png/immoshoot.png';
import CMGButton from '../components/CMGButton';
import CMGInput from '../components/CMGInput';
import { useAuthContext } from '../contexts/AuthContext';
import { useAlertContext } from '../contexts/AlertContext';

const Register = () => {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  const [payload, setPayload] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'CUSTOMER',
  });

  const handleInputChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value
    })
  };

  const handleRegister = (e) => {
    e.preventDefault();

    register(payload)
      .then(() => {
        navigate('/auth/login');
      })
      .catch(() => {
        showAlert({
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
        });
      })
  };

  const navigateToLogin = () => {
    navigate('/auth/login');
  }

  return (
    <Box overflowY="scroll" height="100vh" paddingTop="200px">
      <Flex direction="column" height="80%" width="100vw" gap="20px" marginTop="100px" marginBottom="100px" justifyContent="center" alignItems="center">
        <Image src={Immoshoot} />
        <Box border="1px solid #cccfdb" width={isGreaterThan800 ? '460px' : '95vw'}>
          <Box borderBottom="1px solid #cccfdb" padding="20px" width="100%">
            <Text align="left">Connexion</Text>
          </Box>
          <form onSubmit={handleRegister}>
            <Flex direction="column" padding="29px" gap="20px">
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <CMGInput
                  type="text"
                  name="first_name"
                  value={payload.first_name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <CMGInput
                  type="text"
                  name="last_name"
                  value={payload.last_name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <CMGInput
                  type="email"
                  name="email"
                  value={payload.email}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <CMGInput
                  type="password"
                  name="password"
                  value={payload.password}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password:</FormLabel>
                <CMGInput
                  type="password"
                  name="confirm_password"
                  value={payload.confirm_password}
                  onChange={handleInputChange}
                />
              </FormControl>
              <CMGButton background="#1b71ff" textColor="#fff" type="submit" text="Register" style={{ marginTop: '70px' }} />
              <Flex justifyContent="space-between">
                <CMGButton onClick={navigateToLogin} text="Login" marginTop="10px" />
                <CMGButton text="Forgot password" marginTop="10px" />
              </Flex>
            </Flex>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}

export default Register;
