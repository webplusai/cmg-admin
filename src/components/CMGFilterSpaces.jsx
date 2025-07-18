import { Flex, FormControl, FormLabel, Input, Modal, ModalContent, ModalFooter, ModalOverlay, Select } from '@chakra-ui/react';
import { useState } from 'react';
import AutoComplete from './CMGPlaceSearch';
import CMGButton from './CMGButton';
import moment from 'moment';

const CMGFilterSpaceModal = ({
  isFilterModalOpen,
  setIsFilterModalOpen,
  filterData,
  spaces,
  onClose
}) => {
  const [minSquareMeters, setMinSquareMeters] = useState(0);
  const [minDate, setMinDate] = useState();
  const [coords, setCoords] = useState();

  return (
    <Modal isOpen={isFilterModalOpen} size="md" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex flexDirection="column" padding={5} gap={5}>
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <AutoComplete setCoordinates={(coordinates) => setCoords(coordinates)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Select
              color="rgb(26, 91, 130)"
              placeholder="Select a time range"
              style={{ color: "rgb(26, 91, 130)" }}
              onChange={(e) => setMinDate(e.target.value)}
            >
              <option value={moment().subtract(7, 'days').format('DD-MM-YYYY')}>Last 7 days</option>
              <option value={moment().subtract(1, 'month').format('DD-MM-YYYY')}>Last month</option>
              <option value={moment().subtract(3, 'months').format('DD-MM-YYYY')}>Last 3 months</option>
              <option value={moment().subtract(6, 'months').format('DD-MM-YYYY')}>Last 6 months</option>
              <option value={moment().subtract(12, 'months').format('DD-MM-YYYY')}>Last 12 months</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Min Square meters</FormLabel>
            <Input
              type="number"
              value={minSquareMeters}
              onChange={(e) => setMinSquareMeters(e.target.value)}
            />
          </FormControl>
        </Flex>
        <ModalFooter>
          <CMGButton text="Apply" onClick={() => filterData({ minSquareMeters, minDate, coords })} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CMGFilterSpaceModal;
