export enum USER_ROLES {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  VENDOR = 'vendor',
  USER = 'user',
}

export const NonAdminRoles = [USER_ROLES.USER, USER_ROLES.VENDOR];

export enum INVITE_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum RegistrationTypeEnum {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  //   FACEBOOK = 'FACEBOOK',
  //   TWITTER = 'TWITTER',
  //   GITHUB = 'GITHUB',
}

export enum FileFoldersEnum {
  PROFILE_PICTURES = 'profile-pictures',
  FILE_UPLOADS = 'file-uploads',
}
