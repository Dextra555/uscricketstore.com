import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  setLocalStorage(key: string, value: any): void {
    // Check if the value is an object and stringify it if needed
    const serializedValue =
      typeof value === 'object' ? JSON.stringify(value) : value;

    // Set the value in localStorage
    localStorage.setItem(key, serializedValue);
  }

  getLocalStorage(key: string): any | null {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return null; // Value not found in localStorage
    }

    try {
      // Attempt to parse as JSON, in case it's an object
      return JSON.parse(storedValue);
    } catch (error) {
      // If parsing as JSON fails, it's likely a non-object value
      return storedValue;
    }
  }

  setSessionStorage(key: string, value: any): void {
    // Check if the value is an object and stringify it if needed
    const serializedValue =
      typeof value === 'object' ? JSON.stringify(value) : value;

    // Set the value in sessionStorage
    sessionStorage.setItem(key, serializedValue);
  }

  getSessionStorage(key: string): any | null {
    const storedValue = sessionStorage.getItem(key);

    if (storedValue === null) {
      return null; // Value not found in sessionStorage
    }

    try {
      // Attempt to parse as JSON, in case it's an object
      return JSON.parse(storedValue);
    } catch (error) {
      // If parsing as JSON fails, it's likely a non-object value
      return storedValue;
    }
  }
}
