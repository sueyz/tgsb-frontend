/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { toAbsoluteUrl } from '../../../../../../../_metronic/helpers'
import { User } from '../../core/_models'
import { getImage } from '../../core/_requests'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({ user }) => {

  const [src, setSrc] = useState('');

  useEffect(() => {
    getImage(user.avatar ? user.avatar : '').then((res: any) => {
      setSrc(res);

    })

  }, [user.avatar])

  return (
    <div className='d-flex align-items-center'>
      {/* begin:: Avatar */}
      <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
        <a href='#'>
          {user.avatar ? (
            <div className='symbol-label'>
              <img
                src={src}
                className='h-100 w-100'
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className='symbol-label'>
              <img src={toAbsoluteUrl('/media/svg/avatars/blank.png')} className='w-100' />
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
}

export { UserInfoCell }
