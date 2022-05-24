import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {CompaniesListHeader} from './components/header/CompaniesListHeader'
import {UsersTable} from './table/CompaniesTable'
import {UserEditModal} from './companies-edit-modal/CompaniesEditModal'
import {KTCard} from '../../../../_metronic/helpers'

const CompaniesList = () => {
  const {itemIdForUpdate} = useListView()
  // console.log(itemIdForUpdate)
  return (
    <>
      <KTCard>
        <CompaniesListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const CompaniesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <CompaniesList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {CompaniesListWrapper}
