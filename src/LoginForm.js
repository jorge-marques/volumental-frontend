import React, {Component} from 'react';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            password: props.password,
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleUsernameChange(evt) {
        this.setState({
            username: evt.target.value
        });
    }

    handlePasswordChange(evt) {
        this.setState({
            password: evt.target.value
        });
    }

    render() {
        return (
            <form>
                <label>
                    Username<br/>

                    <input type="text"
                           value={this.state.username}
                           onChange={this.handleUsernameChange}/>
                </label>

                <br/>
                <br/>

                <label>
                    Password<br/>

                    <input type="password"
                           value={this.state.password}
                           onChange={this.handlePasswordChange}/>
                </label>

                <br/>
                <br/>

                <input type="submit" onClick={this.props.onSubmit}/>
            </form>
        )
    }
}
