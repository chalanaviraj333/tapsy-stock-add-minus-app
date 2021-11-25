import { Component, OnInit } from '@angular/core';
import { AllLocalStorageRequestService } from '../all-services/all-local-storage-request.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  public dayoptions = {weekday: 'long'};
  public options = {month: 'long',day: 'numeric'};
  public timeOption = {hour: 'numeric',minute: 'numeric'};

  constructor(public localStorageService: AllLocalStorageRequestService) {}

  ngOnInit() {
    this.localStorageService.getDailySaleList();
  }

}
