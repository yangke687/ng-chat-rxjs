import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User, Message, Thread } from '../models';

const initialMessages: Message[] = [];

type IMessageOperation = (messages: Message[]) => Message[];

@Injectable()
export class MessagesService {
  newMessages: Subject<Message> = new Subject<Message>(); // init at declaration

  messages: Observable<Message[]>;

  updates: Subject<any> = new Subject<any>();   // init at declaration
                                                // connect 'messages' stream and 'create' stream

  create: Subject<Message> = new Subject<Message>(); // action streams
  markThreadAsRead: Subject<any> = new Subject<any>();

  constructor () {
    this.messages = this.updates
      // 监听 this.updates, 接收的操作结果累加到 initialMessages
      .scan((messages: Message[], operation: IMessageOperation) => {
        return operation(messages);
      }, initialMessages)
      .publishReplay(1)
      .refCount();

    this.create
      .map((message: Message): IMessageOperation => {
        return (messages: Message[]) => {
          return messages.concat(message);
        };
      })
      .subscribe(this.updates);  // this.create 作为 observable
                                 // this.updates 监听 this.create

    this.newMessages.subscribe(this.create); // this.create 作为 observer

    this.markThreadAsRead
      .map((thread: Thread) => {
        return (messages: Message[]) => {
          return messages.map((message: Message) => {
            if (message.thread.id === thread.id) {
              message.isRead = true;
            }
            return message;
          });
        }
      })
      .subscribe(this.updates);
  }

  addMessage (message: Message) {
    this.newMessages.next(message);
  }

  // in this thread but written by other users
  messagesForThreadUser (thread: Thread, user: User) {
    return this.newMessages
      .filter((message: Message) => {
        // belong to this thread and isn't authored by this user
        return (message.thread.id === thread.id) && (message.author.id !== user.id);
      });
  }
}

export const messagesServiceInjectables: Array<any> = [
  MessagesService,
];
