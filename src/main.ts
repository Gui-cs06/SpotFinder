import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router';

import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// 🔥 Firebase init aqui dentro do main.ts
const firebaseConfig = {
  apiKey: "AIzaSyDHD_O1kStTuqUUuNeXoCnDHfj1Rz1-feE",
  authDomain: "spotfinder-of-gui-and-renan.firebaseapp.com",
  projectId: "spotfinder-of-gui-and-renan",
  storageBucket: "spotfinder-of-gui-and-renan.firebasestorage.app",
  messagingSenderId: "817988248802",
  appId: "1:817988248802:web:e1a6304e33fb8c6bb0aabb"
};

const app = initializeApp(firebaseConfig);

// export global (isso permite usar em qualquer arquivo)
export const db = getFirestore(app);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes)
  ]
});