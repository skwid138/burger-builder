import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import Loader from '../../../components/UI/Loader/Loader';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name'
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street'
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			zip: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Zip Code'
				},
				value: '',
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5,
					isNumber: true,
				},
				valid: false,
				touched: false,
			},
			state: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'State'
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Email Address'
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{value: 'fastest', displayValue: 'Fastest'},
						{value: 'cheapest', displayValue: 'Cheapest'},
					],
				},
				value: 'fastest',
				validation: {},
				valid: true,
			},
		},
		formIsValid: false,
        loading: false,
    }

    orderHandler = event => {
		event.preventDefault();
		this.setState({loading: true});
		
		const formData = {};

		for (let formElementIdentifier in this.state.orderForm) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}

        const order = {
            ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData,
		}
		
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });
	}
	
	/* Form Validation */
	checkValidity(value, rules) {
		let isValid = true;

		if (rules) {
			/* remove white space and make sure there is some input */
			if (rules.required) {
				isValid = value.trim() !== '' && isValid;
			}

			if (rules.minLength) {
				isValid = value.length >= rules.minLength && isValid;
			}

			if (rules.maxLength) {
				isValid = value.length >= rules.minLength && isValid;
			}

			if (rules.isNumber) {
				isValid = (!isNaN(Number(value)) && typeof(Number(value)) === 'number') && isValid
			}
		}

		return isValid;
	}

	inputChangedHandler = (event, inputIdentifier) => {
		/* Deep Clone form element being changed. */
		const updatedOrderForm = {...this.state.orderForm};
		const updatedFormElement = {...updatedOrderForm[inputIdentifier]};

		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentifier] = updatedFormElement;

		/* check all form input elements to determine if any are false */
		let formIsValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = (updatedOrderForm[inputIdentifier].valid || updatedOrderForm[inputIdentifier].valid === undefined) && formIsValid
		}

		this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
	}

    render () {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key],
			});
		}

        let form = (
            <form onSubmit={ this.orderHandler }>
				{ formElementsArray.map(formElement => (
					<Input 
						key={ formElement.id }
						elementType={ formElement.config.elementType }
						elementConfig={  formElement.config.elementConfig }
						invalid={ !formElement.config.valid }
						shouldValidate={ formElement.config.validation }
						touched={ formElement.config.touched }
						value={ formElement.config.value }
						changed={ event => this.inputChangedHandler(event, formElement.id) } />
				)) }
                
                <Button btnType="Success" disabled={ !this.state.formIsValid }>ORDER</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Loader />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice,
	}
};

export default connect(mapStateToProps)(ContactData);