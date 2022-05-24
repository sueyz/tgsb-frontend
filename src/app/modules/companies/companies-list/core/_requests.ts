import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../_metronic/helpers'
import {Companies, CompaniesQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const COMPANY_URL = `${API_URL}/company`
const COMPANY_IMAGE_UPLOAD_URL = `${API_URL}/company/upload`
const GET_COMPANIES_URL = `${API_URL}/company/query`

const getCompanies = (query: string): Promise<CompaniesQueryResponse> => {
  return axios
    .get(`${GET_COMPANIES_URL}?${query}`)
    .then((d: AxiosResponse<CompaniesQueryResponse>) => d.data)
}

const getCompaniesById = (id: ID): Promise<Companies | undefined> => {
  return axios
    .get(`${COMPANY_URL}/${id}`)
    .then((response: AxiosResponse<Response<Companies>>) => response.data)
    .then((response: Response<Companies>) => response.data)
}

const createCompanies = (company: Companies): Promise<Companies | undefined> => {
  return axios
    .post(`${COMPANY_URL}/register`, company)
    .then((response: AxiosResponse<Response<Companies>>) => response.data)
    .then((response: Response<Companies>) => response.data)
}

const uploadImage = (file: FormData) => {
  return axios
    .post(COMPANY_IMAGE_UPLOAD_URL, file, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response.data.filename
    })
}

const updateCompanies = (company: Companies): Promise<Companies | undefined> => {
  return axios
    .put(`${COMPANY_URL}/${company.id}`, company)
    .then((response: AxiosResponse<Response<Companies>>) => response.data)
    .then((response: Response<Companies>) => response.data)
}

const deleteCompanies = (companyId: ID): Promise<void> => {
  return axios.delete(`${COMPANY_URL}/${companyId}`).then(() => {})
}

const deleteSelectedCompanies = (companyIds: Array<ID>): Promise<void> => {
  const requests = companyIds.map((id) => axios.delete(`${COMPANY_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

export {getCompanies, deleteCompanies, deleteSelectedCompanies, getCompaniesById, createCompanies, updateCompanies, uploadImage}
