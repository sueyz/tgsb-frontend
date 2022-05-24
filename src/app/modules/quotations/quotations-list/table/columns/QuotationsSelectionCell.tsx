import { FC, useMemo } from 'react'
import { ID } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'

type Props = {
  id: ID,
  lock: boolean
}

const QuotationsSelectionCell: FC<Props> = ({ id, lock }) => {
  const { selected, onSelect } = useListView()
  const isSelected = useMemo(() => selected.includes(id), [id, selected])
  return (
    <div className='form-check form-check-sm form-check-custom form-check-solid'>

      <input
        className='form-check-input'
        type='checkbox'
        id={'box-round'}
        data-kt-check={isSelected}
        disabled={lock}
        onClick={(event) => {
          event.stopPropagation(); 
        }}
        data-kt-check-target='#kt_table_users .form-check-input'
        checked={lock === false ? isSelected : lock}
        onChange={() => {
          onSelect(id)}}
      />
      <div id="tick_mark"></div>

    </div>
  )
}

export { QuotationsSelectionCell }
