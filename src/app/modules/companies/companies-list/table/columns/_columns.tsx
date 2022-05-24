import {Column} from 'react-table'
import {CompaniesInfoCell} from './CompaniesInfoCell'
import {Companies} from '../../core/_models'

var test =0 
const usersColumns: ReadonlyArray<Column<Companies>> = [
  {
    // id: 'first_name',
    id: '1',
    Cell: ({...props}) => {
    test = props.row.index * 3

    if(test < props.data.length)
      return <CompaniesInfoCell company={props.data[test]} />},
  },
  {
    id: '2',
    Cell: ({...props}) => {

      test = props.row.index * 3 + 1
      if(test < props.data.length)
        return <CompaniesInfoCell company={props.data[test]} />},
  },
  {
    id: '3',
    Cell: ({...props}) => {
      test = props.row.index * 3 + 2
    if(test < props.data.length)
      return <CompaniesInfoCell company={props.data[test]} />},
  }
]

export {usersColumns}
