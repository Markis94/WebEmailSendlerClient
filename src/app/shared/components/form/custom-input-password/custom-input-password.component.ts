import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef
} from "@angular/core";
import { ControlContainer, NG_VALUE_ACCESSOR, NgForm } from "@angular/forms";
import { noop } from "rxjs/internal/util/noop";

@Component({
  selector: "app-custom-input-password",
  templateUrl: "./custom-input-password.component.html",
  styleUrls: ["./custom-input-password.component.css"],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputPasswordComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputPasswordComponent implements OnInit, AfterViewInit {
  @Output() value = new EventEmitter<any>();
  @Input() inputValue = "";
  @Input() disabled: boolean = false;
  @Input() label: string = "";
  @Input() required: boolean = true;
  @Input() placeholder: string = "";
  @Input() pattern: string = "";
  @Input() onpasteDisable: boolean = false;
  @Input() patternMessage: string = "Поле содержит недопустимые символы!";
  show: boolean = false;
  id = "input-" + Math.random();
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.onpasteDisable) {
      const element = document.getElementById(this.id);
      element!.onpaste = (e) => {
        e.preventDefault();
        return false;
      };
      element!.oncopy = (e) => {
        e.preventDefault();
        return false;
      };
    }
  }

  onChange(value: string) {
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
