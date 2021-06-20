import { Dispatch, SetStateAction, ReactElement } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

export interface ChatBubbles {
  sender: boolean;
  Nickname: string;
  Message?: string;
  Profile: string;
  Media?: string;
}

export interface ContactsEntry {
  profile: string;
  Nickname: string;
  UID: string;
  createChat: CallableFunction;
}

export interface ChatEntry {
  id: string;
  chatName: string;
  chatMode: string;
  enterChat: CallableFunction;
  SetVisible: Dispatch<SetStateAction<boolean>>;
}

export interface MediaSets {
  Visible: boolean;
  SetVisible: Dispatch<SetStateAction<boolean>>;
  SetMedia: Dispatch<SetStateAction<string>>;
}

export interface InvitationsData {
  AddRemove: CallableFunction;
  Nickname: string;
  Profile: string;
  UID: string;
}

export interface PopUpData {
  children: any;
  visible: boolean;
  SetVisible: Dispatch<SetStateAction<boolean>>;
}

export interface ReloginData {
  Visible: boolean;
  SetVisible: Dispatch<SetStateAction<boolean>>;
  DeleteAccounts: CallableFunction;
}

export interface AddMember {
  navigation: any;
  route: {
    params: {
      id: string;
    };
  };
}

export interface SearchBarParams {
  placeholder?: string;
  SetValue?: Dispatch<SetStateAction<string>>;
  value?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  leftIconContainerStyle?: ViewStyle;
  rightIconContainerStyle?: ViewStyle;
  style?: TextStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export interface ChatParams {
  id: string;
  chatName: string;
  currentMode: string;
}

export interface ChatSections {
  navigation: any;
  route: {
    params: ChatParams;
  };
}

export interface MoreChat {
  SetVisible: Dispatch<SetStateAction<boolean>>;
  navigation: any;
  params: ChatParams;
}

export interface MoreHome {
  SetMode: Dispatch<SetStateAction<boolean>>;
  SetVisible: Dispatch<SetStateAction<boolean>>;
  navigation: any;
}
