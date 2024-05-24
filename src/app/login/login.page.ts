import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransizioneService } from './servizio-transizione.service';
import { LoginFinto } from './login/mockup/login-mockup.component';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RecuperoCredenzialiFinto } from './recupero-credenziali/mockup/recupero-credenziali-mockup.component';
import { ResetPasswordFinto } from './reset-password/mockup/reset-password-form-mockup.component';
import { PlatformLocation } from '@angular/common'
import { CambioPasswordFinto } from './cambio-password/mockup/cambio-password.component';
import { BarraLoaderComponent } from '../comuni/barra-loader/barra-loader.component';
import { VerificaFintoComponent } from './verifica/mockup/verifica-mockup.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecuperoCredenzialiFinto, LoginFinto, ResetPasswordFinto, CambioPasswordFinto, BarraLoaderComponent, VerificaFintoComponent]
})
export class LoginPage implements OnInit, AfterViewInit {

  constructor(
    public transizione: TransizioneService, 
    private router : Router, 
    location: PlatformLocation
  ){
    location.onPopState(() => window.location.reload());
  }
  
  @ViewChild("main")
  main!: ElementRef<HTMLElement>;


  @ViewChild("overlay")
  overlay!: ElementRef<HTMLElement>;
  
  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if(e instanceof NavigationStart )
      { 
        this.transizione.ultimaRoute = this.router.url;
      }
      else if(e instanceof NavigationEnd && this.transizione.inTransizione)
      {
        this.transizione.routeAttuale = this.router.url;
        this.transizione.MostraOverlay();
      }
    })
  }

  ngAfterViewInit(): void {
    this.transizione.main = this.main.nativeElement;
    this.transizione.overlay = this.overlay.nativeElement;
  }
}
