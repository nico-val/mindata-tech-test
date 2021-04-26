import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedDialogEntryComponent } from './routed-dialog-entry.component';

describe('RoutedDialogEntryComponent', () => {
  let component: RoutedDialogEntryComponent;
  let fixture: ComponentFixture<RoutedDialogEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutedDialogEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutedDialogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
