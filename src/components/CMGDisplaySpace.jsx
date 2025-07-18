import { Box, Image, Text, Stack, Badge, useMediaQuery, Flex } from '@chakra-ui/react';
import { currencyConverter } from '../utils';
import moment from 'moment';
import constants from '../utils/constants';
import CMGCarousel from './CMGCarousel';

const CMGDisplaySpace = ({ space, reservations }) => {
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  return (
    <Box maxW={isGreaterThan800 ? "sm" : "lg"} borderWidth="1px" borderRadius="lg" maxHeight="80vh" overflow="scroll" padding={0}>
      <Flex>
        <CMGCarousel images={space.images ? space.images?.split(',') : []} showDelete={false} width="400px" />
      </Flex>
      <Box p="6">
        <Box mt="1" mb="1" >
          <Text fontSize="1.4em" fontWeight="semibold">{space.name}</Text>
        </Box>
        <Box>
          <Text
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
          >
            Price: {currencyConverter(space.currency)} {space.price}
          </Text>
        </Box>
        <Box>
          <Text
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
          >
            Area: {space.square_meters} sqm
          </Text>
        </Box>
        <Box>
          <Text color="gray.500" fontSize="sm">
            Location: {space.location}
          </Text>
        </Box>

        <Box>
          <Text color="gray.500" fontSize="sm">
            Latitude: {space.latitude}, Longitude: {space.longitude}
          </Text>
        </Box>

        <Box>
          <Text color="gray.500" fontSize="sm">
            Created at: {new Date(space.created_at).toLocaleString()}
          </Text>
        </Box>
        <Box paddingTop={10}>
          <Text>Reservations</Text>
          <Box paddingTop={3}>
            {
              reservations.length > 0 ?
                <>
                  <Box display="flex" justifyContent="space-between" fontWeight="semibold" padding={0} fontSize="0.8em" width="100%">
                    <Box width="40%">Full Name</Box>
                    <Box width="30%">Date</Box>
                    <Box width="30%">Status</Box>
                  </Box>
                  {
                    reservations.map((reservation, i) =>
                      <Box display="flex" key={i} justifyContent="space-between" padding={0} fontSize="0.8em" width="100%">
                        <Box width="40%">{reservation.username}</Box>
                        <Box width="30%">{moment(reservation.start_date).format('DD-MM-YYYY')}</Box>
                        <Box width="30%">
                          <Badge background={constants.STATUS_COLOR[reservation.status]}>{(reservation.status).replace('_', ' ')}</Badge>
                        </Box>
                      </Box>
                    )
                  }
                </>
                :
                <></>
            }
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CMGDisplaySpace;
