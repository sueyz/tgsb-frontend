import { Column } from 'react-table'
import { QuotationsInfoCell } from './QuotationsInfoCell'
import { QuotationsStatusCell } from './QuotationsStatusCell'
import { UserActionsCell } from './QuotationsActionsCell'
import { QuotationsSelectionCell } from './QuotationsSelectionCell'
import { QuotationsSelectionHeader } from './QuotationsSelectionHeader'
import { QuotationsCustomHeader } from './QuotationsCustomHeader'
import { Quotations } from '../../core/_models'
import _ from 'lodash'

const usersColumns: ReadonlyArray<Column<Quotations>> = [
  {
    Header: (props) => <QuotationsSelectionHeader tableProps={props} />,
    id: 'finalize',
    Cell: ({ ...props }) =>
      <QuotationsSelectionCell
        id={props.data[props.row.index].id}
        lock={props.data[props.row.index].lock} />,
  },
  {
    Header: (props) => <QuotationsCustomHeader tableProps={props} title='Quotation' className='min-w-150px cursor-pointer text-hover-primary' />,
    accessor: 'type',
  },
  {
    Header: (props) => <QuotationsCustomHeader tableProps={props} title='Name' className='min-w-125px cursor-pointer text-hover-primary' />,
    id: 'name',
    Cell: ({ ...props }) => <QuotationsInfoCell quotations={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <QuotationsCustomHeader tableProps={props} title='Venue' className='min-w-125px cursor-pointer text-hover-primary' />,
    accessor: 'address1',
    Cell: ({ ...props }) =>
      `${props.data[props.row.index].address1 ? props.data[props.row.index].address1 : ""} 
      ${props.data[props.row.index].address2 ? ", " + props.data[props.row.index].address2 : ""}
      ${props.data[props.row.index].address3 ? ", " + props.data[props.row.index].address3 : ""}
      ${props.data[props.row.index].zip}, ${props.data[props.row.index].city}, ${props.data[props.row.index].state}`

  },
  {
    Header: (props) => (
      <QuotationsCustomHeader tableProps={props} title='Status' className='min-w-150px cursor-pointer text-hover-primary' />
    ),
    id: 'payment_term.date',
    Cell: ({ ...props }) => (
      <QuotationsStatusCell
        quotations={props.data[props.row.index].quotations}
        payment_term={props.data[props.row.index].payment_term}
        balancePaid={props.data[props.row.index].balancePaid}
      />
    ),
  },
  {
    Header: (props) => (
      <QuotationsCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell
      id={props.data[props.row.index].id}
      lock={props.data[props.row.index].lock}
    />,
  },
]

export { usersColumns }
