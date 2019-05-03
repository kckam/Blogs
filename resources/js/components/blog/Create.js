import React, { Component } from 'react';
import Form from './Form';

class Create extends Component {
    render() {
        return <Form {...this.props} type="create" />;
    }
}

export default Create;