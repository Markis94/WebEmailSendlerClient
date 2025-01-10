import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef, model } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';

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
    standalone: false
})

export class CustomTextareaComponent implements OnInit {

  inputValue = model("");
  @Input() label:string = "";
  @Input() required: boolean = false;
  @Input() disabled = false;
  @Input() placeholder: string = "";
  @Input() minlength:number = 0;
  @Input() maxlength:number = 500;

  id = 'tarea-'+ Math.random();
  
  constructor(
    ) { 
    }

  ngOnInit() {
  }
}
