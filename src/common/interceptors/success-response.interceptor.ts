import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class SuccessResponseInterceptor implements NestInterceptor{
    constructor(private dto: any ) {}
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // request Handler가 클라이언트의 요청을 처리하기 전에 실행할 코드를 작성한다
        console.log('Im running before the handler');
        const res = context.switchToHttp().getResponse();
        const status = res.statusCode
        console.log(status < 400);
        
      // response가 전송되기 전에 실행할 코드를 작성한다.
      return handler.handle().pipe(
        // data는 response data가 들어온다.
        map((data: any) => {
            
          return data
        })
      )
    }
  }