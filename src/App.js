import React from "react";
import { Alert, Avatar, Button, Container, Content, ControlLabel, Dropdown, Footer, Form, FormControl, FormGroup, Header, Icon, Loader, Modal, Nav, Navbar, Uploader } from "rsuite";
import axios from "axios";
import { nanoid } from "nanoid";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userLogin, userLogout } from "./store/users";
import HomePage from './components/home';


function Topbar(props) {
  let user = props.user;
  let localUser = localStorage.getItem("ONLYAPPS_USER");

  if (user===null&&localUser !== null) {
    props.userLogin(JSON.parse(localUser));
  }

  return (
    <Navbar appearance={"inverse"}>
      <Navbar.Header>
        <h3 style={{ margin: "6px 8px 0 16px" }}><Link to="/">Only APPs</Link></h3>
      </Navbar.Header>
      <Navbar.Body>
        <Nav>
          <Link to="/"><Nav.Item>首页</Nav.Item></Link>
          <Nav.Item>所有应用</Nav.Item>
        </Nav>

        <Nav pullRight>
          {user ? (
            <div>
              <Avatar circle src={user.avatarUrl} style={{marginTop: "8px"}} />
              <Dropdown title={user.username}>
                <Dropdown.Item icon={<Icon icon="user" />}>个人中心</Dropdown.Item>
                <Dropdown.Item icon={<Icon icon="cog" />}>设置</Dropdown.Item>
                <a onClick={props.userLogout} style={{ color: "#575757" }} href="#">
                  <Dropdown.Item icon={<Icon icon="sign-out" />}>退出</Dropdown.Item>
                </a>
              </Dropdown>
            </div>
            ) : (
            <div>
              <Nav.Item>
                <RegistModal />
              </Nav.Item>
              <Nav.Item>
                <LoginModal />
              </Nav.Item>
            </div>
          )}
        </Nav>
      </Navbar.Body>
    </Navbar>
  )
}

const TopMenuBar = connect(
  (store) => { return { user: store.userReducer.user } },
  (dispatch) => {
    return {
      userLogin: (user) => dispatch(userLogin(user)),
      userLogout: () => dispatch(userLogout())
    }
  })(Topbar);

class RegistModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      qiniuToken: '',
      avatarKey: '',
      fileInfo: null,
      uploading: false,
      avatarUrl: '',
      formValue: {
        username: '',
        password: '',
        c_password: ''
      },
      formError: {
        username: null,
        password: null,
        c_password: null
      }
    };
  }

  componentDidMount() {
    axios.post("/api/qiniu_token", {
      AccessKey: "HnLWPldUcH1OubvrnwgvFd9IGb9dkE-SFXYe49fr",
      SecretKey: "zKHAYatojAqVQk49HrbCE_JammLr8AxNlwS2JyLa",
      Bucket: "xjbdevelop"
    }).then(response => {
      if (response.status === 200) {
        let qiniuToken = response.data;
        let avatarKey = nanoid();
        this.setState({ qiniuToken, avatarKey });
      } else {
        console.warn(response);
      }
    }).catch(e => {
      console.warn(e);
    });
  }


  open = () => { this.setState({ show: true }) };
  close = () => { this.setState({ show: false }) };

  handleChange = (value) => {
    this.setState({ formValue: value });
    let formError = {
      username: null,
      password: null,
      c_password: null
    };
    if (value.username === '') {
      formError.username = "用户名不能为空！";
    } else {
      formError.username = null;
    }
    if (value.password === '') {
      formError.password = "密码不能为空！";
    } else {
      formError.password = null;
    }
    if (value.password !== value.c_password) {
      formError.c_password = "与密码不一致！";
    } else {
      formError.c_password = null;
    }
    this.setState({ formError });
  }

  handleSubmit = () => {
    let formError = {
      username: null,
      password: null,
      c_password: null
    };
    let flag = true;
    if (this.state.formValue.username === '') {
      formError.username = "用户名不能为空！";
      flag = false;
    }
    if (this.state.formValue.password === '') {
      formError.password = "密码不能为空！";
      flag = false;
    }
    if (this.state.formValue.password !== this.state.formValue.c_password) {
      formError.c_password = "与密码不一致！";
      flag = false;
    }

    if (flag) {
      let user = {
        username: this.state.formValue.username,
        password: this.state.formValue.password,
        avatarUrl: this.state.avatarUrl
      };
      axios.post("/api/register", user)
        .then(response => {
          console.log(response.data);
        }).catch(e => {
          console.warn(e);
        });

      this.setState({
        avatarKey: '',
        fileInfo: null,
        uploading: false,
        avatarUrl: '',
        formValue: {
          username: '',
          password: '',
          c_password: ''
        },
        formError: {
          username: null,
          password: null,
          c_password: null
        }
      });
      this.close();
      Alert.success("注册成功，请使用新账户登陆。");
    } else {
      this.setState({ formError });
    }
  }

  onUpload = (file) => {
    this.setState({ uploading: true });
    let reader = new FileReader();
    reader.readAsDataURL(file.blobFile);
    reader.onloadend = () => {
      this.setState({ fileInfo: reader.result })
    };
  }

  uploadSuccess = (response, file) => {
    let avatarUrl = "http://qn.onlyapps.cn/" + response.key;
    this.setState({ uploading: false, avatarUrl });
    console.log("上传成功，url：", avatarUrl);
  }

  uploadFailed = () => {
    this.setState({ uploading: false, fileInfo: null });
    console.log("上传失败");
  }

  render() {
    return (
      <div>
        <a onClick={this.open} style={{ color: "white", textDecoration: "none" }} href="#">
          <Icon icon="user" />&nbsp;&nbsp;注册
        </a>

        <Modal backdrop="static" show={this.state.show} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>注册</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form fluid onChange={this.handleChange}>
              <FormGroup>
                <ControlLabel>头像：</ControlLabel>
                <Uploader fileListVisible={false}
                  action="https://upload-z2.qiniup.com/"
                  data={{
                    token: this.state.qiniuToken,
                    key: this.state.avatarKey
                  }}
                  onUpload={this.onUpload}
                  onSuccess={this.uploadSuccess}
                  onError={this.uploadFailed}
                >
                  <button>
                    {this.state.uploading && <Loader backdrop center />}
                    {this.state.fileInfo ? <img src={this.state.fileInfo} width="150px" height="150px" alt="头像" />
                      : <Icon icon="avatar" size="5x" />}
                  </button>
                </Uploader>
              </FormGroup>
              <FormGroup>
                <ControlLabel>用户名：</ControlLabel>
                <FormControl name="username" required={true}
                  errorMessage={this.state.formError.username} errorPlacement="bottomStart"></FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>密码：</ControlLabel>
                <FormControl name="password" type="password"
                  errorMessage={this.state.formError.password} errorPlacement="bottomStart"></FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>确认密码：</ControlLabel>
                <FormControl name="c_password" type="password"
                  errorMessage={this.state.formError.c_password} errorPlacement="bottomStart"></FormControl>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="primary" onClick={this.handleSubmit}>确定</Button>
            <Button onClick={this.close}>取消</Button>
          </Modal.Footer>
        </Modal>

      </div>
    )
  }

}

