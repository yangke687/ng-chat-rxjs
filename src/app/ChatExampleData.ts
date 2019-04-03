declare var require: any;
import { User, Thread, Message } from './models';
import {
  MessagesService,
  ThreadsService,
  UserService,
} from './services/services';
import * as moment from 'moment';

const me: User      = new User('Juliet', require('images/avatars/female-avatar-1.png'));
const ladycap: User = new User('Lady Capuconst', require('images/avatars/female-avatar-2.png'));
const echo: User    = new User('Echo Bot', require('images/avatars/male-avatar-1.png'));
const rev: User     = new User('Reverse Bot', require('images/avatars/female-avatar-4.png'));
const wait: User    = new User('Waiting Bot', require('images/avatars/male-avatar-2.png'));

const tLadycap: Thread = new Thread('tLadycap', ladycap.name, ladycap.avatarSrc);
const tEcho: Thread    = new Thread('tEcho', echo.name, echo.avatarSrc);
const tRev: Thread     = new Thread('tRev', rev.name, rev.avatarSrc);
const tWait: Thread    = new Thread('tWait', wait.name, wait.avatarSrc);

const initialMessages: Array<Message> = [
  new Message({
    author: me,
    sentAt: moment().subtract(45, 'minutes').toDate(),
    text: 'Yet let me weep for such a feeling loss.',
    thread: tLadycap
  }),
  new Message({
    author: ladycap,
    sentAt: moment().subtract(20, 'minutes').toDate(),
    text: 'So shall you feel the loss, but not the friend which you weep for.',
    thread: tLadycap
  }),
  new Message({
    author: echo,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: `I\'ll echo whatever you send me`,
    thread: tEcho
  }),
  new Message({
    author: rev,
    sentAt: moment().subtract(3, 'minutes').toDate(),
    text: `I\'ll reverse whatever you send me`,
    thread: tRev
  }),
  new Message({
    author: wait,
    sentAt: moment().subtract(4, 'minutes').toDate(),
    text: `I\'ll wait however many seconds you send to me before responding. Try sending '3'`,
    thread: tWait
  }),
  new Message({
    author: wait,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: `Ha Ha Ha...`,
    thread: tWait
  }),
];

export class ChatExampleData {
  static init(
    messagesService: MessagesService,
    threadsService: ThreadsService,
    userService: UserService
  ): void {
    // todo
    messagesService.messages.subscribe(() => {});

    // set 'Juliet' the current user
    userService.setCurrentUser(me);

    // create initial messages
    initialMessages.map((message: Message) => {
      messagesService.addMessage(message);
    });

    threadsService.setCurrentThread(tEcho);

    this.setupBots(messagesService);
  }

  static setupBots (messagesService: MessagesService): void {
    // echo bot
    messagesService.messagesForThreadUser(tEcho, echo)
      .forEach((message: Message): void => {
        messagesService.addMessage(
          new Message({
            author: echo,
            text: message.text,
            thread: tEcho,
          })
        );
      }, null);

    // message text reverse bot
    messagesService.messagesForThreadUser(tRev, rev)
      .forEach((message: Message): void => {
        messagesService.addMessage(
          new Message({
            author: rev,
            text: message.text.split('').reverse().join(''),
            thread: tRev
          })
        )
      }, null);

    // waiting bot
    messagesService.messagesForThreadUser(tWait, wait)
      .forEach((message: Message): void => {
        let waitTime: number = parseInt(message.text, 10);
        let reply: string;

        if (isNaN(waitTime)) {
          waitTime = 0;
          reply = `I didn't understand ${message.text}. Try send me a number`;
        } else {
          reply = `I waited ${waitTime} seconds to send you this`;
        }

        setTimeout(() => {
          messagesService.addMessage(new Message({
            author: wait,
            text: reply,
            thread: tWait,
          }));
        }, waitTime * 1000);
      }, null);
  }
}
