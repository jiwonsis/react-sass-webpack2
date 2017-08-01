import React from 'react';
import ReactDOM from 'react-dom';

import KanbanBoard from './KanbanBoard'

import '../styles/styles.scss';
// import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

let cardList = [
    {
        id: 1,
        title: "Read the book",
        description: "I should read the whole book",
        status: "in-progress",
        tasks: []
    },{
        id: 2,
        title: "write some code",
        description: "Code along with the samples in the book",
        status: "todo",
        tasks: [
            {
                id: 1,
                name: "ContactList Example",
                done: true
            },{
                id: 2,
                name: "The kanban Example",
                done: false
            },{
                id: 3,
                name: "My own experiments",
                done: false
            }
        ]
    },
];

ReactDOM.render(<KanbanBoard cards={cardList} />, document.querySelector('#root'));