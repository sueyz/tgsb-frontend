import {useListView} from '../../core/ListViewProvider'
import {QuotationsListToolbar} from './QuotationsListToolbar'
import {QuotationsListGrouping} from './QuotationsListGrouping'
import {QuotationsListSearchComponent} from './QuotationsListSearchComponent'

const UsersListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <QuotationsListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <QuotationsListGrouping /> : <QuotationsListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {UsersListHeader}
