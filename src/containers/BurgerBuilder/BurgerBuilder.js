import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import axios from '../../axios-orders';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Loader from '../../components/UI/Loader/Loader';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

class BurgerBuilder extends Component {
	state = {
		purchasing: false,
		loading: false,
		error: false,
	};

	// componentDidMount() {
	// 	axios.get('/ingredients.json')
	// 		.then(response => {
	// 			this.setState({ingredients: response.data})
	// 		})
	// 		.catch(error => {
	// 			this.setState({error: true})
	// 		});
	// }

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

		return sum > 0;
	}

	/* Will show modal and backdrop */
	purchaseHandler = () => {
		this.setState({purchasing: true})
	}

	/* Will hide modal and backdrop */
	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	}

	purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
	}

	render() {
		const disabledInfo = {...this.props.ings};
		let orderSummary = null;
		let burger = this.state.error ? <p>Ingredients can't be retrieved!</p> : <Loader />

		if (this.props.ings) {
			burger = (<Aux>
				<Burger ingredients={ this.props.ings } />
				<BuildControls
				ingredientAdded={ this.props.onIngredientAdded }
				ingredientRemoved={ this.props.onIngredientRemoved }
				disabled={ disabledInfo }
				purchasable={ this.updatePurchaseState(this.props.ings) }
				ordered={ this.purchaseHandler }
				price={ this.props.price } />
			</Aux>);

			orderSummary = (<OrderSummary 
				ingredients={ this.props.ings }
				purchaseCanceled={ this.purchaseCancelHandler }
				purchaseContinued={ this.purchaseContinueHandler }
				price={ this.props.price } />);
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

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: ingredientName => dispatch({type: actionTypes.ADD_INGREDIENT, payload: {ingredientName: ingredientName}}),
		onIngredientRemoved: ingredientName => dispatch({type: actionTypes.REMOVE_INGREDIENT, payload: {ingredientName: ingredientName}}),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));