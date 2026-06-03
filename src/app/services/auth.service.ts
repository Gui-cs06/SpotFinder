import { Injectable } from '@angular/core';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';

import { db } from '../../main';

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private USERS_COLLECTION = 'users';
  private LOGGED_USER_ID_KEY = 'loggedUserId';

  constructor() { }


  async register(user: User): Promise<boolean> {

    const usersRef = collection(db, this.USERS_COLLECTION);

    const emailQuery = query(
      usersRef,
      where('email', '==', user.email)
    );

    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      return false;
    }

    await addDoc(usersRef, {
      name: user.name,
      email: user.email,
      password: user.password
    });

    return true;
  }


  async login(email: string, password: string): Promise<boolean> {

    const usersRef = collection(db, this.USERS_COLLECTION);

    const loginQuery = query(
      usersRef,
      where('email', '==', email),
      where('password', '==', password)
    );

    const querySnapshot = await getDocs(loginQuery);

    if (querySnapshot.empty) {
      return false;
    }

    const userDoc = querySnapshot.docs[0];

    localStorage.setItem(
      this.LOGGED_USER_ID_KEY,
      userDoc.id
    );

    return true;
  }


  logout() {
    localStorage.removeItem(this.LOGGED_USER_ID_KEY);
  }


  getLoggedUserId(): string | null {
    return localStorage.getItem(this.LOGGED_USER_ID_KEY);
  }


  isLoggedIn(): boolean {
    return !!this.getLoggedUserId();
  }


  async getLoggedUser(): Promise<User | null> {

    const loggedUserId = this.getLoggedUserId();

    if (!loggedUserId) {
      return null;
    }

    return await this.getUserById(loggedUserId);
  }


  async getUserById(id: string): Promise<User | null> {

    const userRef = doc(db, this.USERS_COLLECTION, id);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return {
      id: userSnap.id,
      ...userSnap.data()
    } as User;
  }


  async getUsers(): Promise<User[]> {

    const usersRef = collection(db, this.USERS_COLLECTION);

    const querySnapshot = await getDocs(usersRef);

    return querySnapshot.docs.map(userDoc => {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User;
    });

  }

}