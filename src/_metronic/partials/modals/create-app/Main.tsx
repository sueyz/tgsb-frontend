/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useRef} from 'react'
import useState from 'react-usestateref'
import ReactPDF, {Document, Page, Text, View, StyleSheet, PDFViewer} from '@react-pdf/renderer'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {Formik, Form, FormikValues, Field, ErrorMessage, FieldArray} from 'formik'
import * as Yup from 'yup'
import {StepperComponent} from '../../../assets/ts/components'
import axios, {AxiosResponse} from 'axios'
import {
  initialQuotations,
  Quotations,
} from '../../../../app/modules/quotations/quotations-list/core/_models'
import {ID, Response} from '../../../../_metronic/helpers'
import {
  Companies,
  CompaniesQueryResponse,
} from '../../../../app/modules/companies/companies-list/core/_models'
import {useQueryResponse} from '../../../../app/modules/quotations/quotations-list/core/QueryResponseProvider'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useHistoryState} from '../../../layout/MasterLayout'

const API_URL = process.env.REACT_APP_THEME_API_URL
const QUOTATIONS_URL = `${API_URL}/quotations/register`
const GET_COMPANIES_URL = `${API_URL}/company/?`
const CHECK_INVOICE_URL = `${API_URL}/quotations/check/?`
const ATTACHMENTS_UPLOAD_URL = `${API_URL}/quotations/upload`
const PDF_UPLOAD_URL = `${API_URL}/quotations/pdf`

var allTotal = 0

const createQuotations = (quotation: Quotations): Promise<Quotations | undefined> => {
  return axios
    .post(QUOTATIONS_URL, quotation)
    .then((response: AxiosResponse<Response<Quotations>>) => response.data)
    .then((response: Response<Quotations>) => {
      return response.data
    })
}

const getCompanies = (text: String): Promise<CompaniesQueryResponse> => {
  return axios
    .get(`${GET_COMPANIES_URL}${text}`)
    .then((d: AxiosResponse<CompaniesQueryResponse>) => d.data)
}

const checkInvoice = (text: String) => {
  return axios.get(`${CHECK_INVOICE_URL}${text}`).then((response) => {
    return response.data
  })
}

const uploadAttachements = (file: FormData) => {
  return axios
    .post(ATTACHMENTS_UPLOAD_URL, file, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response.data.files
    })
}
const uploadPdf = (file: FormData) => {
  return axios
    .post(PDF_UPLOAD_URL, file, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response.data.files
    })
}

const createQuotationSchema = [
  Yup.object({
    name: Yup.string().required().label('Quotation name'),
    invoiceNo: Yup.string().required().label('Invoice number'),
    type: Yup.string().required().label('Quotation type'),
  }),
  Yup.object({
    company: Yup.string().required().label('Company'),
  }),
  Yup.object({
    workType: Yup.string().required().label('Work type'),
    quotations: Yup.array()
      .of(
        Yup.object({
          desc: Yup.string().notRequired().label('Description'),
          amount: Yup.number().required().label('Amount'),
        })
      )
      .min(1, 'Quotations'),
  }),
  Yup.object({
    payment_term: Yup.array()
      .of(
        Yup.object({
          percentage: Yup.number().required().label('Percentage'),
          desc: Yup.string().required().label('Description'),
          amount: Yup.number().required().label('Amount'),
          date: Yup.date().required().label('Date'),
        })
      )
      .min(1, 'Payment Term'),
    balancePaid: Yup.number().required().label('Balance paid'),
  }),
  Yup.object({
    projectSchedule: Yup.array()
      .of(
        Yup.object({
          desc: Yup.string().notRequired().label('Description'),
          week: Yup.string().notRequired().label('Week'),
        })
      )
      .min(1, 'Project schedule'),
  }),
  Yup.object({
    address1: Yup.string().required().label('Address 1'),
    zip: Yup.string().required().label('Zip'),
    city: Yup.string().required().label('City'),
    state: Yup.string().required().label('State'),
  }),
]

const notifyExist = () => toast('Invoice number already used!')

