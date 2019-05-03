import React, { Component } from 'react';
import Form from './Form';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blog: null
        };
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: `/blogs/${this.props.match.params.id}`,
        }).then((response) => {

            let { data } = response.data;

            this.setState({
                blog: data
            });
        })
    }

    render() {
        let { blog } = this.state;
        return (
            blog ?
                <Form {...this.props} blog={blog} type="edit" />
                :
                <CSSTransition
                    key="load_blog"
                    in={!blog}
                    timeout={1000}
                    classNames={'fade-fast'}
                    unmountOnExit
                >
                    <div className="page_overlay">
                        Fetching...
                    </div>

                </CSSTransition>
        )
    }
}

export default Edit;