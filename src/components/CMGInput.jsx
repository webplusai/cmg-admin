import { Input } from '@chakra-ui/react'

const CMGInput = ({ ...props }) => {
  return (
    <Input
      {...props}
      className="cmg-input"
      style={{ borderBottom: '1px solid #000', width: '100%', padding: '5px 10px' }}
    />
  )
}

export default CMGInput;