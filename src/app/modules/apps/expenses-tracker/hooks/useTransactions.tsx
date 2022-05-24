import { createContext, useEffect, useState, ReactNode, useContext } from "react";
// import { api } from "../services/api";
import axios from "axios";
import { ID } from "../../../../../_metronic/helpers";


interface Transaction {
  id: ID;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
  bank: string;
  card_type: string,
  note: string;
  isDebt: boolean,
  lent_upfronted: string;
  // refund: number;
  // claim_date: string;
}

const API_URL = process.env.REACT_APP_THEME_API_URL
// const TRANSACTION_URL = `${API_URL}/expenses`
const TRANSACTION_URL = `${API_URL}/expenses/transactions`


type TransactionInput = Omit<Transaction, "id" | "createdAt">;

// ReactNode = general typing for children elements (components)
interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
  deleteTransaction: (transactionId: ID) => Promise<void>;
  updateTransaction: (transaction: TransactionInput, transactionId: ID) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

// receive all children elements and provide data
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    axios
      .get(TRANSACTION_URL)
      .then((response: any) => {
        setTransactions(response.data.transactions.reverse())}
      );
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    // post -> used for insertion
    const response = await axios.post(TRANSACTION_URL, {
      ...transactionInput,
    });
    const { transaction } = response.data; // saving transaction data from axios

    setTransactions([...transactions.reverse(), transaction].reverse());
  }

  async function deleteTransaction(transactionId: ID) {
    await axios.delete(`${TRANSACTION_URL}/${transactionId}`).then((response: any) => {
      setTransactions(response.data.transactions.reverse())}
    );
  }

  async function updateTransaction(transaction: TransactionInput, transactionId: ID) {
    await axios.put(`${TRANSACTION_URL}/${transactionId}`, transaction).then((response: any) => {
      setTransactions(response.data.transactions.reverse())}
    );
  }

  // provide the context data for all children
  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction , deleteTransaction, updateTransaction}}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}