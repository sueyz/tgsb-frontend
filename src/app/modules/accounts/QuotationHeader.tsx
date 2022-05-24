/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext, useState} from 'react'
import {ID, isNotEmpty, KTSVG, QUERIES, toAbsoluteUrl} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {ProgressBar, Step} from 'react-step-progress-bar'
import {RootState} from '../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {useMutation} from 'react-query'
import {
  markQuotation,
  unlockQuotation,
  updateQuotation,
  uploadAttachements,
} from '../quotations/quotations-list/core/_requests'

import {confirm} from 'react-confirm-box'
import {UsersListLoading} from '../quotations/quotations-list/components/loading/QuotationsListLoading'
import {useNavigate} from 'react-router'
import {Button, Modal} from 'react-bootstrap'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'

const editBalanceSchema = Yup.object().shape({
  balancePaid: Yup.number().min(1).required('Amount Paid is required'),
})

const QuotationHeader: React.FC = () => {
  const location: any = useLocation()
  const isAdmin = useSelector<RootState>(({auth}) => auth.user?.role, shallowEqual)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [isActive, setActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setFile([])
    setIsOpen(false)
  }

  var stepPositions: Array<number> = []
  var total = 0

  const markSelectedItems = useMutation(() => markQuotation([location.state.original.id]), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      setLoading(false)
      location.state.original.lock = true
    },
  })

  const unlockItem = useMutation(() => unlockQuotation(location.state.original.id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      setLoading(false)
      location.state.original.lock = false // nak antar  ni ke overview
    },
  })

  Array.from(location.state.original.payment_term).forEach((element: any, index: number) => {
    index > 0
      ? stepPositions.push(element.percentage + stepPositions[index - 1])
      : stepPositions.push(element.percentage)
  })

  Array.from(location.state.original.quotations).forEach((element: any) => {
    total += element.amount
  })

  const toggleClass = async () => {
    if (location.state.original.lock === false || isAdmin === 'Administrator') {
      const result = await confirm('Are you sure?')
      if (result) {
        setLoading(true)
        // setActive(!isActive);
        {
          location.state.original.lock === true && isAdmin === 'Administrator'
            ? await unlockItem.mutateAsync()
            : await markSelectedItems.mutateAsync()
        }
        navigate('/quotations/overview', {
          state: {original: location.state.original, company_info: location.state.company_info},
        })

        return
      }
    }
  }

  const [file, setFile] = useState<File[]>()

  const onChangeFiles = (e: any) => {
    console.log(e.target.files)
    setFile(e.target.files)
  }

  const formik = useFormik({
    initialValues: {
      ...location.state.original,
    },
    enableReinitialize: true,
    validationSchema: editBalanceSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      if (isNotEmpty(location.state.original.id)) {
        if (file !== undefined) {
          let fd = new FormData()

          Array.from(file).forEach(async (file) => {
            fd.append('attachments', file)
          })
          const results = await uploadAttachements(fd)

          Array.from(results).forEach((element: any) => {
            console.log(results)
            values.attachments?.push(`quotations/${element.filename}`)
          })
        }

        console.log(values)

        values.lock = location.state.original.lock

        await updateQuotation(values)
          .then(() => {
            closeModal()

            location.state.original = values // ni hantar alik atas je
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
  })

  var total = 0

  location.state.original.quotations?.forEach((element: any) => {
    total += element.amount
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div style={{display: 'flex'}}>
          <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
            Payment Schedule
          </a>

          <span
            style={{marginTop: 5, marginLeft: 5}}
            onClick={toggleClass}
            className={location.state.original.lock ? 'lock' : 'unlocked'}
          ></span>

          {location.state.original.lock === false ? (
            <button
              style={{margin: 'auto', marginRight: 0}}
              type='button'
              className='btn btn-success'
              onClick={openModal}
            >
              Update Balance
            </button>
          ) : (
            <></>
          )}

          <Modal dialogClassName='modal-custom' centered={true} show={isOpen} onHide={closeModal}>
            <Modal.Header style={{marginRight: 50, marginLeft: 50}} closeButton>
              <Modal.Title>Update Paid</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{marginRight: 50, marginLeft: 50}}>
              <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit}>
                {/* begin::Scroll */}

                <div
                  className='d-flex flex-column scroll-y me-n7 pe-7'
                  id='kt_modal_add_user_scroll'
                  data-kt-scroll='true'
                  data-kt-scroll-activate='{default: false, lg: true}'
                  data-kt-scroll-max-height='auto'
                  data-kt-scroll-dependencies='#kt_modal_add_user_header'
                  data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
                  data-kt-scroll-offset='300px'
                >
                  {/* begin::Form group BALANCE */}
                  <div className='fv-row mb-3 d-flex flex-d-row' style={{alignItems: 'center'}}>
                    <label className='form-label fw-bolder text-dark fs-6 me-5'>RM</label>
                    <input
                      placeholder='Amount Paid'
                      type='number'
                      min={1}
                      autoComplete='off'
                      {...formik.getFieldProps('balancePaid')}
                      className={clsx(
                        'form-control form-control-lg form-control-solid',
                        {'is-invalid': formik.touched.balancePaid && formik.errors.balancePaid},
                        {
                          'is-valid': formik.touched.balancePaid && !formik.errors.balancePaid,
                        }
                      )}
                    />
                    <p className='form-label fw-bolder fs-6 ms-5'>/</p>
                    <p className='form-label fs-6 ms-5'>{total}</p>
                  </div>
                  {formik.touched.balancePaid && formik.errors.balancePaid && (
                    <div className='fv-plugins-message-container'>
                      <div className='mt-2 fv-help-block'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.balancePaid}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* end::Form group */}
                </div>
                {/* end::Scroll */}

                <div className='d-flex flex-column mb-3 fv-row mt-10'>
                  <label className='fs-6 fw-bold form-label mb-4'>
                    Additional attachments/files:
                  </label>
                  <div className='position-relative'>
                    <input
                      type='file'
                      name='files'
                      multiple
                      onChange={(e: any) => {
                        onChangeFiles(e)
                      }}
                    />
                  </div>
                </div>

                {/* begin::Actions */}
                <div className='text-center pt-15'>
                  <button
                    type='reset'
                    onClick={() => closeModal()}
                    className='btn btn-light me-3'
                    data-kt-users-modal-action='cancel'
                    disabled={formik.isSubmitting}
                  >
                    Discard
                  </button>

                  <button
                    type='submit'
                    className='btn btn-primary'
                    data-kt-users-modal-action='submit'
                    disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
                  >
                    <span className='indicator-label'>Submit</span>
                    {formik.isSubmitting && (
                      <span className='indicator-progress'>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
                {/* end::Actions */}
              </form>
            </Modal.Body>
            {formik.isSubmitting && <UsersListLoading />}
          </Modal>

          {loading && <UsersListLoading />}

          {location.state.original.lock === false}
        </div>

        <div style={{marginRight: 10, marginBottom: 50, marginTop: 70}}>
          <ProgressBar
            stepPositions={stepPositions}
            percent={(location.state.original.balancePaid / total) * 100}
            filledBackground='linear-gradient(to right, #fefb72, #f0bb31)'
          >
            {location.state.original.payment_term.map((value: any, index: number) => {
              return (
                <Step transition='scale' key={index}>
                  {({accomplished, position}) => (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <img
                        style={{
                          filter: `grayscale(${accomplished ? 0 : 80}%)`,
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                        width='30'
                        src={toAbsoluteUrl('/media/icons/duotune/general/plant_small.png')}
                      />
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          color: 'white',
                          backgroundColor: accomplished ? 'green' : 'gray',
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>
                  )}
                </Step>
              )
            })}
          </ProgressBar>
        </div>
        <div style={{display: 'flex', alignItems: 'center', marginTop: 70, marginBottom: 30}}>
          <div>
            {location.state.original.payment_term.map((value: any, index: number) => {
              return (
                <div key={index} style={{display: 'flex', marginTop: 5}}>
                  {index + 1}
                  <a style={{marginLeft: 10, marginRight: 10}}> ---&gt; </a>
                  <b style={{marginRight: 20}}>
                    {new Intl.DateTimeFormat('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }).format(new Date(value.date))}{' '}
                    :{' '}
                  </b>
                  RM {value.amount} ({value.percentage}%)
                </div>
              )
            })}
          </div>

          <div style={{display: 'flex', flexDirection: 'column', marginLeft: 50}}>
            <b style={{color: 'green'}}>Balance Paid: RM {location.state.original.balancePaid}</b>
            <b style={{color: 'red', marginTop: 5}}>
              Balance Remaining: RM {total - location.state.original.balancePaid}
            </b>
            <b style={{marginTop: 5}}>Total: RM {total}</b>
          </div>
        </div>

        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            <li className='nav-item'>
              <a
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/quotations/overview' && 'active')
                }
                style={{cursor: 'pointer'}}
                onClick={() => {
                  navigate('/quotations/overview', {
                    state: {
                      original: location.state.original,
                      company_info: location.state.company_info,
                    },
                  })
                }}
              >
                Overview
              </a>
            </li>
            <li className='nav-item'>
              {location.state.original.lock === false ? (
                <a
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/quotations/settings' && 'active')
                  }
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    navigate('/quotations/settings', {
                      state: {
                        original: location.state.original,
                        company_info: location.state.company_info,
                      },
                    })
                  }}
                >
                  Settings
                </a>
              ) : (
                <></>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {QuotationHeader}
