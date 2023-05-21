import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, BarChart, Bar, PieChart, 
  Pie, Cell, } from 'recharts';

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 2,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTimeline: [],
      dataTimeline15: [],
      data_text: {
        updatedDate: '',
        Passed: '',
        Failed: '',
        Errors: '',
        recovered: '',
        newPassed: '',
        newFailed: '',
        newErrors: '',
        newRecovered: '',
      },
      data_pie: [{}],
    };
  }

  componentDidMount() {
    this.callAPI();
  }

  callAPI() {
    axios.get('http://localhost:5000/api/orders')
    .then(response => {
        console.log(response.data);
        const data = response.data['Data'];
        const lastData = data.slice(-1)[0];
        this.setState({
          dataTimeline: data,
          dataTimeline15: data.slice(1).slice(-15),
          data_text: {
            source: response.data['Source'],
            updatedDate: lastData['Date'],
            Passed: lastData['Passed'],
            Failed: lastData['Failed'],
            Errors: lastData['Errors'],
            recovered: lastData['Recovered'],
            newPassed: lastData['NewPassed'],
            newFailed: lastData['NewFailed'],
            newErrors: lastData['NewErrors'],
            newRecovered: lastData['NewRecovered'],
          },
          data_pie: [
            { name: 'Failed', value: lastData['Failed'] },
            { name: 'Errors', value: lastData['Errors'] },
            { name: 'recovered', value: lastData['Recovered'] },
          ]
        });
        
    })
    .catch(function (error) {
        console.log(error);
    })
  }
  
  render() {
    const { classes } = this.props;
    const { dataTimeline, dataTimeline15, data_text, data_pie } = this.state;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              ThermoKing Panel Test Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.appBarSpacer} />
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography align="right">
                Last updated: {data_text.updatedDate}
              </Typography>
              <Typography variant="subtitle2" align="right">
                <a href={data_text.source} target="_blank" rel="noopener noreferrer">{data_text.source}</a>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Passed</Typography>
                <Typography variant="h3">{data_text.Passed.toLocaleString()}</Typography>
                <Typography variant="h5">({data_text.newPassed.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Failed</Typography>
                <Typography variant="h3">{data_text.Failed.toLocaleString()}</Typography>
                <Typography variant="h5">({data_text.newFailed.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Errors</Typography>
                <Typography variant="h3">{data_text.Errors.toLocaleString()}</Typography>
                <Typography variant="h5">({data_text.newErrors.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Recovered</Typography>
                <Typography variant="h3">{data_text.recovered.toLocaleString()}</Typography>
                <Typography variant="h5">({data_text.newRecovered.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                    width={500} 
                    height={300} 
                    data={dataTimeline15}
                    margin={{top: 5, right: 5, left: 0, bottom: 5}}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="NewPassed" fill="#8884d8" />
                    <Bar dataKey="NewErrors" fill="#FF9AA2" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart width={400} height={400}>
                    <Legend />
                    <Pie dataKey="value" isAnimationActive={false} data={data_pie} outerRadius={100} label>
                      <Cell fill="#8884d8" />
                      <Cell fill="#FF9AA2" />
                      <Cell fill="#8FC1A9" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart
                    data={dataTimeline}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Passed" stroke="blue" dot={false} />
                    <Line type="monotone" dataKey="Failed" stroke="orange" dot={false} />
                    <Line type="monotone" dataKey="Errors" stroke="red" dot={false} />
                    <Line type="monotone" dataKey="Recovered" stroke="green" dot={false} />
                  </LineChart>  
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <footer className={classes.footer}>
          <Paper className={classes.paper}>
            <Typography variant="h6">
              ThermoKing SR4 LCD Test Dashboard
            </Typography>
            <Typography component="p">
              Source code by Anu S. KETL @ <a href="https://github.com/nuSapb/tk-dashboard">https://github.com/nuSapb/tk-dashboard</a>
            </Typography>
          </Paper>
        </footer>
      </div>
    );
  }
}

export default withStyles(styles)(App);