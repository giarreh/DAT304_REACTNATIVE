import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button, Dimensions, FlatList} from 'react-native';
import {
  LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart
} from "react-native-chart-kit";
import moment from 'moment';
import {foodlist, renderFoodItem, food_styles} from '../../components/foodlist';


const placebodata = {
  labels: [
  '2022-01-01T00:00:00Z', 
  '2022-01-01T01:00:00Z', 
  '2022-01-01T02:00:00Z', 
  '2022-01-01T03:00:00Z', 
  '2022-01-01T04:00:00Z', 
  '2022-01-01T05:00:00Z'],
  datasets: [
    {
      data: [20, 45, 28, 50, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2 // optional
    }
  ],
  legend: ["Whole hour"] // optional
}

const InformationScreen = ({navigation}) => {

  const [data, setData] = useState(placebodata);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = require('./data.json');
      // Update the labels with the current time in 5-minute intervals
      const newLabels = Array.from({ length: 12 }, (_, i) => {
        const time = moment().add(5 * i, 'minutes').format();
        return time;
      });
      setData({
        labels: newLabels,
        datasets: [
          {
            data: newData,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
          }
        ],
        legend: ["Whole hour"]
      });
    }, 10000); // 10s in milliseconds
    return () => clearInterval(interval);
  }, []);
  const formatXLabel = (value) => {
    return moment.utc(value).local().format('LT');
  }
      
  return (
    <View style={styles.container}>
      <Text>Information Screen</Text>
      <LineChart
        data={data}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisSuffix="g"
        yAxisInterval={1} // optional, defaults to 1
        formatXLabel={formatXLabel}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />

      <View style={food_styles.container}>
      <Text style={food_styles.titleText}>Recently Eaten Food</Text>
      <FlatList
        data={foodlist}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
      />
      </View>

      <Button
      title="Go back"
      onPress={() => 
        navigation.navigate("TabNavigator", {screen: "Home"})}>
      </Button>



    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 'auto',
  },
});

export default InformationScreen;