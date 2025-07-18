import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Box, Container, Flex, Image, Text } from '@chakra-ui/react';
import { getSpaceService } from '../../services/space.services';
import CMGCard from '../../components/CMGCard';
import CMGButton from '../../components/CMGButton';
import { useAlertContext } from '../../contexts/AlertContext';

const ViewSpace = () => {
  const [space, setSpace] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlertContext();

  const getSpace = () => {
    getSpaceService(id)
      .then(space => setSpace(space))
      .catch(error => {
        showAlert({
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
        });
      })
  }

  useEffect(() => {
    getSpace();
  }, [])

  return (
    <Container>
      <Flex>
        <Box>
          <Image src={space?.image} height={200} width={200} objectFit="contain" />
        </Box>
        <Box>
          <CMGCard title={space?.name} header={<CMGButton onClick={() => navigate(`/spaces/edit/${id}`)} icon={<FaEdit />} />} >
            <Flex direction="column" gap="20px">
              <Flex direction="column" alignItems="start">
                <Text>{space?.location}</Text>
                <small style={{ color: 'grey' }}>Location</small>
              </Flex>
              <Flex direction="column" alignItems="start">
                <Text>{space?.number_of_beds}</Text>
                <small style={{ color: 'grey' }}>Number of beds</small>
              </Flex>
              <Flex direction="column" alignItems="start">
                <Text>{space?.price} {space?.currency}</Text>
                <small style={{ color: 'grey' }}>Price</small>
              </Flex>
            </Flex>
          </CMGCard>
        </Box>
      </Flex>
    </Container>
  )
}

export default ViewSpace;