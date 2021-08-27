import { FlexboxGrid } from 'rsuite';
import { Route, Switch } from 'react-router-dom';
import MyApp from './MyApp'
import todoPage from '../todo';

function HomePanel() {
    return (
        <FlexboxGrid justify="center" align="top">
            <FlexboxGrid.Item colspan={13}>
                <MyApp />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1}></FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6}>
                <div style={{backgroundColor: "lightcyan", height: "300px"}}></div>
            </FlexboxGrid.Item>
        </FlexboxGrid>
        
    );
}

function HomePage(props) {
    return (
        <Switch>
            <Route path="/todo" component={todoPage} />

            <Route path="/" component={HomePanel} />
        </Switch>
    )
};

export default HomePage;