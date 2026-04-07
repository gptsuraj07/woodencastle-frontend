import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css'],
})
export class AboutUsComponent implements AfterViewInit {

  gallery = [
    { title: 'Chopping Boards' },
    { title: 'Serving Platters' },
    { title: 'Bakeware' },
    { title: 'Food Styling Props' }
  ];

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${i * 100}ms`;
          el.classList.add('active');
        }
      });
    }, { threshold: 0.2 });

    elements.forEach((el: Element) => observer.observe(el));
  }
}