import {KTSVG} from '../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {CompaniesListFilter} from './CompaniesListFilter'

const CompaniesListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const openAddCompanyModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <CompaniesListFilter />

      {/* begin::Export */}
      {/* <button type='button' className='btn btn-light-primary me-3'>
        <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
        Export
      </button> */}
      {/* end::Export */}

      {/* begin::Add company */}
      <button type='button' className='btn btn-primary' onClick={openAddCompanyModal}>
        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
        Add Company
      </button>
      {/* end::Add company */}
    </div>
  )
}

export {CompaniesListToolbar}
