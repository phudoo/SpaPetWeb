import { NgModule } from '@angular/core';

import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//day 1
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';

//day 2
import { HomeAdminComponent } from './admin/adminUser/home-admin/home-admin.component';
import { EdituserComponent } from './admin/adminUser/edituser/edituser.component';
import { AdduserComponent } from './admin/adminUser/adduser/adduser.component';
import { MenuAdminComponent } from './admin/menu-admin/menu-admin.component';
import { ServiceComponent } from './admin/adminService/service/service.component';
import { DetailserviceComponent } from './admin/adminService/detailservice/detailservice.component';
import { EditserviceComponent } from './admin/adminService/editservice/editservice.component';
import { AddserviceComponent } from './admin/adminService/addservice/addservice.component';
import { AddappointmentComponent } from './user/appointment/addappointment/addappointment.component';

import { ReactiveFormsModule } from '@angular/forms';
import { AllAppointmentComponent } from './user/appointment/all-appointment/all-appointment.component';
import { DetailappointmentComponent } from './user/appointment/detailappointment/detailappointment.component';
import { AddpetComponent } from './user/pets/addpet/addpet.component';
import { ListmypetsComponent } from './user/pets/listmypets/listmypets.component';
import { DetailpetComponent } from './user/pets/detailpet/detailpet.component';
import { EditpetComponent } from './user/pets/editpet/editpet.component';
import { HomedoctorComponent } from './doctor/homedoctor/homedoctor.component';
import { AllproductComponent } from './user/product/allproduct/allproduct.component';
import { DetailproductComponent } from './user/product/detailproduct/detailproduct.component';
import { EditproductComponent } from './admin/adminproduct/editproduct/editproduct.component';
import { AddproductComponent } from './admin/adminproduct/addproduct/addproduct.component';
import { AllproductadminComponent } from './admin/adminproduct/allproductadmin/allproductadmin.component';
import { AllserviceComponent } from './user/service/allservice/allservice.component';
import { AddcartComponent } from './user/product/addcart/addcart.component';
import { HeaderComponent } from './pages/header/header.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { AllcartComponent } from './user/product/allcart/allcart.component';
import { AddorderComponent } from './user/order/addorder/addorder.component';
import { MyorderComponent } from './user/order/myorder/myorder.component';
import { DetailorderComponent } from './user/order/detailorder/detailorder.component';
import { OrderdoctorComponent } from './doctor/orderdoctor/orderdoctor.component';
import { InterfaceuserComponent } from './user/interfaceuser/interfaceuser.component';
import { BlogComponent } from './blog/blog/blog.component';
import { AddblogComponent } from './blog/addblog/addblog.component';
import { EditblogComponent } from './blog/editblog/editblog.component';
import { DetailblogComponent } from './blog/detailblog/detailblog.component';
import { AlbumComponent } from './album/album/album.component';
import { EditalbumComponent } from './album/editalbum/editalbum.component';
import { UserreviewComponent } from './review/userreview/userreview.component';
import { EditreviewComponent } from './review/editreview/editreview.component';
import { DeletereviewComponent } from './review/deletereview/deletereview.component';
import { DetailreviewComponent } from './review/detailreview/detailreview.component';
import { GioithieuComponent } from './gioithieu/gioithieu.component';
import { ReviewuserComponent } from './doctor/reviewuser/reviewuser.component';
import { ContactComponent } from './contact/contact.component';
import { DetailcontactComponent } from './contact/detailcontact/detailcontact.component';
import { AllcontactComponent } from './contact/allcontact/allcontact.component';
import { RevenueComponent } from './doctor/revenue/revenue.component';
import { ChatrealtimeComponent } from './chat/chatrealtime/chatrealtime.component';
import { AllalbumComponent } from './allalbum/allalbum.component';
import { DetailalbumComponent } from './album/detailalbum/detailalbum.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HomeAdminComponent,
    EdituserComponent,
    AdduserComponent,
    MenuAdminComponent,
    ServiceComponent,
    DetailserviceComponent,
    EditserviceComponent,
    AddserviceComponent,
    DetailappointmentComponent,
    ListmypetsComponent,
    DetailpetComponent,
    EditpetComponent,
    HomedoctorComponent,
    DetailproductComponent,
    EditproductComponent,
    AddproductComponent,
    AllproductadminComponent,
    AddcartComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AllcartComponent,
    AddorderComponent,
    MyorderComponent,
    DetailorderComponent,
    InterfaceuserComponent,
    BlogComponent,
    AddblogComponent,
    EditblogComponent,
    DetailblogComponent,
    EditalbumComponent,
    DeletereviewComponent,
    DetailreviewComponent,
    GioithieuComponent,
    RevenueComponent,
    AllalbumComponent,
    DetailalbumComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideClientHydration(withEventReplay())],
  bootstrap: [AppComponent],
})
export class AppModule {}
