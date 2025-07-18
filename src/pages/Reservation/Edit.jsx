import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, FormControl, FormErrorMessage, FormLabel, Input, Text, VStack, Select, Flex, Image } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { createSpaceService, getSpaceService, updateSpaceService } from '../../services/space.services';
import CMGInput from '../../components/CMGInput';
import CMGButton from '../../components/CMGButton';
import CMGCard from '../../components/CMGCard';
import { useAlertContext } from '../../contexts/AlertContext';

const EditSpace = () => {
  const { handleSubmit, errors, formState } = useForm();
  const [payload, setPayload] = useState();
  const [edited, setEdited] = useState();
  const [file, setFile] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlertDialog, showAlert } = useAlertContext();
  const params = useParams()

  useEffect(() => {
    getSpaceService(params.id)
      .then((response) => setPayload(response))
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
        });
      })
  }, [params.id])

  const handleOnChange = (e) => {
    setEdited({
      ...edited,
      [e.target.name]: e.target.value
    })
  }

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
    fileToImage(e.target.files[0]);
  }

  const handleFormSubmit = () => {
    let formdata = new FormData();
    setIsSubmitting(true);

    Object.entries(edited).forEach((entry) => formdata.append(entry[0], entry[1]))
    if (file) formdata.append('image', file)

    if (params.id) {
      updateSpaceService(params.id, formdata)
        .then(() => {
          setIsSubmitting(false);
          showAlert({
            title: 'Success',
            description: `${payload?.name} space was updated successfully`,
            status: 'success',
          });
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
          setIsSubmitting(false);
          showAlert({
            title: 'Success',
            description: `${payload?.name} space was created successfully`,
            status: 'success',
          });
          setPayload();
          setEdited();
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

  const fileToImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setDisplayImage(e.target.result);
    };

    reader.readAsDataURL(file)
  }

  return (
    <Box margin="0">
      <CMGCard title={params.id ? "Edit space" : "Create space"} width="100%">
        <Flex gap={20}>
          <Box flex={4}>
            <Flex direction="inherit" gap="20px" justifyContent="center" >
              <Box>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Flex direction="row" gap="20px" flexWrap="wrap" justifyContent="space-between">
                    {/* <VStack spacing={4}> */}
                    <FormControl isInvalid={errors?.name} isRequired width="47%">
                      <FormLabel>Name</FormLabel>
                      <CMGInput
                        type="text"
                        name="name"
                        onChange={handleOnChange}
                        defaultValue={payload?.name}
                      />
                      <FormErrorMessage>{errors?.name && errors?.name?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.location} isRequired width="47%">
                      <FormLabel>Location</FormLabel>
                      <CMGInput
                        type="text"
                        name="location"
                        onChange={handleOnChange}
                        defaultValue={payload?.location}
                      />
                      <FormErrorMessage>{errors?.location && errors?.location.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.number_of_bed} isRequired width="47%">
                      <FormLabel>Number of Beds</FormLabel>
                      <CMGInput
                        type="number"
                        name="number_of_beds"
                        onChange={handleOnChange}
                        defaultValue={payload?.number_of_beds}
                      />
                      <FormErrorMessage>{errors?.number_of_bed && errors?.number_of_bed.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.price} isRequired width="47%">
                      <FormLabel>Price</FormLabel>
                      <CMGInput
                        type="number"
                        name="price"
                        onChange={handleOnChange}
                        defaultValue={payload?.price}
                      />
                      <FormErrorMessage>{errors?.price && errors?.price.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.price} isRequired width="47%">
                      <FormLabel>Currency</FormLabel>
                      <Select placeholder="Select currency" name="currency" onChange={handleOnChange} width="100%">
                        <option value="USD" selected={payload?.currency === 'USD'}>USD</option>
                        <option value="EUR" selected={payload?.currency === 'EUR'}>EUR</option>
                        <option value="GBP" selected={payload?.currency === 'GBP'}>GBP</option>
                      </Select>
                      <FormErrorMessage>{errors?.currency && errors?.currency.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl width="47%">
                      <FormLabel>Space image</FormLabel>
                      <Input type="file" name="image" width="100%" onChange={handleUpload} />
                    </FormControl>
                  </Flex>
                  <Box marginTop={20}>
                    <CMGButton
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                      colorScheme="teal"
                      text="Create Space"
                      boxShadow="0 1px 2px 1px rgba(6,18,73,.2)"
                    />
                  </Box>
                </form>
              </Box>
            </Flex>
          </Box>
          <Box flex={2}>
            <Box>
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
            </Box>
          </Box>
        </Flex >
      </CMGCard >
    </Box >
  )
}

export default EditSpace;