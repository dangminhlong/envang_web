import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'evtime'
})
export class EvTimePipe implements PipeTransform {
    transform(value: string): string {
        let arPart = value.split("T");
        let ngayPart = arPart[0];
        let timePart = arPart[1];
        let arNgayPart = ngayPart.split("-");
        let arTimePart = timePart.split(":");
        return arNgayPart[2] + "/" + arNgayPart[1] + "/" + arNgayPart[0] + " " + arTimePart[0] + ":" + arTimePart[1];
    }
}

@Pipe({
    name: 'evtimeonly'
})
export class EvTimeOnlyPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return "";
        let gio = value.substr(0, 2);
        let phut = value.substr(2);
        return gio + ":" + phut;
    }
}