import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { catchError, concatMap, map, Observable, of, tap, throwError } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private apiService: ApiService, private dataService: DataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request);
    if (request.url.includes("/mirror/")){
      
      return next.handle(request).pipe(
        concatMap ((respOriginal) => {
          console.log("concatmap:",respOriginal)

          if (respOriginal instanceof HttpResponse){
            return this.apiService.checkStatus().pipe(
              map (resp=> respOriginal),
              catchError(err => {
                //console.log(err);
                if(err.status === 403){
                  return throwError(()=>err)
                }
                return of(err)
              }),
              map (() => respOriginal)
            )
          }  
          return of(respOriginal)
        }),
        catchError(err => {
          console.log(err);
          
          if (err.status === 403){
            return this.apiService.refreshToken().pipe(
              concatMap((resp: any) => {
                return throwError(()=> resp)
                /* this.dataService.session$.next({
                  username: this.apiService.getSession('username'),
                  token: resp.token
                })
                return this.apiService.searchPokemom('ditto') */
              })
            );
          }
          return of (err)
        })
      );
    }
    return next.handle(request)
  }
}
