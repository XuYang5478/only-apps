import React from "react";
import { FlexboxGrid, Nav, Panel, Placeholder } from "rsuite";

class Covid extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            area: "China"
        };
    }

    render() {
        let {Paragraph } = Placeholder;
        return (
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={18}>
                    <div style={{height:"16px"}}></div>
                    <Nav appearance="tabs" activeKey={this.state.area} onSelect={(area)=>this.setState({area})} >
                        <Nav.Item eventKey="China">国内</Nav.Item>
                        <Nav.Item eventKey="Global">全球</Nav.Item>
                    </Nav>

                    <Panel bordered style={{marginTop: "18px"}}>
                        <Paragraph active rows={15}></Paragraph>
                    </Panel>

                    
                </FlexboxGrid.Item>
            </FlexboxGrid>
        );
    }
}

const CovidPage = Covid;
export default CovidPage;