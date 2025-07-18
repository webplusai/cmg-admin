import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, TableCaption, Image, useMediaQuery, Stack, Tooltip, IconButton, Box, Flex, Badge, Input, Checkbox } from '@chakra-ui/react';
import React from 'react';
import _ from 'lodash';
import CMGPagination from './CMGPagination';
import constants from '../utils/constants';
import { responseParser } from '../utils';
import CMGSpinner from './CMGSpinner';
import CMGText from './CMGText';
import { FaCalendar } from 'react-icons/fa';
import { MdHourglassEmpty } from 'react-icons/md';

export function CMGTable({
  data = [],
  columns = [],
  editRow,
  deleteRow,
  caption,
  metadata,
  actions,
  pageSettings,
  setPageSettings,
  isLoading,
  enableSelection,
  selections,
  setSelections,
  onImageClicked,
  actionables,
}) {
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')
  const formatTitle = (str) => {
    return str.replace(/_/g, ' ');
  }

  const selectColorScheme = (data) => {
    return constants.STATUS_COLOR[data]
  }

  const handleChecked = (checked, data) => {
    setSelections({ ...selections, [data.id]: checked })
  }

  return (
    <React.Fragment>
      {
        isLoading ?
          <CMGSpinner /> :
          data.length > 0 ?
            <Box width={isGreaterThan800 ? '80vw' : '100%'}>
              <TableContainer>
                <Table variant='striped' width="100%">
                  <TableCaption>{caption}</TableCaption>
                  <Thead>
                    <Tr>
                      {enableSelection && <Th></Th>}
                      {columns.find(column => column.id === 'image') && <Th>Image</Th>}
                      {
                        columns.filter(column => column.id !== 'image').map((column, i) => <Th key={i}>{column.value}</Th>)
                      }
                      {!_.isEmpty(actions) && <Th>Actions</Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      data.length > 0 &&
                      data.map((d, i) => (
                        <Tr key={i}>
                          {enableSelection && <Td><Checkbox onChange={(e) => handleChecked(e.target.checked, d)} /></Td>}
                          {columns.find(column => column.id === 'image') && (
                            <Td>
                              <Image
                                src={d['image']}
                                height={isGreaterThan800 ? '50px' : '40px'}
                                width={isGreaterThan800 ? '50px' : '40px'}
                                borderRadius="50%"
                                onClick={() => onImageClicked(d)}
                                style={{ cursor: 'pointer' }}
                              />
                            </Td>
                          )}
                          {
                            columns.filter(column => column.id !== 'image').map((column, i) =>
                              <Td key={i} onClick={() => column?.filterable ? column.onClick(d) : onImageClicked(d)} style={{ cursor: 'pointer' }}>
                                {
                                  column.component ?
                                    <column.component colorScheme={selectColorScheme(d[column.id])}>{responseParser(d, column.id).replace('_', ' ')}</column.component>
                                    :
                                    responseParser(d, column.id)
                                }
                              </Td>
                            )
                          }
                          {!_.isEmpty(actions) &&
                            <Td>
                              <Stack direction="row" spacing={4}>
                                {
                                  actions.map((action, i) => (
                                    <Tooltip label={action.label} key={i} >
                                      <IconButton
                                        disabled={action?.isDisabled(d)}
                                        cursor={action?.isDisabled(d) ? 'not-allowed' : 'initial'}
                                        onClick={() => !action?.isDisabled(d) && action.fn(d)}
                                        aria-label="Edit"
                                        size='sm'
                                        colorScheme={action?.isDisabled(d) ? "gray" : "blue"}
                                        variant="outline"
                                        icon={action.icon(d)}
                                      />
                                    </Tooltip>
                                  ))
                                }
                              </Stack>
                            </Td>
                          }
                        </Tr>
                      ))
                    }
                  </Tbody>
                </Table>
              </TableContainer>
              {!_.isEmpty(data) &&
                <Box marginRight={3}>
                  <CMGPagination meta={metadata} onPageChange={(page) => setPageSettings({ ...pageSettings, page })} />
                </Box>
              }
            </Box>
            :
            <Flex direction="column" sx={{ alignItems: "center", justifyContent: "center", my: 20 }}>
              <MdHourglassEmpty size={150} color="grey" />
              <CMGText>No result found</CMGText>
            </Flex>
      }
    </React.Fragment>
  );
}

export default CMGTable;