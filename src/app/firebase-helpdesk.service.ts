import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { deleteDoc, doc, Firestore, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { environment } from '../environments/environment';

interface StoredValue {
  value: string;
  updatedAt?: unknown;
}

@Injectable({ providedIn: 'root' })
export class FirebaseHelpdeskService {
  private readonly app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(environment.firebase);
  private readonly db: Firestore = getFirestore(this.app);

  async getItem(key: string): Promise<string | null> {
    const localValue = localStorage.getItem(key);

    try {
      const snapshot = await getDoc(doc(this.db, environment.helpdeskCollection, key));
      if (snapshot.exists()) {
        const data = snapshot.data() as StoredValue;
        if (typeof data.value === 'string') {
          localStorage.setItem(key, data.value);
          return data.value;
        }
      }

      if (localValue !== null) {
        this.setItem(key, localValue);
        return localValue;
      }

      return null;
    } catch (error) {
      console.error('Error leyendo Firebase para key:', key, error);
      return localValue;
    }
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);

    void setDoc(
      doc(this.db, environment.helpdeskCollection, key),
      {
        value,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    ).catch((error) => {
      console.error('Error guardando en Firebase para key:', key, error);
    });
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);

    void deleteDoc(doc(this.db, environment.helpdeskCollection, key)).catch((error) => {
      console.error('Error eliminando en Firebase para key:', key, error);
    });
  }
}
