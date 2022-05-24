import {useListView} from '../../core/ListViewProvider'
import {CompaniesListToolbar} from './CompaniesListToolbar'
import {CompaniesListGrouping} from './CompaniesListGrouping'
import {CompaniesListSearchComponent} from './CompaniesListSearchComponent'

const CompaniesListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <CompaniesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <CompaniesListGrouping /> : <CompaniesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {CompaniesListHeader}
