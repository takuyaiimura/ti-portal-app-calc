import { Component, OnInit } from '@angular/core';
import { OktaSDKAuthService } from 'app/shared/okta/okta-auth-service';
import { OktaConfig } from "app/shared/okta/okta-config";
import {
  OktaAuth,
  OktaAuthOptions,
  TokenManager,
  AccessToken,
  IDToken,
  UserClaims,
  TokenParams
} from '@okta/okta-auth-js'

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {
  private stack: (number | string)[] = [];
  display = '';
  UserLoggedIn: any;
  strWelcome: any;
  strUserSession: any;
  strSan: any;
  strUser: any;
  authService = new OktaAuth(this.oktaSDKAuth.config);

  constructor(private oktaSDKAuth: OktaSDKAuthService, private OktaConfig: OktaConfig) { }

  async ngOnInit() {
    this.display = '0';
    this.stack = ['='];

    this.strUserSession = await this.authService.session.exists()
      .then(function (exists) {
        if (exists) {
          // logged in
          console.log(exists);
          return exists
        } else {
          // not logged in
          //console.log(exists);

          return exists
        }
      });
    switch (this.strUserSession == true) {
      case false:
        console.log(this.OktaConfig.strPostLogoutURL);
        window.location.replace(this.OktaConfig.strPostLogoutURL);

      case true:
        var strSession = this.authService.token.getWithoutPrompt({
          responseType: 'id_token', // or array of types
          sessionToken: 'testSessionToken', // optional if the user has an existing Okta session           
        })
          .then(function (res) {
            var tokens = res.tokens;
            //console.log(res.tokens);
            //console.log(res.state);
            var strUser = tokens.idToken.claims.email;
            //console.log(strUser);
            return tokens.idToken.claims.email;
          })
          .catch(function (err) {
          });
        this.strUser = await this.authService.token.getWithoutPrompt()
        console.log(this.strUser);
        // this.UserID = this.strUser.tokens.idToken.claims.sub;
        this.UserLoggedIn = this.strUser.tokens.idToken.claims.email;
        console.log(this.UserLoggedIn)
        this.strWelcome = 'ようこそ';
        this.strSan = 'さん';

    }
  }

  numberPressed(val: string): void {
    if (typeof this.stack[this.stack.length - 1] !== 'number') {
      this.display = val;
      this.stack.push(parseInt(this.display, 10));
    } else {
      this.display += val;
      this.stack[this.stack.length - 1] = parseInt(this.display, 10);
    }
  }

  operatorPressed(val: string): void {
    const precedenceMap: { [index: string]: any } = { '+': 0, '-': 0, '*': 1, '/': 1 };
    this.ensureNumber();
    const precedence = precedenceMap[val];
    let reduce = true;
    while (reduce) {
      let i = this.stack.length - 1;
      let lastPrecedence = 100;

      while (i >= 0) {
        if (typeof this.stack[i] === 'string') {
          lastPrecedence = precedenceMap[this.stack[i]];
          break;
        }
        i--;
      }
      if (precedence <= lastPrecedence) {
        reduce = this.reduceLast();
      } else {
        reduce = false;
      }
    }

    this.stack.push(val);
  }

  equalPressed(): void {
    this.ensureNumber();
    while (this.reduceLast()) { }
    this.stack.pop();
  }

  percentPressed(): void {
    this.ensureNumber();
    while (this.reduceLast()) { }
    const result = this.stack.pop() as number / 100;
    this.display = result.toString(10);
  }

  acPressed(): void {
    this.stack = ['='];
    this.display = '0';
  }

  cePressed(): void {
    if (typeof this.stack[this.stack.length - 1] === 'number') { this.stack.pop(); }
    this.display = '0';
  }

  private ensureNumber(): void {
    if (typeof this.stack[this.stack.length - 1] === 'string') {
      this.stack.push(parseInt(this.display, 10));
    }
  }

  private reduceLast(): boolean {
    if (this.stack.length < 4) { return false; }
    const num2 = this.stack.pop() as number;
    const op = this.stack.pop() as string;
    const num1 = this.stack.pop() as number;
    let result = num1;
    switch (op) {
      case '+': result = num1 + num2;
        break;
      case '-': result = num1 - num2;
        break;
      case '*': result = num1 * num2;
        break;
      case '/': result = num1 / num2;
        break;
    }
    this.stack.push(result);
    this.display = result.toString(10);
    return true;
  }
}
