import { Component } from '@angular/core';


import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import {
  arrowBackOutline,
  codeSlashOutline,
  logoGithub,
  logoLinkedin,
  mailOutline,
  heart,
  personOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon
]
})
export class AboutPage {

  developers = [
    {
      name: 'Gui Cabral',
      role: 'Desenvolvedor Frontend',
      avatar: 'GC',
      description: 'Responsável pela interface e experiência do usuário.',
  
      github: 'https://github.com/Gui-cs06',
      linkedin: 'https://linkedin.com/in/seuLinkedin',
      email: 'mailto:csgui151006@gmail.com'
    },
  
    {
      name: 'Renan Domingues',
      role: 'Desenvolvedor Backend',
      avatar: 'RD',
      description: 'Responsável pela lógica e integração do sistema.',
  
      github: 'https://github.com/RenanDevDomingues',
      linkedin: 'https://linkedin.com/in/',
      email: 'mailto:renandominguesdev@gmail.com'
    }
  ];

  technologies = [
    {
      name: 'Ionic',
      type: 'Framework'
    },
    {
      name: 'Angular',
      type: 'Frontend'
    },
    {
      name: 'TypeScript',
      type: 'Linguagem'
    },
    {
      name: 'SCSS',
      type: 'Estilização'
    }
  ];

  constructor(private router: Router) {

    addIcons({
      arrowBackOutline,
      codeSlashOutline,
      logoGithub,
      logoLinkedin,
      mailOutline,
      heart,
      personOutline
    });

  }

  goBack() {
    this.router.navigate(['/profile']);
  }

}