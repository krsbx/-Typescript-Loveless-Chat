import React, {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';

interface ContextType {
  Mode: boolean;
  SetMode: Dispatch<SetStateAction<boolean>>;
  CurrentMode: any;
  VisibleTab: boolean;
  SetVisibleTab: Dispatch<SetStateAction<boolean>>;
}

const InitialValues = {
  Mode: false,
  SetMode: (): void => {},
  CurrentMode: 'Groups',
  VisibleTab: false,
  SetVisibleTab: (): void => {},
};

export const ModeContext = createContext<ContextType>(InitialValues);

export const UseMode = () => {
  return useContext(ModeContext);
};

export const ModeProvider = ({ children }: any) => {
  //Default Views => Groups
  const [Mode, SetMode] = useState(false);

  //Visible Bottom Bar
  const [VisibleTab, SetVisibleTab] = useState(true);

  const CurrentMode = (): string => {
    return Mode == false ? 'Groups' : 'Private';
  };

  const vals = {
    Mode,
    SetMode,
    CurrentMode,
    VisibleTab,
    SetVisibleTab,
  };

  return <ModeContext.Provider value={vals}>{children}</ModeContext.Provider>;
};
