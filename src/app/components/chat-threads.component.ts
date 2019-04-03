import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ThreadsService } from '../services/ThreadsService';


@Component({
  selector: 'chat-threads',
  changeDetection: ChangeDetectionStrategy.OnPush, // checkOnce
  template: `
    <div class="row">
      <div class="conversation-wrap">
        <chat-thread
          *ngFor="let thread of threads | async"
          [thread]="thread"
        >
        </chat-thread>
      </div>
    </div>
  `
})
export class ChatThreads {
  threads: Observable<any>;

  constructor (private threadsService: ThreadsService ) {
    this.threads = threadsService.orderedThreads;
  }
}
