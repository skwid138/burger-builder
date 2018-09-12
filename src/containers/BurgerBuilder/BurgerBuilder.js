import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
	salad: 0.5,
	bacon: 0.7,
	cheese: 0.4,
	meat: 1.3
};

class BurgerBuilder extends Component {
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0
		},
		totalPrice: 4
	};

	/* Update State with additional ingredient and price */
	addIngredientHandler = type => {
		const newCount = this.state.ingredients[type] + 1;
		const newIngredients = {...this.state.ingredients};
		newIngredients[type] = newCount;

		const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

		this.setState({totalPrice: newPrice,ingredients: newIngredients});
	}

	/* Update State with reduced ingredient and price */
	removeIngredientHandler = type => {
		if (this.state.ingredients[type]) {
			const newCount = this.state.ingredients[type] - 1;
			const newIngredients = {...this.state.ingredients};
			newIngredients[type] = newCount;

			const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

			this.setState({totalPrice: newPrice,ingredients: newIngredients});
		}
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		};

		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		return(
			<Aux>
				<Burger ingredients={ this.state.ingredients } />
				<BuildControls
					ingredientAdded={ this.addIngredientHandler }
					ingredientRemoved={ this.removeIngredientHandler }
					disabled={ disabledInfo }
					price={ this.state.totalPrice } />
			</Aux>
		);
	};
};

export default BurgerBuilder;