/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../../setup'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {ID, KTSVG, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteQuotation, unlockQuotation} from '../../core/_requests'
import {confirm} from 'react-confirm-box'

type Props = {
  id: ID
  lock: boolean
}

const UserActionsCell: FC<Props> = ({id, lock}) => {
  const {setItemIdForUpdate} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  const isAdmin = useSelector<RootState>(({auth}) => auth.user?.role, shallowEqual)

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
  }

  const deleteItem = useMutation(() => deleteQuotation(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.QUOTATION_LIST}-${query}`])
    },
  })

  const unlockItem = useMutation(() => unlockQuotation(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.QUOTATION_LIST}-${query}`])
    },
  })

  return (
    <>
      {lock === false || isAdmin === 'Administrator' ? (
        <a
          href='#'
          className='btn btn-light btn-active-light-primary btn-sm'
          data-kt-menu-trigger='hover'
          data-kt-menu-placement='bottom-end'
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          Actions
          <KTSVG path='/media/icons/duotune/arrows/arr072.svg' className='svg-icon-5 m-0' />
        </a>
      ) : (
        <a style={{marginRight: 25}}>Locked</a>
      )}
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-150px py-4'
        data-kt-menu='true'
      >
        {lock === true && isAdmin === 'Administrator' ? (
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              data-kt-users-table-filter='delete_row'
              onClick={async (event) => {
                event.stopPropagation()
                const result = await confirm('Are you sure?')
                if (result) {
                  // setLoading(true)
                  await unlockItem.mutateAsync()
                  return
                }
              }}
            >
              Unlock
            </a>
          </div>
        ) : (
          <></>
        )}
        {/* begin::Menu item */}
        {lock === false ? (
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              onClick={(event) => {
                event.stopPropagation()
                openEditModal()
              }}
            >
              Update Balance
            </a>
          </div>
        ) : (
          <></>
        )}

        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={async (event) => {
              event.stopPropagation()
              const result = await confirm('Are you sure?')
              if (result) {
                // setLoading(true)
                await deleteItem.mutateAsync()
                return
              }
            }}
          >
            Delete
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  )
}

export {UserActionsCell}
