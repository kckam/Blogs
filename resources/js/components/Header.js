import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_submitting: false
        };

        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin() {
        let _this = this;
        if (!this.state.is_submitting) {
            this.setState({
                is_submitting: true
            }, async () => {
                try {
                    await axios({
                        method: 'post',
                        url: `/login`,
                        data: {
                            email: this.email.value,
                            password: this.password.value,
                        },
                    })
                        .then(function ({ status, data }) {
                            location.reload();
                        })
                }
                catch (err) {
                    console.log(err);
                    this.setState({
                        is_submitting: false,
                    });
                }
            });
        }
    }

    handleLogout() {
        axios({
            method: 'post',
            url: `/logout`,
        })
            .then(function ({ status, data }) {
                location.reload();
            })

    }

    renderLoginForm() {
        let { auth } = this.props;
        let { is_submitting } = this.state;

        if (auth === null) {
            return (
                <div className="auth">
                    Loading
                </div>
            );
        }
        else if (auth) {
            return (
                <div className="auth">
                    {auth.role === "admin" && <Link className="create-btn" to='/create'><i className="fas fa-plus-square"></i> Create</Link>}
                    <button type="button" onClick={this.handleLogout}>Logout</button>
                </div>
            );
        }
        else {
            return (
                <div className="auth">
                    <input type="text" ref={element => this.email = element} placeholder="email" name="email" />
                    <input type="password" ref={element => this.password = element} placeholder="password" name="password" />
                    <button type="button" onClick={this.handleLogin}>{is_submitting ? 'Logging In' : 'Login'}</button>
                </div>
            );
        }
    }

    render() {

        return (
            <header>
                <Link to="/" className="logo">Blog</Link>
                {this.renderLoginForm()}


            </header>
        );
    }
}

export default Header;