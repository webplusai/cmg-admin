import { Box } from "@chakra-ui/react"

const CMGLayoutHeader = ({ children }) => {
  return (
    <Box minHeight="70px">
      {children}
    </Box>
  )
};

export default CMGLayoutHeader;