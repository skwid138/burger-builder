import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

/* For boolean props they will be truthy if passed like active */
/* if not passed they will be false */
const navigationItems = props => (
	<ul className={ classes.NavigationItems }>
		<NavigationItem link="/" active>Burger Builder</NavigationItem>
		<NavigationItem link="/" >Checkout</NavigationItem>
	</ul>
);
 
export default navigationItems;