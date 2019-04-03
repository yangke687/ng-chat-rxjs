import { Component, OnInit, Input } from '@angular/core';
import { Thread } from '../models';
import { ThreadsService } from '../services/ThreadsService';

@Component({
  inputs: ['thread'],
  selector: 'chat-thread',
  template: `
    <div class="media conversation">
      <div class="pull-left">
        <img class="media-object avatar" src="{{ thread.avatarSrc }}" />
      </div>
      <div class="media-body">
        <h5 class="media-heading contact-name">{{thread.name}}
          <span *ngIf="selected">&bull;</span>
        </h5>
        <small class="message-preview">{{thread.lastMessage.text}}</small>
      </div>
      <a (click)="clicked($event)" class="div-link">Select</a>
    </div>
  `
})
export class ChatThread implements OnInit {
  thread: Thread;
  selected = false;

  constructor (private threadsService: ThreadsService) {
  }

  ngOnInit(): void {
    this.threadsService.currentThread.subscribe( (currentThread: Thread) => {
      this.selected = currentThread &&          //
        this.thread &&                          //
        (currentThread.id === this.thread.id);  // 监听 this.threadsService.currentThread
    });
  }

  clicked(event: any): void {
    event.preventDefault();
    this.threadsService.setCurrentThread(this.thread); // 触发上面的订阅
  }
}
