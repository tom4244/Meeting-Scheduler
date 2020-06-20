import React from 'react';
import { Form, Input, RoundedButton } from '../elements';
import { connect } from 'react-redux';
import { createEvent } from '../../actions/eventActions';
import { PropTypes } from 'prop-types';

class EventForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			errors: {},
			isLoading: false
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.createEvent(this.state);
	}

	render() {
		const { title, errors, isLoading } = this.state;

		return (
			<Form onSubmit={this.onSubmit}>
			  <h1> Create New Game Event</h1>

        <Input
          name='title'
			    value={title}
			    onChange={this.onChange}
			    error={errors.title}
			    placeholder='Event Title'
			  />

			  <RoundedButton type='submit'>Create</RoundedButton>
			</Form>
		);
	}
}

EventForm.propTypes = {
	createEvent: PropTypes.func.isRequired
}

export default connect(null, { createEvent })(EventForm);


