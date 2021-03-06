import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { iif } from 'rxjs';
import {
  distinct,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs/operators';
import { NoWhitespaceValidator } from 'src/app/shared/validators/whitespace.validator';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  public filterFormControl = this.formBuilder.control(null, [
    NoWhitespaceValidator,
  ]);

  @Output()
  public filterTextChanged = this.filterFormControl.valueChanges.pipe(
    map((filterText) => (this.filterFormControl.valid ? filterText : null)),
    distinctUntilChanged()
  );

  constructor(private formBuilder: FormBuilder) {}
}
