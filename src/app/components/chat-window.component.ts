import { Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

import { Message, Thread, User } from '../models';
import { MessagesService, ThreadsService, UserService } from '../services/services';

@Component({
  selector: 'chat-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chat-window-container">
      <div class="chat-window">
        <div class="panel-container">
          <div class="panel panel-default">

            <div class="panel-heading top-bar">
              <div class="panel-title-container">
                <h3 class="panel-title">
                  <span class="glyphicon glyphicon-comment"></span>
                  Chat - {{currentThread.name}}
                </h3>
              </div>
              <div class="panel-buttons-container">
                <!-- you could put minimize or close buttons here -->
              </div>
            </div>

            <div class="panel-body msg-container-base">
              <chat-message
                *ngFor="let message of messages | async"
                [message]="message">
              </chat-message>
          </div>

          <div class="panel-footer">
            <div class="input-group">
              <input type="text"
              class="chat-input"
              placeholder="Write your message here..."
              (keydown.enter)="onEnter($event)"
              [(ngModel)]="draftMessage.text" />
              <span class="input-group-btn">
                <button class="btn-chat"
                (click)="onEnter($event)"
                >Send</button>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ChatWindow implements OnInit {
  messages: Observable<any>;
  currentThread: Thread;
  currentUser: User;
  draftMessage: Message;

  constructor (
    private messagesService: MessagesService,
    private threadsService: ThreadsService,
    private userService: UserService,
    private el: ElementRef
  ) {}

  scrollToBottom(): void {
    const scrollPane: any = this.el
      .nativeElement.querySelector('.msg-container-base');
      scrollPane.scrollTop = scrollPane.scrollHeight;
  }

  ngOnInit(): void {
    this.messages = this.threadsService.currentThreadMessages;
    this.draftMessage = new Message();

    this.threadsService.currentThread.subscribe((thread: Thread) => {
      this.currentThread = thread;
    });  // 监听所有 threadsService.setCurrentThread

    this.userService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });   // 监听所有  UserService.setCurrentUser

    this.messages.subscribe((messages: Array<Message>) => {
      setTimeout(() => {
        this.scrollToBottom();
       });
    }); // 监听消息变化
  }

  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }

  sendMessage(): void {
    let m:Message = this.draftMessage;
    m.author = this.currentUser;
    m.thread = this.currentThread;
    m.isRead = true;
    this.messagesService.addMessage(m);
    this.draftMessage = new Message();
  }
}
