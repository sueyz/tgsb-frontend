import {ID, Response} from '../../../../../_metronic/helpers'
export type Companies = {
  id?: ID
  type?: String
  name?: String
  address?: String
  avatar?: String
  email?: String
  phone?: String
  accountNo?: String
  bank?: String
  // online?: boolean
  // initials?: {
  //   label: string
  //   state: string
  // }
}

export type CompaniesQueryResponse = Response<Array<Companies>>

export const initialCompany: Companies = {
  avatar: 'avatars/blank.png',
  address: '',
  type: 'Regular',
  name: '',
  email: '',
  phone: '',
  accountNo: '',
  bank: '',
}
