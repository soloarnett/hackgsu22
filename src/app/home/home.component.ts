import { Component, ElementRef, HostListener, Injectable, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as confetti from 'canvas-confetti';

@Injectable()
class confettiProperties {
  globalOptions?: confetti.GlobalOptions
  options?: confetti.Options
  constructor(
    public canvas?: HTMLCanvasElement,
    globalOptions?: Object,
    options?: Object
  ) {
    this.globalOptions = globalOptions
    this.options = options
  }
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  public animationStarted = false;
  myConfettiInterval: any

  music: HTMLAudioElement = new Audio
  passwordCorrect = false
  playing = false
  showDiscoBall = false
  showFlashes = false
  surpriseEnabled = false
  startedOnce = false
  skipConfirm = true
  bgAudio = {
    enabled: true,
    confirmed: false
  }
  sessionStarted = false
  flashes = [{}, {}, {}, {}, {}, {}, {}, {}]
  confetti: confettiProperties = new confettiProperties

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
  ) {
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    // if(this.startedOnce){
      this.startConfetti()
    // }
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    clearInterval(this.myConfettiInterval)
    this.animationStarted = false
    this.backgroundAudio()
  }

  backgroundAudio() {
    if (this.passwordCorrect) {
      if (this.skipConfirm) {
        this.skipConfirm = false
      } else {

        if (!this.bgAudio.confirmed) {
          const wasPlaying = this.playing
          if(wasPlaying){
            this.toggleMusic('pause')
          }
          this.bgAudio.enabled = confirm('Enable Background Audio?')
          this.bgAudio.confirmed = true
          if (this.bgAudio.enabled) {
            if(wasPlaying){
              this.toggleMusic()
            }
          }else{
            this.toggleMusic('pause')
          }
        }else{
          if (!this.bgAudio.enabled) {
            this.toggleMusic('pause')
          }
        }

      }
    }


  }

  toggleMusic(option?: string) {
    if (this.passwordCorrect) {
      if (this.playing || option == 'pause') {
        this.music.pause()
        this.playing = false
        this.showFlashes = false
        this.showDiscoBall = false
      } else {
        this.music.play()
        this.playing = true
        this.showDiscoBall = true
        this.showFlashes = true
        this.music.onended = () => {
          this.playing = false
          this.showDiscoBall = false
          this.showFlashes = false
        }
      }
    } else {
      this.getMusic()
      let password = prompt('Enter Password')?.toLowerCase()
      if (password == "password" || password == "panther" || password == "panthers") {
        this.passwordCorrect = true
        this.toggleMusic()
      }
    }
  }

  restartMusic() {
    this.music.load()
    this.music.play()
    this.playing = true
    this.showDiscoBall = true
    this.showFlashes = true
  }

  getMusic() {
    this.music = new Audio();
    this.music.src = "http://hackgsu.com/assets/music/OldSkool.mp3";
    this.music.load();
  }

  public startConfetti(): void {
    if (this.animationStarted) {

      if (this.confetti.canvas) {
        const myConfetti = confetti.create(this.confetti.canvas, this.confetti.globalOptions);
        myConfetti(this.confetti.options)
        this.myConfettiInterval = setInterval(() => myConfetti(this.confetti.options), 4000);
      }
    } else {
      this.animationStarted = true
      const canvas: HTMLCanvasElement = this.renderer2.createElement('canvas');
      const globalOptions: confetti.GlobalOptions = {
        resize: true
      }
      const options: confetti.Options = {
        particleCount: 100,
        ticks: 600,
        spread: 200,
        zIndex: 0,
        origin: {
          x: 0.5,
          y: -0.3
        },
        gravity: 0.8,
        colors: ['#0039A6', '#FFFFFF']
      }
      this.renderer2.appendChild(this.elementRef.nativeElement, canvas);
      this.confetti.canvas = canvas
      this.confetti.globalOptions = globalOptions
      this.confetti.options = options
      this.startConfetti()
    }
    this.startedOnce = true
  }

  ngOnInit(): void {
    // this.startConfetti()
  }

}
