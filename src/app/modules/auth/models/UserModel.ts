import {AuthModel} from './AuthModel'
import {UserAddressModel} from './UserAddressModel'
import {UserCommunicationModel} from './UserCommunicationModel'
import {UserEmailSettingsModel} from './UserEmailSettingsModel'
import {UserSocialNetworksModel} from './UserSocialNetworksModel'

export interface UserModel {
  id: number
  username: String
  password: String | undefined
  email: String
  first_name: String
  last_name: String
  fullname?: String
  occupation?: String
  companyName?: String
  phone?: String
  role: String
  pic?: String
  language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  timeZone?: String
  website?: 'https://keenthemes.com'
  emailSettings?: UserEmailSettingsModel
  auth?: AuthModel
  communication?: UserCommunicationModel
  address?: UserAddressModel
  socialNetworks?: UserSocialNetworksModel
}
