import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import Header from './Header';
import Index from './blog/Index';
import Create from './blog/Create';
import Show from './blog/Show';
import Edit from './blog/Edit';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: null
        }
    }

    componentDidMount() {
        axios.get("/auth").then((response) => {
            let { data } = response
            this.setState({ auth: data });
        })
    }

    render() {
        return (
            <BrowserRouter basename="/">
                <Route path="/" render={({ location }) =>
                    (
                        <section>
                            <Header auth={this.state.auth} />
                            <TransitionGroup>
                                <CSSTransition
                                    key={location.key}
                                    timeout={900}
                                    classNames="fade_page"
                                >
                                    <Switch location={location}>
                                        <Route exact path="/" render={(props) => <Index auth={this.state.auth} {...props} />} />
                                        <Route exact path="/create" render={(props) => <Create auth={this.state.auth} {...props} />} />
                                        <Route exact path="/:id/edit" render={(props) => <Edit auth={this.state.auth} {...props} />} />
                                        <Route exact path="/:id" render={(props) => <Show auth={this.state.auth} {...props} />} />
                                        {/* <Route exact path='*' render={() => <div>No</div>} /> */}
                                    </Switch>
                                </CSSTransition>
                            </TransitionGroup>
                        </section>

                    )
                } />
            </BrowserRouter>
        );
    }
}

export default App;