import React from 'react'
import {QuotationDetails} from './cards/QuotationDetails'
import {SignInMethod} from './cards/SignInMethod'
import {ConnectedAccounts} from './cards/ConnectedAccounts'
import {EmailPreferences} from './cards/EmailPreferences'
import {Notifications} from './cards/Notifications'
import {DeactivateAccount} from './cards/DeactivateAccount'

export function Settings() {
  return (
    <>
      <QuotationDetails />
      {/* <SignInMethod />
      <ConnectedAccounts />
      <EmailPreferences />
      <Notifications />
      <DeactivateAccount /> */}
    </>
  )
}
