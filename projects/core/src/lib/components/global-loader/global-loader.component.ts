import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {LoaderService} from "../../services";

@Component({
  selector: "global-loader",
  templateUrl: "./global-loader.component.html",
  styleUrls: ["./global-loader.component.scss"],
  standalone: true,
  imports: [AsyncPipe, NgClass, TranslatePipe]
})
export class GlobalLoaderComponent {
  @Input() color: string;
  constructor(public loaderService: LoaderService) {}
}
