import React from 'react';
import { FlatList, Text, Dimensions } from 'react-native';
import { AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { addDays, format } from 'date-fns';
import styled from 'styled-components';
import Intervals from './Intervals';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Cal = styled(FlatList)`
  flex: 1;
  padding-vertical: 50;
`;

const Day = styled.View`
  width: ${WIDTH};
  border: solid 1px black;
`;

const DateLabel = styled.Text`
  text-align: center;
  color: black;
`;

export default class App extends React.Component {
  state = {
    dates: [],
    intervals: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    reservations: {},
  };

  componentWillMount = async () => {
    const today = new Date();
    const week = Array(5)
      .fill()
      .map((e, index) => ({ date: addDays(today, index), reservations: [] }));
    this.setState({ dates: week });

    await this._retrieveData();

    const reserved = this.state.reservations;

    console.log(reserved);
    /**
 
const datesWReserves = Object.keys(reserved).reduce((acc, k) => {
      const { date } = reserved[k];
      acc.hasOwnProperty(date)
        ? Object.assign({}, acc, { [date]: [...acc[date], k] })
        : Object.assign({}, acc, { [date]: [k] });
    }, {});

    this.setState(prevState => {
      const newDates = prevState.dates.map(
        d =>
          datesWReserves.hasOwnProperty(date)
            ? Object.assign({}, d, { reservations: datesWReserves[date] })
            : d,
      );
      return {
        dates: newDates,
      };
    });

 */
  };

  componentDidMount = () => {};

  reserveInterval = async (interval, date) => {
    const now = new Date();
    const id = now.valueOf();
    try {
      await AsyncStorage.mergeItem(String(id), JSON.stringify({ interval, date }));
    } catch (error) {
      // Error saving data
    }
    this.setState(prevState => {
      const newDates = prevState.dates.map(
        d => (d.date == date ? Object.assign({}, d, { reservations: [...d.reservations, id] }) : d),
      );
      return {
        dates: newDates,
        reservations: {
          ...prevState.reservations,
          [id]: { interval, date },
        },
      };
    });
  };

  _storeData = async () => {
    try {
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();

      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          const r = stores.reduce((acc, store) => {
            return Object.assign({}, acc, { [store[0]]: JSON.parse(store[1]) });
          }, {});
          this.setState({ reservations: r });
        });
      });
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    const { dates, intervals, reservations } = this.state;
    return (
      <Cal
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
        data={dates}
        renderItem={({ item }) => {
          const reserved = item.reservations.reduce(
            (acc, r) => [...acc, reservations[r].interval],
            [],
          );
          return (
            <Day>
              <DateLabel>{format(item.date, 'DD-MM-YYYY')}</DateLabel>
              <Intervals
                intervals={intervals}
                reserved={reserved}
                reservations={item.reservations}
                reserve={this.reserveInterval}
                date={item.date}
              />
            </Day>
          );
        }}
      />
    );
  }
}
