import { Component, Inject, OnInit, OnDestroy,ElementRef,ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <<<< import it here
import { WebsocketDataServiceService } from '../websocket-data-service.service';
import { ChatService, Message } from '../chat.service';
import { WebsocketService } from '../websocket.service';

import { ViewEncapsulation} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css','../register/register.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})

export class RegisterComponent implements OnInit, OnDestroy {
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
  @ViewChild('keyempty') keyempty: ElementRef;
  /// WEBSOCKET LAUNCHING
  constructor(private websocketDataServiceService: WebsocketDataServiceService, private router: Router,private modalService: NgbModal) {
    this.loadClient();
    if(this._client.logintoken){
      router.navigate(['/all-menu']);
    }
    this._subs.push(this.websocketDataServiceService.clientSource.subscribe(client => {
      this._client = client;
      if (this._client.data['user'] !== undefined) {
        //console.log(JSON.stringify(this._client));
        this.readClient(client);
      }
    }));
    this._subs.push(this.websocketDataServiceService.newUserSource.subscribe(client => {
      this._newUser = client;
      if (this._newUser !== undefined) {
        //alert('new user update ' + this._newUser.data.user['message']);
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
  // show client content ++++++++++ //
  showclient(content){
    this.modalService.open(content,{ centered: true });     
} 

   // show client content ++++++++++ /
   showkeyempty(keyempty){
    this.modalService.open(keyempty,{ centered: true }); 
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
    this._client = c;
    if (c !== undefined) {
      // console.log('return from server');
      // console.log(msg);
      // console.log(this._client.data['command'] + this._client.data['command2']);
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
        case 'get-transaction':
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);
          } else {
            // // alert('change password OK');
            console.log('get transaction id ok');
          }
          break;
        case 'check-transaction':
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);           
          } else {
            // // alert('change password OK');
            console.log('check transaction id ok');
          }
          break;
        case 'get-user-gui':
          // console.log('here get user gui ');
          // // console.log(this._client);
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);
          } else {
            // // alert(this._client.data['user'].gui);
            console.log('get user gui ok');
          }
          break;
        case 'check-phonenumber':
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);
          } else {
            // // alert(this._client.data['user'].gui);
            this._newUser.data = this._client.data;
            console.log('check phonenumber ok');
          }
          break;
        case 'check-username':
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);
          } else {
            this._newUser.data = this._client.data;
            console.log('chek username ok');
          }
          break;
        case 'check-secret':
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);            
          } else {
            this._newUser.data = this._client.data;
            console.log('check secret ok');
          }
          break;
        case 'get-secret':
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);
          } else {
            this._newUser.data = this._client.data;
            console.log('get secret  ok');
          }
          break;
        case 'register':
          if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
            console.log(this._client.data['message']);
          } else {
            this._newUser.data = this._client.data;
            this.saveClient();
            this.showclient(this.content);
            this.router.navigate(['/login']);
            // this.router.navigate(['/register-success-page']);            
          }
          break;
        default:
          break;
      }
      // console.log(this.heartbeat_interval);
      // console.log(this._client);
      // if (evt.data != '.') $('#output').append('<p>'+evt.data+'</p>');
    } else {
      // alert('data empty');
      console.log('data is empty');
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
      // console.log('changed from server');
      // console.log(d['command'] + d['command2']);
      switch (d['command']) {
        case 'notification-changed':
          if (d['client']['data']['sms'] !== undefined) {
            console.log('SMS');
            console.log(d['client']['data']['res'].resultDesc);
            console.log(d['client']['data']['res'].msisdn);
          }
        case 'error-changed':
          console.log(d['client']['data']['message']);
          break;
          case 'secret-changed':
          console.log(d);
          break;
      }
      // // console.log(msg);
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
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.changeMessage(this._client);
  }
  setOtherMessage() {
    const msg = {
      title: '',
      data: {},
      other: {}, // ...
    };
    //msg.data['transaction'] = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.setOtherMessage(msg);
  }
  shakeHands() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.shakeHands();
  }
  ping_test() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.ping_test();
    this._client.data.message += ' HERE in app component';
    console.log(this._client);
  }


  get_user_gui() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.get_user_gui();
  }

  register() {
    //this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.register(this._newUser);
    this.clearJSONValue(this._newUser);
  }
  getSecret() {
    //this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    if(!this._newUser.data.user.phonenumber || !this._newUser.data.user.username || !this._newUser.data.user.password || !this._newUser.data.user.confirmpassword){
      this.showkeyempty(this.keyempty);      
    }else{
      this.websocketDataServiceService.getSecret(this._newUser);
    }
    
  }
  checkSecret(event: any) {
    if (this._newUser.data['secret'] !== undefined) {
      if (this._newUser.data['secret'].length === 6) {
        //this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
        this.websocketDataServiceService.checkSecret(this._newUser);
      }
    }
  }
  checkUsername() {
    //this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.checkUsername(this._newUser);
  }
  checkPhoneNumber() {
    ///this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.checkPhoneNumber(this._newUser);
  }
  

  goTo(com) {
    console.log(JSON.stringify(this._client));
    // if (!this._client.gui || this._client.gui === undefined) {
    //   this._client = this.websocketDataServiceService.getClient();
    // }
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
    this.router.navigate([com]).then(res => {
      // this.websocketDataServiceService.stopService();
      // alert(res);
    }).catch(err => {
      // alert(err);
    });
  }

  getForgotKeys() {
    let d: any;
    d = {};
    d.data = {};
    d.data.user = {};
    d.data.user.phonenumber = this._currentUserdetail.phonenumber;
    d.data.forgot = this._currentUserdetail.forgot;

   // d.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // alert(JSON.stringify(d));
    // alert(JSON.stringify(this._currentUserdetail));
    if (d.data.user['phonenumber'] !== undefined) {
      this.websocketDataServiceService.getForgotKeys(d);
    } else {
      // alert('forgot key is empty');
      this.showkeyempty(this.keyempty);     
    }
  }

  createTransaction() {
    let x;
    this._trans.push(x = this.websocketDataServiceService.createTransaction());
    return x;
  }

  /////////////// END SENDING

}