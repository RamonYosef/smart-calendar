import { Component } from '@angular/core';
import { CalendarioComponent } from "../../components/calendario/calendario.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalendarioComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
