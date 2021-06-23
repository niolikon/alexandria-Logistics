import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule }  from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProcessHTTPMsgService } from './commons/service/process-httpmsg-service.service';

import { AuthenticationService } from './authentication/service/authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthorizedInterceptor } from './authentication/service/http-authorized-interceptor';
import { HttpUnauthorizedInterceptor } from './authentication/service/http-unauthorized-interceptor';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './logistics/footer/footer.component';
import { HeaderComponent } from './logistics/header/header.component';
import { ProductListComponent } from './logistics/inventory/product-list/product-list.component';
import { ProductDetailComponent } from './logistics/inventory/product-detail/product-detail.component';
import { PersonListComponent } from './logistics/inventory/person-list/person-list.component';
import { PersonDetailComponent } from './logistics/inventory/person-detail/person-detail.component';
import { CompanyListComponent } from './logistics/inventory/company-list/company-list.component';
import { CompanyDetailComponent } from './logistics/inventory/company-detail/company-detail.component';
import { InventoryHomeComponent } from './logistics/inventory/inventory-home/inventory-home.component';
import { HomeComponent } from './logistics/home/home.component';
import { CredentialsService } from './authentication/service/credentials.service';
import { ProductService } from './logistics/inventory/service/product.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ProductListComponent,
    ProductDetailComponent,
    PersonListComponent,
    PersonDetailComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    InventoryHomeComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    ProcessHTTPMsgService,
    AuthenticationService,
    CredentialsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthorizedInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpUnauthorizedInterceptor,
      multi: true
    },
    ProductService
  ],
  entryComponents: [
    HomeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
