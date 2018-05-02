import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms"; // <<<< import it here
import { WebsocketDataServiceService } from "../websocket-data-service.service";
import { ChatService, Message } from "../chat.service";
import { WebsocketService } from "../websocket.service";

import { ViewEncapsulation,ElementRef,ViewChild} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.css"],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private _message: Message;
  private _newUser: any = {};
  private _userDetailsStr = "";
  private _server_event: any = [];
  private _client: Message = {
    gui: "",
    username: "",
    logintoken: "",
    logintime: "",
    loginip: "",
    data: {}
  };
  private _otherSource: any = {};
  private _loginUser = { username: "", password: "" };
  private _currentUserdetail: any = {};
  private _otherMessage: any = {};
  private _subs: any = [];
  private _trans: any = [];

  @ViewChild('Alert_update_details') Alert_update_details: ElementRef;

  /// WEBSOCKET LAUNCHING
  constructor(
    private websocketDataServiceService: WebsocketDataServiceService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.loadClient();
    if(!this._client.logintoken){
      router.navigate(['/hello-client']);
    }
    console.log(JSON.stringify(this._client));
      this._subs.push(this.websocketDataServiceService.clientSource.subscribe(client => {
      this.readClient(client);
    }));
      this._subs.push(this.websocketDataServiceService.newUserSource.subscribe(client => {
      this.readNewUser(client);
     // }
    }));
      this._subs.push(this.websocketDataServiceService.eventSource.subscribe(events => {
      this.readServerEvent(events);
    }));
      this._subs.push(this.websocketDataServiceService.currentUserSource.subscribe(user => {
      this.readCurrentUserDetail(user);
    }));

    this._subs.push(this.websocketDataServiceService.otherSource.subscribe(msg => {
      //this._otherMessage = msg;
      this.readOtherMessage(msg);
    }));
  }


    // Alert_update_details ++++++++++ //

    Show_update_details(Alert_update_details){
      this.modalService.open(Alert_update_details,{ centered: true }); 
      // alert(content);   
  } 

  //// END WEBSOCKET LAUNCHING

  /// OTHER FUNCTIONS
  private clearJSONValue(u) {
    for (const key in u) {
      if (u.hasOwnProperty(key)) {
        u[key] = "";
      }
    }
  }
  private publicPath = ["/login", "/register", "/forgotpassword"];
  //// END OTHER FUNCTIONS
  /// INIT FUNCTIONS
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this._newUser = JSON.parse(JSON.stringify(this._client));
    this._newUser.data = {};
    this._newUser.data.user = {};
    this._message = JSON.parse(JSON.stringify(this._client));
    this._currentUserdetail = {};
    this._userDetailsStr = "";
    this._otherMessage = {};
    //this.getUserDetails();
  }
  ngOnDestroy() {
    console.log("STOP SERVICE");
  }
  saveClient() {
    //this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
  }
  loadClient() {
    sessionStorage.setItem("firstHandShake", "");
    sessionStorage.setItem("firstHeartBeat", "");
    if (!this._client.gui || this._client.gui === undefined) {
      this._client = this.websocketDataServiceService.getClient();
      //this.websocketDataServiceService.refreshClient();
      console.log("client loaded");
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
      switch (this._client.data["command"]) {
        case "heart-beat":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
          } else {
            // this._client.data['user'] = u;
            console.log("heart beat ok");
            console.log(JSON.stringify(this._client));
          }
          break;
        case "shake-hands":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
          } else {
            this.router.url;
            this.getUserDetails();
          }
          break;
        case "ping":
          console.log("ping OK");
          // // alert(this._client.data['message']);
          break;
        case "get-client":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
          } else {
            console.log("get-client OK");
          }
          break;

        case "edit-profile":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
          } else {
            // // console.log(this._client.data['user']);
            const u = JSON.parse(JSON.stringify(c.data["user"]));
            //alert(JSON.stringify(u));
            this._currentUserdetail = u;
            this.saveClient();
            console.log("edit user details ok");
            this.Show_update_details(this.Alert_update_details);
          }
          break;
        case "get-profile":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
          } else {
            // // console.log(this._client.data['user']);
            const u = JSON.parse(JSON.stringify(c.data["user"]));
            this._currentUserdetail = u;
            console.log("get user details ok");
          }
          break;
        case "get-transaction":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
          } else {
            // // alert('change password OK');
            console.log("get transaction id ok");
          }
          break;
        case "check-transaction":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
          } else {
            // // alert('change password OK');
            console.log("check transaction id ok");
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
      console.log("data is empty");
    }
  }
  readNewUser(n): any {
    // this._newUser;
    if (n !== undefined) {
      this._newUser.data = n.data;
    }
  }
  readServerEvent(event: any): any {
  
  }
  readCurrentUserDetail(c: any): any {
    this._currentUserdetail = c;
    this._userDetailsStr = JSON.stringify(this._currentUserdetail);
  }
  readOtherMessage(m: any): any {
    // this._message
    this._message = m;
  }
  /// END RECEIVING

  //// SENDING
  showNewMessage() {
    this._client.data.message = "changed from show message";
    //this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.changeMessage(this._client);
  }
  setOtherMessage() {
    const msg = {
      title: "",
      data: {},
      other: {} // ...
    };
    // msg.data['transaction'] = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.setOtherMessage(msg);
  }
  shakeHands() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.shakeHands();
  }
  ping_test() {
    //this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    //this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.ping_test();
    this._client.data.message += " HERE in app component";
    console.log(this._client);
  }

  getUserDetails() {
    //this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this._client.data.user = this._currentUserdetail;
    //this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.getUserDetails(this._client.data);
  }
  updateUserDetails() {
    //this._currentUserdetail = JSON.parse(this._userDetailsStr);
    // this._currentUserdetail.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    //this.websocketDataServiceService.refreshClient();
    //alert(JSON.stringify(this._currentUserdetail));
    this.websocketDataServiceService.updateUserDetails(this._currentUserdetail); // should be _userDetails
  }
  get_user_gui() {
    this.websocketDataServiceService.get_user_gui();
  }

  goTo(com) {
    console.log(JSON.stringify(this._client));
    // if (!this._client.gui || this._client.gui === undefined) {
    //   this._client = this.websocketDataServiceService.getClient();
    // }
    //this.websocketDataServiceService.refreshClient();
    //this.websocketDataServiceService.setClient(this._client);
    this.router
      .navigate([com])
      .then(res => {
        // this.websocketDataServiceService.stopService();
        // alert(res);
      })
      .catch(err => {
        // alert(err);
      });
  }
  createTransaction() {
    let x;
    this._trans.push(
      (x = this.websocketDataServiceService.createTransaction())
    );
    return x;
  }

  /////////////// END SENDING
}
