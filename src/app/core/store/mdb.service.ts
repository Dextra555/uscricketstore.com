import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StyleLoaderService {
  loadStyle(href: string): void {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = href;
    document.head.appendChild(linkElement);
  }
}
