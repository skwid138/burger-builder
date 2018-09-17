import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Loader from '../../components/UI/Loader/Loader';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

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
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
	};

	/* Used to disable the order button if no ingredients have been added. */
	updatePurchaseState (ingredients) {
		const sum = Object.keys(ingredients)
			.map(ingredientKey => {
				return ingredients[ingredientKey]
			})
			/* take the array of values and squash them into one number */
			.reduce((sum, el) => {
				return sum + el;
			}, 0);

		this.setState({purchasable: sum > 0});
	}

	/* Update State with additional ingredient and price */
	addIngredientHandler = type => {
		const newCount = this.state.ingredients[type] + 1;
		const newIngredients = {...this.state.ingredients};
		newIngredients[type] = newCount;

		const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

		this.setState({totalPrice: newPrice,ingredients: newIngredients});
		this.updatePurchaseState(newIngredients);
	}

	/* Update State with reduced ingredient and price */
	removeIngredientHandler = type => {
		if (this.state.ingredients[type]) {
			const newCount = this.state.ingredients[type] - 1;
			const newIngredients = {...this.state.ingredients};
			newIngredients[type] = newCount;

			const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

			this.setState({totalPrice: newPrice,ingredients: newIngredients});
			this.updatePurchaseState(newIngredients);
		}
	}

	/* Will show modal and backdrop */
	purchaseHandler = () => {
		this.setState({purchasing: true})
	}

	/* Will hide modal and backdrop */
	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	}

	/* Used with Modal to complete purchase */
	purchaseContinueHandler = () => {
		this.setState({loading: true});

		const orderData = {
			ingredients: this.state.ingredients,
			price: this.state.totalPrice,
			customer: {
				name: 'Hunter',
				address: {
					street: 'Easy',
					zip: '138',
					state: 'MN'
				},
				email: 'mt@address.com'
			},
			deliveryMethod: 'aliens',
		};

		axios.post('/orders.json', orderData)
			.then(response => {
				this.setState({loading: false, purchasing: false});
				console.log(response);
			}).catch(error => {
				this.setState({loading: false, purchasing: false});
				console.log(error);
			});
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		};

		let orderSummary = <OrderSummary 
			ingredients={ this.state.ingredients }
			purchaseCanceled={ this.purchaseCancelHandler }
			purchaseContinued={ this.purchaseContinueHandler }
			price={ this.state.totalPrice } />

		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		if (this.state.loading) {
			orderSummary = <Loader/>
		}

		return(
			<Aux>
				<Modal show={ this.state.purchasing } modalClosed={ this.purchaseCancelHandler }>
					{ orderSummary }
				</Modal>
				<Burger ingredients={ this.state.ingredients } />
				<BuildControls
					ingredientAdded={ this.addIngredientHandler }
					ingredientRemoved={ this.removeIngredientHandler }
					disabled={ disabledInfo }
					purchasable={ this.state.purchasable }
					ordered={ this.purchaseHandler }
					price={ this.state.totalPrice } />
			</Aux>
		);
	};
};

export default withErrorHandler(BurgerBuilder, axios);