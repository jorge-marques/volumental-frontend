import './App.css';
import logo from './volumental_logo.svg';

import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

import {nextSizes} from "./api";
import LoginForm from "./LoginForm";

function randomColor() {
    const hexDigits = '0123456789ABCDEF';

    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += hexDigits[Math.floor(Math.random() * hexDigits.length)];
    }

    return color;
}

const widthColors = {};

function getWidthColor(width) {
    if (!widthColors[width]) {
        widthColors[width] = randomColor();
    }

    return widthColors[width];
}

function sizesResponseToChartData(payload) {
    const sizes = payload.sizes;

    const labels = Object.keys(sizes);

    const data = labels.reduce((accumulator, length, idx) => {
        const widthsByLength = sizes[length];

        Object.keys(widthsByLength).forEach(width => {
            if (!accumulator[width]) {
                accumulator[width] = {
                    label: width,
                    data: [],
                    backgroundColor: getWidthColor(width),
                }
            }

            accumulator[width].data[idx] = widthsByLength[width];
        });

        return accumulator;
    }, {});

    return {
        labels: labels,
        datasets: Object.values(data)
    };
}

class App extends Component {
    state = {
        auth: {
            username: '',
            password: '',
            valid: false,
        },
        chartOptions: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            },
        }
    };

    constructor() {
        super();

        this.toNextPage = this.toNextPage.bind(this);
        this.handleLoginFormSubmission = this.handleLoginFormSubmission.bind(this);
    }

    handleLoginFormSubmission(username, password) {
        const auth = {username, password};

        const req = nextSizes(auth);

        req.done(response => {
            auth.valid = true;

            const chartData = sizesResponseToChartData(response.data[0]);

            this.setState({auth, chartData});
        });

        req.fail(() => {
            window.alert('Wrong credentials. Please try again.');
        });
    }

    toNextPage() {
        const req = nextSizes(this.state.auth);

        req.done(response => {
            const chartData = sizesResponseToChartData(response.data[0]);
            this.setState({chartData});
        });
    }

    render() {
        const auth = this.state.auth;
        const chartData = this.state.chartData;
        const chartOptions = this.state.chartOptions;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2 className="App-title">Frontend Exercise | Jorge Marques</h2>
                </header>

                <div className="App-container">
                    {auth.valid
                        ?
                        <div>
                            <Bar
                                data={chartData}
                                options={chartOptions}/>

                            <div className="App-pagination">
                                <button onClick={this.toNextPage}>Next page</button>
                            </div>
                        </div>

                        : <div className="App-LoginForm-container">
                            <LoginForm
                                username={auth.username}
                                password={auth.password}
                                onSubmit={this.handleLoginFormSubmission}/>
                        </div>}
                </div>
            </div>
        );
    }
}

export default App;
