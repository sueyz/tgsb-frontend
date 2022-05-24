import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
import {usersColumns} from './columns/_columns'
import {Companies} from '../core/_models'
import {CompaniesListLoading} from '../components/loading/CompaniesListLoading'
import {UsersListPagination} from '../components/pagination/CompaniesListPagination'
import {KTCardBody} from '../../../../../_metronic/helpers'

const UsersTable = () => {
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => users, [users])
  const columns = useMemo(() => usersColumns, [])
  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_users'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? 
            (
              rows.map((row: Row<Companies>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} 
                 />
              })) : (
              <tr>
                <td colSpan={7}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UsersListPagination />
      {isLoading && <CompaniesListLoading />}
    </KTCardBody>
  )
}

export {UsersTable}
