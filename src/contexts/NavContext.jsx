import { createContext, useContext, useState } from "react";

const NavContext = createContext();

const NavProvider = ({ children }) => {
  const [isSideOpened, setIsSideOpened] = useState(false);

  return (
    <NavContext.Provider value={{ isSideOpened, setIsSideOpened }}>
      {children}
    </NavContext.Provider>
  )
}

export default NavProvider;

export const useNavContext = () => {
  return useContext(NavContext);
}