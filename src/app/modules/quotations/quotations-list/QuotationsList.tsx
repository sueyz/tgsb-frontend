import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/QuotationsListHeader'
import {QuotationsTable} from './table/QuotationsTable'
import {QuotationsEditModal} from './quotations-edit-modal/QuotationsEditModal'
import {KTCard} from '../../../../_metronic/helpers'

const QuotationsList = () => {
  const {itemIdForUpdate} = useListView()
  // console.log(itemIdForUpdate)
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <QuotationsTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <QuotationsEditModal />}
    </>
  )
}

const QuotationsListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <QuotationsList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {QuotationsListWrapper}
