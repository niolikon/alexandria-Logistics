import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavigationService } from '../../service/navigation-service.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

  @Input() tooltip?:String;

  @Output() clicked? = new EventEmitter<undefined>();

  constructor(private navigation: NavigationService) { }

  ngOnInit(): void {
  }

  goBack() {
    this.clicked?.emit();
    this.navigation.back();
  }

}
