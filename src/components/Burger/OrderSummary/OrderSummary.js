import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = props => {

	const ingredientsSummary = Object.keys(props.ingredients)
		.map(ingredientKey => {
			return (
				<li key={ ingredientKey }>
					<span style={{textTransform: 'capitalize'}}>{ ingredientKey }</span>: { props.ingredients[ingredientKey] }
				</li>);
		})

	return (
		<Aux>
			<h3>Your Order</h3>
			<p>With the following ingredients: </p>
			<ul>{ ingredientsSummary }</ul>
			<p><strong>Total Price: ${ props.price.toFixed(2) }</strong></p>
			<p>Continue to Checkout?</p>
			<Button clicked={ props.purchaseCanceled } btnType="Danger">CANCEL</Button>
			<Button clicked={ props.purchaseContinued } btnType="Success">CONTINUE</Button>
		</Aux>
	);
};
 
export default orderSummary;