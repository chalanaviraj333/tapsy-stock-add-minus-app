import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { DisplayItem } from '../all-interfaces/display-item';

@Injectable({
  providedIn: 'root'
})
export class AllLocalStorageRequestService {

  public ordersNotUploaded: Array<DisplayItem> = [];

  constructor() { }

  // get daily list from local storage
  getDailySaleList() {
    Storage.get({ key: 'dailyItemArray' }).then((storedData) => {
      if (!storedData || !storedData.value) {
        return;
      }

      const datafromLocalStorage = JSON.parse(storedData.value);
      const currentDate: number = new Date().getDate() - 2;

      datafromLocalStorage.forEach((item) => {
        const itemDate: number = new Date(item.date).getDate();

        if (itemDate < currentDate) {
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
        }
      });
    });
  }

  // send not uploaded order item array to database
  setTookArrayToLocalStorage(ordersNotUploaded: Array<DisplayItem>) {
    const data = JSON.stringify(ordersNotUploaded);
    Storage.set({
      key: 'ordersNotUploaded',
      value: data,
    });
  }
}
