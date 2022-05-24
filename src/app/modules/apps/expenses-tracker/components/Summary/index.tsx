import incomeImg from "../../assets/income.svg";
import outcomeImg from "../../assets/outcome.svg";
import totalImg from "../../assets/total.svg";
import { useTransactions } from "../../hooks/useTransactions";

import { Container } from "./styles";

export function Summary() {
  // getting context data
  const { transactions } = useTransactions();

  const summary = transactions.reduce(
    (acc, transaction) => {

      if (transaction.type === "deposit") {
        acc.deposits += transaction.amount;
        acc.total += transaction.amount;
      } else {
        acc.withdraws += transaction.amount;
        acc.total -= transaction.amount;
      }

      if (transaction.isDebt) {
        if (transaction.type === "deposit") {
          acc.debtTotal += transaction.amount;
        } else {
          acc.debtTotal -= transaction.amount;
        }

      }

      // return acc with deposits, withdraws and total
      return acc;
    },
    {
      // starter
      deposits: 0,
      withdraws: 0,
      debtTotal: 0,
      total: 0,
    }
  );

  return (
    <Container>
      <div>
        <header>
          <p>Income</p>
          <img src={incomeImg} alt="Entradas" />
        </header>
        <strong>
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "MYR",
          }).format(summary.deposits)}
        </strong>
      </div>
      <div>
        <header>
          <p>Expenses</p>
          <img src={outcomeImg} alt="Saídas" />
        </header>
        <strong>
          -{" "}
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "MYR",
          }).format(summary.withdraws)}
        </strong>
      </div>
      <div className="highlight-background-red">
        <header>
          <p>Debt Balance</p>
          <img src={totalImg} alt="Total" />
        </header>
        <strong>
          {" "}
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "MYR",
          }).format(summary.debtTotal)}
        </strong>
      </div>
      <div className="highlight-background">
        <header>
          <p>Total Balance</p>
          <img src={totalImg} alt="Total" />
        </header>
        <strong>
          {" "}
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "MYR",
          }).format(summary.total)}
        </strong>
      </div>
    </Container>
  );
}
