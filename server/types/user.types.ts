

export type UserData = {
  id: string;
  role_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
};

export type authTokens = {
  accessToken: string;
  refreshToken: string;
};

export type RoleData = {
  id: string;
  name: string;
  canManageAssessment: boolean;
  canManageUser: boolean;
  canManageRole: boolean;
  canManageNotification: boolean;
  canManageLocalGroup: boolean;
  canManageReports: boolean;
  canAttemptAssessment: boolean;
  canViewReport: boolean;
  canManageMyAccount: boolean;
  canViewNotification: boolean;
};

export type device = 'mobile' | 'web';

export type RefreshTokenData = {
  user_id: string; 
  device_type: device;
  refresh_token: string;
}

export type userAttributes =
  'id'
  | 'role_id'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'createdAt'
  | 'updatedAt'

  export type roleAttributes =
  | 'id'
  | 'name'
  | 'canManageAssessment'
  | 'canManageUser'
  | 'canManageRole'
  | 'canManageNotification'
  | 'canManageLocalGroup'
  | 'canManageReports'
  | 'canAttemptAssessment'
  | 'canViewReport'
  | 'canManageMyAccount'
  | 'canViewNotification'
  | 'createdAt'
  | 'updatedAt';

export type Permissions =
  | 'canManageAssessment'
  | 'canManageUser'
  | 'canManageRole'
  | 'canManageNotification'
  | 'canManageLocalGroup'
  | 'canManageReports'
  | 'canAttemptAssessment'
  | 'canViewReport'
  | 'canManageMyAccount'
  | 'canViewNotification'
