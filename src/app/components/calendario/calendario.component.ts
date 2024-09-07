import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionChevronBack, ionChevronForward } from '@ng-icons/ionicons'
import { bootstrapMoonStarsFill, bootstrapSunFill } from '@ng-icons/bootstrap-icons'
import { ButtonsComponent } from "../../shared/buttons/buttons.component";
import { ApiServiceService } from '../../service/api.service.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, NgIconComponent, ButtonsComponent, NgClass],
  viewProviders: [provideIcons({ ionChevronBack, ionChevronForward, bootstrapMoonStarsFill, bootstrapSunFill })],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent {

  @Input() toggleIcon: string = 'bootstrapSunFill'

  currentDate = new Date();
  today = new Date();
  selectedDate = new Date();
  calendarHolidays: any;
  holiday: any;
  selectedHolidayName: string = ""

  calendarDays: any[] = [];



  constructor(private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.apiHolidayData()
  }

  apiHolidayData(): void {

    this.apiService.getDataFeriados().subscribe({
      next: (data) => {
        this.calendarHolidays = data
        
        this.calendarHolidays.map((index: any) => {
          return index.date = new Date(index.date)
        })

        this.buildCalendar()
        this.clickDay


      }, error: (response): void => {
        console.log(response)
      }
    })
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // primeiro dia da semana
    const firstDayOfTheWeek = 0;
    
    // ultimo dia da semana
    const lastDayOfTheWeek = 6;

    // vai subtraindo -1 ate o primeiro dia da semana
    const dataInicial = new Date(year, month, 1);
    while (dataInicial.getDay() !== firstDayOfTheWeek) {
      dataInicial.setDate(dataInicial.getDate() - 1)
    }

    // vai somando + 1 ate o Ultimo dia da semana
    const dataFinal = new Date(year, month + 1, 0);
    while (dataFinal.getDay() !== lastDayOfTheWeek) {
      dataFinal.setDate(dataFinal.getDate() + 1)
    }

    this.calendarDays = []
    for (
      let data = new Date(dataInicial.getTime());
      data <= dataFinal;
      data.setDate(data.getDate() + 1)
    ) {
      this.calendarDays.push(new Date(data.getTime()));
    }

    this.calendarDays = this.calendarDays.map(index => {
      const holidays = this.calendarHolidays.find((item: any) => 
        index.getDate() === item.date.getDate() + 1 && 
        index.getMonth() === item.date.getMonth()
      )

      return {
        date: index,
        holiday: holidays ? holidays.name : ''
      }
    })

    this.holiday = this.calendarHolidays.find((index: any) => 
    index.date.getDate() + 1 === this.selectedDate.getDate() 
    && index.date.getMonth() === this.selectedDate.getMonth())

    this.selectedHolidayName = this.holiday ? this.holiday.name : ""

    
  }

  // Trocando o Mes
  switchMonth(offsetMes: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offsetMes);
    
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),)
    this.selectedDate.setDate(this.currentDate.getMonth() === this.today.getMonth() ? this.today.getDate() : 1)


    this.currentDate = new Date(this.currentDate.getTime());
    this.selectedDate = new Date(this.selectedDate.getTime());
    this.buildCalendar();
    this.selectedHolidayName = ""
  }

  clickDay(day: number, mes: number) {
    this.selectedDate.setDate(mes === this.currentDate.getMonth() ? day : 1)
    this.selectedDate = new Date(this.selectedDate.getTime())

    this.holiday = this.calendarHolidays.find((index: any) => 
    index.date.getDate() + 1 === this.selectedDate.getDate() && 
    index.date.getMonth() === mes)

    this.selectedHolidayName = this.holiday ? this.holiday.name : ""
  }

  backToday() {
    this.selectedDate = new Date(this.today)
    this.selectedDate = new Date(this.selectedDate.getTime())




    this.currentDate.setMonth(this.today.getMonth())
    this.currentDate.setFullYear(this.today.getFullYear())
    this.currentDate = new Date(this.currentDate.getTime())
    this.buildCalendar();
    console.log(this.currentDate.getDate())

    this.holiday = this.calendarHolidays.find((index: any) => 
    index.date.getDate() + 1 === this.selectedDate.getDate() 
    && index.date.getMonth() === this.selectedDate.getMonth())

    this.selectedHolidayName = this.holiday ? this.holiday.name : ""
  }


  getDayClasses(dia: any): { [key: string]: boolean } {
    return {
      'calendar__moth-late': this.currentDate.getMonth() !== dia.date.getMonth(),
      'calendar__day-actual': this.today.getDate() === dia.date.getDate() && this.today.getMonth() === dia.date.getMonth(),
      'calendar__day-holiday': dia.holiday && this.currentDate.getMonth() === dia.date.getMonth(),
      'calendar__day-click ': this.selectedDate.getDate() === dia.date.getDate() &&
        this.selectedDate.getMonth() === dia.date.getMonth() &&
        this.selectedDate.getDate() !== this.today.getDate()
    }
  }

  SwitchTheme() {
    const theme = document.body.classList.toggle('dark-theme') 
    this.toggleIcon = !theme ? 'bootstrapSunFill' : 'bootstrapMoonStarsFill'
  }
}
