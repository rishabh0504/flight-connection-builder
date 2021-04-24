import { flightSchedules } from "../config"
import moment from 'moment'


const formatConnectingFlights = async (connectedFlights = []) => {
    const mappedDetails = await connectedFlights.map(flight => {
        const { startFlight, connectedFlight } = flight;
        return {
            onwardFltNo: startFlight.flightNo,
            onwardDepArpt: startFlight.departureAirport,
            onwardArrArpt: startFlight.arrivalAirport,
            onwardDepTime: startFlight.departureTime,
            onwardArrTime: startFlight.arrivalTime,
            connFltNo: connectedFlight.flightNo || '',
            connDepArpt: connectedFlight.departureAirport || '',
            connArrArpt: connectedFlight.arrivalAirport || '',
            connDepTime: connectedFlight.departureTime || '',
            connArrTime: connectedFlight.arrivalTime || ''
        }
    })
    return await mappedDetails;
}


export const getConnectedFlights = async (tripStartPoint, tripEndPoint) => {

    // this will give two level connectivity flights


    // First of Find all flights which starts from tripStartPoint  and ends on tripEndPoint

    let indirectFlights = flightSchedules.filter((flight) => {
        return flight.departureAirport === tripStartPoint || flight.arrivalAirport === tripEndPoint
    });

    // Get all start point flights from indirect flights

    const startPointFlights = indirectFlights.filter((flight) => {
        return flight.departureAirport === tripStartPoint;
    });

    // Get all end point flights from indirect flights

    const endPointFlights = indirectFlights.filter((flight) => {
        return flight.arrivalAirport === tripEndPoint;
    });

    // Now filter all startPointFlights whose arrivalAirport  and endPointFlights departure is same

    let connectedFlights = [];
    const MIN_CONNECTING_TIME = 2 * 60; // 2 hours conversion in minutes
    const MAX_CONNECTING_TIME = 8 * 60; // 8 hours conversion in minutes

    startPointFlights.map((startFlight, index) => {
        endPointFlights.map((endPoint, secondIndex) => {
            if (startFlight.arrivalAirport === endPoint.departureAirport) {
                const connectedFlightDepartureTime = moment(endPoint.departureTime, 'HH:mm');
                const directFlightArrivalTime = moment(startFlight.arrivalTime, 'HH:mm');
                const waitingTimeForConnectedFlight = connectedFlightDepartureTime.diff(directFlightArrivalTime, 'minutes');
                if (waitingTimeForConnectedFlight >= MIN_CONNECTING_TIME && waitingTimeForConnectedFlight <= MAX_CONNECTING_TIME) {
                    connectedFlights.push({
                        startFlight: startFlight,
                        connectedFlight: endPoint
                    });
                }
            }
        })
    })

    const mappedFlightPath = await formatConnectingFlights(connectedFlights)
    return await mappedFlightPath;
}