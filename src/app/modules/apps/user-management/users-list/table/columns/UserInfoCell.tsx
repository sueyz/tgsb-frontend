/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {User} from '../../core/_models'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({user}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {user.avatar ? (
          <div className='symbol-label'>
            <img
              src={toAbsoluteUrl(`/media/${user.avatar}`)}
              className='h-100 w-100'
              style={{objectFit: 'cover'}}
            />
          </div>
        ) : (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl('/media/avatars/blank.png')} className='w-100' />
          </div>
        )}
      </a>
    </div>
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {user.first_name} {user.last_name}
      </a>
      <span>{user.email}</span>
    </div>
  </div>
)

export {UserInfoCell}
