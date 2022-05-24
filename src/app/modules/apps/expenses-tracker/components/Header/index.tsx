import logoImg from "../../assets/money.png";
import textImg from "../../assets/tgsbimage.png";

import { Container, Content } from "./styles";

interface HeaderProps {
  onOpenNewTransactionModal: () => void;
}

export function Header({onOpenNewTransactionModal}: HeaderProps) {
  return (
    <Container>
      <Content>
        <img src={logoImg} alt="TGSB bank" />
        <b style={{marginLeft: 20, color: 'white', fontFamily: 'monospace', fontSize: 'xxx-large'}}>TGSB Bank</b>
        <button type="button" onClick={onOpenNewTransactionModal}>
          New transaction
        </button>
      </Content>
    </Container>
  );
}
