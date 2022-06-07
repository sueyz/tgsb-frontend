/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { Companies } from '../../core/_models'
import cn from "classnames";
import { CompaniesActionsCell } from './CompaniesActionsCell'
import { getImage } from '../../core/_requests';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
  company: Companies
}

const CompaniesInfoCell: FC<Props> = ({ company }) => {

  const [src, setSrc] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    getImage(company.avatar ? company.avatar : '').then((res: any) => {
      setSrc(res);

    })

  }, [company.avatar])


  return (
    <div className='d-flex align-items-center'>
      {/* begin:: Avatar */}

      <div className="flip-card-outer">
        <div className={cn("flip-card-inner", {
          "hover-trigger": true
        })}>
          <div className="card front" style={{ display: 'flex' }}>
            <div className="card-body d-flex justify-content-center align-items-center" style={{ flexDirection: 'column' }}>
              <div className='symbol symbol-100px overflow-hidden mb-3'>
                <a href='#'>
                  {company.avatar ? (
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
              <p className="card-text fs-1 fw-bold">{company.name}</p>
            </div>
          </div>
          <div className="card back">
            <div>
              <CompaniesActionsCell id={company.id} />
            </div>
            <p className="card-text ms-5 fst-italic">Quotation: {company.type}</p>
            <p className="card-text ms-5 fst-italic">Address: {company.address}</p>
            <p className="card-text ms-5 fst-italic">Email: <a href={"mailto:" + company.email}>{company.email}</a></p>

            <p className="card-text ms-5 fst-italic">Tel: {company.phone}</p>

            <div className="card-body d-flex justify-content-center align-items-center">

              <p style={{ color: '#34b0f6', cursor: 'pointer' }} onClick={() => {
                navigate('/companies/quotationList', {
                  state: { original: company.id },
                })
              }} className="card-text fs-1 fw-bolder"><u>More Info</u></p>
              {/* <Link to='/crafted/account/settings' className='menu-link px-5'>
          Account Settings
        </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CompaniesInfoCell }