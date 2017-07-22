import React, { Component } from 'react';
import {render} from 'react-dom';

import '../styles/styles.scss';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';


class Hello extends Component {
    render() {
        var place = "hello";
        return (
            <h1>hello {place}</h1>
        );
    }
}

render(<Hello/>, document.getElementById('react-container'));