import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useMediaQuery } from '@chakra-ui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import RSelect from 'react-select';
import { useAlertContext } from '../contexts/AlertContext';
import { useUserContext } from '../contexts/UserContext';
import { createReservationService } from '../services/reservation.services';
import { getSpacesService } from '../services/space.services';
import constants from '../utils/constants';

const CMGCreateReservationModal = ({ title, isOpen, onClose }) => {
  const [reservationPayload, setReservationPayload] = useState({
    space_id: '',
    start_date: moment(),
    end_date: moment(),
    status: 'reserved',
    user_id: ''
  });
  const [space, setSpace] = useState(null);
  const [status, setStatus] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const { getAllUsers } = useUserContext();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { showAlert } = useAlertContext();
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  const handleChange = (key, value) => {
    setReservationPayload((prevPayload) => ({
      ...prevPayload,
      [key]: value,
    }));
  };

  const handleClose = () => {
    setSelectedUser();
    setSpace();
    setReservationPayload();
    setStatus();
    onClose();
  }

  const handleSubmit = () => {
    let payload = {
      ...reservationPayload,
      status: status.value,
      user_id: selectedUser.value,
      space_id: space.value
    };

    createReservationService(payload)
      .then(() => {
        showAlert({
          title: 'Success',
          description: `Reservation was made successfully`,
          status: 'success',
        });

        handleClose();
      })
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error?.response?.data?.message || error?.message || 'Something went wrong',
          status: 'error',
        });
      })
  };

  const getSpaces = () => {
    getSpacesService()
      .then(res => {
        const spaceOptions = res.items.map((space) => ({
          value: space.id,
          label: `${space.name}`,
        }));

        setSpaces(spaceOptions)
      })
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
        });
      });
  }

  useEffect(() => {
    getSpaces()
  }, [])

  useEffect(() => {
    if (users.length === 0) {
      getAllUsers({ page: 1, limit: 10 }, true)
        .then((users) => {
          const userOptions = users.items.map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name}`,
          }));
          setUsers(userOptions);
        })
        .catch((error) => {
          showAlert({
            title: 'Error',
            description: error?.message || 'Something went wrong',
            status: 'error',
          });
        });
    }
  }, [users, getAllUsers]);

  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Flex gap="20px">
              <FormControl mt={4}>
                <FormLabel>User</FormLabel>
                <RSelect
                  options={users}
                  value={selectedUser}
                  onChange={handleUserSelect}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Space</FormLabel>
                <RSelect
                  options={spaces}
                  value={space}
                  onChange={(e) => setSpace(e)}
                />
              </FormControl>
            </Flex>
            <Flex gap={isGreaterThan800 ? "20px" : "10px"} mt={4}>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  width={isGreaterThan800 ? '100%' : '91%'}
                  value={moment(reservationPayload?.start_date).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    let date = moment(e.target.value, 'YYYY-MM-DD').set('hour', 0);
                    let isSameDay = reservationPayload?.end_date.isSame(moment(), 'day');

                    if (!date.isAfter(reservationPayload?.end_date) || isSameDay) {
                      handleChange('start_date', date)
                    } else {
                      showAlert({
                        title: 'Error',
                        description: 'Start date should be before End date',
                        status: 'error',
                      });
                    }
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  width={isGreaterThan800 ? '100%' : '91%'}
                  value={moment(reservationPayload?.end_date).format('YYYY-MM-DD')}
                  name="end_date"
                  onChange={(e) => {
                    let date = moment(e.target.value, 'YYYY-MM-DD').set('hour', 12);

                    if (date.isBefore(reservationPayload?.start_date)) {
                      showAlert({
                        title: 'Error',
                        description: 'End date should be after Start date',
                        status: 'error',
                      });
                    } else {
                      handleChange('end_date', date)
                    }
                  }}
                />
              </FormControl>
            </Flex>
            <Flex gap="20px">
              <FormControl mt={4}>
                <FormLabel>Status</FormLabel>
                <RSelect
                  options={Object.keys(constants.STATUS_COLOR).map(key => (
                    {
                      label: key.replace('_', ' '),
                      value: key
                    }
                  ))}
                  value={status}
                  onChange={(e) => setStatus(e)}
                />
              </FormControl>
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CMGCreateReservationModal;
