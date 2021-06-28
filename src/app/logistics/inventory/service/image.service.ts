import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inventoryBaseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { Image } from '../model/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  addImage(image:File, productId:string): Observable<Image> {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('image', image, image.name);
    
    return this.http.post<Image>(inventoryBaseURL + 'images', formData)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  deleteImage(id: string): Observable<Image> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete<Image>(inventoryBaseURL + 'images/' + id, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
