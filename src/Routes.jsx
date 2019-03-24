
import React from 'react'
import { Route, Switch, Router } from 'react-router-dom'
import App from './App'
import NotFound from './NotFound'
import history from './history';

const Routes = () => (
    <Router history={history} >
        <Switch>
            <Route path={`/location/:coordinatesCenter/:radius`} component={App} /> 
            <Route path={`/location/:coordinatesCenter`} component={App} />
            <Route path={`/catalog/categories/:category`} component={App} />
            <Route path={`/catalog/viewpoints/:viewpoint`} component={App} />
            <Route path={`/catalog/:group/:category/:viewpoint`} component={App} />
            <Route path={`/catalog/:group/:category`} component={App} />
            <Route path={`/catalog/:group`} component={App} />
            <Route path={`/catalog`} component={App} />
            <Route exact path={`/`} component={App} />
            <Route path='*' component={NotFound} />
        </Switch>
    </Router >
);

export default Routes;