import { useTransactions } from '../../hooks/useTransactions';
import { Container } from "./styles";
import { ID, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import React from 'react';


var count = 0
var lastLength = 0

interface HeaderProps {
  clickHandler: (transaction: any) => any;

}

export function TransactionsTable({ clickHandler }: HeaderProps) {
  const { transactions, deleteTransaction } = useTransactions();


  async function handleDeleteTransaction(id: ID) {
    await deleteTransaction(id);
  }


  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            if (lastLength !== transactions.length) {
              lastLength = transactions.length
              count = 0
            }
            count++
            if (count >= transactions.length + 1)
              count = 1
            return (
              <React.Fragment key={transaction.id}>
                <tr>
                  <td style={{ fontWeight: 900 }}><img style={{ cursor: 'pointer' }} src={toAbsoluteUrl('/media/icons/duotune/arrows/arr013.svg')} data-bs-toggle="collapse" data-bs-target={"#a" + transaction.id} aria-expanded="false" aria-controls={'a' + transaction.id} />
                    {" " + (count-transactions.length - 1)*-1}
                  </td>
                  <td>
                    {"   " + transaction.title} </td>
                  <td className={transaction.type}>
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "MYR",
                    }).format(transaction.amount)}
                  </td>
                  <td>{transaction.category} {
                  (transaction.isDebt && transaction.type.includes('withdraw'))? "(Debt)" : (transaction.isDebt && transaction.type.includes('deposit')) ? "(Refund)" : ""}</td>
                  <td>
                    {new Intl.DateTimeFormat('en-GB', {}).format(new Date(transaction.createdAt))}
                  </td>
                  <td><img style={{ cursor: 'pointer', marginRight: 15 }} src={toAbsoluteUrl('/media/icons/duotune/general/pencil.png')} onClick={() =>

                    clickHandler(transaction)
                  }

                  />
                    <img style={{ cursor: 'pointer' }} src={toAbsoluteUrl('/media/icons/duotune/general/trash.png')} onClick={() => handleDeleteTransaction(transaction.id)} />
                  </td>

                </tr>

                <tr>
                  <td key={'a' + transaction.id} colSpan={6} style={{ padding: 0 }} className="collapse" id={'a' + transaction.id}>
                    <div className="card card-body" style={{ borderRadius: 0, color: 'white', backgroundColor: "#1E1E2D" }}>
                      <p><b>Bank: </b>{transaction.bank} </p>
                      <p><b>Card type: </b>{transaction.card_type} </p>
                      <p><b>Note: </b>{transaction.note} </p>
                      {transaction.category === 'Petty cash' ? <p><b>Lend/Upfronted by: </b>{transaction.lent_upfronted} </p> : <></>}
                      {/* {transaction.category === 'Petty cash' ? <p><b>Refund: </b>{transaction.refund} </p> : <></>}
                      {transaction.category === 'Petty cash' ? <p><b>Claim date: </b>{new Intl.DateTimeFormat('en-GB', {}).format(new Date(transaction.claim_date))} </p> : <></>} */}


                    </div>
                  </td>
                </tr>

              </React.Fragment>



            );
          })}
        </tbody>
      </table>
    </Container>
  );
}


