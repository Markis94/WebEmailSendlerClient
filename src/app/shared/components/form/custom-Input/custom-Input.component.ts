import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef, model } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';

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
    standalone: false
})
export class CustomInputComponent implements OnInit {

  inputValue = model<string | number | null>(null);
  show: boolean = false;
  @Input() password: boolean = false;
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
  
  constructor() { }
  
  ngOnInit() {
    if(this.type == "email" && this.pattern == ""){
      this.pattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$";
    }
  }
}
