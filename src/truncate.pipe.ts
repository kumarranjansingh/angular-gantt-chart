import {Pipe, PipeTransform} from '@angular/core'
@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, args:any[]) : string {
    let limit = arguments.length > 0 ? parseInt(arguments[1]) : 10;
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
