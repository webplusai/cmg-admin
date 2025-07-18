const constants = {
  TO_EXEMPT: ['id', 'created_at', 'updated_at', 'image', 'user_id', 'space_id'],
  STATUS: {
    CANCELLED: 'cancelled',
    RESERVED: 'reserved',
    PAID_50: 'paid_50%',
    PAID_100: 'paid_100%'
  },
  MONTHS: [
    { _id: '1', value: 'JANUARY' },
    { _id: '2', value: 'FEBRUARY' },
    { _id: '3', value: 'MARCH' },
    { _id: '4', value: 'APRIL' },
    { _id: '5', value: 'MAY' },
    { _id: '6', value: 'JUNE' },
    { _id: '7', value: 'JULY' },
    { _id: '8', value: 'AUGUST' },
    { _id: '9', value: 'SEPTEMBER' },
    { _id: '10', value: 'OCTOBER' },
    { _id: '11', value: 'NOVEMBER' },
    { _id: '12', value: 'DECEMBER' },
  ],
  SORT_OPTIONS: [
    { _id: 'start_date', value: 'Reservation date' },
    { _id: 'date_range', value: 'Number of days' }
  ],
  SORT_ORDER: [
    { _id: 'ASC', value: 'Ascending' },
    { _id: 'DESC', value: 'Descending' }
  ],
  STATUS_COLOR: {
    'reserved': 'yellow',
    'paid_50%': 'orange',
    'paid_100%': 'red'
  },
}

export default constants;