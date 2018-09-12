import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {

	/* Returns an Array of Arrays with Ingredient components */
	let transformedIngredients = Object.keys(props.ingredients)
		.map(ingredientKey => {
			return [...Array(props.ingredients[ingredientKey])]
				.map((_, index) => {
					return <BurgerIngredient key={ ingredientKey + index } type={ ingredientKey } />;
				});
		})
		.reduce((arr, el) => {
			return arr.concat(el);
		}, []);

	if (!transformedIngredients.length) {
		transformedIngredients = <p>Please start adding ingredients</p>
	}

	return (
		<div className={ classes.Burger }>
			<BurgerIngredient type="bread-top" />
			{ transformedIngredients }
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
}
 
export default burger;