class Login extends React.Component {
  state = {
    show: false,
    formValue: {
      username: '',
      password: ''
    },
    error: null
  }

  open = () => { this.setState({ show: true }) };
  close = () => { this.setState({ show: false, formValue: { username: '', password: '' }, error: null }) };

  handleChange = (value) => {
    this.setState({ formValue: value, error: null });
  }

  handleLogin = () => {
    axios.post("/api/login", this.state.formValue)
      .then(response => {
        if (response.status === 200) {
          let data = response.data;
          if (data.id > 0) {
            this.props.userLogin(data);
            this.close();
            Alert.success("欢迎回来，" + data.username + " ~");
          } else {
            this.setState({ error: "帐号或密码错误，请检查后重新登录。" });
          }
        } else {
          console.warn(response);
          this.setState({ error: `网络链接错误（${response.status}），请稍后再试。` });
      }
      }).catch(e => {
        console.warn(e);
        this.setState({ error: `未知错误：${e}` });
    })
  }

  render() {
    return (
      <div>
        <a onClick={this.open} style={{
          color: "white", textDecoration: "none",
          backgroundColor: "#003f8c", padding: "5px 8px", borderRadius:"5px"
        }} href="#">
          <Icon icon="sign-in" />&nbsp;&nbsp;登入
        </a>
        

        <Modal backdrop="static" show={this.state.show} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>登入</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form fluid formValue={this.state.formValue} onChange={this.handleChange}>
              <FormGroup>
                <ControlLabel>用户名/手机号</ControlLabel>
                <FormControl name="username" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>密码</ControlLabel>
                <FormControl name="password" type="password" />
              </FormGroup>
            </Form>
            {this.state.error ? (<p style={{color: "red", marginTop: "5px"}}>{ this.state.error}</p>):null}
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="primary" onClick={this.handleLogin}>确定</Button>
            <Button onClick={this.close}>取消</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  };
}
const LoginModal = connect(
  (store) => {
    return { user: store.userReducer.user }
  },
  (dispatch) => {
    return {
      userLogin: (user) => dispatch(userLogin(user)),
      userLogout: () => dispatch(userLogout)
    }
  })(Login);

function App() {
  return (
    <Container>
      <Header>
        <TopMenuBar />
      </Header>
      <Content>
        <HomePage />
      </Content>
      <Footer>
      </Footer>
    </Container>
  );
}

export default App;
