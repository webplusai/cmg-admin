import { CloseIcon } from '@chakra-ui/icons';
import { Badge, Box, Card, Divider, Flex, Heading, IconButton, Tooltip, useMediaQuery } from '@chakra-ui/react';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { MdCancel, MdSort } from 'react-icons/md';
import CMGButton from '../../components/CMGButton';
import CMGCreateReservationModal from '../../components/CMGCreateReservationModal';
import CMGFilterModal from '../../components/CMGFilterModal';
import CMGReservationInfoModal from '../../components/CMGInfoModal';
import CMGSortModal from '../../components/CMGSortModal';
import CMGTable from '../../components/CMGTable';
import CMGText from '../../components/CMGText';
import CMGCalendar from '../../components/Calendar/CMGCalendar';
import { useAlertContext } from '../../contexts/AlertContext';
import { getReservationService, updateReservationService } from '../../services/reservation.services';
import { getSpacesNoPaginationService } from '../../services/space.services';
import { getDateRange } from '../../utils';
import constants from '../../utils/constants';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState();
  const [meta, setMeta] = useState();
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState()
  const [sortQuery, setSortQuery] = useState();
  const [filterQuery, setFilterQuery] = useState();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)
  const [isSortActive, setIsSortActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [pageSettings, setPageSettings] = useState({ page: 1, limit: 10 });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isCreateReservationModalOpen, setIsCreateReservationModalOpen] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [selectedSpace, setSelectedSpace] = useState()
  const { showAlertDialog, showAlert } = useAlertContext();
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  const getReservations = () => {
    setIsLoading(true)
    let queryPayload = { ...filterQuery, ...sortQuery, start_month: currentMonth, end_month: currentMonth }

    getReservationService({ ...queryPayload, ...pageSettings })
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
  }, [currentMonth])

  const getSpaces = () => {
    setIsLoading(true)
    getSpacesNoPaginationService()
      .then(response => {
        setIsLoading(false);
        setSpaces(response)
      })
      .catch(() => {
        setIsLoading(false);
        setError('Encountered an error while fetching the spaces')
      })
  }

  const filterReservations = (q) => {
    let queryPayload = { ...q, ...sortQuery, start_month: currentMonth }

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

  const sortReservations = (q) => {
    let queryPayload = { ...q, ...filterQuery, start_month: currentMonth }

    setSortQuery(q)
    getReservationService(queryPayload)
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

  useEffect(() => {
    getSpaces()
    getReservations()
  }, [pageSettings])

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

  const filterDateEntries = () => {
    if (reservations?.length > 0) {
      return getDateRange(
        reservations
          .filter(reservation => reservation.status !== constants.STATUS.CANCELLED)
      )
    }
  }

  const queryDate = (dateData) => {
    const data = reservations
      .filter((datum) => datum.status !== constants.STATUS.CANCELLED)
      .filter((datum) => {
        return moment(dateData, 'DD-MM-YYYY').isBetween(moment(datum.start_date), datum.end_date) || moment(dateData, 'DD-MM-YYYY').isSame(moment(datum.start_date), 'day')
      })

    if (data.length > 0) {
      setSelectedReservations(data);
      setIsInfoModalOpen(true);
    }
  };

  const reset = () => {
    setIsSortActive(false);
    setIsFilterActive(false);
    setIsLoading(true)
    let queryPayload = { ...filterQuery, start_month: currentMonth }

    getReservationService({ ...queryPayload, ...pageSettings })
      .then(response => {
        setIsLoading(false);
        setReservations(response.items)
        setMeta(response.meta);
        setIsSortActive(false);
        setIsFilterActive(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError('Encountered an error while fetching the reservations')
      })
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" pr={1} pb={2} flexWrap="wrap" gap="10px">
        <Flex mt={0} flex={1} direction="column" sx={{ alignItems: 'flex-start' }}>
          <Heading as="h2">Reservation List</Heading>
          <CMGText>Manage Reservations</CMGText>
        </Flex>
        <Flex gap={3}>
          {(isFilterActive || isSortActive) &&
            <Tooltip label="Cancel Sort" >
              <IconButton onClick={reset} aria-label="Cancel" size='sm' variant="outline" icon={<MdCancel />} />
            </Tooltip>
          }
          <Tooltip label="Create Reservation" >
            <CMGButton
              onClick={() => setIsCreateReservationModalOpen(!isCreateReservationModalOpen)}
              aria-label="Filter"
              variant="outline"
              text="Create Reservation"
            />
          </Tooltip>
          <Tooltip label="Filter" >
            <IconButton
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              color="initial"
              aria-label="Filter"
              size="sm"
              variant="outline"
              padding="20px 0"
              icon={<FaFilter />}
            />
          </Tooltip>
          <Tooltip label="Sort" >
            <IconButton
              onClick={() => setIsSortModalOpen(!isSortModalOpen)}
              background={isSortActive ? 'green.300' : 'initial'}
              color={isSortActive ? 'white' : 'initial'}
              aria-label="Sort"
              size="sm"
              padding="20px 0"
              variant="outline"
              icon={<MdSort />}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Divider />
      <Box width="100%">
        <Flex gap={3} style={{ width: '100%', flexDirection: 'column', justifyContent: 'center' }}>
          <Box>
            <CMGCalendar
              dates={filterDateEntries()}
              handleDateClick={queryDate}
              handleMonthChange={(month) => setCurrentMonth(month + 1)}
            />
          </Box>
          <Card width={isGreaterThan800 ? "80vw" : "100vw"}>
            <Flex gap="20px">
              {
                filterQuery?.space_id && (
                  <Flex style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => filterReservations({ ...filterQuery, space_id: undefined })} >
                    <Badge style={{ display: 'flex' }} className="clickable">{selectedSpace?.name}</Badge>
                    <Badge className="clickable"><FaTimes /></Badge>
                  </Flex>
                )
              }
              {
                filterQuery?.status && (
                  <Flex style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => filterReservations({ ...filterQuery, status: undefined })} >
                    <Badge style={{ display: 'flex' }} className="clickable">{filterQuery?.status?.replace('_', ' ')}</Badge>
                    <Badge className="clickable"><FaTimes /></Badge>
                  </Flex>
                )
              }
            </Flex>
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
          </Card>
        </Flex>
      </Box>
      <CMGFilterModal
        isFilterModalOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(!isFilterModalOpen)}
        spaces={spaces}
        setSelectedSpace={setSelectedSpace}
        selectedUserId={filterQuery?.user_id}
        filterData={(query) => {
          setIsFilterActive(true)
          filterReservations(query)
        }}
      />
      <CMGSortModal
        isSortModalOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(!isSortModalOpen)}
        sortData={(query) => {
          setIsSortActive(true)
          sortReservations(query)
        }}
      />
      <CMGReservationInfoModal
        title="Reservation information"
        data={selectedReservations}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(!isInfoModalOpen)}
        handleCancelReservation={handleCancelReservation}
      />
      <CMGCreateReservationModal
        title="Create reservation"
        data={reservation}
        isOpen={isCreateReservationModalOpen}
        onClose={() => {
          getReservations()
          setIsCreateReservationModalOpen(!isCreateReservationModalOpen)
        }}
      />
    </Box>
  )
}

export default Reservations;