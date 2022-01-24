import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';

import { ViewChild, AfterViewInit } from '@angular/core';
import {OktaSDKAuthService} from 'app/shared/okta/okta-auth-service';
import {AuthService} from 'app/shared/okta/okta-authentication';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

declare const OktaMFA: any;
declare const RemoveMFAWidget: any;



@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})


export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    public Userfullname: any;

    
    
    constructor(public location: Location, private element : ElementRef,public _matdialog: MatDialog,private OktaAuth: AuthService, private OktaAuthClient : OktaSDKAuthService,private router: Router) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        
                

    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
        if( titlee === '/home' ) {
            return true;
        }
        else {
            return false;
        }
    }

    
    // //////////////////
          // Widget Login
    // //////////////////
    // widgetModal() {
    //     const WidgetDialogConfig = new MatDialogConfig();
    //     this.sidebarClose();

    
    //     // 表示するdialogの設定
    //     WidgetDialogConfig.disableClose = true;
    //     WidgetDialogConfig.id = "widget-modal-component";
    //     WidgetDialogConfig.height = "600px";
    //     WidgetDialogConfig.width = "450px";
        
    
    //     const modalDialog = this._matdialog.open(WidgetModalComponent, WidgetDialogConfig);
    //   }
  
    
 
    ProfilePage(){
        // this.router.navigate(['https://kent-nagao-test.oktapreview.com/home/kent-nagao-test_angulartest_3/0oa1bn5842y4SaRrA1d7/aln1bn8srsqNf0zLq1d7']);
        OktaMFA();


    }

    isDocumentation() {
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
        if( titlee === '/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    OktaLogout(){
        // this.OktaAuthClient.OktaSDKAuthClient.signOut();
        this.OktaAuth.OktaLogout();
        // document.getElementById("welcomeText").innerHTML = " "
        }
}



