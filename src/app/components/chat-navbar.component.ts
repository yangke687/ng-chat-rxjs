import { Component, OnInit } from '@angular/core';
import { MessagesService, ThreadsService } from '../services/services';

import { Message, Thread } from '../models';
import { reduce } from 'underscore';

@Component({
  selector: 'nav-bar',
  template: `
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="https://ng-book.com/2">
             ng-book 2
          </a>
        </div>
        <p class="navbar-text navbar-right">
          <button class="btn btn-primary" type="button">
            Messages <span class="badge">{{ unreadMessagesCount }}</span>
          </button>
        </p>
      </div>
    </nav>

  `
})
export class ChatNavBar implements OnInit {
  unreadMessagesCount: number;

  constructor (
    private messagesService: MessagesService,
    private threadsService: ThreadsService
  ) {

  }

  ngOnInit(): void {
    this.messagesService.messages.combineLatest(
      this.threadsService.currentThread,
      (messages: Message[], currentThread: Thread) => {
        return [currentThread, messages];
      }
    ).subscribe(([currentThread, messages]: [Thread, Message[]]) => {
      this.unreadMessagesCount = reduce(
        messages,
        (sum: number, m: Message) => {
          const msgIsInCurrentThread: boolean = m.thread &&
            currentThread &&
            (currentThread.id === m.thread.id);
          if ( m && !m.isRead && !msgIsInCurrentThread ) {
            sum += 1;
          }
          return sum;
        },
        0
      );
    });
  }
}
