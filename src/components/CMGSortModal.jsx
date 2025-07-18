import { Button, FormControl, FormLabel, Modal, ModalContent, ModalOverlay, Select, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import constants from '../utils/constants';

const CMGSortModal = ({
  isSortModalOpen,
  sortData,
  onClose
}) => {
  const [sortOption, setSortOption] = useState();
  const [sortOrder, setSortOrder] = useState();

  const submit = () => {
    let data = {
      sortOption: sortOption,
      sortOrder: sortOrder,
    };

    sortData(data)
    onClose()
  };

  return (
    <Modal isOpen={isSortModalOpen} size="md" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <VStack spacing={4} p={4}>
          <FormControl isRequired>
            <FormLabel>Sort options</FormLabel>
            <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option>---- Select Option ----</option>
              {constants.SORT_OPTIONS?.length > 0 && constants.SORT_OPTIONS.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.value}
                </option>
              ))}
            </Select>
          </FormControl>
          {/* Room */}
          <FormControl isRequired>
            <FormLabel>Rooms</FormLabel>
            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option>---- Select Option ----</option>
              {constants.SORT_ORDER?.length > 0 && constants.SORT_ORDER.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.value}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button onClick={submit} colorScheme="teal">
            Sort
          </Button>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default CMGSortModal;
