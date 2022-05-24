import {useQuery} from 'react-query'
import {CompaniesEditModalForm} from './CompaniesEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getCompaniesById} from '../core/_requests'

const UserEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: company,
    error,
  } = useQuery(
    `${QUERIES.COMPANIES_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getCompaniesById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )

  if (!itemIdForUpdate) {
    return <CompaniesEditModalForm isUserLoading={isLoading} company={{id: undefined}} />
  }

  if (!isLoading && !error && company) {
    return <CompaniesEditModalForm isUserLoading={isLoading} company={company} />
  }

  return null
}

export {UserEditModalFormWrapper}
