import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//day 1 login and register
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './home/home.component';
import { HomeAdminComponent } from './admin/adminUser/home-admin/home-admin.component';
import { EdituserComponent } from './admin/adminUser/edituser/edituser.component';
import { AdduserComponent } from './admin/adminUser/adduser/adduser.component';
//day 5
import { MenuAdminComponent } from './admin/menu-admin/menu-admin.component';
import { ServiceComponent } from './admin/adminService/service/service.component';
import { DetailserviceComponent } from './admin/adminService/detailservice/detailservice.component';
import { EditserviceComponent } from './admin/adminService/editservice/editservice.component';
//day 6
import { AddserviceComponent } from './admin/adminService/addservice/addservice.component';
// day7
import { AddappointmentComponent } from './user/appointment/addappointment/addappointment.component';
import { AddpetComponent } from './user/pets/addpet/addpet.component';
import { DetailappointmentComponent } from './user/appointment/detailappointment/detailappointment.component';

import { ListmypetsComponent } from './user/pets/listmypets/listmypets.component';
//day 8
import { AllAppointmentComponent } from './user/appointment/all-appointment/all-appointment.component';
//day 10
import { DetailpetComponent } from './user/pets/detailpet/detailpet.component';
import { EditpetComponent } from './user/pets/editpet/editpet.component';
import { HomedoctorComponent } from './doctor/homedoctor/homedoctor.component';
import { AllproductComponent } from './user/product/allproduct/allproduct.component';
import { DetailproductComponent } from './user/product/detailproduct/detailproduct.component';
import { AllproductadminComponent } from './admin/adminproduct/allproductadmin/allproductadmin.component';
import { AddproductComponent } from './admin/adminproduct/addproduct/addproduct.component';
import { AllserviceComponent } from './user/service/allservice/allservice.component';

//day 11
import { EditproductComponent } from './admin/adminproduct/editproduct/editproduct.component';
import { AddcartComponent } from './user/product/addcart/addcart.component';
import { AllcartComponent } from './user/product/allcart/allcart.component';
import { AddorderComponent } from './user/order/addorder/addorder.component';

//day 12
import { MyorderComponent } from './user/order/myorder/myorder.component';
import { DetailorderComponent } from './user/order/detailorder/detailorder.component';

//day 13
import { OrderdoctorComponent } from './doctor/orderdoctor/orderdoctor.component';
//day 14
import { InterfaceuserComponent } from './user/interfaceuser/interfaceuser.component';
import { BlogComponent } from './blog/blog/blog.component';
import { EditblogComponent } from './blog/editblog/editblog.component';
import { AddblogComponent } from './blog/addblog/addblog.component';
import { DetailblogComponent } from './blog/detailblog/detailblog.component';
import { AlbumComponent } from './album/album/album.component';
import { AddalbumComponent } from './album/addalbum/addalbum.component';
import { EditalbumComponent } from './album/editalbum/editalbum.component';
import { UserreviewComponent } from './review/userreview/userreview.component';
//day15 
import { GioithieuComponent } from './gioithieu/gioithieu.component'; 
import { ReviewuserComponent } from './doctor/reviewuser/reviewuser.component';
import { ContactComponent } from './contact/contact.component';
import { AllcontactComponent } from './contact/allcontact/allcontact.component';
import { DetailcontactComponent } from './contact/detailcontact/detailcontact.component';

//day 16
import { RevenueComponent } from './doctor/revenue/revenue.component';
import { ChatrealtimeComponent } from './chat/chatrealtime/chatrealtime.component';
import { AllalbumComponent } from './allalbum/allalbum.component';
import { DetailalbumComponent } from './album/detailalbum/detailalbum.component';
 
export const routes: Routes = [
  //day 1 login and register
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  //day 2 page admin
  { path: 'admin', component: HomeAdminComponent },
  //day 3
  { path: 'adduser', component: AdduserComponent },
  { path: 'edituser/:id', component: EdituserComponent },
  //day 5
  { path: 'menuadmin', component: MenuAdminComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'detailservice/:id', component: DetailserviceComponent },
  { path: 'editservice/:id', component: EditserviceComponent },
  //day 6
  { path: 'addservice', component: AddserviceComponent },

  //day 7
  { path: 'addappointment', component: AddappointmentComponent },
  { path: 'addpet', component: AddpetComponent },
  { path : 'listmypets', component: ListmypetsComponent },
  //day 8 
  { path: 'allappointment', component: AllAppointmentComponent },
  { path: 'detailappointment/:id', component: DetailappointmentComponent },
  //day 10 
  { path: 'detailpet/:id', component: DetailpetComponent },
  { path: 'editpet/:id', component: EditpetComponent },
  { path: 'homedoctor', component: HomedoctorComponent },
  { path: 'allproduct', component: AllproductComponent},
  { path: 'product/:id', component: DetailproductComponent},
   { path: 'admin/products', component: AllproductadminComponent },
 { path: 'admin/addproduct', component: AddproductComponent },
  { path: 'services', component: AllserviceComponent },
 
  //day 11
  {path: 'admin/editproduct/:id', component: EditproductComponent},
   { path: 'addcart', component: AddcartComponent },
 { path: 'allcart', component: AllcartComponent },
 { path: 'addorder', component: AddorderComponent },
 { path: 'myorder', component: MyorderComponent},
 { path: 'detailorder/:id', component: DetailorderComponent},
 { path: 'doctor/orders', component: OrderdoctorComponent },
 //day 14
 { path: 'interface', component: InterfaceuserComponent},
 { path: 'editblog/:id', component: EditblogComponent},
 { path: 'addblog', component: AddblogComponent},
 { path: 'blog', component: BlogComponent},
 { path: 'blog/:id', component : DetailblogComponent},
 { path: 'album', component: AlbumComponent},
 { path: 'editalbum/:id', component: EditalbumComponent},
 { path: 'addalbum', component: AddalbumComponent},
 { path: 'userreview/:id', component: UserreviewComponent},
{ path: 'reviewuser', component: ReviewuserComponent},

 //day 15
  { path: 'about' , component: GioithieuComponent},
  { path: 'contact', component: ContactComponent},
   { path: 'allcontacts' , component: AllcontactComponent},
  { path: 'detailcontact/:id', component: DetailcontactComponent},

  //day 16
  { path: 'revenue', component: RevenueComponent},
  
  // Chat route
  { path: 'chat/chatrealtime', component: ChatrealtimeComponent },
  { path: 'allalbum', component: AllalbumComponent},
  { path: 'album/:id', component: DetailalbumComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
