import { Input } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";

const CMGDatePicker = ({ date, style, onChange, onOpen, ...props }) => {
  const [toggleDate, setToggleDate] = useState(false);

  return (
    // toggleDate ?
    <DatePicker
      style={style}
      selected={date}
      onChange={onChange}
      onOpen={onOpen}
    />
    // :
    // <Input
    //   type="text"
    //   value={date}
    // // onClick={() => setToggleDate(true)}
    // />
  )
};

export default CMGDatePicker;