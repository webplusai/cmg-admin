import { useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { standardEndDate } from '../../utils';

const DateRangeCalendar = ({ dates, handleDateClick, handleMonthChange }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [calendar, setCalendar] = useState([]);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateSelected = (date, selectedRanges) => {
    return selectedRanges.some(range =>
      moment(date).isBetween(moment(range.start).subtract(1, 'day'), standardEndDate(range.end), null, '[]')
    );
  }

  const statusColor = (date, selectedRanges) => {
    const data = selectedRanges.find(range =>
      moment(date).isBetween(moment(range.start), standardEndDate(range.end), null, '[]')
    );

    return data;
  }

  const renderCalendar = (ranges = []) => {
    let calendar = [];
    const currentDate = moment().add(currentMonthIndex, 'month').startOf('month');
    let initDay = -1;
    let days = 0;
    let isFirst = true;

    while (currentDate.isBefore(moment().add(currentMonthIndex, 'month').endOf('month'))) {
      const isToday = currentDate.isSame(moment(), 'day');
      const isSelected = isDateSelected(currentDate, ranges);
      const sColor = statusColor(currentDate, ranges);

      if (initDay === -1) {
        initDay = currentDate.day();
      }

      if ((days !== initDay) && isFirst) {
        calendar = [];

        for (let i = 0; i < initDay; i++) {
          calendar.push(
            <div
              key={currentDate.format('YYYY-MM-DD')}
              className="calendar-cell"
            ></div>
          );
        }

        isFirst = false;
      }

      calendar.push(
        <div
          key={currentDate.format('YYYY-MM-DD')}
          className={`calendar-cell${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}`}
          style={{ backgroundColor: sColor?.background || 'white', color: sColor?.background === 'yellow' ? 'black' : sColor?.background === 'red' ? 'white' : 'initial' }}
          onClick={(e) => handleDateClick(`${e.target.innerText}-${currentDate.month() === 0 ? 12 : currentDate.month()}-${currentDate.year() - (currentDate.month() === 0 ? 1 : 0)}`)}
        >
          {currentDate.date()}
        </div>
      );

      initDay = (initDay + 1) % 7;
      days = (days + 1) % 7;

      currentDate.add(1, 'day');
    }

    setCalendar(calendar);
  }

  useEffect(() => {
    let ranges = dates?.length > 0 ? dates.map((date) => ({ start: date[0], end: date[1], background: date[2] })) : [];

    renderCalendar(ranges)
  }, [currentMonthIndex, dates])

  return (
    <Box>
      <Flex justifyContent="space-between" padding="10px 5px">
        <IconButton onClick={() => {
          setCalendar([])
          setCurrentMonthIndex(currentMonthIndex - 1)
          handleMonthChange(moment().add(currentMonthIndex - 1, 'month').month())
        }}>
          <ArrowLeftIcon />
        </IconButton>
        <Box paddingTop="7px">
          {moment().add(currentMonthIndex, 'month').format('MMMM')}, {moment().add(currentMonthIndex, 'month').format('YYYY')}
        </Box>
        <IconButton onClick={() => {
          setCalendar([])
          setCurrentMonthIndex(currentMonthIndex + 1)
          handleMonthChange(moment().add(currentMonthIndex + 1, 'month').month())
        }} >
          <ArrowRightIcon />
        </IconButton>
      </Flex>
      <Box className="calendar">
        {daysOfWeek.map((day, i) => (<Box key={i}>{day}</Box>))}
        {calendar}
      </Box>
    </Box>
  );
}

export default DateRangeCalendar;
