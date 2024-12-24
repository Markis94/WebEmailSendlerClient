import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { noop } from 'rxjs/internal/util/noop';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {

  @Output() value = new EventEmitter<any>();
  @Input() inputValue = "";
  @Input() label:string = "";
  @Input() required: boolean = false;
  @Input() disabled = false;
  @Input() placeholder: string = "";
  @Input() minlength:number = 0;
  @Input() maxlength:number = 256;
  @Input() min:number = -256;
  @Input() max:number = 256;
  @Input() type:string = "text";
  @Input() autocomplete:string ="off";
  @Input() pattern:string = "";
  @Input() patternMessage:string ="Поле содержит недопустимые символы!";

  id = 'input-'+ Math.random();
  
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
