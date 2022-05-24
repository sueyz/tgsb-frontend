import { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { initialQuotations, Quotations } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/QuotationsListLoading'
import { updateQuotation, uploadAttachements } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { QuotationEditModalHeader } from './QuotationsEditModalHeader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Props = {
  isUserLoading: boolean
  quotations: Quotations
}

const editBalanceSchema = Yup.object().shape({
  balancePaid: Yup.number()
    .min(1)
    .required('Amount Paid is required')
})

const QuotationEditModalForm: FC<Props> = ({ quotations, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [file, setFile] = useState<File[]>()

  const onChangeFiles = (e: any) => {
    console.log(e.target.files)
    setFile(e.target.files)
  }

  const [userForEdit] = useState<Quotations>({
    ...quotations,
    balancePaid: quotations.balancePaid || initialQuotations.balancePaid,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch() // ni yang buat refreshe tanpa reload
    }
    setItemIdForUpdate(undefined) // ni wat modal tuutp
  }

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editBalanceSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      if (isNotEmpty(values.id)) {

        if (file !== undefined) {
          let fd = new FormData()

          Array.from(file).forEach(async (file) => {
            fd.append("attachments", file);

          });
          const results = await uploadAttachements(fd)
          Array.from(results).forEach((element: any) => {
            values.attachments?.push(`quotations/${element.filename}`)
          });
        }

        await updateQuotation(values)
        cancel(true)
      }
    },
  })

  var total = 0

  quotations.quotations?.forEach((element: any) => {
    total += element.amount
  })


  return (
    <>
      <ToastContainer position='bottom-center' />
      <QuotationEditModalHeader checkUser={quotations.id} />

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
          <div className='fv-row mb-3 d-flex flex-d-row' style={{ alignItems: 'center' }}>
            <label className='form-label fw-bolder text-dark fs-6 me-5'>RM</label>
            <input
              placeholder='Amount Paid'
              type='number'
              min={1}
              autoComplete='off'
              {...formik.getFieldProps('balancePaid')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                { 'is-invalid': formik.touched.balancePaid && formik.errors.balancePaid },
                {
                  'is-valid': formik.touched.balancePaid && !formik.errors.balancePaid,
                }
              )}
            />
            <p  className='form-label fw-bolder fs-6 ms-5'>/</p>
            <p  className='form-label fs-6 ms-5'>{total}</p>


          </div>
          {formik.touched.balancePaid && formik.errors.balancePaid && (
            <div className='fv-plugins-message-container'>
              <div className='mt-2 fv-help-block'>
                <span role='alert' style={{ color: '#f1416c' }}>
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
              type="file"
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
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { QuotationEditModalForm, }
