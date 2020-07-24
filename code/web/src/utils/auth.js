import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuthenticated = () => {
	if (localStorage.getItem('token') && localStorage.getItem('isEmployee')) {
		return true;
	} else {
		localStorage.clear();
		return false;
	}
};

const isAdmin = () => {
	if (localStorage.getItem('tokenFake') && localStorage.getItem('isAdmin')) {
		return true;
	}

	localStorage.clear();
	return false;
};

const PrivateRoutes = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAuthenticated() ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/', state: { from: props.location } }} />
			)}
	/>
);

const PrivateAdmin = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAdmin() ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
	/>
);

export { PrivateRoutes, PrivateAdmin };
