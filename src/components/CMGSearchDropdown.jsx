import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Box,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

const SearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    const results = ["Result 1", "Result 2", "Result 3"].filter((result) =>
      result.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  const handleSelect = (result) => {
    setSearchResults([]);
    setSearchTerm(result);
  };

  return (
    <Box>
      <InputGroup>
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <InputRightElement width="4.5rem">
          <Text fontSize="sm" color="gray.500">
            {searchResults.length} results
          </Text>
        </InputRightElement>
      </InputGroup>
      {searchResults.length > 0 && (
        <Box position="absolute" background="white" width="100%" zIndex={20}>
          <List mt="2" maxH="150px" overflowY="auto">
            {searchResults.map((result) => (
              <ListItem
                key={result}
                px="3"
                py="2"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleSelect(result)}
              >
                {result}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SearchDropdown;
