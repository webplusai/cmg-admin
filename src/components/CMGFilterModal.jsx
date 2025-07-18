import { Button, Flex, FormControl, FormLabel, HStack, Modal, ModalContent, ModalOverlay, Select, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import constants from '../utils/constants';
import CMGInput from './CMGInput';
import { useUserContext } from '../contexts/UserContext';
import { getSpacesService } from '../services/space.services';

const CMGFilterModal = ({
  isFilterModalOpen,
  setSelectedSpace,
  filterData,
  spaces = [],
  onClose,
  selectedUserId
}) => {
  const [space, setSpace] = useState();
  const [status, setStatus] = useState();
  const thisYear = new Date().getFullYear();
  const [startMonth, setStartMonth] = useState();
  const [startYear, setStartYear] = useState(thisYear);
  const [endMonth, setEndMonth] = useState();
  const [endYear, setEndYear] = useState(thisYear);
  const [userId, setUserId] = useState(selectedUserId);
  const { allUsers, getAllUsersWithoutPagination } = useUserContext();

  const submit = () => {
    let data = {
      user_id: userId,
      start_month: startMonth,
      start_year: startYear,
      end_month: endMonth,
      end_year: endYear,
      space_id: space,
      status: status,
    };

    filterData(data);
    setUserId();
    onClose()
  };

  useEffect(() => {
    getAllUsersWithoutPagination()
  }, [])

  return (
    <Modal isOpen={isFilterModalOpen} size="md" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <VStack spacing={4} p={4}>
          <FormControl isRequired>
            <FormLabel>Users</FormLabel>
            <Select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">---- Select Option ----</option>
              {allUsers?.length > 0 && allUsers.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                  selected={selectedUserId === user.id}
                >
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </Select>
          </FormControl>
          {/* Year */}
          <Flex justifyContent="space-between" gap={10} width="100%">
            <Flex spacing={2} direction="column" width="100%">
              <FormControl isRequired>
                <FormLabel>Start month</FormLabel>
                <Select
                  value={startMonth || ''}
                  onChange={(e) => setStartMonth(e.target.value)}
                >
                  <option value="">---- Select Option ----</option>
                  {constants.MONTHS.map((month) => (
                    <option key={month._id} value={month._id}>
                      {month.value}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End month</FormLabel>
                <Select
                  value={endMonth || ''}
                  onChange={(e) => setEndMonth(e.target.value)}
                >
                  <option value="">---- Select Option ----</option>
                  {constants.MONTHS.map((month) => (
                    <option key={month._id} value={month._id}>
                      {month.value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            <Flex spacing={2} direction="column" width="100%">
              <FormControl isRequired>
                <FormLabel>Start year</FormLabel>
                <Select
                  value={String(startYear || '')}
                  onChange={(e) => setStartYear(e.target.value)}
                >
                  <option value="">---- Select Option ----</option>
                  {[...Array(20).keys()].map((i) => (
                    <option key={i + thisYear - 10} value={i + thisYear - 10}>
                      {i + thisYear - 10}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End year</FormLabel>
                <Select
                  value={String(endYear || '')}
                  onChange={(e) => setEndYear(e.target.value)}
                >
                  <option value="">---- Select Option ----</option>
                  {[...Array(20).keys()].map((i) => (
                    <option key={i + thisYear - 10} value={i + thisYear - 10}>
                      {i + thisYear - 10}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </Flex>
          {/* Space */}
          <FormControl isRequired>
            <FormLabel>Spaces</FormLabel>
            <Select value={space} onChange={(e) => {
              setSpace(e.target.value)
              setSelectedSpace(spaces.find(s => s.id == e.target.value));
            }}>
              <option value="">---- Select Option ----</option>
              {spaces?.length > 0 && spaces.map((space) => (
                <option key={space._id} value={space.id}>
                  {space.name}
                </option>
              ))}
            </Select>
          </FormControl>
          {/* Reservation Status */}
          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              value={status || ''}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">---- Select Option ----</option>
              {[constants.STATUS.RESERVED, constants.STATUS.PAID_50, constants.STATUS.PAID_100, constants.STATUS.CANCELLED].map((stat) => (
                <option key={stat} value={stat}>
                  {stat.replace('_', ' ')}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button onClick={submit} colorScheme="teal">
            Filter
          </Button>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default CMGFilterModal;
