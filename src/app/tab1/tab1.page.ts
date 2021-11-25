import { Component, OnInit } from '@angular/core';
import { DisplayItem } from '../all-interfaces/display-item';
import { HttprequestsService } from '../all-services/httprequests.service';
import { Storage } from '@capacitor/storage';
import { AllLocalStorageRequestService } from '../all-services/all-local-storage-request.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  public options = {hour: 'numeric',minute: 'numeric' };
  private selectedProduct: any = {};
  public ordersNotUploaded: Array<DisplayItem> = [];
  private timerUpdateProductQuantityHttpRequest = null;
  private timerRefreshAllProductHttpRequest = null;
  private timerUpdateOrderArrayHttpRequest = null;

  constructor(
    public allHttpRequestService: HttprequestsService, public localStorageService: AllLocalStorageRequestService
  ) {}

  ngOnInit() {
    this.allHttpRequestService.getAllRemotes();

    Storage.get({ key: 'dailyItemArray' }).then((storedData) => {
      if (!storedData || !storedData.value) {
        return;
      }

      const datafromLocalStorage = JSON.parse(storedData.value);
      datafromLocalStorage.forEach((item) => {

          this.ordersNotUploaded.push({
            key: null,
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
  _ionChangeInput(event) {
    const enteredQRCode: string = event.target.value;

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
      //   this.tts.speak({
      //   text: speckWord,
      //   locale: 'en-GB',
      //   rate: 1.5})
      // .catch((reason: any) => console.log(reason));

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
      const speckWord: string ="Remote not found";
    //         this.tts.speak({
    //         text: speckWord,
    //         locale: 'en-GB',
    //         rate: 1.5});
    //     setTimeout(() => event.target.value = '', 1000);
    event.target.value = '';
    }
  }


}

// let searchItemArray: Array<any> = [];
// const shellAndBox: string = shellLetter + boxNumber.toString();

// searchItemArray = this.allHttpRequestService.allProdcuts.filter((product) => {
//   let searchWord = product.shell + product.boxnumber.toString();
//   return (
//     searchWord.toLowerCase().indexOf(shellAndBox.toLowerCase()) > -1
//   );
// });
// console.log(searchItemArray);
