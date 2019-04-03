import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

// import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { FromNowPipe } from '../util/FromNowPipe';

import { ChatExampleData } from './chatExampleData';

import { ChatThread } from './components/chat-thread.component';
import { ChatThreads } from './components/chat-threads.component';
import { ChatWindow } from './components/chat-window.component';
import { ChatMessage } from './components/chat-message.component';
import { ChatNavBar } from './components/chat-navbar.component'

import {
  servicesInjectables,
  MessagesService,
  ThreadsService,
  UserService,
} from './services/services';
@Component({
  selector: 'chat-app',
  template: `
    <div>
      <nav-bar></nav-bar>
      <div class="container">
        <chat-threads></chat-threads>
        <chat-window></chat-window>
      </div>
    </div>
  `
})
export class ChatApp {
  constructor (
    private messagesService: MessagesService,
    private threadsService: ThreadsService,
    private userService: UserService
  ) {
    ChatExampleData.init(
      messagesService,
      threadsService,
      userService
    );
  }
}
@NgModule({
  declarations: [
    ChatApp,
    FromNowPipe,
    ChatThread,
    ChatThreads,
    ChatWindow,
    ChatMessage,
    ChatNavBar,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [ servicesInjectables ],
  bootstrap: [ChatApp]
})
export class AppModule { }
