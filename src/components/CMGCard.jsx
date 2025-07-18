import { Box, Flex, Text } from "@chakra-ui/react"

const CMGCard = ({ title, header, justifyContent, children, width = '300px', height = '200px', innerStyle, ...props }) => {
  return (
    <Box border="1px solid #cccfdb" width={width} height={height} minWidth="200px" {...props}>
      {header && <Flex borderBottom="1px solid #cccfdb" padding="20px" width={width} justifyContent="space-between">
        <Text align="left">{title}</Text>
        <Box>
          {header}
        </Box>
      </Flex>}
      <Box padding="29px" style={{ ...innerStyle }}>
        {children}
      </Box>
    </Box>
  )
}

export default CMGCard;