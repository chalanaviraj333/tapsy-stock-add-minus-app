import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Remote } from '../all-interfaces/remote';
import { RemoteShell } from '../all-interfaces/remote-shell';

@Injectable({
  providedIn: 'root',
})
export class HttprequestsService {
  public allProdcuts: Array<any> = [];
  private allRemotes: Array<Remote> = [];
  private allRemoteShells: Array<RemoteShell> = [];

  constructor(private http: HttpClient) {}

  // get all remotes from database
  getAllRemotes() {
    this.allProdcuts = [];
    this.allRemotes = [];

    this.http
      .get<{ [key: string]: Remote }>(
        'https://tapsystock-a6450-default-rtdb.firebaseio.com/remotes.json'
      )
      .subscribe((resData) => {
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            this.allRemotes.push({
              key,
              tapsycode: resData[key].tapsycode,
              boxnumber: resData[key].boxnumber,
              shell: resData[key].shell,
              qtyavailable: resData[key].qtyavailable,
              inbuildchip: resData[key].inbuildchip,
              inbuildblade: resData[key].inbuildblade,
              battery: resData[key].battery,
              buttons: resData[key].buttons,
              costperitem: resData[key].costperitem,
              frequency: resData[key].frequency,
              remotetype: resData[key].remotetype,
              productType: resData[key].productType,
              image: resData[key].image,
              notes: resData[key].notes,
              recentAddedQuantity: resData[key].recentAddedQuantity,
              recentmoreStockAddDate: resData[key].recentmoreStockAddDate,
              totalSale: resData[key].totalSale,
              salestillLastStockAdd: resData[key].salestillLastStockAdd,
              compitablecars: resData[key].compitablecars,
              compitablebrands: resData[key].compitablebrands,
            });
          }
        }
        this.allProdcuts = this.allRemotes;
        this.getAllRemoteShells();
      });
  }

  // get remote shells
  getAllRemoteShells() {
    this.allRemoteShells = [];

    this.http
      .get<{ [key: string]: RemoteShell }>(
        "https://tapsystock-a6450-default-rtdb.firebaseio.com/remote-shells.json"
      )
      .subscribe((resData) => {
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
              this.allRemoteShells.push({
                key,
                tapsycode: resData[key].tapsycode,
                boxnumber: resData[key].boxnumber,
                shell: resData[key].shell,
                remotetype: resData[key].remotetype,
                productType: resData[key].productType,
                compitablebrands: resData[key].compitablebrands,
                image: resData[key].image,
                qtyavailable: resData[key].qtyavailable,
                inbuildblade: resData[key].inbuildblade,
                buttons: resData[key].buttons,
                notes: resData[key].notes,
                recentAddedQuantity: resData[key].recentAddedQuantity,
                recentmoreStockAddDate: resData[key].recentmoreStockAddDate,
                totalSale: resData[key].totalSale,
                salestillLastStockAdd: resData[key].salestillLastStockAdd
              });
          }
        }
        this.allProdcuts = this.allProdcuts.concat(this.allRemoteShells);
      });
  }

  findandMinusStock(key: string, productType: string) {
    if (productType == 'remote') {
      this.http
      .get<{ [key: string]: Remote }>(
        'https://tapsystock-a6450-default-rtdb.firebaseio.com/remotes.json'
      )
      .subscribe((resData) => {
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            this.allRemotes.push({
              key,
              tapsycode: resData[key].tapsycode,
              boxnumber: resData[key].boxnumber,
              shell: resData[key].shell,
              qtyavailable: resData[key].qtyavailable,
              inbuildchip: resData[key].inbuildchip,
              inbuildblade: resData[key].inbuildblade,
              battery: resData[key].battery,
              buttons: resData[key].buttons,
              costperitem: resData[key].costperitem,
              frequency: resData[key].frequency,
              remotetype: resData[key].remotetype,
              productType: resData[key].productType,
              image: resData[key].image,
              notes: resData[key].notes,
              recentAddedQuantity: resData[key].recentAddedQuantity,
              recentmoreStockAddDate: resData[key].recentmoreStockAddDate,
              totalSale: resData[key].totalSale,
              salestillLastStockAdd: resData[key].salestillLastStockAdd,
              compitablecars: resData[key].compitablecars,
              compitablebrands: resData[key].compitablebrands,
            });
          }
        }
      });
    }
    else {

    }
  }
}
