import {Component} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ToggleComponent } from './toggle/toggle.component';
import { LoginComponent } from './login/login.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from './/app-routing.module';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { HometopupComponent } from './hometopup/hometopup.component';
import { UbalanceComponent } from './ubalance/ubalance.component';
import { UrechargeRequestCashierComponent } from './urecharge-request-cashier/urecharge-request-cashier.component';
import { URechargeRequestComponent } from './u-recharge-request/u-recharge-request.component';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { TableHistoryComponent } from './table-history/table-history.component';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { ItemsComponent } from './items/items.component';
import { ItemShopComponent } from './item-shop/item-shop.component';
import { TestComponent } from './test/test.component';
import { LogoutComponent } from './logout/logout.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { AllMenuComponent } from './all-menu/all-menu.component';
import { HelloClientComponent } from './hello-client/hello-client.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ChangePhoneComponent } from './change-phone/change-phone.component';
import { ResiterSuccessPageComponent } from './register-success-page/resiter-success-page.component';
import { ModalComponent } from './modal/modal.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,    
    ToggleComponent,
    LoginComponent,    
    FooterComponent,   
    IndexComponent,
    RegisterComponent,    
    AdminComponent,
    ForgotpasswordComponent,
    ChangepasswordComponent,   
    HometopupComponent,
    UbalanceComponent,
    UrechargeRequestCashierComponent,
    URechargeRequestComponent,
    TransferHistoryComponent,
    TableHistoryComponent,
    AdminHistoryComponent,
    ItemsComponent,
    ItemShopComponent,
    TestComponent,
    LogoutComponent,
    UserInfoComponent,
    AllMenuComponent,
    HelloClientComponent,
    WelcomeComponent,
    ChangePhoneComponent,
    ResiterSuccessPageComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
