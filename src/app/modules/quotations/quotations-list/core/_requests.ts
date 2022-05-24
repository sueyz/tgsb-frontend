import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../_metronic/helpers'
import {Quotations, QuotationsQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const QUOTATIONS_URL = `${API_URL}/quotations`
const GET_QUOTATIONS_URL = `${API_URL}/quotations/query`
const ATTACHMENTS_UPLOAD_URL = `${API_URL}/quotations/upload`

const getQuotations = (query: string): Promise<QuotationsQueryResponse> => {
  return axios
    .get(`${GET_QUOTATIONS_URL}?${query}`)
    .then((d: AxiosResponse<QuotationsQueryResponse>) => d.data)
}

const getCurrentQuotations = (): Promise<QuotationsQueryResponse> => {
  return axios
    .get(`${QUOTATIONS_URL}/current`)
    .then((d: AxiosResponse<QuotationsQueryResponse>) => d.data)
}

const getQuotationsById = (id: ID): Promise<Quotations | undefined> => {
  return axios
    .get(`${QUOTATIONS_URL}/${id}`)
    .then((response: AxiosResponse<Response<Quotations>>) => response.data)
    .then((response: Response<Quotations>) => response.data)
}

const updateQuotation = (quotation: Quotations): Promise<Quotations | undefined> => {
  return axios
    .put(`${QUOTATIONS_URL}/${quotation.id}`, quotation)
    .then((response: AxiosResponse<Response<Quotations>>) => response.data)
    .then((response: Response<Quotations>) => response.data)
}

const deletePdf = (
  id: ID,
  object: {path: any; attachments: any}
): Promise<Quotations | undefined> => {
  return axios
    .put(`${QUOTATIONS_URL}/pdf/${id}`, object)
    .then((response: AxiosResponse<Response<Quotations>>) => response.data)
    .then((response: Response<Quotations>) => response.data)
}

const deleteQuotation = (quotationId: ID): Promise<void> => {
  return axios.delete(`${QUOTATIONS_URL}/${quotationId}`).then(() => {})
}

const markQuotation = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.put(`${QUOTATIONS_URL}/lock/${id}`))
  return axios.all(requests).then(() => {})
}

const unlockQuotation = (quotationId: ID): Promise<void> => {
  return axios.put(`${QUOTATIONS_URL}/unlock/${quotationId}`).then(() => {})
}

const uploadAttachements = (file: FormData) => {
  return axios
    .post(ATTACHMENTS_UPLOAD_URL, file, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response)
      return response.data.files
    })
}

export {
  getCurrentQuotations,
  getQuotations,
  deleteQuotation,
  markQuotation,
  getQuotationsById,
  updateQuotation,
  deletePdf,
  uploadAttachements,
  unlockQuotation,
}
