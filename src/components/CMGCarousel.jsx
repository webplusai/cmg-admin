import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Image, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAlertContext } from '../contexts/AlertContext';
import { deleteImageSpaceService } from '../services/space.services';

const CMGCarousel = ({ images, onSuccess, onDelete, id, width = '100%', showDelete = true, deletePositionTop = '70px', deletePositionRight = '70px', position = 'absolute' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageList, setImageList] = useState(images);
  const { showAlert } = useAlertContext();
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)');

  if (typeof images === 'string') {
    images = images.split(',');
    setImageList(images)
  }

  useEffect(() => {
    setImageList(images)
  }, [images.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageList.length) % imageList.length);
  };

  const deleteFromUI = (image) => {
    let listOfImages = [...imageList];
    const indexOfImage = listOfImages.findIndex(img => img === image);
    listOfImages.splice(indexOfImage, 1)
    onDelete && onDelete(indexOfImage)
    setCurrentIndex(0);
    setImageList([...images, ...listOfImages])
  }

  const handleDeleteImage = (image) => {
    if (image.startsWith('data:image')) {
      return deleteFromUI(image)
    }

    deleteImageSpaceService({ url: image, id })
      .then(() => {
        onSuccess();
        showAlert({
          title: 'Success',
          description: `Image was deleted successfully`,
          status: 'success',
        });

        deleteFromUI(image)
      })
      .catch(error => {
        showAlert({
          title: 'Error',
          description: error && error?.message || 'Something went wrong',
          status: 'error',
        });
      })
  }

  return (
    <Box background="#fff" width="100%">
      {
        imageList.length > 0 ?
          <Flex justify="center" align="center" mb={1} flexDirection="column">
            {showDelete &&
              <IconButton
                onClick={() => handleDeleteImage(imageList[currentIndex])}
                mr={2}
                icon={<DeleteIcon />}
                style={{ position, right: deletePositionRight, top: deletePositionTop }}
              />
            }
            <Image src={imageList[currentIndex]} alt={`Slide ${currentIndex}`} width={width} height="300px" objectFit="cover" />
            <Flex width="100%" justifyContent="space-between" p={2}>
              <IconButton onClick={prevSlide} mr={2} icon={<ChevronLeftIcon />} />
              <Box mt="2">
                <Text>{currentIndex + 1}/{imageList.length}</Text>
              </Box>
              <IconButton onClick={nextSlide} ml={2} icon={<ChevronRightIcon />} />
            </Flex>
          </Flex>
          :
          <Flex minHeight="200px" alignItems="center" justifyContent="center" width="100%">
            <Text>No images to preview</Text>
          </Flex>
      }
    </Box>
  );
};

export default CMGCarousel;