const Main: FC = () => {
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const stepper = useRef<StepperComponent | null>(null)
  const [currentSchema, setCurrentSchema] = useState(createQuotationSchema[0])
  const [company, setCompany, refCompany] = useState<Companies[]>()
  const [initValues] = useState<Quotations>(initialQuotations)
  const {refetch} = useQueryResponse()
  const {setHistory} = useHistoryState()

  const [file, setFile] = useState<File[]>()

  const onChangeFiles = (e: any) => {
    console.log(e.target.files)
    setFile(e.target.files)
  }

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
  }

  const prevStep = (values: Quotations) => {
    if (!stepper.current) {
      return
    }

    stepper.current.goPrev()

    setCurrentSchema(createQuotationSchema[stepper.current.currentStepIndex - 1])
  }

  const submitStep = async (values: Quotations, actions: FormikValues) => {
    if (!stepper.current) {
      return
    }

    setCurrentSchema(createQuotationSchema[stepper.current.currentStepIndex])

    // console.log(stepper.current)

    if (stepper.current.currentStepIndex === 1) {
      values.company = undefined
      await checkInvoice(values.invoiceNo ? values.invoiceNo : '').then(async (response) => {
        if (response.data === null) {
          var {data} = await getCompanies(values.type ? values.type : '')
          setCompany(data)
        } else {
          setCompany(undefined)
          notifyExist()
        }
      })
    }

    if (stepper.current.currentStepIndex !== stepper.current.totatStepsNumber) {
      stepper.current.goNext()

      if (refCompany.current === undefined) {
        prevStep(values)
      }
    } else {
      values.attachments?.splice(0, values.attachments.length)

      if (file !== undefined) {
        let fd = new FormData()

        Array.from(file).forEach(async (file: any) => {
          fd.append('attachments', file)
        })
        const results = await uploadAttachements(fd)
        Array.from(results).forEach((element: any) => {
          values.attachments?.push(`quotations/${element.filename}`)
        })
      }

      if (values.type !== 'Sub-consultant') {
        let fd2 = new FormData()
        const newFormat = {
          values: values,
        }

        fd2.append('pdf', await ReactPDF.pdf(<MyDocument formikProps={newFormat} />).toBlob())

        const result2 = await uploadPdf(fd2)
        values.attachments?.push(`quotations/${result2}`)
      }

      await createQuotations(values)

      stepper.current.goto(1)
      actions.resetForm()
      refetch()

      setHistory(23)
    }
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }

    loadStepper()
  }, [stepperRef])

  return (
    <div className='modal fade' id='kt_modal_create_app' aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered mw-1000px'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h2>Create Quotation</h2>
            <ToastContainer position='bottom-center' />

            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
              <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
            </div>
          </div>

          <div className='modal-body py-lg-10 px-lg-10'>
            <div
              ref={stepperRef}
              className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
              id='kt_modal_create_app_stepper'
            >
              <div className='d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px'>
                <div className='stepper-nav ps-lg-10'>
                  <div className='stepper-item current' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>1</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Name & Invoice number</h3>

                      <div className='stepper-desc'>Name your Quotation project</div>
                    </div>
                  </div>

                  <div className='stepper-item' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>2</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Companies</h3>

                      <div className='stepper-desc'>Select company</div>
                    </div>
                  </div>

                  <div className='stepper-item' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>3</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Quotation Details (1)</h3>

                      <div className='stepper-desc'>Work type & proposed fee</div>
                    </div>
                  </div>

                  <div className='stepper-item' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>4</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Quotation Details (2)</h3>

                      <div className='stepper-desc'>schedule, balance, dates</div>
                    </div>
                  </div>

                  <div className='stepper-item' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>5</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Quotation Details (3)</h3>

                      <div className='stepper-desc'>project schedule</div>
                    </div>
                  </div>

                  <div className='stepper-item' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>6</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Address and Contact</h3>

                      <div className='stepper-desc'>project adress, poc, contact</div>
                    </div>
                  </div>

                  <div className='stepper-item' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>7</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Review</h3>

                      <div className='stepper-desc'>Review and Submit</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex-row-fluid py-lg-5 px-lg-15'>
                <Formik
                  validationSchema={currentSchema}
                  initialValues={initValues}
                  onSubmit={submitStep}
                  enableReinitialize
                >
                  {(formikProps) => (
                    <Form
                      className='form'
                      id='kt_modal_create_app_form'
                      onSubmit={formikProps.handleSubmit}
                    >
                      <div className='current' data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <div className='fv-row mb-10'>
                            <label className='d-flex align-items-center fs-5 fw-bold mb-2'>
                              <span className='required'>Invoice Number</span>
                            </label>

                            <Field
                              type='text'
                              className='form-control form-control-lg form-control-solid'
                              name='invoiceNo'
                              placeholder='Invoice no'
                            />
                            <div className='text-danger'>
                              <ErrorMessage name='invoiceNo' />
                            </div>
                          </div>

                          <div className='fv-row mb-10'>
                            <label className='d-flex align-items-center fs-5 fw-bold mb-2'>
                              <span className='required'>Quotation Name</span>
                              {/* <i
                                className='fas fa-exclamation-circle ms-2 fs-7'
                                data-bs-toggle='tooltip'
                                title='Specify your unique quotation name'
                              ></i> */}
                            </label>

                            <Field
                              type='text'
                              className='form-control form-control-lg form-control-solid'
                              name='name'
                              placeholder='name'
                            />
                            <div className='text-danger'>
                              <ErrorMessage name='name' />
                            </div>
                          </div>

                          <div className='fv-row'>
                            <label className='d-flex align-items-center fs-5 fw-bold mb-4'>
                              <span className='required'>Quotation type</span>

                              {/* <i
                                className='fas fa-exclamation-circle ms-2 fs-7'
                                data-bs-toggle='tooltip'
                                title='Select your app type'
                              ></i> */}
                            </label>

                            <div className='fv-row'>
                              <label className='d-flex flex-stack mb-5 cursor-pointer'>
                                <span className='d-flex align-items-center me-2'>
                                  <span className='symbol symbol-50px me-6'>
                                    <span className='symbol-label bg-light-primary'>
                                      <KTSVG
                                        path='/media/icons/duotune/maps/map004.svg'
                                        className='svg-icon-1 svg-icon-primary'
                                      />
                                    </span>
                                  </span>

                                  <span className='d-flex flex-column'>
                                    <span className='fw-bolder fs-6'>Regular Quotation</span>

                                    <span className='fs-7 text-muted'>
                                      A quotation from us to other companies
                                    </span>
                                  </span>
                                </span>

                                <span className='form-check form-check-custom form-check-solid'>
                                  <Field
                                    className='form-check-input'
                                    type='radio'
                                    name='type'
                                    value='Regular'
                                  />
                                </span>
                              </label>

                              <label className='d-flex flex-stack mb-5 cursor-pointer'>
                                <span className='d-flex align-items-center me-2'>
                                  <span className='symbol symbol-50px me-6'>
                                    <span className='symbol-label bg-light-danger  '>
                                      <KTSVG
                                        path='/media/icons/duotune/general/gen024.svg'
                                        className='svg-icon-1 svg-icon-danger'
                                      />
                                    </span>
                                  </span>

                                  <span className='d-flex flex-column'>
                                    <span className='fw-bolder fs-6'>Sub-Consultant Quotation</span>

                                    <span className='fs-7 text-muted'>
                                      A quotation from other companies to us
                                    </span>
                                  </span>
                                </span>

                                <span className='form-check form-check-custom form-check-solid'>
                                  <Field
                                    className='form-check-input'
                                    type='radio'
                                    name='type'
                                    value='Sub-consultant'
                                  />
                                </span>
                              </label>
                            </div>

                            <div className='text-danger'>
                              <ErrorMessage name='type' />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <div className='fv-row'>
                            <label className='d-flex align-items-center fs-5 fw-bold'>
                              <span className='required'>Select company</span>
                              {/* <i
                                className='fas fa-exclamation-circle ms-2 fs-7'
                                data-bs-toggle='tooltip'
                                title='Specify your project company'
                              ></i> */}
                            </label>
                            <p className='fs-7 mb-6'>
                              <i>
                                If company is not in the list, please add first at the companies
                                page
                              </i>
                            </p>

                            <div style={{height: 300, overflowY: 'scroll'}}>
                              {refCompany.current ? (
                                refCompany.current.length > 0 ? (
                                  refCompany.current.map((company: Companies, i: number) => {
                                    return (
                                      <label
                                        key={i}
                                        className='d-flex flex-stack cursor-pointer mb-5'
                                      >
                                        <span className='d-flex align-items-center me-2'>
                                          <span className='symbol symbol-50px me-6'>
                                            {company.avatar ? (
                                              <div className='symbol-label'>
                                                <img
                                                  src={toAbsoluteUrl(`/media/${company.avatar}`)}
                                                  className='h-100 w-100'
                                                  style={{objectFit: 'cover'}}
                                                />
                                              </div>
                                            ) : (
                                              <div className='symbol-label'>
                                                <img
                                                  src={toAbsoluteUrl('/media/avatars/blank.png')}
                                                  className='w-100'
                                                />
                                              </div>
                                            )}
                                          </span>

                                          <span className='d-flex flex-column'>
                                            <span className='fw-bolder fs-6'>{company.name}</span>

                                            <span className='fs-7 text-muted'>
                                              {company.type} Quotation
                                            </span>
                                          </span>
                                        </span>

                                        <span className='form-check form-check-custom form-check-solid me-8'>
                                          <Field
                                            className='form-check-input'
                                            type='radio'
                                            name='company'
                                            value={company.id}
                                          />
                                        </span>
                                      </label>
                                    )
                                  })
                                ) : (
                                  <></>
                                )
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                          <div className='text-danger'>
                            <ErrorMessage name='company' />
                          </div>
                        </div>
                      </div>

                      <div data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <div className='fv-row mb-3'>
                            <label className='d-flex align-items-center fs-5 fw-bold mb-4'>
                              <span className='required'>Select Work Type</span>

                              {/* <i
                                className='fas fa-exclamation-circle ms-2 fs-7'
                                data-bs-toggle='tooltip'
                                title='Select your app database engine'
                              ></i> */}
                            </label>

                            <label className='d-flex flex-stack cursor-pointer mb-5'>
                              <span className='d-flex align-items-center me-2'>
                                {/* <span className='symbol symbol-50px me-6'>
                                  <span className='symbol-label bg-light-success'>
                                    <i className='fas fa-database text-success fs-2x'></i>
                                  </span>
                                </span> */}

                                <Field
                                  as='select'
                                  name='workType'
                                  style={{textOverflow: 'ellipsis'}}
                                  className='form-select'
                                  aria-label='Default select example'
                                >
                                  <option value='EIA'>Environmental Impact Asssesment</option>
                                  <option value='EMT'>Environmental Mark Assesment</option>
                                  <option value='DSR'>Dynamic Search Rescue</option>
                                </Field>
                              </span>
                            </label>
                          </div>
                          <div className='text-danger mb-10'>
                            <ErrorMessage name='workType' />
                          </div>

                          <div className='fv-row mb-10'>
                            <label className='required fs-5 fw-bold mb-2'>
                              {formikProps.values.type === 'Sub-consultant'
                                ? 'Total Proposed Fee'
                                : 'Proposed Fee'}
                            </label>

                            <FieldArray name='quotations'>
                              {(arrayHelpers) => {
                                return (
                                  <div>
                                    {formikProps.values.quotations ? (
                                      formikProps.values.quotations.map((value: any, index) => {
                                        if (formikProps.values.type === 'Sub-consultant') {
                                        }

                                        return (
                                          <div key={index}>
                                            {formikProps.values.type === 'Sub-consultant' ? (
                                              <Field
                                                style={{display: 'none'}}
                                                name={`quotations.${index}.desc`}
                                                value={'-'}
                                              ></Field>
                                            ) : (
                                              <div
                                                className='mb-10'
                                                style={{display: 'flex', alignItems: 'center'}}
                                              >
                                                <Field
                                                  component='textarea'
                                                  rows='3'
                                                  className='form-control form-control-lg form-control-solid'
                                                  name={`quotations.${index}.desc`}
                                                  placeholder='Description'
                                                />
                                              </div>
                                            )}
                                            <div
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: 25,
                                              }}
                                            >
                                              <b style={{marginRight: 7}}>RM</b>
                                              <Field
                                                type='number'
                                                rows='1'
                                                min={0}
                                                className='form-control form-control-lg form-control-solid'
                                                name={`quotations.${index}.amount`}
                                                placeholder='Amount'
                                              />
                                              {index >= 1 ? (
                                                <img
                                                  style={{
                                                    cursor: 'pointer',
                                                    position: 'absolute',
                                                    right: 0,
                                                    marginRight: '5%',
                                                  }}
                                                  onClick={() => arrayHelpers.remove(index)}
                                                  src={toAbsoluteUrl(
                                                    '/media/icons/duotune/general/trash.png'
                                                  )}
                                                ></img>
                                              ) : (
                                                <></>
                                              )}
                                            </div>
                                            <div className='divider mb-5'>{index + 1}</div>
                                          </div>
                                        )
                                      })
                                    ) : (
                                      <></>
                                    )}
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                      {formikProps.values.type !== 'Sub-consultant' && (
                                        <button
                                          type='button'
                                          onClick={() => arrayHelpers.push({desc: '', amount: 0})}
                                        >
                                          Add more fields
                                        </button>
                                      )}

                                      <p
                                        style={{
                                          display: 'flex',
                                          margin: 'auto',
                                          alignItems: 'center',
                                          marginRight: 0,
                                          width: '30%',
                                        }}
                                      >
                                        <b>Total RM: </b>
                                        <span style={{marginLeft: 10}}>
                                          {formikProps.values.quotations!.reduce(
                                            (sum, item: any) => sum + item.amount,
                                            0
                                          )}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                )
                              }}
                            </FieldArray>
                          </div>

                          <div className='fv-row'>
                            {formikProps.values.quotations ? (
                              formikProps.values.quotations.map((quotations: any, index) => {
                                return (
                                  <div key={index}>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`quotations.${index}.desc`} />
                                    </div>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`quotations.${index}.amount`} />
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 4 */}
                      <div data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <div className='fv-row'>
                            <label className='required fs-5 fw-bold mb-2'>Payment Schedule</label>

                            <FieldArray name='payment_term'>
                              {(arrayHelpers) => {
                                return (
                                  <div>
                                    {formikProps.values.payment_term ? (
                                      formikProps.values.payment_term.map((value: any, index) => {
                                        return (
                                          <div
                                            className='mb-10'
                                            key={index}
                                            style={{alignItems: 'center'}}
                                          >
                                            <div style={{display: 'flex'}}>
                                              <div
                                                style={{
                                                  width: '22%',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                }}
                                              >
                                                <b style={{marginRight: 7, marginLeft: 10}}>%</b>
                                                <Field
                                                  type='number'
                                                  min={0}
                                                  max={100}
                                                  rows='1'
                                                  className='form-control form-control-lg form-control-solid'
                                                  name={`payment_term.${index}.percentage`}
                                                  placeholder=''
                                                />
                                              </div>

                                              <Field
                                                style={{width: '78%', marginLeft: 20}}
                                                component='textarea'
                                                rows='1'
                                                className='form-control form-control-lg form-control-solid'
                                                name={`payment_term.${index}.desc`}
                                                placeholder='Description'
                                              />
                                            </div>

                                            <div style={{display: 'flex', marginTop: 20}}>
                                              <div
                                                style={{
                                                  width: '22%',
                                                  margin: 'auto',
                                                  marginRight: 0,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                }}
                                              >
                                                <b style={{marginRight: 7}}>RM</b>
                                                <Field
                                                  type='number'
                                                  min={0}
                                                  disabled
                                                  style={{paddingRight: 0}}
                                                  className='form-control form-control-lg form-control-solid'
                                                  name={`payment_term.${index}.amount`}
                                                  value={
                                                    (value.amount =
                                                      allTotal * (value.percentage / 100))
                                                  }
                                                  placeholder='Amount'
                                                />
                                                {index >= 1 ? (
                                                  <img
                                                    style={{
                                                      cursor: 'pointer',
                                                      position: 'absolute',
                                                      right: 0,
                                                      marginRight: '5%',
                                                    }}
                                                    onClick={() => arrayHelpers.remove(index)}
                                                    src={toAbsoluteUrl(
                                                      '/media/icons/duotune/general/trash.png'
                                                    )}
                                                  ></img>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                              <Field
                                                style={{width: '78%', marginLeft: 20}}
                                                type='date'
                                                className='form-control form-control-lg form-control-solid'
                                                name={`payment_term.${index}.date`}
                                              />
                                            </div>
                                            <></>

                                            <div className='divider mt-5'>{index + 1}</div>
                                          </div>
                                        )
                                      })
                                    ) : (
                                      <></>
                                    )}
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                      <button
                                        type='button'
                                        onClick={() =>
                                          arrayHelpers.push({
                                            percentage: 0,
                                            desc: '',
                                            amount: 0,
                                            date: '',
                                          })
                                        }
                                      >
                                        Add more fields
                                      </button>

                                      <b style={{margin: 'auto', marginRight: 0, width: '30%'}}>
                                        Total RM: {allTotal}{' '}
                                      </b>
                                    </div>
                                  </div>
                                )
                              }}
                            </FieldArray>
                          </div>

                          <div className='fv-row mb-10'>
                            {formikProps.values.payment_term ? (
                              formikProps.values.payment_term.map((value: any, index) => {
                                return (
                                  <div key={index}>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`payment_term.${index}.percentage`} />
                                    </div>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`payment_term.${index}.desc`} />
                                    </div>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`payment_term.${index}.amount`} />
                                    </div>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`payment_term.${index}.date`} />
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className='fv-row mb-7'>
                            <label className='d-flex align-items-center fs-5 fw-bold mb-4'>
                              <span className='required'>Balance Paid</span>

                              {/* <i
                                className='fas fa-exclamation-circle ms-2 fs-7'
                                data-bs-toggle='tooltip'
                                title='Select your app database engine'
                              ></i> */}
                            </label>

                            <div style={{display: 'flex', alignItems: 'center'}}>
                              <b style={{marginRight: 7}}>RM</b>
                              <Field
                                type='number'
                                className='form-control form-control-lg form-control-solid'
                                name='balancePaid'
                                min='0'
                                placeholder='Balance paid'
                              />
                              <div className='text-danger'>
                                <ErrorMessage name='balancePaid' />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 5 */}
                      <div data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <div className='fv-row mb-10'>
                            <label className='required fs-5 fw-bold mb-2'>
                              Proposed project schedule
                            </label>

                            <FieldArray name='projectSchedule'>
                              {(arrayHelpers) => {
                                return (
                                  <div>
                                    {formikProps.values.projectSchedule ? (
                                      formikProps.values.projectSchedule.map(
                                        (value: any, index) => {
                                          return (
                                            <div className='mb-10' key={index}>
                                              <Field
                                                style={{width: '100%'}}
                                                component='textarea'
                                                rows='3'
                                                className='form-control form-control-lg form-control-solid mb-5'
                                                name={`projectSchedule.${index}.desc`}
                                                placeholder='Description'
                                              />

                                              <div
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                }}
                                              >
                                                <Field
                                                  style={{width: '30%'}}
                                                  type='text'
                                                  className='form-control form-control-lg form-control-solid'
                                                  name={`projectSchedule.${index}.week`}
                                                  placeholder='Week'
                                                />

                                                <div
                                                  style={{
                                                    width: '60%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                  }}
                                                >
                                                  <Field
                                                    component='textarea'
                                                    rows='2'
                                                    className='form-control form-control-lg form-control-solid'
                                                    name={`projectSchedule.${index}.remark`}
                                                    placeholder='Remark'
                                                  />

                                                  {index >= 1 ? (
                                                    <img
                                                      style={{
                                                        cursor: 'pointer',
                                                        position: 'absolute',
                                                        right: 0,
                                                        marginRight: '5%',
                                                      }}
                                                      onClick={() => arrayHelpers.remove(index)}
                                                      src={toAbsoluteUrl(
                                                        '/media/icons/duotune/general/trash.png'
                                                      )}
                                                    ></img>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </div>
                                              </div>

                                              <div className='divider mt-3'>{index + 1}</div>

                                              <></>
                                            </div>
                                          )
                                        }
                                      )
                                    ) : (
                                      <></>
                                    )}
                                    <button
                                      type='button'
                                      onClick={() =>
                                        arrayHelpers.push({desc: '', week: '', remark: ''})
                                      }
                                    >
                                      Add more fields
                                    </button>
                                  </div>
                                )
                              }}
                            </FieldArray>
                          </div>

                          <div className='fv-row'>
                            {formikProps.values.projectSchedule ? (
                              formikProps.values.projectSchedule.map((value: any, index) => {
                                return (
                                  <div key={index}>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`projectSchedule.${index}.desc`} />
                                    </div>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`projectSchedule.${index}.week`} />
                                    </div>
                                    <div className='text-danger'>
                                      <ErrorMessage name={`projectSchedule.${index}.remark`} />
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>

                      <div data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <div className='pb-lg-3'>
                            <label className='required fs-6 fw-bold form-label'>
                              Venue Address
                            </label>
                          </div>
                          <div className='d-flex flex-column fv-row mb-3'>
                            {/* <label className='d-flex align-items-center fs-6 fw-bold form-label mb-2'>
                              <span className='required'>Name On Card</span>
                              <i
                                className='fas fa-exclamation-circle ms-2 fs-7'
                                data-bs-toggle='tooltip'
                                title="Specify a card holder's name"
                              ></i>
                            </label> */}

                            <Field
                              type='text'
                              className='form-control form-control-solid mb-3'
                              placeholder='Address#1'
                              name='address1'
                            />
                            <div className='text-danger'>
                              <ErrorMessage name='address1' />
                            </div>
                            <Field
                              type='text'
                              className='form-control form-control-solid mb-3'
                              placeholder='Address#2'
                              name='address2'
                            />
                            <Field
                              type='text'
                              className='form-control form-control-solid'
                              placeholder='Address#3'
                              name='address3'
                            />
                          </div>
                          <div
                            className='d-flex mb-3 fv-row'
                            style={{justifyContent: 'space-between'}}
                          >
                            <Field
                              type='text'
                              onKeyPress={(event: any) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              maxLength={5}
                              style={{width: '30%'}}
                              className='form-control form-control-solid'
                              placeholder='Zip'
                              name='zip'
                            />
                            <Field
                              type='text'
                              style={{width: '30%'}}
                              className='form-control form-control-solid'
                              placeholder='City'
                              name='city'
                            />

                            <Field
                              as='select'
                              style={{width: '30%'}}
                              className='form-select form-select-solid'
                              placeholder='State'
                              name='state'
                            >
                              <option></option>
                              <option value='Kelantan'>Kelantan</option>
                              <option value='Johor'>Johor</option>
                              <option value='Terengganu'>Terengganu</option>
                              <option value='Pahang'>Pahang</option>
                              <option value='Perak'>Perak</option>
                              <option value='Perlis'>Perlis</option>
                              <option value='Kedah'>Kedah</option>
                              <option value='KL'>WP Kuala Lumpur</option>
                              <option value='Selangor'>Selangor</option>
                              <option value='N9'>Negeri Sembilan</option>
                              <option value='Labuan'>WP Labuan</option>
                              <option value='Sabah'>Sabah</option>
                              <option value='Melaka'>Melaka</option>
                              <option value='Sarawak'>Sarawak</option>
                            </Field>
                          </div>
                          <div
                            className='d-flex mb-10 fv-row'
                            style={{justifyContent: 'space-between'}}
                          >
                            <div className='text-danger' style={{width: '30%'}}>
                              <ErrorMessage name='zip' />
                            </div>
                            <div className='text-danger' style={{width: '30%'}}>
                              <ErrorMessage name='city' />
                            </div>
                            <div className='text-danger' style={{width: '30%'}}>
                              <ErrorMessage name='state' />
                            </div>
                          </div>
                          <div className='d-flex flex-column mb-3 fv-row'>
                            <label className='fs-6 fw-bold form-label mb-2'>Person in charge</label>

                            <div className='position-relative'>
                              <Field
                                type='text'
                                className='form-control form-control-solid'
                                placeholder='Poc'
                                name='poc'
                              />
                              {/* <div className='position-absolute translate-middle-y top-50 end-0 me-5'>
                                <img
                                  src={toAbsoluteUrl('/media/svg/card-logos/visa.svg')}
                                  alt=''
                                  className='h-25px'
                                />
                                <img
                                  src={toAbsoluteUrl('/media/svg/card-logos/mastercard.svg')}
                                  alt=''
                                  className='h-25px'
                                />
                                <img
                                  src={toAbsoluteUrl('/media/svg/card-logos/american-express.svg')}
                                  alt=''
                                  className='h-25px'
                                />
                              </div> */}
                            </div>
                          </div>

                          <div
                            className='mb-7 fv-row'
                            style={{display: 'flex', justifyContent: 'space-between'}}
                          >
                            <div style={{width: '40%'}}>
                              <label className='fs-6 fw-bold form-label mb-2'>E-mail</label>

                              <div className='position-relative'>
                                <Field
                                  type='text'
                                  className='form-control form-control-solid'
                                  placeholder='E-mail'
                                  name='email'
                                />
                              </div>
                            </div>
                            <div style={{width: '40%'}}>
                              <label className='fs-6 fw-bold form-label mb-2'>Contact</label>

                              <div className='position-relative'>
                                <Field
                                  type='text'
                                  className='form-control form-control-solid'
                                  placeholder='Contact'
                                  name='contact'
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <h1 className='fw-bolder text-dark mb-3'>Review!</h1>

                          {formikProps.values.type === 'Sub-consultant' ? (
                            <>
                              <div className='text-muted fw-bold fs-3 mb-15'>
                                Please review if needed before submission.
                              </div>
                              <PDFViewer
                                style={{display: 'none', height: 500, width: 500, marginBottom: 10}}
                              >
                                <MyDocument formikProps={formikProps} />
                              </PDFViewer>
                            </>
                          ) : (
                            <>
                              <div className='text-muted fw-bold fs-3 mb-5'>
                                Review the generated pdf.
                              </div>
                              <PDFViewer style={{height: 500, width: 500, marginBottom: 10}}>
                                <MyDocument formikProps={formikProps} />
                              </PDFViewer>
                            </>
                          )}

                          <div className='d-flex flex-column mb-7 fv-row'>
                            <label className='fs-6 fw-bold form-label mb-2'>Additional note</label>
                            <div className='position-relative'>
                              <Field
                                component='textarea'
                                rows='4'
                                className='form-control form-control-lg form-control-solid'
                                placeholder='Note'
                                name='note'
                              />
                            </div>
                          </div>
                          <div className='d-flex flex-column mb-3 fv-row'>
                            <label className='fs-6 fw-bold form-label mb-4'>
                              Additional attachments/files
                            </label>
                            <div className='position-relative'>
                              <Field
                                type='file'
                                name='files'
                                multiple
                                onChange={(e: any) => {
                                  onChangeFiles(e)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='d-flex flex-stack pt-10'>
                        <div className='me-2'>
                          <button
                            onClick={() => prevStep(formikProps.values)}
                            type='button'
                            className='btn btn-lg btn-light-primary me-3'
                            data-kt-stepper-action='previous'
                          >
                            <KTSVG
                              path='/media/icons/duotune/arrows/arr063.svg'
                              className='svg-icon-4 me-1'
                            />
                            Back
                          </button>
                        </div>

                        <div>
                          {stepper.current?.currentStepIndex !== 7 && (
                            <button type='submit' className='btn btn-lg btn-primary me-3'>
                              <span className='indicator-label'>
                                Continue
                                <KTSVG
                                  path='/media/icons/duotune/arrows/arr064.svg'
                                  className='svg-icon-3 ms-2 me-0'
                                />
                              </span>
                            </button>
                          )}
                          {stepper.current?.currentStepIndex === 7 && (
                            <button
                              disabled={formikProps.isSubmitting}
                              type='submit'
                              data-bs-dismiss='modal'
                              className='btn btn-lg btn-primary me-3'
                            >
                              <span className='indicator-label'>
                                Submit
                                <KTSVG
                                  path='/media/icons/duotune/arrows/arr064.svg'
                                  className='svg-icon-3 ms-2 me-0'
                                />
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Proposed = (fee: any) => {
  var totalProposed = 0

  return fee.props.formikProps.values.quotations ? (
    fee.props.formikProps.values.quotations.map((value: any, index: number) => {
      totalProposed += Number(value.amount)

      allTotal = totalProposed
      return (
        <div key={index}>
          <View style={[styles.row]}>
            <Text style={[styles.cell, {width: '5%', borderRight: 0, borderBottom: 0}]}>
              {index + 1}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  width: '70%',
                  borderRight: 0,
                  textAlign: 'left',
                  paddingLeft: 10,
                  paddingBottom: 10,
                  borderBottom: 0,
                },
              ]}
            >
              {value.desc}
            </Text>
            <Text style={[styles.cell, {width: '25%', borderBottom: 0}]}>{value.amount}</Text>
          </View>
          <View style={[styles.row]}>
            {fee.props.formikProps.values.quotations?.length === index + 1 && (
              <>
                <Text style={[styles.cell, {width: '5%', borderRight: 0}]}>{index + 2}</Text>
                <Text
                  style={[
                    styles.cell,
                    {
                      width: '70%',
                      borderRight: 0,
                      textAlign: 'left',
                      paddingLeft: 10,
                      paddingBottom: 10,
                    },
                  ]}
                >
                  Total
                </Text>
                <Text style={[styles.cell, {width: '25%', fontWeight: 'bold'}]}>
                  {totalProposed}
                </Text>
              </>
            )}
          </View>
        </div>
      )
    })
  ) : (
    <></>
  )
}

const Term = (term: any) => {
  var totalTerm = 0

  return term.props.formikProps.values.payment_term ? (
    term.props.formikProps.values.payment_term.map((value: any, index: number) => {
      totalTerm += Number(value.amount)
      return (
        <div key={index}>
          <View style={[styles.row]}>
            <Text style={[styles.cell, {width: '5%', borderRight: 0, borderBottom: 0}]}>
              {index + 1}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  width: '70%',
                  borderRight: 0,
                  textAlign: 'left',
                  paddingLeft: 10,
                  paddingBottom: 10,
                  borderBottom: 0,
                },
              ]}
            >
              {value.percentage}% {value.desc}
            </Text>
            <Text style={[styles.cell, {width: '25%', borderBottom: 0}]}>{value.amount}</Text>
          </View>
          <View style={[styles.row]}>
            {term.props.formikProps.values.payment_term?.length === index + 1 && (
              <>
                <Text style={[styles.cell, {width: '5%', borderRight: 0}]}>{index + 2}</Text>
                <Text
                  style={[
                    styles.cell,
                    {
                      width: '70%',
                      borderRight: 0,
                      textAlign: 'left',
                      paddingLeft: 10,
                      paddingBottom: 10,
                    },
                  ]}
                >
                  Total
                </Text>
                <Text style={[styles.cell, {width: '25%', fontWeight: 'bold'}]}>{totalTerm}</Text>
              </>
            )}
          </View>
        </div>
      )
    })
  ) : (
    <></>
  )
}

const MyDocument = (props: any) => (
  <Document>
    <Page style={styles.page} size='A4'>
      <View style={styles.table}>
        <Text style={{fontSize: 11, fontWeight: 1000, marginBottom: 15}}>
          Table 1.0: Proposed Fee for Preparing the {props.formikProps.values.workType}
        </Text>
        <View style={[styles.row]}>
          <Text
            style={[styles.headerText, styles.cell, {width: '5%', borderRight: 0, borderBottom: 0}]}
          >
            #
          </Text>
          <Text
            style={[
              styles.headerText,
              styles.cell,
              {width: '70%', borderRight: 0, borderBottom: 0, paddingLeft: '7%'},
            ]}
          >
            Description
          </Text>
          <Text style={[styles.headerText, styles.cell, {width: '25%', borderBottom: 0}]}>
            Amount (RM)
          </Text>
        </View>
        <Proposed props={props} />

        <Text style={{fontSize: 11, fontWeight: 1000, marginBottom: 15, marginTop: 50}}>
          Table 2.0: Schedule of Payment for Preparing the {props.formikProps.values.workType}
        </Text>
        <View style={[styles.row]}>
          <Text
            style={[styles.headerText, styles.cell, {width: '5%', borderRight: 0, borderBottom: 0}]}
          >
            #
          </Text>
          <Text
            style={[
              styles.headerText,
              styles.cell,
              {width: '70%', borderRight: 0, borderBottom: 0, paddingLeft: '7%'},
            ]}
          >
            Term of Payment
          </Text>
          <Text style={[styles.headerText, styles.cell, {width: '25%', borderBottom: 0}]}>
            Amount (RM)
          </Text>
        </View>
        <Term props={props} />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: 9,
            marginTop: 5,
            textAlign: 'left',
            lineHeight: 1.5,
            paddingRight: 30,
          }}
        >
          <Text>Note: </Text>
          <Text> - </Text>
          <Text>
            {' '}
            Make all cheque payable to TROPICAL GROWTH (M) SDN BHD or kindly bank in to TROPICAL
            GROWTH (M) SDN BHD (Maybank Account no: 553038601340)
          </Text>
        </View>
      </View>
    </Page>

    <Page style={styles.page} size='A4'>
      <View style={styles.table}>
        <Text style={{fontSize: 11, fontWeight: 1000, marginBottom: 15}}>
          Table 3.0: Proposed Project Schedule
        </Text>
        <View style={[styles.row]}>
          <Text
            style={[styles.headerText, styles.cell, {width: '5%', borderRight: 0, borderBottom: 0}]}
          >
            #
          </Text>
          <Text
            style={[
              styles.headerText,
              styles.cell,
              {width: '55%', borderRight: 0, borderBottom: 0},
            ]}
          >
            Description
          </Text>
          <Text
            style={[
              styles.headerText,
              styles.cell,
              {width: '15%', borderRight: 0, borderBottom: 0},
            ]}
          >
            Week No
          </Text>
          <Text style={[styles.headerText, styles.cell, {width: '25%', borderBottom: 0}]}>
            Remarks
          </Text>
        </View>
        {props.formikProps.values.projectSchedule ? (
          props.formikProps.values.projectSchedule.map((value: any, index: number) => {
            return (
              <div key={index}>
                <View style={[styles.row]}>
                  {props.formikProps.values.projectSchedule?.length !== index + 1 ? (
                    <>
                      <Text style={[styles.cell, {width: '5%', borderRight: 0, borderBottom: 0}]}>
                        {index + 1}
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          {
                            width: '55%',
                            borderRight: 0,
                            textAlign: 'left',
                            paddingLeft: 10,
                            paddingBottom: 10,
                            borderBottom: 0,
                          },
                        ]}
                      >
                        {value.desc}
                      </Text>
                      <Text style={[styles.cell, {width: '15%', borderBottom: 0, borderRight: 0}]}>
                        {value.week}
                      </Text>
                      <Text style={[styles.cell, {width: '25%', borderBottom: 0}]}>
                        {value.remark}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.cell, {width: '5%', borderRight: 0}]}>{index + 1}</Text>
                      <Text
                        style={[
                          styles.cell,
                          {
                            width: '55%',
                            borderRight: 0,
                            textAlign: 'left',
                            paddingLeft: 10,
                            paddingBottom: 10,
                          },
                        ]}
                      >
                        {value.desc}
                      </Text>
                      <Text style={[styles.cell, {width: '15%', borderRight: 0}]}>
                        {value.week}
                      </Text>
                      <Text style={[styles.cell, {width: '25%'}]}>{value.remark}</Text>
                    </>
                  )}
                </View>
              </div>
            )
          })
        ) : (
          <></>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: 9,
            marginTop: 5,
            textAlign: 'left',
            lineHeight: 1.5,
            paddingRight: 30,
          }}
        >
          <Text>Note: </Text>
          <Text> - </Text>
          <Text>
            {' '}
            This proposed schedule however, will be very much depending on delivery of requested
            information, payment made by project proponent on every stage of claim. Any delay may
            affect the overall schedule of {props.formikProps.values.workType} preparation and
            submission.
          </Text>
        </View>
      </View>
    </Page>
  </Document>
)

const styles = StyleSheet.create({
  page: {flexDirection: 'column', padding: 25, textAlign: 'center', marginTop: 30},
  table: {
    fontSize: 10,
    // alignItems: 'stretch'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  cell: {
    borderStyle: 'solid',
    borderWidth: 1.5,
    paddingTop: 9,
    // flexShrink: 1,
    // flexGrow: 1,
    // alignSelf: "stretch"
  },
  headerText: {
    fontSize: 11,
    justifyContent: 'center',
    fontWeight: 'bold',
    paddingBottom: 5,
  },
})

export {Main, MyDocument}
