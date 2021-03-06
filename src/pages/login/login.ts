// 3d party imports
import { Component } from '@angular/core';
import { NavController, Platform, ToastController, NavParams, ViewController, Events, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// app imports
import { TabsPage, SignupPage } from '../';
import { AuthService, ConnectionService } from '../../services';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  previousLoginMethod: string;
  isWeb: boolean;
  login: {email?: string, password?: string} = {};
  submitted = false;
  isConnected: boolean;

  constructor(private platform: Platform,
              private navParams: NavParams,
              private authService: AuthService,
              private connectionService: ConnectionService,
              private storage: Storage,
              private viewCtrl: ViewController,
              private toastCtrl: ToastController,
              private navCtrl: NavController,
              private app: App,
              private events: Events) {

    this.getPreviousLoginMethod();
    this.isWeb = this.platform.is('mobileweb');

    if (navParams.data.email) {
      this.login.email = navParams.data.email;
    }

    this.authService.rpCurrentUser$.subscribe(() => {
      this.viewCtrl.dismiss();
    });

    this.connectionService.connection$.subscribe((isConnected: boolean) => {
      this.isConnected = isConnected;
    });

  }

  ionViewDidEnter() {
    this.app.setTitle('Login - NG-BE 2016');
    this.events.publish("navController:current", this.navCtrl);
  }

  signInWithFacebook(): void {
    this.authService.signInWithFacebook()
      .then(() => this.postSignIn());
  }

  signInWithGithub(): void {
    this.authService.signInWithGithub()
      .then(() => this.postSignIn());
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
      .then(() => this.postSignIn());
  }

  signInWithTwitter(): void {
    this.authService.signInWithTwitter()
      .then(() => this.postSignIn());
  }

  postSignIn(): void {
    this.navCtrl.push(TabsPage);
  }

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {

      let data = {
        email: form.controls.email.value,
        password: form.controls.password.value
      };
      this.authService.loginEmailPassword(data).then(
        (res) => {
          this.viewCtrl.dismiss();
        },
        (err) => {
          let toast = this.toastCtrl.create({
            message: err.message,
            showCloseButton: true,
            closeButtonText: 'close',
            duration: 5000
          });
          toast.present();
        }
      );

    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  private getPreviousLoginMethod() {
    this.storage.get('previousLoginMethod').then((previousLoginMethod) => {
      this.previousLoginMethod = previousLoginMethod;
    });
  }

}
