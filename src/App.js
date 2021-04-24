
import './App.css';
import { useEffect, useState } from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import NotFound from './components/not-found';
import Map from './components/map';
import convert from 'geo-coordinates-parser'
import CustomTable from './components/table';
import { getFlights, getFlightSchedules, searchFlights } from './services';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));



function App() {


  const classes = useStyles();

  const [tripStartPoint, setTripStartPoint] = useState("");
  const [tripEndPoint, setTripEndPoint] = useState("");
  const [tripStartErrorMessage, setTripStartErrorMessage] = useState("");
  const [tripEndErrorMessage, setTripEndErrorMessage] = useState("");
  const [availableFlights, setAvailableFlights] = useState([]);
  const [mapPath, setMapPath] = useState([]);
  const [flights, setFlights] = useState([])
  const [flightSchedules, setFlightSchedule] = useState([]);

  useEffect(async () => {
    const flightsList = await getFlights();
    const scheduledFlights = await getFlightSchedules()
    setFlights(flightsList);
    setFlightSchedule(scheduledFlights);
  }, []);


  // Getting lattitude and longitudes for coordinates

  const showMapPath = (flight) => {
    const possiblePath = [];
    const {
      onwardDepArpt,
      onwardArrArpt,
      connDepArpt,
      connArrArpt,
      connFltNo
    } = flight;


    flights.map(item => {
      // Departure Airport
      let convertableCoordinate = null;
      if ((item.arptCd === onwardDepArpt) || (item.arptCd === onwardArrArpt) || (connFltNo && item.arptCd === connDepArpt) || (connFltNo && item.arptCd === connArrArpt)) {
        const convertableCoordinate = item.coordinates;
        let converted;
        try {
          converted = convert(convertableCoordinate);
          possiblePath.push({
            lat: converted.decimalLatitude,
            lng: converted.decimalLongitude
          });
        }
        catch (e) {
          console.log(e);
          /*we get here if the string is not valid coordinates or format is inconsistent between lat and long*/
        }
      }
    })
    setMapPath(possiblePath)
  }


  // Search flight business logic upto two levels

  const searchFlight = async () => {
    if (!tripStartPoint) {
      setTripStartErrorMessage('Please select start point ..!!');
      return;
    }
    if (!tripEndPoint) {
      setTripEndErrorMessage('Please select end point ..!!');
      return;
    }
    if (tripStartPoint === tripEndPoint) {
      setTripStartErrorMessage('Start and end point can not be same ..!!');
      setTripEndErrorMessage('Start and end point can not be same ..!!');
      return;
    }

    const allFlightsPath = await searchFlights({
      tripStartPoint,
      tripEndPoint
    });
    setAvailableFlights(allFlightsPath);
  }


  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>

            <Autocomplete
              freeSolo
              onInputChange={(_, val) => {
                setTripStartErrorMessage('')
                setTripStartPoint(val);
                setAvailableFlights([]);
              }}
              inputValue={tripStartPoint}
              disableClearable
              options={flights.map(option => option.arptCd)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="From Airport"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  InputProps={{ ...params.InputProps, type: "search" }}
                  error={tripStartErrorMessage ? true : false}
                  helperText={tripStartErrorMessage}
                />
              )}
            />
            <Autocomplete
              freeSolo
              onInputChange={(_, val) => {
                setTripEndErrorMessage('')
                setTripEndPoint(val);
                setAvailableFlights([]);
              }}
              inputValue={tripEndPoint}
              disableClearable
              options={flights.map(option => option.arptCd)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="To Airport"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  InputProps={{ ...params.InputProps, type: "search" }}
                  error={tripEndErrorMessage ? true : false}
                  helperText={tripEndErrorMessage}
                />
              )}
            />

            <Button variant="contained" color="primary" onClick={searchFlight}>
              Search Flights
            </Button>
          </Paper>
          <Paper className={classes.paper}>
            {
              availableFlights && availableFlights.length > 0 && (
                <CustomTable availableFlights={availableFlights} triggerPathChange={showMapPath} />
              )
            }
            {
              availableFlights && availableFlights.length === 0 && (
                <NotFound />
              )
            }
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Map path={mapPath} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
