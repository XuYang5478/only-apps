import React from "react";
import { Button, Checkbox, FlexboxGrid, List } from "rsuite";

const finishedTodoStyle = {
    textDecoration: "line-through",
    color: "#aaa"
}

class todoPage extends React.Component {
    render() {
        let todos = [
            "todo 1: 点滴记录，生活不再盲目。",
            "两个结合”的提出，是中国共产党立足百年华诞的重大时刻和“两个一百年”历史交汇的关键节点，对中国共产党不断推动理论创新、进行理论创造的科学总结，是以史为鉴、开创未来，对继续发展当代中国马克思主义、21世纪马克思主义的明确宣示。",
            "建党百年的宝贵经验。在中国人民和中华民族的伟大觉醒中，在马克思列宁主义同中国工人运动的紧密结合中，中国共产党应运而生。在党成立初期和领导革命早期，由于对马克思主义的理解不够深刻，对中国革命实际把握不够准确，曾一度机械地、教条式地理解和运用马克思主义，因而走了不少弯路，甚至使中国革命一度陷入绝境。经过艰辛探索，并在付出惨痛代价后，中国共产党开始认识到马克思主义必须与中国实际相结合才能取得革命成功。1938年，党的六届六中全会正式提出“马克思主义中国化”的重大命题，标志着我们党在理论上开始走向成熟。之后，我们党自觉地推进马克思主义和中国实际相结合，形成了一系列重大理论成果，指导中国革命、建设和改革不断取得成功。"
        ];

        let finished = [
            "“两弹一星”精神是中国共产党人精神谱系的重要组成部分，是载人航天精神之源。",
            "善良的人们无不渴望和平，但在产生战争的社会根源没有消除之前，永久和平是不可能实现的。居安思危、有备无患历来是中国的立国之本，也是从战争中获得的血的教训。面对战争的威胁，我们只能积极应对，加强国防建设，用实力捍卫和平。",
            "伟大事业孕育伟大精神，伟大精神引领伟大事业。在中国共产党领导下，把社会主义制度优势转化为国防科研工作优势，团结凝聚广大国防科研工作者坚定信仰信念，将生命融入使命，以超常的付出把“两弹一星”研制成功，把“两弹一星”精神发扬光大，铸就了辉煌的业绩，为国家在国际舞台上奠定了坚实的大国地位，对于实现全面建成社会主义现代化强国，实现中华民族伟大复兴的中国梦依然具有十分重要的战略意义。"
        ];

        return (
            <div>
                <FlexboxGrid justify="center" style={{ marginBottom: "15px" }}>
                    <FlexboxGrid.Item colspan={18}>
                        <FlexboxGrid align="middle">
                            <FlexboxGrid.Item colspan={20}>
                                <h3>{`有${todos.length}项代办未完成：`}</h3>
                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item colspan={4} style={{ textAlign: "center" }}>
                                <Button appearance="primary">添加</Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FlexboxGrid.Item>
                </FlexboxGrid>

                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={18}>
                        <List>
                            {todos.map((todo, index) => {
                                return (
                                    <List.Item key={index}>
                                        <FlexboxGrid align="middle">
                                            <FlexboxGrid.Item colspan={20}>
                                                <Checkbox>{todo}</Checkbox>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item colspan={4} style={{ textAlign: "center" }}>
                                                <a>编辑</a>&nbsp;&nbsp;
                                                <a style={{color: "red"}}>删除</a>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                );
                            })}

                            {finished.map((todo, index) => {
                                return (
                                    <List.Item key={index}>
                                        <FlexboxGrid align="middle">
                                            <FlexboxGrid.Item colspan={20}>
                                                <Checkbox defaultChecked><span style={finishedTodoStyle}>{todo}</span></Checkbox>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item colspan={4} style={{ textAlign: "center" }}>
                                                <a>编辑</a>&nbsp;&nbsp;
                                                <a style={{ color: "red" }}>删除</a>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                );
                            })}
                            {/* 

                                <List.Item>
                                    <FlexboxGrid align="middle">
                                        <FlexboxGrid.Item colspan={20}>
                                            <Checkbox>“</Checkbox>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={4} style={{ textAlign: "center" }}>
                                            <a>编辑</a>&nbsp;&nbsp;
                                            <a>删除</a>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item> */}
                        </List>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>

        );
    }
}

export default todoPage;