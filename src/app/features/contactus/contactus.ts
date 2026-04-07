import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contactus.html',
  styleUrls: ['./contactus.css']
})
export class Contactus {

  phone = '9597718532';
  email = 'thewoodencastle2020@gmail.com';

  callNow() {
    window.location.href = `tel:${this.phone}`;
  }

  sendMail() {
    window.location.href = `mailto:${this.email}`;
  }
}