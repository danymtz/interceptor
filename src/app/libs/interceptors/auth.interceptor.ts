import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, concatMap, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import StorageHelper from '../helpers/storage.helper';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private apiService: ApiService, private dataService: DataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request);
    if (request.url.includes("/mirror/")){
      console.log(StorageHelper.getItem('session'));
      let originalRequest = request;
      request = request.clone({
          setHeaders: {
            Authorization: 'Bearer '+StorageHelper.getItem('session').token
          }
        })
        return next.handle(request).pipe(
          catchError( (err:any) => {
            console.log('catch error',err);
            if (err instanceof HttpErrorResponse && err.status === 401){
              console.log('in response error');
              return this.expiredHandler(originalRequest, next)
            }
            return throwError(()=> err)
          })
        )
      }
    return next.handle(request)
  }

  private expiredHandler (originalRequest: HttpRequest<unknown>, next:HttpHandler){
    return this.apiService.refreshToken().pipe(
      switchMap((resp:any)=>{
        StorageHelper.setItem('session',resp)
        originalRequest = originalRequest?.clone({
          setHeaders: {
            Authorization: 'Bearer '+StorageHelper.getItem('session').token
          }
        })
        return next.handle(originalRequest);
      })
    )
  }
}
