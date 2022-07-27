import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function CenterColumn(
  props: {
    children: JSX.Element;
  }
) {
  return (
    <Row className='justify-content-center'>
      <Col md={10} lg={8}>
        {props.children}
      </Col>
    </Row>
  );
}
