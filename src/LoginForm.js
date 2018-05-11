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
        this.handleSubmission = this.handleSubmission.bind(this);
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

    handleSubmission(evt) {
        evt.preventDefault();
        this.props.onSubmit(this.state.username, this.state.password)
    }

    render() {
        return (
            <form>
                <label>
                    Username<br/>

                    <input type="text"
                           value={this.state.username}
                           required
                           onChange={this.handleUsernameChange}/>
                </label>

                <br/>
                <br/>

                <label>
                    Password<br/>

                    <input type="password"
                           value={this.state.password}
                           required
                           onChange={this.handlePasswordChange}/>
                </label>

                <br/>
                <br/>

                <input type="submit" onClick={this.handleSubmission}/>
            </form>
        )
    }
}
