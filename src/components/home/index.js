import { FlexboxGrid } from 'rsuite';
import { Route, Switch } from 'react-router-dom';
import MyApp from './MyApp'
import TodoPage from '../todo';
import { connect } from 'react-redux';

function MyAppPanel(props) {
    return props.user ? (
        <FlexboxGrid justify="center" align="top" style={{marginTop:"20px"}}>
            <FlexboxGrid.Item colspan={13}>
                <MyApp />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1}></FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6}>
                <div style={{ backgroundColor: "lightcyan", height: "300px" }}></div>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    ) : (<NewerPage />);
}
const HomePanel = connect((store) => { return { user: store.userReducer.user } })(MyAppPanel);


const header1Style = {
    fontSize: "54px",
    lineHeight: "130%",
    fontWeight: "600"
}

const header4Style = {
    fontSize: "1.7em",
    lineHeight: "140%",
    fontWeight: "400",
    color: "#c4f0ff",
    marginTop: "30px"
}

function NewerPage() {
    return (
        <div style={{ backgroundColor: "#3498ff", color: "white",}}>
            <div style={{ padding: "10% 0" }}>
                <FlexboxGrid justify="center" style={{marginBottom: "50px"}}>
                    <FlexboxGrid.Item colspan={14}>
                        <h1 style={header1Style}>Only APPs</h1>
                        <h1 style={header1Style}>简单、纯净、好用</h1>
                        <h4 style={header4Style}>这是一个apps集合网站，里面有精心设计过的各种小应用和实用工具，帮助您高效规划生活，完成目标。
                            只需一个账号便可获得全部功能。你想要的，这里都有。</h4>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={7}>

                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    )
}

function HomePage(props) {
    return (
        <Switch>
            <Route path="/todo" component={TodoPage} />

            <Route path="/" component={HomePanel} />
        </Switch>
    )
};

export default HomePage;