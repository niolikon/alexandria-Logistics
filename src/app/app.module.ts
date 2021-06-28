import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule }  from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms'; 
import { NgxFileDropModule } from 'ngx-file-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ProcessHTTPMsgService } from './commons/service/process-httpmsg-service.service';

import { AuthenticationService } from './authentication/service/authentication.service';
import { CredentialsService } from './authentication/service/credentials.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthorizedInterceptor } from './authentication/service/http-authorized-interceptor';
import { HttpUnauthorizedInterceptor } from './authentication/service/http-unauthorized-interceptor';

import { CompanyService } from './logistics/inventory/service/company.service';
import { PersonService } from './logistics/inventory/service/person.service';
import { ProductService } from './logistics/inventory/service/product.service';
import { ImageService } from './logistics/inventory/service/image.service';
import { inventoryBaseURL } from './logistics/inventory/baseurl';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './logistics/footer/footer.component';
import { HeaderComponent } from './logistics/header/header.component';

import { ProductListComponent } from './logistics/inventory/product-list/product-list.component';
import { ProductDetailComponent } from './logistics/inventory/product-detail/product-detail.component';
import { ProductNewComponent } from './logistics/inventory/product-new/product-new.component';

import { PersonListComponent } from './logistics/inventory/person-list/person-list.component';
import { PersonDetailComponent } from './logistics/inventory/person-detail/person-detail.component';
import { PersonNewComponent } from './logistics/inventory/person-new/person-new.component';

import { CompanyListComponent } from './logistics/inventory/company-list/company-list.component';
import { CompanyDetailComponent } from './logistics/inventory/company-detail/company-detail.component';
import { CompanyNewComponent } from './logistics/inventory/company-new/company-new.component';

import { BookListComponent } from './logistics/inventory/book-list/book-list.component';
import { BookDetailComponent } from './logistics/inventory/book-detail/book-detail.component';
import { BookNewComponent } from './logistics/inventory/book-new/book-new.component';

import { InventoryHomeComponent } from './logistics/inventory/inventory-home/inventory-home.component';
import { HomeComponent } from './logistics/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductNewComponent,
    PersonListComponent,
    PersonDetailComponent,
    PersonNewComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    CompanyNewComponent,
    BookListComponent,
    BookDetailComponent,
    BookNewComponent,
    InventoryHomeComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
    MatCardModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxFileDropModule,
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
    CompanyService,
    PersonService,
    ProductService,
    ImageService,
    { 
      provide: 'inventoryBaseURL', 
      useValue: inventoryBaseURL
    },
  ],
  entryComponents: [
    HomeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
