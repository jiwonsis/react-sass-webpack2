import React from 'react';
import {render} from 'react-dom';

import KanbanBoardContainer from './KanbanBoardContainer'

import '../styles/styles.scss';
// import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';



render(<KanbanBoardContainer />, document.querySelector('#root'));


