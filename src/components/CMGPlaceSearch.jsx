import React, { useState, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Box,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useAlertContext } from "../contexts/AlertContext";
import axios from "axios";

const SearchDropdown = ({ defaultValue = " ", setCoordinates, setLocation }) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState('')
  const { showAlert } = useAlertContext();

  useEffect(() => {
    const fetchPlaces = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_URL}/spaces/location?location=${searchTerm}`

      try {
        const data = await axios.get(apiUrl);

        if (data.data.results) {
          setSearchResults(data.data.results);
        }
      } catch (error) {
        showAlert({
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
        });
      }
    };

    const getData = setTimeout(() => fetchPlaces(), 2000)

    return () => clearTimeout(getData)
  }, [searchTerm]);

  const handleSelect = (result) => {
    setSearchResults([]);
    setSelected(result.formatted_address);
    setSearchTerm(result.formatted_address);
    setCoordinates(result.geometry.location)
    setLocation(result.formatted_address)
  };

  return (
    <Box>
      <InputGroup width="100%">
        <Input
          type="text"
          placeholder="Search for a location..."
          value={searchTerm}
          onChange={(e) => {
            setSelected('')
            setSearchTerm(e.target.value)
          }}
          paddingRight="70px"
        />
        <InputRightElement width="4.5rem">
          <Text fontSize="sm" color="gray.500">
            {searchResults.length} results
          </Text>
        </InputRightElement>
      </InputGroup>
      {!selected && searchResults.length > 0 && (
        <List mt="2" maxH="150px" overflowY="auto" style={{ position: 'absolute', top: 70, width: '100%', backgroundColor: '#fff', zIndex: 10, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
          {searchResults.map((result, i) => (
            <ListItem
              key={i}
              px="3"
              py="2"
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => handleSelect(result)}
            >
              {result?.formatted_address}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchDropdown;
