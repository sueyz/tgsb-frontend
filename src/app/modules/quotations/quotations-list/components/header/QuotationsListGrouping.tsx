import {useQueryClient, useMutation} from 'react-query'
import {QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {markQuotation} from '../../core/_requests'

const QuotationsListGrouping = () => {
  const {selected, clearSelected} = useListView()
  const queryClient = useQueryClient()
  const {query} = useQueryResponse()

  const markSelectedItems = useMutation(() => markQuotation(selected), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.QUOTATION_LIST}-${query}`])
      clearSelected()
    },
  })

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>

      <button
        type='button'
        className='btn btn-danger'
        onClick={async () => await markSelectedItems.mutateAsync()}
      >
        Lock Selected
      </button>
    </div>
  )
}

export {QuotationsListGrouping}
