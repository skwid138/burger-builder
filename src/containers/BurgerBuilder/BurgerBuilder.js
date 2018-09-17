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
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false,
	};

	componentDidMount() {
		axios.get('/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data})
			})
			.catch(error => {
				this.setState({error: true})
			});
	}

	/* Used to disable the order button if no ingredients have been added. */
	updatePurchaseState(ingredients) {
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
		const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(`${encodeURIComponent(i)}=${encodeURIComponent(this.state.ingredients[i])}`);
        }
        queryParams.push(`price=${this.state.totalPrice}`);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		};
		let orderSummary = null;
		let burger = this.state.error ? <p>Ingredients can't be retrieved!</p> : <Loader />

		if (this.state.ingredients) {
			burger = (<Aux>
				<Burger ingredients={ this.state.ingredients } />
				<BuildControls
				ingredientAdded={ this.addIngredientHandler }
				ingredientRemoved={ this.removeIngredientHandler }
				disabled={ disabledInfo }
				purchasable={ this.state.purchasable }
				ordered={ this.purchaseHandler }
				price={ this.state.totalPrice } />
			</Aux>);

			orderSummary = (<OrderSummary 
				ingredients={ this.state.ingredients }
				purchaseCanceled={ this.purchaseCancelHandler }
				purchaseContinued={ this.purchaseContinueHandler }
				price={ this.state.totalPrice } />);
		}

		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		if (this.state.loading) {
			orderSummary = <Loader />
		}

		return(
			<Aux>
				<Modal show={ this.state.purchasing } modalClosed={ this.purchaseCancelHandler }>
					{ orderSummary }
				</Modal>
				{ burger }
			</Aux>
		);
	};
};

export default withErrorHandler(BurgerBuilder, axios);