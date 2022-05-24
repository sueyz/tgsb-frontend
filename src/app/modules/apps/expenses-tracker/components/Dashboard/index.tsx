import { Summary } from '../Summary';
import { TransactionsTable } from '../TransactionsTable';
import useState from 'react-usestateref'
import { NewTransactionModal } from "../NewTransactionModal";

import { Container } from './styles'

export function Dashboard() {
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] =
    useState(false);

  const [activeItem, setActiveItem, ref] = useState();


  function handleOpenNewTransactionModal() {
    setIsNewTransactionModalOpen(true);
  }

  function handleCloseNewTransactionModal() {
    setIsNewTransactionModalOpen(false);
  }
  return (
    <Container>
      <Summary />
      <TransactionsTable clickHandler={(transaction) => {
        handleOpenNewTransactionModal()
        setActiveItem(transaction)
        }} />
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onRequestClose={handleCloseNewTransactionModal}
        transaction={ref.current}
      ></NewTransactionModal>
    </Container>
  );
}