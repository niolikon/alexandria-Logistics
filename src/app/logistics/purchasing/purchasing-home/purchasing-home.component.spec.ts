import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingHomeComponent } from './purchasing-home.component';

describe('PurchasingHomeComponent', () => {
  let component: PurchasingHomeComponent;
  let fixture: ComponentFixture<PurchasingHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasingHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
