/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {buildStyles, CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {useMutation} from 'react-query'
import {getCurrentQuotations} from '../../modules/quotations/quotations-list/core/_requests'
import {Quotations} from '../../modules/quotations/quotations-list/core/_models'
import AnimatedProgressProvider from './AnimatedProgressProvider'
import {ID, Response} from '../../../_metronic/helpers'
import {Companies} from '../../modules/companies/companies-list/core/_models'
import axios, {AxiosResponse} from 'axios'
import {useNavigate} from 'react-router-dom'
import {useHistoryState} from '../../../_metronic/layout/MasterLayout'

const DashboardLoading = () => {
  const styles = {
    borderRadius: '0.475rem',
    boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
    backgroundColor: '#fff',
    color: '#7e8299',
    fontWeight: '500',
    width: 'auto',
    padding: '1rem 2rem',
    position: 'absolute',
    top: '30%',
    left: ' 55%',
  }

  return <div style={{...styles, position: 'absolute', textAlign: 'center'}}>Processing...</div>
}

const DashboardPage: FC = () => {
  const navigate = useNavigate()

  const API_URL = process.env.REACT_APP_THEME_API_URL
  const COMPANY_URL = `${API_URL}/company`

  const getCompaniesById = (id: ID): Promise<Companies | undefined> => {
    return axios
      .get(`${COMPANY_URL}/${id}`)
      .then((response: AxiosResponse<Response<Companies>>) => response.data)
      .then((response: Response<Companies>) => {
        setLoading(false)
        return response.data
      })
  }

  const [quote, setQuote] = useState<Quotations[] | undefined>([])
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<Array<Companies>>([])
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File[]>()
  const {history} = useHistoryState()

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setFile([])
    setIsOpen(false)
  }

  const onChangeFiles = (e: any) => {
    console.log(e.target.files)
    setFile(e.target.files)
  }

  const getCurrent = useMutation(() => getCurrentQuotations(), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (response) => {
      // ✅ update detail view directly
      setLoading(false)
      // location.state.original.lock = true
      // setHistory(30)
      // setQuote(token);
      // setQuote(response.data)
    },
  })

  useEffect(() => {
    async function getAll() {
      setLoading(true)
      var test = await getCurrent.mutateAsync()
      setQuote(test.data)

      var array: Array<Companies> = []

      if (test.data !== undefined) {
        for (const element of test.data) {
          await getCompaniesById(element.company).then((response: any) => {
            array.push(response)
          })
        }
      }

      setCompany(array)
    }
    getAll()
  }, [history])

  return (
    <>
      {/* begin::Row */}
      {loading && <DashboardLoading />}

      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
        {quote ? (
          quote.map((element: any, i: number) => {
            // console.log(company)
            // console.log(company.length)

            var total = 0
            element.quotations.map((quote: any, index: number) => {
              total += quote.amount
            })
            var percent = ((element.balancePaid / total) * 100).toFixed(3)

            var next_payment_date = ''
            var numberDate1 = 0

            var date2 = new Date()
            var numberDate2 = parseInt(date2.toISOString().slice(0, 10).replace(/-/g, ''))
            // number 20180610

            var diff1 = new Date()
            var diff2 = new Date(date2.toISOString().slice(0, 10))

            var cyclePayment = 0

            if (element.payment_term !== undefined) {
              var tempCount = 0
              for (let i = 0; i < element.payment_term.length; i++) {
                tempCount += element.payment_term[i].amount

                diff1 = new Date(element.payment_term[i].date)

                next_payment_date = new Intl.DateTimeFormat('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }).format(new Date(element.payment_term[i].date))

                numberDate1 = Number(next_payment_date.split('/').reverse().join(''))
                //number 20180605

                cyclePayment = element.payment_term[i].amount

                if (element.balancePaid !== undefined) {
                  if (element.balancePaid < tempCount && numberDate2 <= numberDate1) {
                    break
                  } else if (element.balancePaid >= tempCount && numberDate2 <= numberDate1) {
                    continue
                  }
                }
              }
            }

            // To calculate the time difference of two dates
            var Difference_In_Time = diff1.getTime() - diff2.getTime()

            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)

            var color =
              Difference_In_Days > 7
                ? '#50CC89'
                : Difference_In_Days <= 7 && Difference_In_Days > 3
                ? '#EED202'
                : 'red'

            var tempTotal = 0

            return (
              <div key={i} className='card' style={{width: '18rem', marginBottom: 25}}>
                <div className='card-body pb-0 '>
                  <h5 className='card-title'>{element.type}</h5>
                </div>

                <div style={{padding: 20}}>
                  <AnimatedProgressProvider valueStart={0} valueEnd={percent}>
                    {(value: number) => (
                      <CircularProgressbar
                        value={value}
                        text={`${value}%`}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          strokeLinecap: 'butt',

                          textColor: color,
                          backgroundColor: '#f88',
                          pathColor: color,
                        })}
                      />
                    )}
                  </AnimatedProgressProvider>
                </div>

                <div className='card-body'>
                  <h5 className='card-title'>{company[i] && company[i].name}'s</h5>
                  <p className='card-text'>{element.name}</p>
                </div>

                {element.balancePaid >= total && <h3 className='card-body ms-10'>COMPLETED</h3>}

                <ul
                  style={{alignItems: 'center', width: '100%'}}
                  className='list-group list-group-flush'
                >
                  {element.payment_term.map((newElement: any, i: number) => {
                    tempTotal += newElement.amount

                    var tempDate = new Intl.DateTimeFormat('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }).format(new Date(newElement.date))

                    if (tempDate === next_payment_date) {
                      return (
                        element.balancePaid < tempTotal && (
                          <li key={i} style={{color: color}} className='list-group-item'>
                            <b>RM {tempTotal}</b> before {tempDate}
                          </li>
                        )
                      )
                    } else {
                      return (
                        element.balancePaid < tempTotal && (
                          <li key={i} className='list-group-item'>
                            <b>RM {tempTotal}</b> before {tempDate}
                          </li>
                        )
                      )
                    }
                  })}
                </ul>
                <div
                  className='card-body'
                  style={{
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                  }}
                >
                  {/* {(element.lock === false) ? <button
                style={{ fontSize: 12 }}
                type='button'
                className='btn btn-success'
                onClick={openModal}
              >
                Update Balance
              </button> : <></>} */}
                  <button
                    style={{fontSize: 12, marginTop: 10}}
                    type='button'
                    className='btn btn-primary'
                    onClick={() =>
                      navigate('/quotations/overview', {
                        state: {original: element, company_info: company && company},
                      })
                    }
                  >
                    More Info
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <></>
        )}
      </div>
      {/* end::Row */}
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
