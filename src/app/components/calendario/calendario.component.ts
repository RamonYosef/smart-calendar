import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionChevronBack, ionChevronForward } from '@ng-icons/ionicons'
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, NgIconComponent],
  viewProviders: [provideIcons({ ionChevronBack, ionChevronForward })],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent {
  dataAtual = new Date();
  diasCalendario: Date[] = [];


  ngOnInit(): void {
    this.construirCalendario()
  }

  construirCalendario(): void {
    const ano = this.dataAtual.getFullYear();
    const mes = this.dataAtual.getMonth();


    const primeiroDiaDaSemana = 0;
    const UltimoDiaDaSemana = 6;

    // vai subtraindo -1 ate o primeiro dia da semana
    const dataInicial = new Date(ano, mes, 1);
    while (dataInicial.getDay() !== primeiroDiaDaSemana) {
      dataInicial.setDate(dataInicial.getDate() - 1)
    }

    // vai somando + 1 ate o Ultimo dia da semana
    const dataFinal = new Date(ano, mes + 1, 0);
    while (dataFinal.getDay() !== UltimoDiaDaSemana) {
      dataFinal.setDate(dataFinal.getDate() + 1)
    }

    this.diasCalendario = []
    for (
      let data = new Date(dataInicial.getTime());
      data <= dataFinal;
      data.setDate(data.getDate() + 1)
    ) {
      this.diasCalendario.push(new Date(data.getTime()));
    }

  }

  alterarMes(offsetMes: number) {
    this.dataAtual.setMonth(this.dataAtual.getMonth() + offsetMes);

    this.dataAtual = new Date(this.dataAtual.getTime());
    this.construirCalendario();
  }


  


}
