import {Navbar,Container,Button} from 'react-bootstrap';
import {MdAddCircle} from 'react-icons/md';
function Header(){
    return(
    <Navbar bg="dark" variant="dark">
    <Container className="wrapper">
      <Navbar.Brand href="/">
        <img
          alt=""
          src="/logo.png"
          width="30"
          height="30"
          className="d-inline-block align-top logo"
        />{' '}
      Prosper
      </Navbar.Brand>
      <div className="new-scheme-wrapper">
                        <Button  onClick={(e) => {e.preventDefault();window.location.href='/newscheme';}} className="new-scheme-button"><MdAddCircle size={40} /></Button>
        </div>
    </Container>
  </Navbar>
    )
}
export default Header;