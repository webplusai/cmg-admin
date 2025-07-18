import {
  Box,
  Flex,
  Image,
  VStack,
  useMediaQuery,
  useOutsideClick
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Immoshoot from '../assets/png/immoshoot.png';
import { useAuthContext } from '../contexts/AuthContext';
import CMGButton from './CMGButton';
import { useNavContext } from '../contexts/NavContext';

const Layout = ({ sideLinks, header, content }) => {
  const { isSignedIn, logout } = useAuthContext();
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')
  const { isSideOpened, setIsSideOpened } = useNavContext();
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => setIsSideOpened(false),
  })

  const handleLogout = () => {
    logout();
    window.location.reload()
  }

  const openSideBar = () => {
    setIsSideOpened(!isSideOpened)
  }

  return (
    isSignedIn ?
      <Flex h="100vh" overflowY="hidden" overflowX="hidden">
        {(isGreaterThan800 || isSideOpened) &&
          <Box ref={ref} flex={1} width="250px" height="100%" zIndex={200} position={isGreaterThan800 ? 'relative' : 'fixed'} bg="#f4f6f8" padding="28px 35px" color="#000" borderRight="1px solid #cccfdb">
            <VStack align="start" spacing={4}>
              <Flex width="100%" justifyContent="center">
                <Image src={Immoshoot} height={70} marginBottom="20px" />
              </Flex>
              <Flex direction="column" gap="20px" alignItems="start" mt={4} h="65vh">
                {sideLinks}
              </Flex>
              <Flex width="100%" justifyContent="center">
                <CMGButton boxShadow="0 1px 2px 1px rgba(6,18,73,.2)" text="Sign out" onClick={handleLogout} />
              </Flex>
            </VStack>
          </Box>
        }
        <Box flex={5} maxW={'100vw'} p={4} bgColor="#fff">
          <Flex justifyContent={isGreaterThan800 ? 'space-between' : isSideOpened ? 'center' : 'flex-start'} marginLeft={!isSideOpened ? '0px' : '100px'} minHeight="70px" width="100%">
            {header}
            {!isGreaterThan800 && <CMGButton onClick={openSideBar} icon={isSideOpened ? <FaTimes /> : <FaBars />} />}
          </Flex>
          <Flex direction="column" gap="10px" width="100%" height="85vh" overflowY="scroll" overflowX="hidden">
            {content}
          </Flex>
        </Box>
      </Flex>
      :
      <>
        {content}
      </>
  );
}

export default Layout;
