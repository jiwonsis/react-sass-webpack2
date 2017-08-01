import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../styles/styles.scss';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

class Main extends Component {
    render(){
        return (
            <div>
                <h2>Hello!</h2>
            </div>
        )
    }
}


ReactDOM.render(<Main/>, document.querySelector('.main'));