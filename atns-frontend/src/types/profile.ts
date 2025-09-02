export interface Profile {
    id?: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    bio?: string;
    dateOfBirth: string;
    batchYear: number;
    faculty: string;
    currentPosition: string;
    profileImageUrl?: string;
}
