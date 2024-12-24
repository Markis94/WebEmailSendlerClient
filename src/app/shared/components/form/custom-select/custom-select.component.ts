import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectComponent implements OnInit {

  @Output() value = new EventEmitter<any>();
  @Input() selectValue:any = null;
  @Input() label:string = "";
  @Input() placeholder: string = "Выберите значение";
  @Input() selectValueList:any = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() lschetItems: boolean = false;
  
  id = 'slc-'+ Math.random();

  constructor() { }

  ngOnInit() {
  }

  changeValue(){
    this.value.emit(this.selectValue);
  }
}