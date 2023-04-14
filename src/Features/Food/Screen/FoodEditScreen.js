import React, { useContext, useState, useLayoutEffect } from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from 'react-native';
import { FoodContext } from '../../../services/Foods/Food-Context';
import { styles } from '../../../Styles';

export const FoodEditScreen = ({ route, navigation }) => {
    const { food } = route.params;
    const { AddFood } = useContext(FoodContext);
    const [grams, setGrams] = useState(food.grams);
    const [carbs, setCarbs] = useState(Number(food.carbohydrates * food.grams / 1000).toFixed(0));

    useLayoutEffect(() => {
        navigation.setOptions({
            title: food.name,
        });
    }, [navigation, food.name]);

    const addToSelectedFoods = () => {
        const selectedFood = {
            ...food,
            grams: Number(grams),
        };
        AddFood(selectedFood);
        navigation.goBack();
    };

    const handleGramsChange = (input) => {
        setGrams(Number(input));
        setCarbs(Number(food.carbohydrates * input / 1000).toFixed(0));
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { fontSize: 18 }]}>
                Carbs/kg: {Number(food.carbohydrates).toFixed(0)}
            </Text>

            <Text style={[styles.label, { fontSize: 18 }]}>
                Carbs/Amount: {carbs}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.label, { fontSize: 18 }]}>Amount:</Text>
                <TextInput
                    style={[styles.input, { height: 40 }]}
                    keyboardType="number-pad"
                    onChangeText={handleGramsChange}
                    value={grams.toString()}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                }}
            >
                <TouchableOpacity style={styles.button} onPress={addToSelectedFoods}>
                    <Text style={styles.buttonText}>Confirm Change</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};