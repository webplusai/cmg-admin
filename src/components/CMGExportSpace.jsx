import { Box, Image, Text, Stack, Badge, useMediaQuery } from '@chakra-ui/react';
import { currencyConverter } from '../utils';

const CMGExportSpace = ({ space }) => {
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  return (
    <Box maxW={isGreaterThan800 ? "sm" : "lg"} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={space.image} alt={space.name} height={200} width="100%" objectFit="cover" />
      <Box p="6">
        <Stack spacing={1} isInline align="baseline" justifyContent="center">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {currencyConverter(space.currency)}
          </Badge>
          <Text
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
          >
            {space.price} per {space.square_meter} sqm
          </Text>
        </Stack>

        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
          {space.name}
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
      </Box>
    </Box>
  );
};

export default CMGExportSpace;
