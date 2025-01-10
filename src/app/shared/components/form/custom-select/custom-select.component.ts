import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef, model } from '@angular/core';
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
    standalone: false
})
export class CustomSelectComponent implements OnInit {
  selectValue = model<any>(null);
  @Input() label:string = "";
  @Input() placeholder: string = "Выберите значение";
  @Input() selectValueList:any = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() key: string = "";
  
  id = 'slc-'+ Math.random();

  constructor() { }

  ngOnInit() {
  }
}