import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import _map from 'lodash/map';

class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blog: null,
            errors: {},
            comments: [],
            is_submitting: false
        };

        this.handlePostComment = this.handlePostComment.bind(this);
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

    handlePostComment() {
        let _this = this;

        if (!this.state.is_submitting) {
            this.setState({
                is_submitting: true
            }, async () => {
                try {
                    await axios({
                        method: 'post',
                        url: `/blogs/${this.props.match.params.id}/comment`,
                        data: {
                            name: this.name.value,
                            comment: this.comment.value,
                        },
                    })
                        .then(function ({ status, data }) {
                            console.log(data);
                            if (status === 200) {
                                _this.setState({
                                    blog: data.data
                                });

                                console.log(_this.state.blog);
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
                    this.setState({
                        errors: { error: ["Unknown Error."] },
                        is_submitting: false
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

    render() {
        let { blog, errors, is_submitting } = this.state;
        let { auth } = this.props;

        return (
            <section className="show container">
                {
                    blog ?
                        <article>
                            <h1 className="title">
                                {blog.title}
                            </h1>

                            <div className="desc">
                                {ReactHtmlParser(blog.body)}
                            </div>

                            <div className="details">
                                <i className="fas fa-clock"></i> {blog.created_at_readable}
                            </div>
                        </article>
                        :
                        <div>Loading</div>
                }

                {blog &&
                    <div className="reply_section">
                        {
                            blog.comments &&
                            <ul className="comment_list">
                                {blog.comments.map((comment) => {
                                    return <li key={`comment_${comment.id}`}>
                                        <div className="name">{comment.name} says:</div>
                                        <div className="at">{comment.created_at_readable}</div>
                                        {comment.comment}
                                    </li>
                                })}
                            </ul>
                        }

                        <h3>Leave a reply</h3>

                        <form>
                            {Object.keys(errors).length ? <ul className="error_list">{this.renderErrors(errors)}</ul> : null}
                            <div className="form-group">
                                <label>Name</label>
                                <input ref={element => this.name = element} defaultValue={auth ? auth.name : ''} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea ref={element => this.comment = element} className="form-control" />
                            </div>

                            <button type="button" className={`${is_submitting ? 'disabled' : ''}`} onClick={this.handlePostComment}>
                                {is_submitting ? 'Submitting' : 'Submit'}
                            </button>
                        </form>
                    </div>
                }
            </section>
        );
    }
}

export default Show;