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

    const lengths = Object.keys(sizes);

    const data = lengths.reduce((accumulator, length, idx) => {
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

    // Explicit sorting is necessary, otherwise sizes with .5 increments would only show at the end.
    lengths.sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
    });

    return {
        labels: lengths,
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

            const data = response.data[0];
            const chartData = sizesResponseToChartData(data);

            this.setState({
                auth,
                chartData,
                system: data.system,
                gender: data.gender,
            });
        });

        req.fail(() => {
            window.alert('Wrong credentials. Please try again.');
        });
    }

    toNextPage() {
        const req = nextSizes(this.state.auth);

        req.done(response => {
            const data = response.data[0];
            const chartData = sizesResponseToChartData(data);

            this.setState({
                chartData,
                system: data.system,
                gender: data.gender,
            });
        });
    }

    render() {
        const auth = this.state.auth;
        const system = this.state.system;
        const gender = this.state.gender;
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
                            <div className="App-sizes-system">
                                {system}
                            </div>

                            <div className="App-sizes-gender">
                                {gender}
                            </div>

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
