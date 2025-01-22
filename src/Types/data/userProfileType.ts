// src/types/userProfileType.ts

// Define the type for user profile data
export interface userProfileType {
    fullName: string;
    email: string;
    phoneNumber: string; // Updated field name
    address: string;
    houseNumber: string;
    apartment: string;
    country: string;
    city: string; // Added city field
    pinCode: string; // Added pin code field
  }