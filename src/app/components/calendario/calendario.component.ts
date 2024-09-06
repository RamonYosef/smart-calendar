import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionChevronBack, ionChevronForward } from '@ng-icons/ionicons'
import { ButtonsComponent } from "../../shared/buttons/buttons.component";
import { ApiServiceService } from '../../service/api.service.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, NgIconComponent, ButtonsComponent, NgClass],
  viewProviders: [provideIcons({ ionChevronBack, ionChevronForward })],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent {

  dataAtual = new Date();
  diaAtual = new Date();
  clickData = new Date();
  diaFeriado = new Date();
  dataFeriados: any;
  feriado: any;
  name: string = ""

  diasCalendario: any[] = [];




  ngOnInit(): void {
    this.ApiDataFeriados()
    // this.construirCalendario
  }
  constructor(private apiService: ApiServiceService) { }

  ApiDataFeriados(): void {
    this.apiService.getDataFeriados().subscribe({
      next: (data): void => {
        this.dataFeriados = data

        this.dataFeriados.map((index: any) => {
          const teste = new Date(index.date);
          return index.date = teste
        })

        this.clickDay
        this.construirCalendario()


      }, error: (response): void => {

        console.log(response)

      }
    })

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

    this.diasCalendario = this.diasCalendario.map(index => {
      const sla = this.dataFeriados.find((item: any) => index.getDate() === item.date.getDate() + 1 && index.getMonth() === item.date.getMonth())

      return {
        date: index,
        feriado: sla ? sla.name : ''
      }
    })




  }

  alterarMes(offsetMes: number) {
    this.dataAtual.setMonth(this.dataAtual.getMonth() + offsetMes);

    this.clickData = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(),)
    this.clickData.setDate(this.dataAtual.getMonth() === this.diaAtual.getMonth() ? this.diaAtual.getDate() : 1)


    this.dataAtual = new Date(this.dataAtual.getTime());
    this.clickData = new Date(this.clickData.getTime());
    this.construirCalendario();
    this.name = ""
  }

  clickDay(day: number, mes: number) {
    this.clickData.setDate(mes === this.dataAtual.getMonth() ? day : 1)
    this.clickData = new Date(this.clickData.getTime())

    this.feriado = this.dataFeriados.find((index: any) => index.date.getDate() + 1 === this.clickData.getDate() && index.date.getMonth() === mes)

    this.name = this.feriado ? this.feriado.name : ""
  }

  today() {
    this.clickData = new Date(this.diaAtual)
    this.clickData = new Date(this.clickData.getTime())




    this.dataAtual.setMonth(this.diaAtual.getMonth())
    this.dataAtual.setFullYear(this.diaAtual.getFullYear())
    this.dataAtual = new Date(this.dataAtual.getTime())
    this.construirCalendario();
    console.log(this.dataAtual.getDate())

    this.name = ""
  }


  getDayClasses(dia: any): {[key:string]: boolean}{
    return{
      'calendar__moth-late': this.dataAtual.getMonth() !== dia.date.getMonth(),
      'calendar__day-actual': this.diaAtual.getDate() === dia.date.getDate() && this.diaAtual.getMonth() === dia.date.getMonth(),
      'calendar__day-holiday': dia.feriado && this.dataAtual.getMonth() === dia.date.getMonth(),
      'calendar__day-click ': this.clickData.getDate() === dia.date.getDate() &&
                                   this.clickData.getMonth() === dia.date.getMonth() && 
                                   this.clickData.getDate() !== this.diaAtual.getDate()
    }
  }










}
