import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const CustomTable = (props) => {
    const { availableFlights = [] } = props;
    const showMapPath = (flight) => {
        props.triggerPathChange(flight);
    }
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Onward Flight</TableCell>
                        <TableCell align="right">Dep Airport</TableCell>
                        <TableCell align="right">Arrival Airport</TableCell>
                        <TableCell align="right">Departure Time</TableCell>
                        <TableCell align="right">Arrival Time</TableCell>
                        <TableCell align="right">Connecting Flight</TableCell>
                        <TableCell align="right">Dep Airport </TableCell>
                        <TableCell align="right">Arrival Airport</TableCell>
                        <TableCell align="right">Departure Time</TableCell>
                        <TableCell align="right">Arrival Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {availableFlights.map((flight, index) => (
                        <TableRow key={index} onClick={() => { showMapPath(flight) }}>
                            <TableCell component="th" scope="row">
                                {flight.onwardFltNo}
                            </TableCell>
                            <TableCell align="right">{flight.onwardDepArpt}</TableCell>
                            <TableCell align="right">{flight.onwardArrArpt}</TableCell>
                            <TableCell align="right">{flight.onwardDepTime}</TableCell>
                            <TableCell align="right">{flight.onwardArrTime}</TableCell>
                            <TableCell align="right">
                                {flight.connFltNo || 'NA'}
                            </TableCell>
                            <TableCell align="right">{flight.connDepArpt || 'NA'}</TableCell>
                            <TableCell align="right">{flight.connArrArpt || 'NA'}</TableCell>
                            <TableCell align="right">{flight.connDepTime || 'NA'}</TableCell>
                            <TableCell align="right">{flight.connArrTime || 'NA'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CustomTable;