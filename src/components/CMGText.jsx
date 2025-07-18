import { Text, useMediaQuery } from '@chakra-ui/react'

const CMGText = ({ children, ...props }) => {
  const [isGreaterThan800] = useMediaQuery('(min-width: 800px)')

  return <Text {...props} fontSize={isGreaterThan800 ? '1em' : '0.7em'}>
    {children}
  </Text>
}

export default CMGText;