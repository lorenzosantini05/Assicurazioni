import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FintoHrComponent } from 'src/app/comuni/finto-hr/finto-hr.component';
import {  LoginGoogleFinto } from './bottone-login-google-mockup/login-google-mockup.component';
import { TransizioneService } from '../../servizio-transizione.service';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { LoginMicrosoftFinto } from './bottone-login-microsoft-mockup/login-microsoft-mockup.component';

@Component({
  selector: 'LoginFinto',
  templateUrl: './login-mockup.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss', './login-mockup.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, LoginGoogleFinto, FintoHrComponent, InputTextComponent, InputPasswordComponent, LoginMicrosoftFinto],
})
export class LoginFinto implements AfterViewInit{

  constructor(public transizione: TransizioneService, public sinc: SincronizzazioneService){}

  @ViewChild("form")
  formHtml!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login")
  }
}
