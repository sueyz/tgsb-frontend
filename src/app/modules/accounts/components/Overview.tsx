/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useLocation} from 'react-router'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack'
import {SizeMe} from 'react-sizeme'

import {FileIcon, defaultStyles} from 'react-file-icon'
import {useMutation} from 'react-query'
import {deleteQuotation, deletePdf} from '../../quotations/quotations-list/core/_requests'
import {confirm} from 'react-confirm-box'
import {useNavigate} from 'react-router'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {PDFViewer} from '@react-pdf/renderer'
import {MyDocument} from '../../../../_metronic/partials'

export function Overview() {
  const isAdmin = useSelector<RootState>(({auth}) => auth.user?.role, shallowEqual)

  const location: any = useLocation()
  const navigate = useNavigate()

  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({numPages}: any) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  const deleteItem = useMutation(() => deleteQuotation(location.state.original.id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      navigate('/quotations/list')

      // ✅ update detail view directly
      // queryClient.invalidateQueries([`${QUERIES.QUOTATION_LIST}-${query}`])
    },
  })

  const deletePdfItem = useMutation(
    (element: {path: any; attachments: any}) => deletePdf(location.state.original.id, element),
    {
      // 💡 response of the mutation is passed to onSuccess

      onSuccess: (response: any) => {
        // ✅ update detail view directly
        // setLoading(false);

        // console.log(response)
        location.state.original = response // nak antar  ni ke overview

        navigate('/quotations/overview', {
          state: {original: location.state.original, company_info: location.state.company_info},
        })

        // setHistory(60)
      },
    }
  )

  const match = location.state.original.attachments.find((element: any) => {
    if (element.includes('_Quotations_summary')) {
      return true
    }
  })

  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Quotation Details</h3>
          </div>
          {location.state.original.lock === false ? (
            <button
              style={{margin: 'auto', marginRight: 20, padding: 7}}
              type='button'
              className='btn btn-danger'
              onClick={async () => {
                const result = await confirm('Are you sure?')
                if (result) {
                  // setLoading(true)
                  await deleteItem.mutateAsync()
                  return
                }
              }}
            >
              Delete Quotation
            </button>
          ) : (
            <></>
          )}
          {location.state.original.lock === false ? (
            <button
              style={{padding: 7}}
              className='btn btn-primary align-self-center'
              onClick={() => {
                navigate('/quotations/settings', {
                  state: {
                    original: location.state.original,
                    company_info: location.state.company_info,
                  },
                })
              }}
            >
              Edit Quotation
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Invoice No</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6'>{location.state.original.invoiceNo}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Quotation Name</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{location.state.original.name}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Quotation Type</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6'>{location.state.original.type}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Company In Charge</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6'>{location.state.company_info.name}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Work Type</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6'>{location.state.original.workType}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Address</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6'>
                {location.state.original.address1},{' '}
                {location.state.original.address2 ? location.state.original.address2 + ',' : ''}{' '}
                {location.state.original.address3 ? location.state.original.address3 + ',' : ''}{' '}
                {location.state.original.zip}, {location.state.original.city},{' '}
                {location.state.original.state}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Person In Charge</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {location.state.original.poc ? location.state.original.poc : '-'}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Phone</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {location.state.original.contact ? location.state.original.contact : '-'}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Email</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {location.state.original.email ? location.state.original.email : '-'}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Note</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6'>
                {location.state.original.note ? location.state.original.note : '-'}
              </span>
            </div>
          </div>

          <div className='row mb-10'>
            <label className='col-lg-4 fw-bold text-muted'>Lock</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{location.state.original.lock.toString()}</span>
            </div>
          </div>

          <div className='row mb-10'>
            <label className='col-lg-4 fw-bold text-muted'>Attachments</label>

            <div className='col-lg-8'>
              {location.state.original.attachments.map((element: any, i: number) => {
                var str = element.replace('quotations/', '')
                var last: any = str.substring(str.lastIndexOf('.') + 1)

                return (
                  <div key={i} style={{marginBottom: 7, display: 'flex', alignItems: 'center'}}>
                    {str.substring(str.indexOf('_') + 1).includes('Quotations_summary') ||
                    location.state.original.lock === true ? (
                      <></>
                    ) : (
                      <span
                        onClick={async () => {
                          var placeholder = {
                            path: element,
                            attachments: location.state.original.attachments,
                          }

                          await deletePdfItem.mutateAsync(placeholder)
                        }}
                        style={{
                          marginRight: 15,
                          fontSize: 25,
                          fontWeight: 'bold',
                          color: '#000',
                          cursor: 'pointer',
                        }}
                      >
                        &times;
                      </span>
                    )}

                    <div style={{width: 20, marginRight: 15}}>
                      <FileIcon extension={last} {...(defaultStyles as any)[last]} />
                    </div>
                    <Link
                      to={toAbsoluteUrl(`/documents/${element}`)}
                      target='_blank'
                      download={str.substring(str.indexOf('_') + 1)}
                    >
                      {str.substring(str.indexOf('_') + 1)}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '8%' }}>

          <button
            type="button"
            className='btn'
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            {"<"}
          </button>
          <a style={{ marginLeft: 10, marginRight: 10 }}>
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </a>
          <button
            type="button"
            className='btn'
            disabled={pageNumber >= (numPages ? numPages : 0)}
            onClick={nextPage}
          >
            {">"}
          </button>
        </div> */}
        {/* <ToastContainer position='bottom-center' />
        <SizeMe>
          {({ size }) => (
            <Document file={toAbsoluteUrl(`/documents/${match}`)} onLoadSuccess={onDocumentLoadSuccess} onLoadError={
              (error) => toast('Error while loading document! ' + error.message)
            }>
              <Page width={size.width ? size.width : 1} pageNumber={pageNumber} />
            </Document>
          )}
        </SizeMe> */}

        {location.state.original.type === 'Regular' && (
          <PDFViewer showToolbar={false} width='100%' height='700px'>
            <MyDocument formikProps={{values: location.state.original}} />
          </PDFViewer>
        )}

        {/* <ChartsWidget1 className='card-xxl-stretch mb-5 mb-xl-10' /> */}
      </div>

      {/* <div className='row gy-10 gx-xl-10'>
        

        <div className='col-xl-6'>
          <TablesWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ListsWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div> */}
    </>
  )
}
