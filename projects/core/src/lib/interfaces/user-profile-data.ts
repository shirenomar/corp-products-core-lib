export interface UserProfileData {
  contact: Contact;
  position: Position;
  email: string;
  profileImage: string;
  nameEn: string;
  nameAr: string;
}

export interface Contact {
  mobile: string;
  work: string;
}

export interface Position {
  code: string;
  name: string;
}

