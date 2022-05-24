import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { NewTransactionModal } from "./components/NewTransactionModal";
import { TransactionsProvider } from "./hooks/useTransactions";

import { GlobalStyle } from "./styles/global";
const expensesBreadcrumbs: Array<PageLink> = [
  {
    title: 'Expenses dashboard',
    path: '/apps/expenses-tracker/expenses',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ExpensesPage = () => {
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] =
    useState(false);

  function handleOpenNewTransactionModal() {
    setIsNewTransactionModalOpen(true);
  }

  function handleCloseNewTransactionModal() {
    setIsNewTransactionModalOpen(false);
  }

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='expenses'
          element={
            <>
              <PageTitle breadcrumbs={expensesBreadcrumbs}>Expenses tracker</PageTitle>
              <TransactionsProvider>
                <Header onOpenNewTransactionModal={handleOpenNewTransactionModal} />

                <Dashboard />

                <NewTransactionModal
                  isOpen={isNewTransactionModalOpen}
                  onRequestClose={handleCloseNewTransactionModal}
                ></NewTransactionModal>

                <GlobalStyle />
              </TransactionsProvider>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/expenses-tracker/expenses' />} />
    </Routes>
  )
}

export default ExpensesPage
