import clsx from 'clsx'
import { FC, useState } from 'react'
import { Row } from 'react-table'
import { Quotations } from '../../core/_models'
import { useNavigate } from 'react-router'
import axios, { AxiosResponse } from 'axios'
import { ID, Response } from '../../../../../../_metronic/helpers'
import { Companies } from '../../../../companies/companies-list/core/_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const COMPANY_URL = `${API_URL}/company`

type Props = {
  row: Row<any>
}

const CustomRow: FC<Props> = ({ row }) => {
  const history = useNavigate()
  const [loading, setLoading] = useState(false);

  const getCompaniesById = (id: ID): Promise<Companies | undefined> => {
    return axios
      .get(`${COMPANY_URL}/${id}`)
      .then((response: AxiosResponse<Response<Companies>>) => response.data)
      .then((response: Response<Companies>) => {
        setLoading(false);
        return response.data
      })
  }

  return (


    <tr {...row.getRowProps()} onClick={async () => {
      setLoading(true)

      getCompaniesById(row.original.company).then((response: any) =>
        history('/quotations/overview', { state: { original: row.original, company_info: response } })
      )
    }}>
      {row.cells.map((cell) => {

        return (
          <td
            {...cell.getCellProps()}
            className={clsx({ 'text-end min-w-100px': cell.column.id === 'actions' })}
            style={{ paddingLeft: 10, cursor: 'pointer' }}
          >
            {cell.render('Cell')}
            {loading && <CustomLoading />}

          </td>
        )
      })}
    </tr>

  )
}

const CustomLoading = () => {
  const styles = {
    borderRadius: '0.475rem',
    boxShadow: '0 0 5px 0 rgb(82 63 105 / 15%)',
    backgroundColor: '#fff',
    color: '#7e8299',
    fontWeight: '500',
    margin: '0',
    width: 'auto',
    padding: '1rem 2rem',
    top: 'calc(50% - 2rem)',
    left: 'calc(50% - 4rem)',
  }

  return <div style={{ ...styles, position: 'absolute', textAlign: 'center' }}>Processing...</div>
}

export { CustomRow }
