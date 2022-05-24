/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {Quotations} from '../../core/_models'

type Props = {
  quotations: Quotations
}

const QuotationsInfoCell: FC<Props> = ({quotations}) => (
  <div className='d-flex align-items-center'>    
    <div className='d-flex flex-column'>
      <p className='text-gray-800 mb-1'>
        {quotations.name} <b>({quotations.workType})</b>
      </p>
    </div>
  </div>
)

export {QuotationsInfoCell}
