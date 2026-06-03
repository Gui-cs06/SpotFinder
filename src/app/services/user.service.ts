import { Injectable } from '@angular/core';

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

import { db } from '../../main';

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private USERS_COLLECTION = 'users';
  private LOGGED_USER_ID_KEY = 'loggedUserId';

  constructor() { }


  getLoggedUserId(): string | null {
    return localStorage.getItem(this.LOGGED_USER_ID_KEY);
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


  async findLoggedUser(): Promise<User | null> {

    const loggedUserId = this.getLoggedUserId();

    if (!loggedUserId) {
      return null;
    }

    const userRef = doc(db, this.USERS_COLLECTION, loggedUserId);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return {
      id: userSnap.id,
      ...userSnap.data()
    } as User;

  }


  async updateUser(name: string, email: string): Promise<boolean> {

    const loggedUserId = this.getLoggedUserId();

    if (!loggedUserId) {
      return false;
    }

    const userRef = doc(db, this.USERS_COLLECTION, loggedUserId);

    await updateDoc(userRef, {
      name,
      email
    });

    return true;
  }


  async updatePassword(newPassword: string): Promise<boolean> {

    const loggedUserId = this.getLoggedUserId();

    if (!loggedUserId) {
      return false;
    }

    const userRef = doc(db, this.USERS_COLLECTION, loggedUserId);

    await updateDoc(userRef, {
      password: newPassword
    });

    return true;
  }


  async emailAlreadyExistsForAnotherUser(email: string): Promise<boolean> {

    const loggedUserId = this.getLoggedUserId();

    const usersRef = collection(db, this.USERS_COLLECTION);

    const emailQuery = query(
      usersRef,
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      return false;
    }

    const userWithThisEmail = querySnapshot.docs[0];

    return userWithThisEmail.id !== loggedUserId;
  }

}