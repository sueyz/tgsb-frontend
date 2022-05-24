import { ID } from "../../../../../_metronic/helpers"

export interface IProfileDetails {
  // avatar:string
  // name: string
  id?: ID
  company?: ID,
  type?: string,
  invoiceNo?: string,
  name?: string,
  address1?: string,
  address2?: string,
  address3?: string,
  zip?: string,
  city?: string,
  state?: string,
  quotations?: Array<Object>,
  balancePaid?: number,
  payment_term?: Array<Object>,
  projectSchedule?: Array<Object>,
  note?: string,
  poc?: string,
  contact?: string,
  email?: string,
  workType?: string,
  attachments?: Array<String>,
  lock?: boolean,

  // lName: string
  // company: string
  // contactPhone: string
  // companySite: string
  // country: string
  // language: string
  // timeZone: string
  // currency: string
  // communications: {
  //   email: boolean
  //   phone: boolean
  // }
  // allowMarketing: boolean
}

export interface IUpdateEmail {
  newEmail: string
  confirmPassword: string
}

export interface IUpdatePassword {
  currentPassword: string
  newPassword: string
  passwordConfirmation: string
}

export interface IConnectedAccounts {
  google: boolean
  github: boolean
  stack: boolean
}

export interface IEmailPreferences {
  successfulPayments: boolean
  payouts: boolean
  freeCollections: boolean
  customerPaymentDispute: boolean
  refundAlert: boolean
  invoicePayments: boolean
  webhookAPIEndpoints: boolean
}

export interface INotifications {
  notifications: {
    email: boolean
    phone: boolean
  }
  billingUpdates: {
    email: boolean
    phone: boolean
  }
  newTeamMembers: {
    email: boolean
    phone: boolean
  }
  completeProjects: {
    email: boolean
    phone: boolean
  }
  newsletters: {
    email: boolean
    phone: boolean
  }
}

export interface IDeactivateAccount {
  confirm: boolean
}

// export const profileDetailsInitValues: IProfileDetails = {
//   name: '',
//   lName: 'Smith',
//   company: 'Keenthemes',
//   contactPhone: '044 3276 454 935',
//   companySite: 'keenthemes.com',
//   country: '',
//   language: '',
//   timeZone: '',
//   currency: '',
//   communications: {
//     email: false,
//     phone: false,
//   },
//   allowMarketing: false,
// }

export const updateEmail: IUpdateEmail = {
  newEmail: 'support@keenthemes.com',
  confirmPassword: '',
}

export const updatePassword: IUpdatePassword = {
  currentPassword: '',
  newPassword: '',
  passwordConfirmation: '',
}

export const connectedAccounts: IConnectedAccounts = {
  google: true,
  github: true,
  stack: false,
}

export const emailPreferences: IEmailPreferences = {
  successfulPayments: false,
  payouts: true,
  freeCollections: false,
  customerPaymentDispute: true,
  refundAlert: false,
  invoicePayments: true,
  webhookAPIEndpoints: false,
}

export const notifications: INotifications = {
  notifications: {
    email: true,
    phone: true,
  },
  billingUpdates: {
    email: true,
    phone: true,
  },
  newTeamMembers: {
    email: true,
    phone: false,
  },
  completeProjects: {
    email: false,
    phone: true,
  },
  newsletters: {
    email: false,
    phone: false,
  },
}

export const deactivateAccount: IDeactivateAccount = {
  confirm: false,
}
