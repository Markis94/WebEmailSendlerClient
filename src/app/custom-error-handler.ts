import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, inject, Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class CustomErrorHandler implements ErrorHandler {
  constructor() {}
  private snackBar = inject(MatSnackBar);
  durationInSeconds = 6;
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";

  handleError(error: unknown) {
    let defaultError = "Произошла ошибка!";
    let errorText = "";
    console.warn(error);
    if (error instanceof HttpErrorResponse) {
      errorText = error?.error?.error ?? defaultError;
    }

    if (error instanceof CustomError) {
      errorText = error?.message ?? defaultError;
    }

    if (error instanceof Error) {
      errorText = error?.message ?? defaultError;
    }

    if (errorText) {
      this.snackBar.open(errorText, "закрыть", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000,
      });
    }
  }
}

export class CustomError extends Error {}
