import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AsyncPipe } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-no-access",
  templateUrl: "./no-access.component.html",
  imports: [AsyncPipe, TranslatePipe],
  standalone: true
})
export class NoAccessComponent {
  imageSrc: string = "assets/images/no-access.svg";
  authService = inject(AuthService);
  public router = inject(Router);
}
