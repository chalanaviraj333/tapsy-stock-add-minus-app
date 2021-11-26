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

  public options = {hour: 'numeric',minute: 'numeric' };
  private selectedProduct: any = {};
  public ordersNotUploaded: Array<DisplayItem> = [];
  private updateRemoteQuantityTimer = null;
  private updateRemoteDatabaseHttpTimer = null;

  constructor(
    public allHttpRequestService: HttprequestsService, public localStorageService: AllLocalStorageRequestService, private http: HttpClient, private tts: TextToSpeech
  ) {}

  ngOnInit() {
    this.allHttpRequestService.getAllRemotes();

    Storage.get({ key: 'ordersNotUploaded' }).then((storedData) => {
      if (!storedData || !storedData.value) {
        return;
      }

      const datafromLocalStorage = JSON.parse(storedData.value);
      datafromLocalStorage.forEach((item) => {

          this.ordersNotUploaded.push({
            key: item.key,
            tapsycode: item.tapsycode,
            shell: item.shell,
            boxnumber: item.boxnumber,
            productType: item.productType,
            image: item.image,
            numberofTook: item.numberofTook,
            date: new Date(item.date),
            numberofItemsAvailble: item.numberofItemsAvailble,
          });
      });
    });
  }

  onCLickUpload() {
  }

  sendDataToDatabase() {

    this.ordersNotUploaded.forEach((item) => {
      if (item.productType == 'remote') {
        const currentItem: Remote = this.allHttpRequestService.allProdcuts.find(
          (remote) => remote.key === item.key);

          this.http
          .put(
            `https://tapsystock-a6450-default-rtdb.firebaseio.com/remotes/${currentItem.key}.json`,
            { ...currentItem, key: null }
          )
          .subscribe((resData) => {
            if (resData !== undefined) {
              const index = this.ordersNotUploaded.indexOf(item, 0);
              if (index > -1) {
                this.ordersNotUploaded.splice(index, 1);
                this.localStorageService.setTookArrayToLocalStorage(this.ordersNotUploaded);
              }

              if(this.updateRemoteDatabaseHttpTimer != null) {
                clearTimeout(this.updateRemoteDatabaseHttpTimer);
                this.updateRemoteDatabaseHttpTimer = null;
              }

              this.updateRemoteDatabaseHttpTimer = setTimeout(() => this.allHttpRequestService.getAllRemoteShells(), 100000);

            }
          });


      } else if (item.productType == 'remoteshell'){
        const currentItem: RemoteShell = this.allHttpRequestService.allProdcuts.find(
          (remoteshell) => remoteshell.key === item.key);

          this.http
          .put(
            `https://tapsystock-a6450-default-rtdb.firebaseio.com/remote-shells/${currentItem.key}.json`,
            { ...currentItem, key: null }
          )
          .subscribe((resData) => {
            if (resData !== undefined) {
              const index = this.ordersNotUploaded.indexOf(item, 0);
              if (index > -1) {
                this.ordersNotUploaded.splice(index, 1);
                this.localStorageService.setTookArrayToLocalStorage(this.ordersNotUploaded);
              }

              if(this.updateRemoteDatabaseHttpTimer != null) {
                clearTimeout(this.updateRemoteDatabaseHttpTimer);
                this.updateRemoteDatabaseHttpTimer = null;
              }

              // this.updateRemoteDatabaseHttpTimer = setTimeout(() => this.allHttpRequestService.getAllRemotes(), 100000);
              this.updateRemoteDatabaseHttpTimer = setTimeout(() => this.allHttpRequestService.getAllRemotes(), 10000);

            }
          });


      }
    });

  }


  _ionChangeInput(event) {
    const enteredQRCode: string = event.target.value;

    if(this.updateRemoteQuantityTimer != null) {
      clearTimeout(this.updateRemoteQuantityTimer);
      this.updateRemoteQuantityTimer = null;
    }

    if(this.updateRemoteDatabaseHttpTimer != null) {
      clearTimeout(this.updateRemoteDatabaseHttpTimer);
      this.updateRemoteDatabaseHttpTimer = null;
    }

    this.updateRemoteQuantityTimer = setTimeout(() => this.sendDataToDatabase(), 10000);

    if (enteredQRCode.length > 6) {
      if (enteredQRCode && enteredQRCode.trim() != '') {

        this.selectedProduct = this.allHttpRequestService.allProdcuts.find((i) => i.tapsycode === enteredQRCode);
    }

    }
    else {
      if (enteredQRCode && enteredQRCode.trim() != '') {

        const splitInputArray: Array<string> = enteredQRCode.split(',');
        const shellLetter: string = splitInputArray[0];
        const boxNumber: number = Number(splitInputArray[1]);

        this.selectedProduct = this.allHttpRequestService.allProdcuts.find((i) => i.shell === shellLetter && i.boxnumber === boxNumber);
    }
    }

    if (this.selectedProduct !== undefined && this.selectedProduct.boxnumber !== undefined) {
      this.selectedProduct.qtyavailable = this.selectedProduct.qtyavailable - 1;

      console.log(this.selectedProduct.boxnumber);
      const speckWord: string ="Box " + this.selectedProduct.boxnumber.toString();
        this.tts.speak({
        text: speckWord,
        locale: 'en-GB',
        rate: 1.5})
      .catch((reason: any) => console.log(reason));

    this.ordersNotUploaded.unshift({
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
    this.localStorageService.setTookArrayToLocalStorage(this.ordersNotUploaded);
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

