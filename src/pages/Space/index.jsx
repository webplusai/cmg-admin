import { Box, Divider, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useMediaQuery } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useAlertContext } from '../../contexts/AlertContext';
import CMGButton from '../../components/CMGButton';
import CMGSpinner from '../../components/CMGSpinner';
import CMGText from '../../components/CMGText';
import { deleteImageSpaceService, deleteSpaceService, getSpacesExportService, getSpacesService } from '../../services/space.services';
import CMGTable from '../../components/CMGTable';
import { downloadCsv } from '../../utils';
import CMGModal from '../../components/CMGModal';
import CMGCarousel from '../../components/CMGCarousel';

const Space = () => {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [error, setError] = useState()
  const [pageSettings, setPageSettings] = useState({ page: 1, limit: 10 })
  const [meta, setMeta] = useState();
  const navigate = useNavigate();
  const { showAlertDialog, showAlert } = useAlertContext();
  const [selections, setSelections] = useState({});
  const [selectedSpaceIds, setSelectedSpaceIds] = useState([])
  const [selected, setSelected] = useState()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  const getSpaces = () => {
    setIsLoading(true)
    getSpacesService(pageSettings)
      .then(response => {
        setIsLoading(false);
        setSpaces(response.items.map(item => ({ ...item, image: item.images.split(',')[0] })))
        setMeta(response.meta)
      })
      .catch(() => {
        setIsLoading(false);
        setError('Encountered an error while fetching the spaces')
      })
  }

  useEffect(() => {
    getSpaces()
  }, [pageSettings])

  const exportSpaces = async () => {
    getSpacesExportService()
      .then(response => downloadCsv(response))
  }

  const createSpace = () => navigate('/spaces/create')

  const navigateToSpace = (space) => {
    navigate(`/spaces/edit/${space.id}`);
  }

  const handleDeleteSpace = useCallback((space) => {
    showAlertDialog({
      title: 'Delete space',
      description: `Are you sure you want to delete ${space.name}?`,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      onConfirm: async () => {
        await deleteSpaceService(space.id);
        getSpaces();
      },
      onClose: () => { }
    })
  }, [])

  const handleImageClick = (space) => {
    setIsImageModalOpen(true);
    setSelected(space)
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" pr={1} flexWrap="wrap" gap="10px">
        <Flex mt={0} flex={1} direction="column" sx={{ alignItems: 'flex-start' }}>
          <Heading as="h2">Space List</Heading><br/>
          <CMGText>Manage Spaces</CMGText>
        </Flex>
        <Flex flex={1} justifyContent="flex-end" gap={5}>
          <CMGButton
            text="Export Spaces"
            onClick={exportSpaces}
            width={isGreaterThan800 ? 'initial' : '50%'}
            size='sm'
            variant="outline"
          />
          <CMGButton
            text="Add Space"
            onClick={createSpace}
            width={isGreaterThan800 ? 'initial' : '50%'}
            size='sm'
            variant="outline"
          />
        </Flex>
      </Flex>
      <Divider />
      <Box width="100%">
        {
          isLoading ?
            <CMGSpinner /> :
            error ?
              <CMGText color="red">{error}</CMGText>
              :
              spaces?.length > 0 ?
                <CMGTable
                  data={spaces}
                  pageSettings={pageSettings}
                  setPageSettings={setPageSettings}
                  metadata={meta}
                  onImageClicked={handleImageClick}
                  columns={[
                    { id: 'name', value: 'Name' },
                    { id: 'location', value: 'Location' },
                    { id: 'square_meters', value: 'Unit square meters' },
                    { id: 'price', value: 'Price per day' },
                    { id: 'currency', value: 'Currency' },
                    { id: 'image', value: 'Image' }
                  ]}
                  actions={[
                    {
                      fn: (space) => navigateToSpace(space),
                      label: 'Edit space',
                      icon: () => <EditIcon />,
                      isDisabled: () => false
                    },
                    {
                      fn: (space) => handleDeleteSpace(space),
                      label: 'Delete space',
                      icon: () => <DeleteIcon />,
                      isDisabled: () => false
                    }
                  ]}
                />
                :
                <Flex direction="column" sx={{ alignItems: "center", justifyContent: "center", my: 20 }}>
                  <FaHome size={150} color="grey" />
                  <CMGText>No Space found</CMGText>
                </Flex>
        }
      </Box>
      {
        selected?.images?.length > 0 &&
        <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody style={{ marginTop: '50px' }}>
              <CMGCarousel
                images={selected?.images?.split(',')}
                id={selected?.id}
                deletePositionRight="30px"
                onSuccess={() => {
                  setIsImageModalOpen(false);
                  getSpaces();
                }}
              />
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
          </ModalContent>
        </Modal>}
    </Box>
  )
}

export default Space;