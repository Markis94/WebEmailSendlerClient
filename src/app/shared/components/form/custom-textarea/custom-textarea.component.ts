import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { noop } from 'rxjs';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.css'],

  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CustomTextareaComponent implements OnInit {

  @Output() value = new EventEmitter<string>();
  @Input() inputValue = "";
  @Input() lable:string = "";
  @Input() required: boolean = false;
  @Input() disabled = false;
  @Input() placeholder: string = "";
  @Input() minlength:number = 0;
  @Input() maxlength:number = 1000;

  id = 'tarea-'+ Math.random();
  
  constructor(
    ) { 
    }

  ngOnInit() {
  }

  onChange(value: string){
    this.value.emit(value);
  } 
  
  onTouch: () => void = noop;

  registerOnChange(fn: (temp: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  writeValue(temp: string): void {
    this.inputValue = temp ? temp : "";
  }

}
