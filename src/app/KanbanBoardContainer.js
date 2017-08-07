import React, {Component} from 'react';
import update from 'react-addons-update';
import 'whatwg-fetch';
import KanbanBoard from './KanbanBoard'

// 서버를 로컬에서 실행하는 경우 기본 URL은 localhost:3000 이며,
// 로컬 서버에는 권한 부여 헤더가 필요 없다
const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type' : 'application/json',
    Authorization: 'react-react',
};

class KanbanBoardContainer extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            cards: []
        }
    }

    componentDidMount() {
        fetch(API_URL+'/cards', {headers: API_HEADERS})
            .then((response) => response.json())
            .then((responseData) => this.setState({cards: responseData}))
            .catch((error) => {
                console.log('Error fetching and parsing data', error);
            })
    }

    addTask(cardId, taskName) {
        // 낙관적인 UI 변경을 되돌려야 하는 경우를 대비해 변경 전 원래 상태의 참조값을 저장한다.
        let prevState = this.state;

        // 카드에 인덱스를 찾는다
        let cardIndex = this.state.cards.findIndex((card)=>card.id === cardId);

        // 지정된 이름과 임시 ID로 새로운 태스크를 생성한다.
        let newTask = {id: Date.now(), name: taskName, done:false};

        // 새로운 객체를 생성하고 태스트의 배열로 새로운 태스크를 푸시한다.
        let nextState = update(this.state.cards, {
            [cardIndex] : {
                tasks: {$push: [newTask] }
            }
        });

        // 변경된 객체로 컴포넌트 상태를 설정한다.
        this.setState({cards:nextState});

        // API 를 호출해 서버에 해당 테스크를 추가한다.
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        })
            .then((response) => {
                if(response.ok) {
                    return response.json()
                } else {
                    // 서버의 응답의 정상이 아닌경우,
                    // 오류를 생성해 UI에 대한 낙관적인 변경을 원래대로 되돌려놓는다.
                    throw new Error("Server response wasn't OK")
                }
            })
            .then((responseData) => {
                // 서버가 새로운 태스크를 추가하는 데 이용한
                // 확정 ID 를 반환하면 리액스에서 ID를 업데이트 한다.
                newTask.id = responseData.id;
                this.setState({cards:nextState});
            })
            .catch((error) => {
                console.error("Fetch error:",error);
                this.setState(prevState);
            })

    }

    deleteTask(cardId, taskId, taskIndex) {

        // 카드에 인덱스를 찾는다
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

        // 낙관적인 UI 변경을 되돌려야 하는 경우를 대비해 변경 전 원래 상태의 참조값을 저장한다.
        let prevState = this.state;

        // 해당 테스트를 제외한 새로운 객체를 생성한다.
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice: [[taskIndex, 1]] }
            }
        });

        // 변경된 객체로 컴포넌트 상태를 설정한다.
        this.setState({cards:nextState});

        // API 를 호출해 서버에서 해당 태스크를 제거한다.
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
            .then((response) => {
                if(!response.ok) {
                    // 서버의 응답의 정상이 아닌경우,
                    // 오류를 생성해 UI에 대한 낙관적인 변경을 원래대로 되돌려놓는다.
                    throw new Error("Server response wasn't OK")
                }
            })
            .catch((error) => {
                console.error("Fetch error: ", error);
                this.setState(prevState);
            })
    }

    toggleTask(cardId, taskId, taskIndex) {

        // 낙관적인 UI 변경을 되돌려야 하는 경우를 대비해 변경 전 원래 상태의 참조값을 저장한다.
        let prevState = this.state;

        // 카드의 인덱스를 찾는다
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

        // 카드의 "Done" 값에 대한 참조를 저장한다.
        let newDoneValue = undefined;
        // $apply 명령을 이용하여 done 값을 현재와 반대로 변경한다.
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {$apply: (done) => {
                            newDoneValue = !done;
                            return newDoneValue;
                        }}
                    }
                }
            }
        });

        // 변경된 객체로 컴포넌트 상태를 설정한다.
        this.setState({cards: nextState});

        // API 를 호출해 서버에서 해당 태스크를 토글한다.
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done: newDoneValue})
        })
            .then((response) => {
                if (!response.ok) {
                    if(!response.ok) {
                        // 서버의 응답의 정상이 아닌경우,
                        // 오류를 생성해 UI에 대한 낙관적인 변경을 원래대로 되돌려놓는다.
                        throw new Error("Server response wasn't OK")
                    }
                }
            })
            .catch((error) => {
                console.error("Fetch error: ", error);
                this.setState(prevState);
            })

    }

    render() {
        return (
            <KanbanBoard cards={this.state.cards}
                         taskCallbacks={{
                             toggle: this.toggleTask.bind(this),
                             delete: this.deleteTask.bind(this),
                             add: this.addTask.bind(this) }} />
        )
    }
}
export default KanbanBoardContainer;