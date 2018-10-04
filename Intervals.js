import React from 'react';
import {
  FlatList, Text, Dimensions, TouchableOpacity,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { addDays, format } from 'date-fns';
import styled from 'styled-components';

const Container = styled.FlatList`
  flex: 1;
`;

const Hour = styled.View`
  flex-direction: row;
  border: solid 1px black;
`;

const HourLabel = styled.Text`
  width: 40;
  color: black;
`;

const ActiveArea = styled.View`
  flex: 1;
`;

const HalfHour = styled.View`
  height: 30;
  border: 1px dotted black;
  background: ${({ reserved }) => (reserved ? 'red' : 'white')};
`;

const Interval = ({
  reserve, reserved, interval, date,
}) => (reserved.includes(interval) ? (
  <TouchableOpacity disabled>
    <HalfHour reserved />
  </TouchableOpacity>
) : (
  <TouchableOpacity onPress={() => reserve(interval, date)}>
    <HalfHour />
  </TouchableOpacity>
));

export default ({
  intervals, reservations, reserve, reserved, date,
}) => (
  <Container
    keyExtractor={(item, index) => String(index)}
    data={intervals}
    renderItem={({ item }) => (
      <Hour>
        <HourLabel>{`${String(item)}:00`}</HourLabel>
        <ActiveArea>
          <Interval reserve={reserve} reserved={reserved} interval={item} date={date} />
          <Interval reserve={reserve} reserved={reserved} interval={item + 0.5} date={date} />
        </ActiveArea>
      </Hour>
    )}
  />
);
