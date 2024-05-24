import { Injectable } from '@angular/core';
import { RimuoviParametri } from '../utils/funzioni';

@Injectable({
  providedIn: 'root'
})
export class TransizioneService {

  public formFinti : {[key : string] : HTMLElement} = {};
  public formVeri : {[key : string] : HTMLElement} = {};
  
  public main?: HTMLElement;
  public overlay?: HTMLElement;

  public inTransizione:boolean = false;
  private ultimaRoutePagina?: string;
  private routeAttualePagina?: string;

  public caricamento: boolean = false;

  AggiungiForm(form : HTMLElement, route : string){
    this.formFinti[route] = form;
  }

  public get ultimaRoute() : string | undefined{
    return this.ultimaRoutePagina;
  }
  public get routeAttuale() : string | undefined{
    return this.routeAttualePagina;
  }

  public set ultimaRoute(route: string){
    this.ultimaRoutePagina = RimuoviParametri(route)
  }

  
  public set routeAttuale(route: string){
    this.routeAttualePagina = RimuoviParametri(route)
  }

  private CalcolaWidth(route : string){
    const form = this.formFinti[route];

    const figli = Array.from(form.children);
    
    figli.forEach((c) => c.classList.add("controlla-width"))
    
    const w = figli
    .filter((c) => !(c.classList.contains("invisibile")))
    .map((c) => c.clientWidth)

    figli.forEach((c) => c.classList.remove("controlla-width"))

    const padding = parseFloat(getComputedStyle(form).paddingInline);

    return Math.max(...w) + padding * 2 + "px";
  }

  TransizioneUscita(form : HTMLElement, route : string){
    if(!this.main) return;
    this.inTransizione =  true;

    const wIniziale = getComputedStyle(form).width;
    const w = this.CalcolaWidth(route);

    this.CambiaWidthForm(wIniziale, w, form)
    
  }

  CambiaWidthForm(iniziale: string, finale: string, form: HTMLElement){
    if(!this.main) return;
    this.main.style.setProperty("--max-width", iniziale)
    form.style.setProperty("--max-width", iniziale)

    this.main.classList.add("transizione")
    form.classList.add("transizione")
    
    setTimeout(() => {
      form.style.setProperty("--max-width", finale)
      this.main?.style.setProperty("--max-width", finale)
    }, 1);
  }

  MostraOverlay(){
    if(!this.overlay || !this.ultimaRoutePagina || !this.routeAttualePagina) return;
    
    const formPrec = this.formFinti[this.ultimaRoutePagina]
    const formAtt = this.formVeri[this.routeAttualePagina]
    
    formPrec.classList.add("mostra")
    this.overlay.classList.add("visibile")
    if(!this.ControllaLogo(formAtt)){
      setTimeout(() => {
        this.MostraOverlay();
      }, 0)
      return;
    }
    
    this.MuoviLogo(formPrec, formAtt);
    this.NascondiFigli(formPrec);
    this.NascondiFigli(formAtt, false)

    setTimeout(() => {
      this.overlay?.classList.remove("visibile")
      
      this.MostraFigli(formAtt)
      this.ResettaForm(formPrec) 
      
      setTimeout(() => {
        this.inTransizione = false;
        formAtt.querySelectorAll("*").forEach((c) => c.classList.remove("transizione"))
      }, 500);
    }, 500);
  }

  ResettaForm(form : HTMLElement){
    form.classList.remove("mostra")

    this.MostraFigli(form, false)
    
    Object.values(this.formVeri).forEach((f) => {
      f.style.setProperty("--max-width", null)
    })

    const logo = form.querySelector(".logo") as HTMLElement
    if(!logo)return;
    logo.style.setProperty("--y", "0")
  }

  NascondiFigli(form :  HTMLElement, transizione = true){
    const f = Array.from(form.querySelectorAll(":not(.logo)")).map((c) => c as HTMLElement)

    if(transizione)
    {
      f.forEach((c) => c.classList.add("transizione"))
    }
    else f.forEach((c) => c.classList.remove("transizione"))
    f.forEach((c) => c.classList.add("nascosto"))
  }

  MostraFigli(form :  HTMLElement, transizione = true){
    const f = Array.from(form.querySelectorAll(":not(.logo)")).map((c) => c as HTMLElement)

    if(transizione){
      f.forEach((c) => c.classList.add("transizione"))
    }
    else f.forEach((c) => c.classList.remove("transizione"))
    f.forEach((c) => c.classList.remove("nascosto"))
  }

  MuoviLogo(prec: HTMLElement, att: HTMLElement){
    const logoPrec = prec.querySelector(".logo")! as HTMLElement
    const logoAtt = att.querySelector(".logo")! as HTMLElement
    
    att.classList.add("misura")
    const [xPrec, yPrec] = this.CalcolaCoordinate(logoPrec)
    const [xAtt, yAtt] = this.CalcolaCoordinate(logoAtt)
    att.classList.remove("misura")

    const yDiff = yAtt - yPrec;

    logoPrec.style.setProperty("--y", `${yDiff}px`)
    logoPrec.classList.add("transizione")
  }

  ControllaLogo(f : HTMLElement){
    return !!f.querySelector(".logo")?.getBoundingClientRect().top
  }

  CalcolaCoordinate(logo: HTMLElement){
    const r = logo.getBoundingClientRect()
    return [r.left, r.top]
  }

  NascondiOverlay(){
    if(!this.overlay || !this.ultimaRoutePagina) return;

    const form = this.formFinti[this.ultimaRoutePagina]
    form.classList.remove("mostra")
    this.overlay.classList.remove("visibile")
  }

}
