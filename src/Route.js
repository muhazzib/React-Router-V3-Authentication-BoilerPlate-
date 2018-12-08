import { Router, Route, browserHistory } from 'react-router'
import React, { Component } from 'react';
import { authBol } from './auth.js'





const login = () => {
    localStorage.setItem('user', 'abc')
    authBol.auth = true
    browserHistory.push('/')
}
const logout = () => {
    localStorage.removeItem('user')
    browserHistory.push('/signin')
}
const checkAuthSignInRoute = (nextState, replace, callback) => {
    const localtoken = localStorage.getItem('user')
    if (authBol.auth) {
        if (localtoken) {
            replace('/')
            callback()
        }
        else {
            callback()
        }
    }

    if (!localtoken) {
        callback()
    }

    if (!authBol.auth && localtoken) {
        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(() => {
                authBol.auth = true
                browserHistory.push('/')
                callback();
            })
            .catch((err) => {
                callback();
            })
    }
}
const checkAuth = (nextState, replace, callback) => {
    const localtoken = localStorage.getItem('user')

    if (authBol.auth) {
        if (localtoken) {
            callback()
        }
        else {
            localStorage.removeItem('user')
            replace('/signin')
            callback()
        }
    }

    if (!localtoken) {
        authBol.auth = false
        localStorage.removeItem('user')
        replace('/signin')
        callback()
    }
    if (!authBol.auth && localtoken) {
        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(() => {
                authBol.auth = true
                callback();
                return;
            })
            .catch((err) => {
                authBol.auth = false
                localStorage.removeItem('user')
                browserHistory.push('/signin')
                callback();
            })
    }
}

const SignIn = () => (
    <div>
        <h2>Signin to Con</h2>
        <h1 onClick={() => login()}>SignIn</h1>
        <h5 onClick={() => browserHistory.push('/')}>Go to Home</h5>
    </div>
)
const About = () => (
    <div>
        <h2>Welcome to about</h2>
        <h1 onClick={() => logout()}>Logout</h1>
        <h5 onClick={() => browserHistory.push('/')}>Go to Home</h5>
    </div>
)

const Home = () => (
    <div>
        <h2>Welcome to home</h2>
        <h1 onClick={() => logout()}>Logout</h1>
        <h5 onClick={() => browserHistory.push('/about')}>Go to About</h5>
    </div>
)
class Test extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
    }

    render() {
        return (
            <div>
                <h1>Test</h1>
            </div>
        );
    }
}


class Navbar extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        console.log(this.props)
    }

    render() {
        console.log(this.props.location.pathname)
        return (
            <div>
                {
                    this.props.location.pathname === '/signin' ? (
                        <h1>Login Navbar</h1>
                    ) : null
                }
                {
                    this.props.children
                }
            </div>
        );
    }
}



export default class Routers extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        console.log(this.props)
    }

    render() {
        return (
            <div>
                <Router history={browserHistory}>
                    <Route component={Navbar}>  
                        <Route path='/signin' component={SignIn} onEnter={checkAuthSignInRoute} />
                        <Route path='/' component={Home} onEnter={checkAuth} />
                        <Route path='/about' component={About} onEnter={checkAuth} />
                        <Route path='/test' component={Test} />
                    </Route>
                </Router>
            </div>
        );
    }
}