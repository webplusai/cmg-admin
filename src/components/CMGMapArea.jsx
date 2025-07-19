import { Divider, Flex, Heading, IconButton, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Tooltip, useMediaQuery } from '@chakra-ui/react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MdClose, MdUpload } from 'react-icons/md';
import { useAlertContext } from '../contexts/AlertContext';
import { getReservationsBySpaceIdService } from '../services/reservation.services';
import { getSpacesExportService, getSpacesNoPaginationService } from '../services/space.services';
import { downloadCsv } from '../utils';
import CMGDisplaySpace from './CMGDisplaySpace';
import CMGFilterSpaceModal from './CMGFilterSpaces';
import CMGText from './CMGText';

const CMGMap = () => {
  const { showAlert } = useAlertContext();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const [spaces, setSpaces] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [space, setSpace] = useState();
  const [reservations, setReservations] = useState([]);
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')
  const [isFetching, setIsFetching] = useState(false);
  const [coords, setCoords] = useState()
  const [center, setCenter] = useState({ lat: 48.8566, lng: 2.3522 });
  const [zoom, setZoom] = useState(12)

  const showSpaceInfo = (space) => {
    setSpace(space);
    setIsOpen(true);
  }

  const updateMap = (minSquareMeters = 0, minDate, coordinates) => {
    setCoordinates(coordinates)
    setIsFilterModalOpen(false)
    setIsFetching(true)
    let query = {
      square_meters: minSquareMeters
    }

    if (minDate) {
      query = { ...query, createdAt: minDate }
    }

    getSpacesNoPaginationService(query)
      .then((response) => {
        setSpaces(response);
        if (!space) setSpace(response[0])
        setIsFilterModalOpen(false)
        setIsFetching(false)
      })
      .catch((error) => {
        setIsFetching(false)
        showAlert({
          title: 'Error',
          description: error || 'Something went wrong',
          status: 'error',
        });
      })
  }

  const exportSpaces = async (query) => {
    getSpacesExportService({ ids: `${query.join(',')}` })
      .then(response => downloadCsv(response, 'spaces'))
      .catch(error => {
        showAlert({
          title: 'Error',
          description: error || 'Something went wrong',
          status: 'error',
        });
      })
  }

  const setCoordinates = (coordinates) => {
    if (coordinates) {
      setCenter({ lat: Number(coordinates?.lat), lng: Number(coordinates?.lng) })
      setZoom(6)
    }
  }

  useEffect(() => {
    updateMap()
  }, [])

  useEffect(() => {
    if (space) {
      getReservationsBySpaceIdService(space?.id)
        .then((response) => {
          setReservations(response);
        })
        .catch((error) => {
          showAlert({
            title: 'Error',
            description: error || 'Something went wrong',
            status: 'error',
          });
        })
    }
  }, [space?.id])

  return (
    <div className="App">
      <Flex justifyContent='space-between' alignItems='center' pr={1}>
        <Flex mt={0} flex={1} direction="column" sx={{ alignItems: 'flex-start', pb: 5 }}>
          <Heading as="h2">Map</Heading>
          <CMGText>View space information and their reservation</CMGText>
        </Flex>
        <Flex gap={3}>
          <Tooltip label="Filter" >
            <IconButton
              onClick={() => setIsFilterModalOpen(true)}
              aria-label="Filter"
              size='sm'
              variant="outline"
              icon={<FaFilter />}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Divider />
      {!isLoaded && spaces.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={zoom}
        >
          {
            spaces.map((space, i) => {
              return (
                <MarkerF
                  key={i}
                  onClick={() => showSpaceInfo(space)}
                  position={{ lat: Number(space.latitude), lng: Number(space.longitude) }}
                />
              )
            })
          }
        </GoogleMap>
      )}
      <Modal isOpen={isOpen} className="map-space-info" onClose={() => setIsOpen(false)} size="sm">
        <ModalContent justifyContent="flex-end" top={20} width="100%" containerProps={{ justifyContent: 'flex-end', paddingRight: isGreaterThan800 ? '2rem' : '10px', paddingLeft: isGreaterThan800 ? '0' : '10px' }}>
          <ModalHeader paddingBottom={0} paddingTop={-5} paddingLeft={5}>
            <Flex justifyContent="space-between">
              <IconButton icon={<MdUpload />} onClick={() => exportSpaces([space?.id])} padding={2} />
              <IconButton icon={<MdClose />} padding={2} onClick={() => setIsOpen(false)} />
            </Flex>
          </ModalHeader>
          <ModalBody padding={0} marginTop={-20} background="#fff">
            <CMGDisplaySpace space={space} reservations={reservations} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isFetching} className="map-space-info" onClose={() => setIsFetching(false)}>
        <ModalContent justifyContent="flex-end" top={50} width="100%" height="200px" background="transparent">
          <ModalBody padding={0} display="flex" justifyContent="center" alignItems="center" height="200px">
            <Spinner />
          </ModalBody>
        </ModalContent>
      </Modal>
      <CMGFilterSpaceModal
        onClose={() => setIsFilterModalOpen(false)}
        isFilterModalOpen={isFilterModalOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        setCoordinates={setCoordinates}
        filterData={({ minSquareMeters, minDate, coords }) => updateMap(minSquareMeters, minDate, coords)}
      />
    </div>
  );
};

export default CMGMap;