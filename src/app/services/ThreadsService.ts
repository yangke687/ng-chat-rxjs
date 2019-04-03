import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Thread, Message } from '../models';
import { MessagesService } from './MessageService';
import * as _ from 'underscore';

@Injectable()
export class ThreadsService {
  threads: Observable<{[key: string]: Thread}>;

  orderedThreads: Observable<Thread[]>;

  currentThread: Subject<Thread> = new BehaviorSubject<Thread>(new Thread());

  currentThreadMessages: Observable<Message[]>;

  constructor (private messagesService: MessagesService) {
    this.threads = messagesService.messages
      .map((messages: Message[]) => {
        const threads: {[key: string]: Thread} = {};

        messages.map((message: Message) => {
          threads[message.thread.id] = threads[message.thread.id] || message.thread;
          // cache the most recent messages for each thread
          // to preview within the threads list
          const messagesThread: Thread = threads[message.thread.id];
          if (
            !messagesThread.lastMessage ||
            messagesThread.lastMessage.sentAt < message.sentAt
          ) {
            messagesThread.lastMessage = message;
          }
        });

        return threads;
      });

    this.orderedThreads = this.threads
      .map((
        threadGroups: {[key: string]: Thread}
      ) => {
        const threads: Thread[] = _.values(threadGroups);
        return _.sortBy(threads, (t: Thread) => {
          return t.lastMessage.sentAt;
        }).reverse();
      });

    this.currentThread.subscribe(this.messagesService.markThreadAsRead);

    // mark current thread messages as 'read'
    this.currentThreadMessages = this.currentThread
      .combineLatest(messagesService.messages, (currentThread: Thread, messages: Message[]) => {
        if (currentThread && messages.length > 0) {
          return _.chain(messages)
            .filter((message: Message) => {
              return message.thread.id === currentThread.id;
            })
            .map((message: Message) => {
              message.isRead = true;
              return message;
            })
            .value();
        } else {
          return [];
        }
      });
  }

  setCurrentThread (newThread: Thread) {
    this.currentThread.next(newThread);
  }
}

export const threadsServiceInjectables: Array<any> = [
  ThreadsService
];
