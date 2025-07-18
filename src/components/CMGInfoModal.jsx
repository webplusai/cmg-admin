import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Flex, Text, Badge } from '@chakra-ui/react';
import moment from 'moment';
import { currencyConverter, standardEndDate } from '../utils';
import constants from '../utils/constants';

const CMGReservationInfoModal = ({ data = [], title, isOpen, onClose, handleCancelReservation }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="column" gap={10}>
            {
              data.map((datum) => {
                return (
                  <Flex key={datum.id} justifyContent="space-between">
                    <Flex flexDirection="column">
                      <Text>{datum.space_id.name} <Badge>{moment(datum?.start_date).format('DD/MM/YYYY')} - {standardEndDate(datum?.end_date).format('DD/MM/YYYY')}</Badge> <Badge bgColor={constants.STATUS_COLOR[datum.status]} color={constants.STATUS_COLOR[datum.status] === "yellow" ? "black" : "white"}>{datum.status.replace('_', ' ')}</Badge></Text>
                      <Text>{datum.user_id.last_name} {datum.user_id.first_name}</Text>
                      <Text fontSize="sm" color="#676767">{currencyConverter(datum.space_id.currency)} {datum.space_id.price}</Text>
                    </Flex>
                    <Flex>
                      <Button onClick={() => handleCancelReservation(datum)}>
                        Cancel
                      </Button>
                    </Flex>
                  </Flex>
                )
              })
            }
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CMGReservationInfoModal;
