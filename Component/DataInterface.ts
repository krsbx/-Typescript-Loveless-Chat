import {
  NotificationRequest,
  Notification,
  NotificationResponse,
} from 'expo-notifications';

//Interface for Login
// Usage : Login Page
export interface LoginForm {
  Email: string;
  Password: string;
}

//Usage :
//  Contact Screens (For Validating User Input)
//  Contacts Cleaner (For Cleaning Contacts from deleted Users)
export interface ListUser {
  UID: Record<string, string>;
}

//Interaface for each Users
// Usage:
//  Tab Navigations (To check currents token same as before)
//  Chat Screen (For sending Notifications)
//  Profile Screen (For retrieving User Informations)
//  Register Screen (For consistency data in User Informations on Register Process)
export interface UserInformations {
  FullName: string;
  Nickname: string;
  Profile: string;
  UID: string;
  Token: string;
}

//Interface for Message to Sent
// Usage:
//  List Chat (To create chat element in Home Screen)
//  Chat Screen (For consistency data in User Messages)
export interface MessageContext {
  Nickname: string;
  Email: string;
  Message?: string;
  Media?: string;
  Docs?: DocsInfo;
  Profile: string;
  timestamp: any;
}

export interface DocsInfo {
  Name: string;
  URI: string;
}

//Interface for Whole Message in a Chat Rooms
// Usage:
//  Chat Screen (To retrieve data to show in Chat Screen)
export interface MessageData {
  id: string;
  data: MessageContext;
}

//Interface for Chat Member
// Usage:
//  Add Member Screen (To exclude user that already in chats)
//  Chat Screen (For sending Notifications)
//  Settings Screen (For removing account from groups member)
export interface ChatMember {
  member: Array<string>;
}

//Interface for Chat Data (Docs Fields)
// Usage:
//  Add Chat Screen (For consistency data in Chats Collections Data)
//  Contact Screen (For consistency data in Chats Collections Data)
//  Home Screen (To check is a member or not)
export interface ChatInformations {
  chatName: string;
  member: Array<string>;
}

//Interface for List of Chats
// Usage:
//  Home Screen (For collecting all chats that user joins)
export interface ChatCollections {
  id: string;
  data: ChatInformations;
}

//Interface for Contacts
// Usage:
//  Add Member Screen (To retrieve all Friends Informations)
//  Contact Screen (To retrieve all Friends Informations)
export interface ContactInformations {
  Nickname: string;
  UID: string;
  Profile: string;
}

//Interface for Contacts
// Usage:
//  Add Member Screen (For consistency Data)
//  Contact Screen (For consistency Data)
export interface UserProfileURL {
  Profile: string;
}

//Interface for Contact List
// Usage:
//  Add Contact Screen (For consistency in each user contacts)
//  Add Member Screen (For consistency data retrieval)
//  Contacts Cleaner (For Data References)
export interface FriendInformations {
  UID: string;
  Nickname: string;
}

//Notifications Interfaces
//  For overriding interface
//  (Consistency data in retrieving notifications)
interface NewNotificationRequest extends Omit<NotificationRequest, 'content'> {
  content: {
    sound: string;
    title: string;
    body: string;
    data: {
      id: string;
      chatName: string;
      currentMode: string;
    };
  };
}

interface NotificationData extends Omit<Notification, 'request'> {
  request: NewNotificationRequest;
}

export interface NewNotificationResponse
  extends Omit<NotificationResponse, 'notification'> {
  notification: NotificationData;
}

//Interface for Notifications
// Usage:
//  Tabs Navigations (For consistency data to sent)
export interface NotificationContent {
  to: string;
  sound: string;
  title: string;
  body: string;
  data: {
    id: string;
    chatName: string;
    currentMode: string;
  };
}

//Interface for Documents
//  Usage:
//   Docs Pickers
export interface DocsObjects {
  name?: string;
  size?: number;
  type?: 'success' | 'cancel' | undefined;
  uri?: string;
}
