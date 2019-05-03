import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import _map from 'lodash/map';
import _delay from 'lodash/delay';
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: this.props.blog ? this.props.blog.body : '',
            errors: {},
            is_submitting: false,
            is_submitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(value) {
        this.setState({ body: value })
    }

    handleSubmit() {
        let _this = this;
        let { type, blog } = this.props;

        if (!this.state.is_submitting) {
            this.setState({
                is_submitting: true
            }, async () => {
                try {
                    let { body } = this.state;

                    await axios({
                        method: 'post',
                        url: type === "edit" ? `/blogs/${blog.id}` : '/blogs',
                        data: {
                            title: this.title.value,
                            body,
                        },
                    })
                        .then(function ({ status }) {
                            if (status === 200) {
                                _this.setState({
                                    is_submitted: true,
                                }, () => {
                                    _delay(function () {
                                        _this.props.history.push(`/`);
                                    }, 1000);
                                });
                            }

                            _this.setState({
                                is_submitting: false,
                            });
                        })
                        .catch(function (err) {
                            _this.setState({
                                errors: (err.response !== undefined) ? err.response.data.errors : { error: ["Unknown Error."] },
                                is_submitting: false
                            });
                        })
                }
                catch (err) {
                    let { response } = err;

                    if (response !== undefined && response.status == 401) {
                        this.setState({
                            errors: { error: [response.data.message] }
                        });
                    }
                    else {
                        this.setState({
                            errors: { error: ["Unknown Error."] }
                        });
                    }

                    this.setState({
                        is_submitting: false,
                    });
                }
            });


        }
    }

    renderErrors(errors) {
        return _map(errors, (el, i) => {
            return <li className="text-danger" key={`error_${i}`}>{el[0]}</li>
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.auth !== this.props.auth) {
            if (this.props.auth.role !== "admin") {
                this.props.history.push('/');
            }
        }
    }

    componentDidMount() {
        // this.props.history.push(`/`);
    }

    render() {
        let { errors, is_submitting, is_submitted } = this.state;
        let { blog, auth } = this.props;

        return (
            auth ?
                <section className="create container">

                    <CSSTransition
                        key="filter_logo"
                        in={is_submitted}
                        timeout={1000}
                        classNames={'fade-fast'}
                        unmountOnExit
                    >
                        <div className="overlay">
                            <i className="fas fa-check text-success"></i>
                        </div>

                    </CSSTransition>

                    {Object.keys(errors).length ? <ul className="error_list">{this.renderErrors(errors)}</ul> : null}

                    <form>
                        <div className="row">
                            <div className="col-md-12 form-group">
                                <label>Title:</label>
                                <input ref={element => this.title = element} className="form-control" defaultValue={blog ? blog.title : ""} />
                            </div>

                            <div className="col-md-12 form-group">
                                <label>Body:</label>
                                <ReactQuill
                                    defaultValue={blog ? blog.body : ""}
                                    onChange={this.handleChange} />
                            </div>
                        </div>

                        <button type="button" className={`${is_submitting ? 'disabled' : ''}`} onClick={this.handleSubmit}>
                            {is_submitting ? 'Submitting' : 'Submit'}
                        </button>
                    </form>
                </section >
                : <div></div>
        );
    }
}

export default withRouter(Form);