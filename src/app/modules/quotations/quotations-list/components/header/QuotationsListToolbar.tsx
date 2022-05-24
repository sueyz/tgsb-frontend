import {KTSVG} from '../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {QuotationsListFilter} from './QuotationsListFilter'

const QuotationsListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <QuotationsListFilter />

      {/* begin::Export */}
      {/* <button type='button' className='btn btn-light-primary me-3'>
        <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
        Export
      </button> */}
      {/* end::Export */}

      {/* begin::Add user */}
      {/* <button style={{display: 'none'}} type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
        Add Quote
      </button> */}
      {/* end::Add user */}
    </div>
  )
}

export {QuotationsListToolbar}
