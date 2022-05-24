import React, {FormEvent, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {IProfileDetails} from '../SettingsModel'
import * as Yup from 'yup'
import {ErrorMessage, Field, FieldArray, Form, Formik, useFormik, useFormikContext} from 'formik'
import {useLocation, useNavigate} from 'react-router-dom'
import {Companies, CompaniesQueryResponse} from '../../../../companies/companies-list/core/_models'
import axios, {AxiosResponse} from 'axios'
import useState from 'react-usestateref'
import {updateQuotation} from '../../../../quotations/quotations-list/core/_requests'
import {MyDocument} from '../../../../../../_metronic/partials/modals/create-app/Main'
import ReactPDF, {PDFViewer} from '@react-pdf/renderer'

const profileDetailsSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  company: Yup.string().required('Company is required'),
  workType: Yup.string().required('Work Type is required'),
  address1: Yup.string().required('Address 1 is required'),
  zip: Yup.string().required('Zip is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  quotations: Yup.array()
    .of(
      Yup.object({
        desc: Yup.string().required().label('Description'),
        amount: Yup.number().required().label('Amount'),
      })
    )
    .min(1, 'Quotations'),
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
  projectSchedule: Yup.array()
    .of(
      Yup.object({
        desc: Yup.string().required().label('Description'),
        week: Yup.string().required().label('Week'),
      })
    )
    .min(1, 'Project schedule'),
  balancePaid: Yup.number().required('Balance Paid is required'),
  // note: Yup.string().required('Time zone is required'),
  // currency: Yup.string().required('Currency is required'),
})
const API_URL = process.env.REACT_APP_THEME_API_URL
const GET_COMPANIES_URL = `${API_URL}/company/?`
const PDF_UPLOAD_URL = `${API_URL}/quotations/pdf`

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

const getCompanies = (text: String): Promise<CompaniesQueryResponse> => {
  return axios
    .get(`${GET_COMPANIES_URL}${text}`)
    .then((d: AxiosResponse<CompaniesQueryResponse>) => d.data)
}

