import { Box, Flex, Heading, Select, Text, useMediaQuery } from '@chakra-ui/react';
import { FaTachometerAlt } from 'react-icons/fa';
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import CMGCard from '../components/CMGCard';
import CMGTable from '../components/CMGTable';
import { getSpacesPerformanceAndChanges, getSpacesPerformanceAndChangesTable, getYearPerformance } from '../services/reservation.services';
import { useAlertContext } from '../contexts/AlertContext';
import constants from '../utils/constants';
import CMGText from '../components/CMGText';
import CMGSpinner from '../components/CMGSpinner';

const Performance = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [performances, setPerformances] = useState([]);
  const [averagePerformance, setAveragePerformance] = useState(0);
  const [averageChanges, setAverageChanges] = useState(0);
  const { showAlert } = useAlertContext();
  const [pageSettings, setPageSettings] = useState({ page: 1, limit: 10 });
  const [meta, setMeta] = useState();
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
  });
  const [series, setSeries] = useState([
    {
      name: "Year Performance",
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }
  ]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  const performancePerMonth = () => {
    getSpacesPerformanceAndChanges({ month: selectedMonth, ...pageSettings })
      .then((response) => {
        setAverageChanges(response.averageChanges)
        setAveragePerformance(response.averagePerformance)
      })
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error.message,
          status: 'error',
        });
      })
  }

  const performancePerMonthPaginate = () => {
    setIsLoading(true);
    getSpacesPerformanceAndChangesTable({ month: selectedMonth, ...pageSettings })
      .then((response) => {
        setPerformances(response.data)
        setMeta(response.meta);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showAlert({
          title: 'Error',
          description: error.message,
          status: 'error',
        });
      })
  }

  const handleSelectMonth = (e) => {
    setSelectedMonth(e.target.value);
  }

  useEffect(() => {
    getYearPerformance()
      .then((response) => {
        setSeries([
          {
            name: "Year Performance",
            data: response.performances.map((data) => data.performance)
          }
        ])
      })
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error.message,
          status: 'error',
        });
      })
  }, [])

  useEffect(() => {
    performancePerMonth()
  }, [selectedMonth])

  useEffect(() => {
    performancePerMonthPaginate()
  }, [selectedMonth, pageSettings])

  return (
    <Box width="100%">
      <Flex justifyContent="space-between" alignItems="center" pr={1} pb={5} flexWrap="wrap">
        <Flex mt={0} flex={1} direction="column" sx={{ alignItems: 'flex-start' }}>
          <Heading as="h2">Performance</Heading>
          <CMGText>Filter performance</CMGText>
        </Flex>
        <Select placeholder="Select months" name="months" onChange={handleSelectMonth} width="200px">
          {
            constants.MONTHS.map((month, index) => <option key={index} value={month._id} selected={selectedMonth === Number(month._id)}>{month.value}</option>)
          }
        </Select>
      </Flex>
      <Flex gap={10} flexWrap="wrap" height="auto">
        <CMGCard height="auto" style={{ flex: 1 }} width={isGreaterThan800 ? 'initial' : '100%'} justifyContent="center" display="flex" alignItems="center" innerStyle={{ alignItems: 'center', width: '100%' }}>
          <Text fontSize={30}>{averagePerformance}%</Text>
          <Text fontSize={19} >Performance</Text>
        </CMGCard>
        <CMGCard height="auto" style={{ flex: 1 }} width={isGreaterThan800 ? 'initial' : '100%'} justifyContent="center" display="flex" alignItems="center" innerStyle={{ alignItems: 'center', width: '100%' }}>
          <Text fontSize={30}>{averageChanges}%</Text>
          <Text fontSize={19}>Change</Text>
        </CMGCard>
        <CMGCard height="auto" style={{ flex: 1 }} width={isGreaterThan800 ? 'initial' : '100%'} >
          <Text fontSize={19}>This year</Text>
          <Chart
            options={options}
            series={series}
            type="bar"
          />
        </CMGCard>
      </Flex>
      <Box>
        {
          isLoading ?
            <Box pt={3}>
              <CMGSpinner />
            </Box> :
            error ?
              <CMGText color="red">{error}</CMGText>
              :
              performances?.length > 0 ?
                <CMGTable
                  data={performances}
                  metadata={meta}
                  setPageSettings={setPageSettings}
                  pageSettings={pageSettings}
                  columns={[
                    { id: 'space', value: 'Name' },
                    { id: 'performance', value: 'Performance (%)' },
                    { id: 'change', value: 'Change (%)' }
                  ]}
                />
                :
                <Flex direction="column" sx={{ alignItems: "center", justifyContent: "center", my: 20, pt: 10 }}>
                  <FaTachometerAlt size={150} color="grey" />
                  <CMGText>No Space found</CMGText>
                </Flex>
        }
      </Box>
    </Box>
  );
}

export default Performance;