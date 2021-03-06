import {FC, PropsWithChildren} from 'react'
import {HeaderProps} from 'react-table'
import {useListView} from '../../core/ListViewProvider'
import {Quotations} from '../../core/_models'

type Props = {
  tableProps: PropsWithChildren<HeaderProps<Quotations>>
}

const QuotationsSelectionHeader: FC<Props> = ({tableProps}) => {
  const {isAllSelected, onSelectAll} = useListView()
  return (
    <th {...tableProps.column.getHeaderProps()} className='w-200px ps-11'>
      {/* <div className='form-check form-check-sm form-check-custom form-check-solid me-3'>
        <input
          className='form-check-input'
          type='checkbox'
          data-kt-check={isAllSelected}
          data-kt-check-target='#kt_table_users .form-check-input'
          checked={isAllSelected}
          onChange={onSelectAll}
        />
      </div> */}
      In Status
    </th>
  )
}

export {QuotationsSelectionHeader}
