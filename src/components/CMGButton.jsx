import { Button } from '@chakra-ui/react'

const CMGButton = ({ text, width, background, textColor, icon, height = '40px', ...props }) => {
  return (
    <Button width={width} background={background} padding="0 20px" height={height} color={textColor} {...props} >
      {text}&nbsp;{icon}
    </Button>
  )
}

export default CMGButton;