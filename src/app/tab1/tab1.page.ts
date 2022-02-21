import { Component, OnInit } from '@angular/core';
import { DisplayItem } from '../all-interfaces/display-item';
import { HttprequestsService } from '../all-services/httprequests.service';
import { Storage } from '@capacitor/storage';
import { AllLocalStorageRequestService } from '../all-services/all-local-storage-request.service';
import { Remote } from '../all-interfaces/remote';
import { HttpClient } from '@angular/common/http';
import { RemoteShell } from '../all-interfaces/remote-shell';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  public itemsOrdered: Array<DisplayItem> = [];
  private selectedProduct: any = {};

  constructor(
    public allHttpRequestService: HttprequestsService, public localStorageService: AllLocalStorageRequestService, private http: HttpClient, private tts: TextToSpeech
  ) {}

  ngOnInit() {
    this.allHttpRequestService.getAllRemotes();
  }

  onClickRefresh() {
  }

  sendDataToDatabase() {

  }


  _ionChangeInput(event) {
    const enteredQRCode: string = event.target.value;

    if (enteredQRCode.length > 6) {
      if (enteredQRCode && enteredQRCode.trim() != '') {

        this.selectedProduct = this.allHttpRequestService.allProdcuts.find((i) => i.tapsycode === enteredQRCode);
        console.log(this.selectedProduct);
    }
  } else {
    if (enteredQRCode && enteredQRCode.trim() != '') {

      const splitInputArray: Array<string> = enteredQRCode.split(',');
      const shellLetter: string = splitInputArray[0];
      const boxNumber: number = Number(splitInputArray[1]);

      this.selectedProduct = this.allHttpRequestService.allProdcuts.find((i) => i.shell === shellLetter && i.boxnumber === boxNumber);
      console.log(this.selectedProduct);
    }
    }

    if (this.selectedProduct !== undefined && this.selectedProduct.boxnumber !== undefined) {

      this.allHttpRequestService.findandMinusStock(this.selectedProduct.key, this.selectedProduct.productType);

      this.selectedProduct.qtyavailable = this.selectedProduct.qtyavailable - 1;

      const speckWord: string ="Box " + this.selectedProduct.boxnumber.toString();
        this.tts.speak({
        text: speckWord,
        locale: 'en-GB',
        rate: 1.5})
      .catch((reason: any) => console.log(reason));

    this.itemsOrdered.unshift({
            key: this.selectedProduct.key,
            tapsycode: this.selectedProduct.tapsycode,
            shell: this.selectedProduct.shell,
            boxnumber: this.selectedProduct.boxnumber,
            productType: this.selectedProduct.productType,
            image: this.selectedProduct.image,
            date: new Date(),
            numberofTook: 1,
            numberofItemsAvailble: this.selectedProduct.qtyavailable,
    });
    this.selectedProduct = {};
    event.target.value = '';
    this.localStorageService.setTookArrayToLocalStorage(this.itemsOrdered);
    }
    else {
      if (enteredQRCode && enteredQRCode.trim() != '') {
        const speckWord: string ="Remote not found";
            this.tts.speak({
            text: speckWord,
            locale: 'en-GB',
            rate: 1.5});
        setTimeout(() => event.target.value = '', 1000);
      }
    }
  }

}

