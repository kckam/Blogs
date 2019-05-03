import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _debounce from 'lodash/debounce';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function BlogCard({ blog, auth, handleDelete }) {
    return (
        <div className="blog_card">
            {auth.role === "admin" && <div className="remove-btn text-danger" onClick={(e) => { handleDelete(e, blog.id); }}><i className="fas fa-trash-alt"></i></div>}
            <h2 className="title">{blog.title}</h2>
            <hr />
            <div className="desc">
                <p>
                    {blog.body.replace(/(<([^>]+)>)/ig, " ")}
                </p>
            </div>

            <div className="action">
                {auth.role === "admin" && <Link to={`/${blog.id}/edit`}><i className="fas fa-pencil-alt"></i> Edit Blog</Link>}
                <Link to={`/${blog.id}`}><i className="fas fa-book-open"></i> Read More</Link>
            </div>

            <ul className="details">
                <li>
                    <i className="fas fa-clock"></i> {blog.created_at_readable}
                </li>
                <li><i className="fas fa-envelope"></i> {blog.comment_count} comment(s)</li>
            </ul>
        </div >
    );
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: null,
            blog_page: 1,
            is_fetching: false,
            no_records: 0
        }

        this.handleScroll = this.handleScroll.bind(this);
        this.fetchBlogs = _debounce(this.fetchBlogs.bind(this), 300);
        this.handleFilter = _debounce(this.handleFilter.bind(this), 500);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.fetchBlogs('fetch', 1);
        document.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handleScroll);
    }

    fetchBlogs(type, page) {
        if (this.state.blog_page > 0 || type === "filter") {
            let filter = {
                'sort_recent': this.sort_recent.checked,
                'sort_popular': this.sort_popular.checked,
                's': this.s.value
            };

            document.removeEventListener('scroll', this.handleScroll);

            this.setState({
                is_fetching: true
            });

            axios.get(`/blogs?page=${page}`, { params: filter }).then((response) => {
                let { data } = response.data;
                this.setState((prevState) => {
                    return {
                        blogs: type === "fetch" ? (prevState.blogs === null ? [].concat(data.data) : prevState.blogs.concat(data.data)) : data.data,
                        blog_page: type === "fetch" ? (prevState.blog_page < data.last_page ? data.current_page + 1 : 0) : (data.last_page > 1 ? 2 : 0),
                        no_records: data.total,
                        is_fetching: false
                    }
                }, function () {
                    document.addEventListener('scroll', this.handleScroll);
                });
            })
        }
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = Math.round(windowHeight + window.pageYOffset);
        const offset = 500;

        let { blog_page } = this.state;

        if (windowBottom >= docHeight - offset) {
            //bottom
            this.fetchBlogs('fetch', blog_page);
        }
    }

    handleFilter() {
        this.fetchBlogs('filter', 1);
    }

    handleDelete(e, blog_id) {
        let _this = this;
        try {
            e.target.closest('article').classList.add('removing');

            axios({
                method: 'delete',
                url: `/blogs/${blog_id}`,
            })
                .then(function ({ status }) {
                    console.log(status);
                    if (status === 200) {
                        _this.setState((prevState) => {
                            return {
                                blogs: prevState.blogs.filter(blog => blog.id !== blog_id)
                            }
                        });
                    }
                    else {
                        alert('Error');
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
                    alert(error.response.statusText);
                })
        }
        catch (err) {
            console.log(err);
            alert('Error');
        }
    }

    render() {
        let { blogs, is_fetching, no_records } = this.state;

        return (
            <section className="index container">
                <CSSTransition
                    key="filter_logo"
                    in={is_fetching}
                    timeout={1000}
                    classNames={'fade-fast'}
                    unmountOnExit
                >
                    <div className="page_overlay">
                        Fetching...
                    </div>

                </CSSTransition>

                <div className="row filter_section">
                    <div className="col-sm-12 form-group">
                        <h3><i className="fas fa-filter"></i>Filter</h3>
                    </div>

                    <div className="col-sm-12 form-group">
                        <input type="text" ref={element => this.s = element} onKeyUp={this.handleFilter} className="form-control" placeholder="Search" />
                    </div>

                    <div className="col-sm-12 form-group sort_section">
                        <div className="checkbox_group">
                            <input id="recent" defaultChecked ref={element => this.sort_recent = element} type="checkbox" onClick={this.handleFilter} />
                            <label htmlFor="recent">Recent</label>
                        </div>

                        <div className="checkbox_group">
                            <input id="popular" ref={element => this.sort_popular = element} type="checkbox" onClick={this.handleFilter} />
                            <label htmlFor="popular">Popular</label>
                        </div>
                    </div>
                </div>
                <div className="list_section">
                    {
                        (blogs && blogs.length) ?
                            <div>
                                <div className="row list">
                                    <div className="text-success col-sm-12">
                                        <div className="record">{no_records} blogs found.</div>
                                    </div>
                                </div>

                                <TransitionGroup className="row">
                                    {blogs.map((blog) => {
                                        return (
                                            <CSSTransition
                                                key={`blog_card_${blog.id}`}
                                                timeout={500}
                                                classNames="item"
                                            >
                                                <article key={blog.id} className="col-lg-4 col-md-6 col-sm-12">
                                                    <BlogCard blog={blog} handleDelete={this.handleDelete} {...this.props} />
                                                </article>
                                            </CSSTransition>
                                        );
                                    })}
                                </TransitionGroup>
                            </div>
                            :
                            <div className="text-danger">{blogs === null ? 'Loading...' : 'No Record.'}</div>
                    }
                </div>
            </section>
        );
    }
}

export default Index;