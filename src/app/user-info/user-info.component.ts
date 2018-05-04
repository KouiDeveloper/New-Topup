import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms"; // <<<< import it here
import { WebsocketDataServiceService } from "../websocket-data-service.service";
import { ChatService, Message } from "../chat.service";
import { WebsocketService } from "../websocket.service";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


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
  @ViewChild('Type_dont_support') Type_dont_support: ElementRef;

  /// WEBSOCKET LAUNCHING
  constructor(
    private websocketDataServiceService: WebsocketDataServiceService,
    private router: Router,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private chatService: ChatService
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

   // Alert_update_details ++++++++++ //

   Show_type_error(Type_dont_support){
    this.modalService.open(Type_dont_support,{ centered: true }); 
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
            let photo=JSON.parse(JSON.stringify(this._currentUserdetail.photo));
            u.photo=photo;
            this.updateProfilePhoto(u.photo);
            this._currentUserdetail = u;
            //console.log(this._currentUserdetail.photo);
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
            const u = JSON.parse(JSON.stringify(this._client.data["user"]));
            //console.log(u);
            this.updateProfilePhoto(u.photo);
            this._currentUserdetail=u;
            
            //console.log(this._currentUserdetail);
            //console.log(this._currentUserdetail.photo[0].url);
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

          case "upload":
          if (
            this._client.data["message"].toLowerCase().indexOf("error") > -1
          ) {
            console.log(this._client.data["message"]);
            alert("Error Upload")
          } else {
            // // alert('change password OK');
            console.log("check transaction id ok");
            alert("pass Upload");
          }
          break;
        default:
          break;
      }
  
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
    //this._currentUserdetail = c;
    //this._userDetailsStr = JSON.stringify(this._currentUserdetail);
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
  sendMsg() {
    // this._message.data['command'] = 'ping';
    // console.log(JSON.stringify(this._message));
    // console.log('new message from client to websocket: ', JSON.stringify(this._message.data['command']));
    if (this._message['gui'] || this._message.data['command'] === 'shake-hands' || this._message.data['command'] === 'ping') {
      this.chatService.messages.next(this._message);
    }
  }
  shakeHands() {
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
    this.router
      .navigate([com])
      .then(res => {

      })
      .catch(err => {
        // alert(err);
      });
  }

  binary2imageurl(bin) {
    const l = bin.length;
    const urlCreator = window.URL;
    const array = new Uint8Array(l);
    for (let i = 0; i < l; i++) {
      array[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'image/jpeg' });
    return this.sanitizer.bypassSecurityTrustUrl(
      urlCreator.createObjectURL(blob));

  }
  arraybuffer2imageurl(blob: File) {
    const urlCreator = window.URL;
    // const blob = new Blob([ab]);
    return this.sanitizer.bypassSecurityTrustUrl(
      urlCreator.createObjectURL(blob));
  }
  
  upload(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = data;
    //this._message.data.transaction = this.createTransaction();
    this._message.data.command = 'upload';
    this.sendMsg();
  }
  createTransaction() {
    let x;
    this._trans.push(
      (x = this.websocketDataServiceService.createTransaction())
    );
    return x;
  }

  uploadChange($event): void {
    const file: File = $event.target.files[0];
    if (file === undefined) {
      return;
    }
    let allowtype=['png','jpg','gif','jpeg'];
    console.log(file.type);
    if(allowtype.indexOf(file.type.toLowerCase().split('/')[1])<0){
      this.Show_type_error(this.Type_dont_support);
      return;
    }

    const myReader: FileReader = new FileReader();
    const photo = {
      arraybuffer: '',
      url: {},
      name: ((Math.random() * 1000000) + 1) + '_' + file.name,
      lastmodifieddate: file.lastModifiedDate,
      size: file.size,
      type: file.type,
    };
    
    if (this._currentUserdetail.photo === undefined || !this._currentUserdetail.photo) {
      this._currentUserdetail.photo = [];
    }
    if(this._currentUserdetail.photo.length>0){
      this._currentUserdetail.photo.splice(0,1);
    }

    photo.url = this.arraybuffer2imageurl(file);
    //console.log(photo.url);
    myReader.readAsBinaryString(file);
    myReader.onloadend = (e) => {
      photo.arraybuffer = myReader.result;
      // const a_blob = new Blob([myReader.result], { type: 'binary' });
      // photo.url = window.URL.createObjectURL(a_blob);
      // alert(this._currentUserdetail.photo.length);
      // this.binary2blob(photo.arraybuffer);
      //this._currentUserdetail.testurl = this.binary2blob(photo.arraybuffer);
      this._currentUserdetail.photo.push(photo);
    };
  }
  binary2blob(bin) {
    return this.websocketDataServiceService.binary2imageurl(bin);
  }
  removePhoto(name){
    alert('deleting photo');
    let array=this._currentUserdetail.photo;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.name===name){
        array.splice(index,1);
        return;
      }
    }
  }
  updateProfilePhoto(photo){
    if(photo===undefined || !photo)
      photo=[];
    if(photo.length){
      for (let index = 0; index < photo.length; index++) {
        const element = photo[index];
        element.url= this.websocketDataServiceService.binary2imageurl(element.arraybuffer);
      }
    }   
    //console.log(u);
  }

  selectDefaultPhoto(name){
    let array=this._currentUserdetail.photo;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.name===name){
        array.splice(0,0,array.splice(index,1)[0]);
        return;
      }
    }
  }

  

  /////////////// END SENDING
}