const QuotationDetails: React.FC = () => {
  const location: any = useLocation()

  // console.log(location.state.original)

  const initialValues: IProfileDetails = {
    id: location.state.original.id,
    invoiceNo: location.state.original.invoiceNo,
    name: location.state.original.name,
    type: location.state.original.type,
    company: location.state.original.company,
    address1: location.state.original.address1,
    address2: location.state.original.address2,
    address3: location.state.original.address3,
    zip: location.state.original.zip,
    city: location.state.original.city,
    state: location.state.original.state,
    quotations: location.state.original.quotations,
    balancePaid: location.state.original.balancePaid,
    payment_term: location.state.original.payment_term,
    projectSchedule: location.state.original.projectSchedule,
    note: location.state.original.note,
    poc: location.state.original.poc,
    contact: location.state.original.contact,
    email: location.state.original.email,
    workType: location.state.original.workType,
    attachments: location.state.original.attachments,
    lock: location.state.original.lock,

    // lName: 'Smith',
    // company: 'Keenthemes',
    // contactPhone: '044 3276 454 935',
    // companySite: 'keenthemes.com',
    // country: '',
    // language: '',
    // timeZone: '',
    // currency: '',
    // communications: {
    //   email: false,
    //   phone: false,
    // },
    // allowMarketing: false,
  }

  const [data, setData] = useState<IProfileDetails>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [company, setCompany, refCompany] = useState<Companies[]>()
  const [placeholder, setPlaceholder, refPlaceholder] = useState(true) //not sure how this work without the ref thing

  const navigate = useNavigate()

  const FormObserver: React.FC = () => {
    const {values} = useFormikContext<any>()
    useEffect(() => {
      const fetchData = async () => {
        var {data} = await getCompanies(values.type)
        setCompany(data)
      }

      if (placeholder) {
        setPlaceholder(false)
        fetchData()
      }
    }, [values])
    return null
  }

  const [loading, setLoading] = useState(false)
  // const formik = useFormik<IProfileDetails>({
  //   initialValues,
  //   enableReinitialize: true,
  //   validationSchema: profileDetailsSchema,
  //   onSubmit: (values) => {
  //     setLoading(true)
  //     // setTimeout(() => {
  //     //   values.communications.email = data.communications.email
  //     //   values.communications.phone = data.communications.phone
  //     //   values.allowMarketing = data.allowMarketing
  //     //   const updatedData = Object.assign(data, values)
  //     //   setData(updatedData)
  //     //   setLoading(false)
  //     // }, 1000)
  //   },
  // })

  const handleOnChange = async (event: FormEvent) => {
    setPlaceholder(true)
  }

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Quotation Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <Formik
          validationSchema={profileDetailsSchema}
          initialValues={initialValues}
          onSubmit={async (values) => {
            setLoading(true)

            let fd2 = new FormData()
            const newFormat = {
              values: values,
            }

            fd2.append('pdf', await ReactPDF.pdf(<MyDocument formikProps={newFormat} />).toBlob())

            const result2 = await uploadPdf(fd2)
            var newArray = values.attachments?.filter(
              (element) => !element.includes('Quotations_summary')
            )
            newArray?.push(`quotations/${result2}`)
            values.attachments?.push(`quotations/${result2}`)

            await updateQuotation(values).then((response) => {
              values.attachments = newArray
              location.state.original = values // ni hantar alik atas je

              if (refCompany.current !== undefined) {
                let obj = refCompany.current.find(
                  (o: any) => o.id === location.state.original.company
                )

                location.state.company_info = obj
              }

              navigate('/quotations/overview', {
                state: {
                  original: location.state.original,
                  company_info: location.state.company_info,
                },
              })
            })
          }}
          enableReinitialize
        >
          {(formik) => (
            <Form onChange={handleOnChange} onSubmit={formik.handleSubmit} className='form'>
              <FormObserver />
              <div className='card-body border-top p-9'>
                {/* <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Avatar</label>
              <div className='col-lg-8'>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{ backgroundImage: `url(${toAbsoluteUrl('/media/avatars/blank.png')})` }}
                >
                  <div
                    className='image-input-wrapper w-125px h-125px'
                    style={{ backgroundImage: `url(${toAbsoluteUrl(data.avatar)})` }}
                  ></div>
                </div>
              </div>
            </div> */}

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                    Balance Paid
                  </label>

                  <div className='col-lg-8'>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <b style={{marginRight: 7}}>RM</b>
                      <Field
                        type='number'
                        className='form-control form-control-lg form-control-solid'
                        name='balancePaid'
                        min='0'
                        placeholder='Balance paid'
                      />
                    </div>
                    <div className='text-danger mt-3'>
                      <ErrorMessage name='balancePaid' />
                    </div>
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                    Quotation Name
                  </label>

                  <div className='col-lg-8'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Quotation name'
                      {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className='fv-plugins-message-container mt-2'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                    Quotation Type
                  </label>
                  <div className='col-lg-8 fv-row'>
                    <Field
                      as='select'
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('type')}
                    >
                      <option value='Regular'>Regular Quotation</option>
                      <option value='Sub-consultant'>Sub-consultant Quotation</option>
                    </Field>
                    {formik.touched.type && formik.errors.type && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                    Company In Charge
                  </label>
                  <div className='col-lg-8 fv-row'>
                    <Field
                      as='select'
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('company')}
                    >
                      {refCompany.current ? (
                        refCompany.current.length > 0 ? (
                          refCompany.current.map((company: Companies, i) => {
                            return (
                              <option key={i} value={company.id?.toString()}>
                                {company.name}
                              </option>
                            )
                          })
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </Field>
                    {formik.touched.company && formik.errors.company && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.company}
                        </span>
                      </div>
                    )}
                    <i className='form-text'>
                      If company is not in the list, please add first at the companies page
                    </i>
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>Work Type</label>

                  <div className='col-lg-8 fv-row'>
                    <Field
                      as='select'
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('workType')}
                    >
                      <option value='EIA'>Environmental Impact Asssesment</option>
                      <option value='EMT'>Environmental Mark Assesment</option>
                      <option value='DSR'>Dynamic Search Rescue</option>
                    </Field>
                    {formik.touched.workType && formik.errors.workType && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.workType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Address 1</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='#Address 1'
                      {...formik.getFieldProps('address1')}
                    />
                    {formik.touched.address1 && formik.errors.address1 && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.address1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Address 2</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='#Address 2'
                      {...formik.getFieldProps('address2')}
                    />
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Address 3</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='#Address 3'
                      {...formik.getFieldProps('address3')}
                    />
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Zip</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <Field
                      type='text'
                      onKeyPress={(event: any) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault()
                        }
                      }}
                      maxLength={5}
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Zip'
                      {...formik.getFieldProps('zip')}
                    />
                    {formik.touched.zip && formik.errors.zip && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.zip}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>City</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='City'
                      {...formik.getFieldProps('city')}
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.city}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>State</label>

                  <div className='col-lg-8 fv-row'>
                    <Field
                      as='select'
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('state')}
                    >
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
                    {formik.touched.state && formik.errors.state && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert' style={{color: '#f1416c'}}>
                          {formik.errors.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Proposed Fee</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <FieldArray name='quotations'>
                      {(arrayHelpers) => {
                        return (
                          <div>
                            {formik
                              .getFieldProps('quotations')
                              .value.map((value: any, index: number) => {
                                return (
                                  <div key={index}>
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
                                          style={{cursor: 'pointer', marginLeft: 20}}
                                          onClick={() => arrayHelpers.remove(index)}
                                          src={toAbsoluteUrl(
                                            '/media/icons/duotune/general/trash.png'
                                          )}
                                        ></img>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    <div className='fv-row'>
                                      <div key={index}>
                                        <div className='text-danger'>
                                          <ErrorMessage name={`quotations.${index}.desc`} />
                                        </div>
                                        <div className='text-danger'>
                                          <ErrorMessage name={`quotations.${index}.amount`} />
                                        </div>
                                      </div>
                                    </div>
                                    <div className='divider mb-5'>{index + 1}</div>
                                  </div>
                                )
                              })}
                            <div style={{display: 'flex', alignItems: 'center'}}>
                              <button
                                type='button'
                                onClick={() => arrayHelpers.push({desc: '', amount: 0})}
                              >
                                Add more fields
                              </button>

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
                                  {formik
                                    .getFieldProps('quotations')
                                    .value.reduce((sum: any, item: any) => sum + item.amount, 0)}
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      }}
                    </FieldArray>
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Payment Schedule</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <FieldArray name='payment_term'>
                      {(arrayHelpers) => {
                        return (
                          <div>
                            {formik
                              .getFieldProps('payment_term')
                              .value.map((value: any, index: number) => {
                                return (
                                  <div className='mb-10' key={index} style={{alignItems: 'center'}}>
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

                                    <div
                                      style={{display: 'flex', marginTop: 20, alignItems: 'center'}}
                                    >
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
                                              formik
                                                .getFieldProps('quotations')
                                                .value.reduce(
                                                  (sum: any, item: any) => sum + item.amount,
                                                  0
                                                ) *
                                              (value.percentage / 100))
                                          }
                                          placeholder='Amount'
                                        />
                                      </div>
                                      <Field
                                        style={{width: '78%', marginLeft: 20}}
                                        type='date'
                                        className='form-control form-control-lg form-control-solid'
                                        name={`payment_term.${index}.date`}
                                      />
                                      {index >= 1 ? (
                                        <img
                                          style={{cursor: 'pointer', marginLeft: 20}}
                                          onClick={() => arrayHelpers.remove(index)}
                                          src={toAbsoluteUrl(
                                            '/media/icons/duotune/general/trash.png'
                                          )}
                                        ></img>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    <></>

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

                                    <div className='divider mt-5'>{index + 1}</div>
                                  </div>
                                )
                              })}
                            <div style={{display: 'flex', alignItems: 'center'}}>
                              <button
                                type='button'
                                onClick={() =>
                                  arrayHelpers.push({percentage: 0, desc: '', amount: 0, date: ''})
                                }
                              >
                                Add more fields
                              </button>

                              <b style={{margin: 'auto', marginRight: 0, width: '30%'}}>
                                Total RM:{' '}
                                {formik
                                  .getFieldProps('quotations')
                                  .value.reduce((sum: any, item: any) => sum + item.amount, 0)}{' '}
                              </b>
                            </div>
                          </div>
                        )
                      }}
                    </FieldArray>
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Payment Schedule</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <FieldArray name='projectSchedule'>
                      {(arrayHelpers) => {
                        return (
                          <div>
                            {formik
                              .getFieldProps('projectSchedule')
                              .value.map((value: any, index: number) => {
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

                                    <div className='divider mt-3'>{index + 1}</div>

                                    <></>
                                  </div>
                                )
                              })}
                            <button
                              type='button'
                              onClick={() => arrayHelpers.push({desc: '', week: '', remark: ''})}
                            >
                              Add more fields
                            </button>
                          </div>
                        )
                      }}
                    </FieldArray>
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>Person In Charge</label>

                  <div className='col-lg-8'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='POC'
                      {...formik.getFieldProps('poc')}
                    />
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>Phone</label>

                  <div className='col-lg-8'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Phone'
                      {...formik.getFieldProps('contact')}
                    />
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>E-mail</label>

                  <div className='col-lg-8'>
                    <Field
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='E-mail'
                      {...formik.getFieldProps('email')}
                    />
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>Note</label>

                  <div className='col-lg-8'>
                    <Field
                      component='textarea'
                      rows='4'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Note'
                      {...formik.getFieldProps('note')}
                    />
                  </div>
                </div>
              </div>

              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-primary'>
                  {!loading && 'Save Changes'}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export {QuotationDetails}
