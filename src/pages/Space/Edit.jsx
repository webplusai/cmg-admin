import { CloseIcon } from '@chakra-ui/icons';
import { Badge, Box, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Text, useMediaQuery } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import CMGButton from '../../components/CMGButton';
import CMGCard from '../../components/CMGCard';
import CMGCarousel from '../../components/CMGCarousel';
import CMGReservationInfoModal from '../../components/CMGInfoModal';
import CMGInput from '../../components/CMGInput';
import AutoComplete from '../../components/CMGPlaceSearch';
import CMGTable from '../../components/CMGTable';
import { useAlertContext } from '../../contexts/AlertContext';
import { getReservationService, updateReservationService } from '../../services/reservation.services';
import { createSpaceService, getSpaceService, updateSpaceService } from '../../services/space.services';
import constants from '../../utils/constants';

const EditSpace = () => {
  const { handleSubmit, errors, formState } = useForm();
  const [payload, setPayload] = useState();
  const [images, setImages] = useState([]);
  const [edited, setEdited] = useState();
  const [files, setFiles] = useState();
  const [displayImages, setDisplayImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert, showAlertDialog } = useAlertContext();
  const params = useParams()
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')
  const [location, setLocation] = useState();
  const [reservations, setReservations] = useState([]);
  const [meta, setMeta] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState()
  const [filterQuery, setFilterQuery] = useState();
  const [pageSettings, setPageSettings] = useState({ page: 1, limit: 10 });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [selectedSpace, setSelectedSpace] = useState()

  const inputRef = useRef();
  const navigate = useNavigate();

  const getSpace = () => {
    getSpaceService(params.id)
      .then((response) => {
        setPayload(response)

        if (response.images.length > 0) {
          let imageArr = response.images.split(',')
          setImages(imageArr);
        }
      })
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
        });
      })
  }

  useEffect(() => {
    if (params.id) {
      getSpace();
    }
  }, [params.id])

  const handleOnChange = (e) => {
    setEdited({
      ...edited,
      [e.target.name]: e.target.value
    })
  }

  const handleUpload = (e) => {
    setFiles(e.target.files);
    fileToImage(Object.values(e.target.files));
  }

  const handleFormSubmit = () => {
    let formdata = new FormData();
    setIsSubmitting(true);

    const formPayload = { ...edited, location }

    if (formPayload) Object.entries(formPayload).forEach((entry) => formdata.append(entry[0], entry[1]))

    if (files?.length > 0) {
      Object.values(files).forEach((file, index) => {
        formdata.append(`file${index + 1}`, file);
      });
    }

    if (params.id) {
      updateSpaceService(params.id, formdata)
        .then(() => {
          setIsSubmitting(false);
          getSpace();
          showAlert({
            title: 'Success',
            description: `${payload?.name} space was updated successfully`,
            status: 'success',
          });
          navigate('/spaces')
        })
        .catch((error) => {
          setIsSubmitting(false);
          showAlert({
            title: 'Error',
            description: error?.message || 'Something went wrong',
            status: 'error',
          });
        });
    } else {
      createSpaceService(formdata)
        .then(() => {
          showAlert({
            title: 'Success',
            description: `${formPayload?.name} space was created successfully`,
            status: 'success',
          });

          setIsSubmitting(false);
          setPayload();
          setEdited();
          navigate('/spaces')
        })
        .catch((error) => {
          setIsSubmitting(false);
          showAlert({
            title: 'Error',
            description: error.message || 'Something went wrong',
            status: 'error',
          });
        });
    }
  };

  const fileToImage = (files = [], replace = false) => {
    const loadImage = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          resolve(e.target.result);
        };

        reader.readAsDataURL(file);
      });
    };

    const loadImages = async () => {
      const imagePromises = files.map((file) => loadImage(file));
      const imagesArray = await Promise.all(imagePromises);
      setImages(replace ? imagesArray : [...images, ...imagesArray])
      setDisplayImages(imagesArray);
    };

    loadImages();
  };

  const handleCancelReservation = useCallback((reservation) => {
    showAlertDialog({
      title: 'Cancel Reservation',
      description: `Are you sure you want to cancel this reservation?`,
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Cancel',
      onConfirm: async () => {
        updateReservationService(reservation.id, { status: constants.STATUS.CANCELLED })
          .then(() => {
            showAlert({
              title: 'Success',
              description: `Reservation was cancelled successfully`,
              status: 'success',
            });
            getReservations();
            setIsInfoModalOpen(false);
          })
          .catch((error) => {
            setIsInfoModalOpen(false);
            showAlert({
              title: 'Error',
              description: error.message,
              status: 'danger',
            });
          })
      },
      onClose: () => { }
    })
  }, [])

  const filterReservations = (q) => {
    let queryPayload = { ...q }

    setFilterQuery(q)
    getReservationService({ ...queryPayload, ...pageSettings })
      .then(response => {
        setIsLoading(false);
        setReservations(response.items)
        setMeta(response.meta)
      })
      .catch(() => {
        setIsLoading(false);
        setError('Encountered an error while fetching the spaces')
      })
  }

  const getReservations = () => {
    setIsLoading(true)
    getReservationService({ ...pageSettings, space_id: params.id })
      .then(response => {
        setIsLoading(false);
        setReservations(response.items)
        setMeta(response.meta);
      })
      .catch(() => {
        setIsLoading(false);
        setError('Encountered an error while fetching the reservations')
      })
  }

  useEffect(() => {
    getReservations()
  }, [pageSettings.page, pageSettings.limit])

  return (
    <Box margin="20px">
      <CMGCard title={params.id ? "Edit space" : "Create space"} width="100%" height="auto">
        <Flex gap={20} flexWrap="wrap">
          <Box flex={4}>
            <Flex direction="inherit" gap="20px" justifyContent="center" >
              <Box>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Flex direction="row" gap="20px" flexWrap="wrap" justifyContent="space-between">
                    <FormControl isInvalid={errors?.name} isRequired width={isGreaterThan800 ? '47%' : '100%'}>
                      <FormLabel>Name</FormLabel>
                      <CMGInput
                        type="text"
                        name="name"
                        onChange={handleOnChange}
                        defaultValue={payload?.name}
                      />
                      <FormErrorMessage>{errors?.name && errors?.name?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.latitude} isRequired width={isGreaterThan800 ? '47%' : '100%'}>
                      <FormLabel>Address</FormLabel>
                      <AutoComplete
                        defaultValue={payload?.location}
                        setCoordinates={(coordinates) => setEdited({ ...edited, latitude: coordinates.lat, longitude: coordinates.lng })}
                        setLocation={(location) => setLocation(location)}
                      />
                      <FormErrorMessage>{errors?.address && errors?.address.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.square_meters} isRequired width={isGreaterThan800 ? '47%' : '100%'}>
                      <FormLabel>Unit square meters</FormLabel>
                      <CMGInput
                        type="number"
                        name="square_meters"
                        onChange={handleOnChange}
                        step=".0000001"
                        defaultValue={payload?.square_meters}
                      />
                      <FormErrorMessage>{errors?.square_meters && errors?.square_meters.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.price} isRequired width={isGreaterThan800 ? '47%' : '100%'}>
                      <FormLabel>Price Per day</FormLabel>
                      <CMGInput
                        type="number"
                        name="price"
                        onChange={handleOnChange}
                        step=".01"
                        defaultValue={payload?.price}
                      />
                      <FormErrorMessage>{errors?.price && errors?.price.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.price} isRequired width={isGreaterThan800 ? '47%' : '100%'}>
                      <FormLabel>Currency</FormLabel>
                      <Select placeholder="Select currency" name="currency" onChange={handleOnChange} width="100%">
                        <option value="USD" selected={payload?.currency === 'USD'}>USD</option>
                        <option value="EUR" selected={payload?.currency === 'EUR'}>EUR</option>
                        <option value="GBP" selected={payload?.currency === 'GBP'}>GBP</option>
                      </Select>
                      <FormErrorMessage>{errors?.currency && errors?.currency.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl width={isGreaterThan800 ? '47%' : '100%'}>
                      <FormLabel>Space image</FormLabel>
                      <Input type="file" ref={inputRef} name="image" width="100%" onChange={handleUpload} multiple />
                    </FormControl>
                    {!isGreaterThan800 &&
                      <Box flex={2} minW="200px">
                        <Box>
                          {(displayImages || payload?.image) ?
                            <Flex>
                              <CMGCarousel
                                images={images}
                                id={params.id}
                                width="350px"
                                deletePositionTop="50px"
                                deletePositionRight="-114px"
                                position="relative"
                                onSuccess={() => {
                                  getSpace();
                                }}
                                onDelete={(index) => {
                                  const filesArray = Array.from(files);
                                  let list = new DataTransfer();

                                  for (let i = 0; i < files.length; i++) {
                                    list.items.add(files[i]);
                                  }

                                  let myFileList = list.files;

                                  inputRef.current.files = myFileList;
                                  // files.splice(index, 1);
                                  filesArray.splice(index, 1)
                                  setFiles(filesArray);
                                  fileToImage(filesArray, true)
                                }}
                              />
                            </Flex>
                            :
                            <Text>Image preview</Text>
                          }
                        </Box>
                      </Box>
                    }
                  </Flex>
                  <Box marginTop={20}>
                    <CMGButton
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                      colorScheme="teal"
                      text={`${params?.id ? 'Save' : 'Create'} Space`}
                      boxShadow="0 1px 2px 1px rgba(6,18,73,.2)"
                    />
                  </Box>
                </form>
              </Box>
            </Flex>
          </Box>
          {isGreaterThan800 &&
            <Box flex={2} minW="200px">
              <Box>
                {(displayImages.length > 0 || payload?.images) ?
                  <Flex>
                    <CMGCarousel
                      images={images}
                      id={params.id}
                      width='350px'
                      deletePositionTop='145px'
                      onSuccess={() => {
                        getSpace();
                      }}
                      onDelete={(index) => {
                        const filesArray = Array.from(files);
                        let list = new DataTransfer();

                        for (let i = 0; i < files.length; i++) {
                          list.items.add(files[i]);
                        }

                        let myFileList = list.files;

                        inputRef.current.files = myFileList;
                        filesArray.splice(index, 1)
                        setFiles(filesArray);
                        fileToImage(filesArray, true)
                      }}
                    />
                  </Flex>
                  :
                  <Text>Image preview</Text>
                }
              </Box>
              {/* <Box>
                {(displayImage || payload?.image) ?
                  <Image
                    src={(displayImage || payload?.image)}
                    objectFit="contain"
                    height="300px"
                    width="20vw"
                    borderRadius={20}
                  />
                  :
                  <Text>Image preview</Text>
                }
              </Box> */}
            </Box>
          }
        </Flex >
      </CMGCard >
      {
        params.id &&
        <>
          <Box marginTop="40px">
            <CMGTable
              data={reservations}
              metadata={meta}
              setPageSettings={setPageSettings}
              pageSettings={pageSettings}
              isLoading={isLoading}
              columns={[
                { id: 'user', value: 'User' },
                {
                  id: 'name', value: 'Space Name', filterable: true, onClick: (row) => {
                    setSelectedSpace(row?.space_id);
                    filterReservations({ ...filterQuery, space_id: row?.space_id?.id });
                  }
                },
                { id: 'start_date', value: 'Start Date' },
                { id: 'end_date', value: 'End Date' },
                { id: 'status', value: 'Status', component: Badge, filterable: true, onClick: (row) => filterReservations({ ...filterQuery, status: row?.status }) },
                { id: 'start_date', value: 'Reservation Date' },
                { id: 'number_of_days', value: 'Number of Days' }
              ]}
              actions={[
                {
                  fn: (reservation) => handleCancelReservation(reservation),
                  label: 'Cancel Reservations',
                  icon: (reservation) => <CloseIcon color={reservation.status === constants.STATUS.CANCELLED ? "gray" : "red.400"} />,
                  isDisabled: (reservation) => reservation.status === constants.STATUS.CANCELLED
                }
              ]}
            />
          </Box>
          <CMGReservationInfoModal
            title="Reservation information"
            data={selectedReservations}
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(!isInfoModalOpen)}
            handleCancelReservation={handleCancelReservation}
          />
        </>
      }
    </Box >
  )
}

export default EditSpace;