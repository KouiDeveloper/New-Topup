import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <<<< import it here
import { WebsocketDataServiceService } from '../websocket-data-service.service';
import { ChatService, Message } from '../chat.service';
import { WebsocketService } from '../websocket.service';

import {ElementRef,ViewChild,ViewEncapsulation} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
export class ChangepasswordComponent implements OnInit {
  private _message: Message;
  private _newUser: any = {};
  private _userDetailsStr = '';
  private _server_event: any = [];
  private _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  private _otherSource: any = {};
  private _loginUser = { username: '', password: '' };
  private _currentUserdetail: any = {};
  private _otherMessage: any = {};
  private _subs: any = [];
  private _trans: any = [];
  @ViewChild('content') content: ElementRef;
  /// WEBSOCKET LAUNCHING
  constructor(private websocketDataServiceService: WebsocketDataServiceService, private router: Router,private modalService: NgbModal) {
    this.loadClient();
    if(!this._client.logintoken){
      router.navigate(['/hello-client']);
    }
    this._subs.push(this.websocketDataServiceService.clientSource.subscribe(client => {
      this._client = client;
      if (this._client.data['user'] !== undefined) {
        console.log(JSON.stringify(this._client));
        this.readClient(client);
      }
    }));
    this._subs.push(this.websocketDataServiceService.newUserSource.subscribe(client => {
      this._newUser = client;
      if (this._newUser !== undefined) {
        alert('new user update ' + this._newUser.data.user['message']);
        this.readNewUser(client);
      }
    }));
    this._subs.push(this.websocketDataServiceService.eventSource.subscribe(events => {
      this._server_event.push(events);
      this.readServerEvent(events);
    }));
    this._subs.push(this.websocketDataServiceService.currentUserSource.subscribe(user => {
      this._currentUserdetail = user;
      this._userDetailsStr = JSON.stringify(this._currentUserdetail);
      this.readCurrentUserDetail(user);
    }));

    this._subs.push(this.websocketDataServiceService.otherSource.subscribe(msg => {
      this._otherMessage = msg;
      this.readOtherMessage(msg);
    }));
  }

  
//// END WEBSOCKET LAUNCHING

  /// OTHER FUNCTIONS
  private clearJSONValue(u) {
    for (const key in u) {
      if (u.hasOwnProperty(key)) {
        u[key] = '';
      }
    }
  }

  //// END OTHER FUNCTIONS
  /// INIT FUNCTIONS
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this._newUser = JSON.parse(JSON.stringify(this._client));
    this._newUser.data = {};
    this._newUser.data.user = {};
    this._message = JSON.parse(JSON.stringify(this._client));
    this._currentUserdetail = {};
    this._userDetailsStr = '';
    this._otherMessage = {};
  }
  ngOnDestroy() {
    console.log('STOP SERVICE');   
    
  }

  // show alert for client

  showclient(content){
      this.modalService.open(content,{ centered: true }); 
      // alert(content);   
  } 

  saveClient() {
    //// this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
    console.log(JSON.stringify(this._client));
  }
  loadClient() {
    sessionStorage.setItem('firstHandShake', '');
    sessionStorage.setItem('firstHeartBeat', '');
    if (!this._client.gui || this._client.gui === undefined) {
      this._client = this.websocketDataServiceService.getClient();
      // this.websocketDataServiceService.refreshClient();
      console.log('client loaded');
    } else {
      this.saveClient();
    }
  }
/// INIT FUNCTIONS

  /// *************RECEIVING  */
  readClient(c): any {
    // this._client
    try {
      if (c !== undefined) {
        this._client = c;
        if(this._client.data===undefined){
          alert("Ka lou nar refresh mai");
          return;
        }
        switch (this._client.data['command']) {
          case 'heart-beat':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // this._client.data['user'] = u;
              console.log('heart beat ok');
            }
            break;
          case 'ping':
            console.log('ping OK');
            // // alert(this._client.data['message']);
            break;
          case 'shake-hands':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              // // console.log(this._client);
              console.log(this._client.data['message']);
            } else {
              console.log('shake hands ok');
            }
            break;
          case 'change-password':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              this.logout();
              this.saveClient();
              this.showclient(this.content);
              this.router.navigate(['welcome']);
            }
            break;
          default:
            break;
        }

      } else {
        console.log('data is empty');
      }
    } catch (error) {
      // alert(error);
    }
    
  }
  readNewUser(n): any {
    // this._newUser;
    this._newUser.data = n.data;
  }
  readServerEvent(event: any): any {
    // this._server_event
    const d = event;
    if (d['command'] !== undefined) {
    }
  }
  readCurrentUserDetail(c: any): any {
    // this._currentUserDetail
    this._currentUserdetail = c;
  }
  readOtherMessage(m: any): any {
    // this._message
    this._message = m;
  }
  /// END RECEIVING

  //// SENDING
  showNewMessage() {
    this._client.data.message = 'changed from show message';
    this.websocketDataServiceService.changeMessage(this._client);
  }
  setOtherMessage() {
    const msg = {
      title: '',
      data: {},
      other: {}, // ...
    };
    msg.data['transaction'] = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.setOtherMessage(msg);
  }
  shakeHands() {
    this.websocketDataServiceService.shakeHands();
  }
  ping_test() {
    this.websocketDataServiceService.ping_test();
    this._client.data.message += ' HERE in app component';
    console.log(this._client);
  }

  changepassword() {
    //this._currentUserdetail.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.changePassword(this._currentUserdetail);
    this.clearJSONValue(this._currentUserdetail);
  }
  logout() {
    this.websocketDataServiceService.logout();
  }
  
  goTo(com) {
    console.log(JSON.stringify(this._client));
    this.websocketDataServiceService.setClient(this._client);
    this.router.navigate([com]).then(res => {
    }).catch(err => {
      // alert(err);
    });
  }

  createTransaction() {
    let x;
    this._trans.push(x = this.websocketDataServiceService.createTransaction());
    return x;
  }

  /////////////// END SENDING

}