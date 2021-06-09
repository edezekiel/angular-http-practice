import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = req.clone();
    console.log('Outgoing Request', modifiedRequest.url);
    
    return next.handle(modifiedRequest).pipe(tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log('Incoming Response');
        console.log(event.body);
      }
    }));
  }
}