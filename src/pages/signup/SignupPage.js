import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SignupPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: "#ccc",
        flexDirection: "column",
      }}
    >
      <div>ລົງທະບຽນນຳໃຊ້</div>
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 10,
          backgroundColor: "#ffffff",
        }}
      >
        <Form style={{ width: "100%" }}>
          <Form.Group className="mb-3">
            <Form.Label>ຊື່ຮ້ານ</Form.Label>
            <Form.Control type="text" placeholder="name" />
            {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>ເບີໂທ</Form.Label>
            <Form.Control type="text" placeholder="Ex: 02098765432" />
            {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>ເມວ</Form.Label>
            <Form.Control type="email" placeholder="example@mail.com" />
            {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>ລະຫັດຜ່ານ</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group> */}
          <Button variant="primary" type="submit">
            Sign up
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SignupPage;
