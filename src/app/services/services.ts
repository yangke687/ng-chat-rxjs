import { messagesServiceInjectables } from './MessageService';
import { threadsServiceInjectables } from './ThreadsService';
import { userServiceInjectables } from './UserService';

export * from './MessageService';
export * from './ThreadsService';
export * from './UserService';

export const servicesInjectables: Array<any> = [
  messagesServiceInjectables,
  threadsServiceInjectables,
  userServiceInjectables,
];
