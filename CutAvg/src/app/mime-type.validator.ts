import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimeType = (control: AbstractControl): any | Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File
  const fileReader = new FileReader()
  const frObs = new Observable((observer: Observer<{ [key: string]: any } | null>) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = ""
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16)
      }
      //console.log(header)
      let isValid = false
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
          isValid = true;
          break;
        case "ffd8ffe1":
          isValid = true;
          break;
        case "ffd8ffe2":
          isValid = true;
          break;
        case "ffd8ffe3":
          isValid = true;
          break;
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {

        observer.next(null)

      }
      else {

        observer.next({ invalidMimeType: true });
      }
      observer.complete()
    });
    fileReader.readAsArrayBuffer(file)
  })
  return frObs
}
