
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import styled from 'styled-components'
import Login from '../login/Login'


const Main = styled.main`
  /* position: relative; */
  overflow: hidden;
  transition: all .15s;
  padding: 0 20px;
  margin-left: ${props => (props.expanded ? 240 : 64)}px;
`
function Routes() {

  return (
    <Router>
      <Switch>
        {/* Before login routes */}
        <PublicRoute exact path='/' component={Login} />

        {/* After login routes (has SideNav and NavBar) */}
        <Route
          render={({ location, history }) =>
            <React.Fragment>
              {/* sidenav */}
             
              <Main>
                {/* navbar */}
              

                {/* Contents */}
                <div
                  style={{
                    marginTop: 60,
                    backgroundColor: '#eee',
                    minHeight: '100vh'
                  }}
                >
                  {/* private routes */}
                  <PrivateRoute
                    path='../route/App.js'
                    
                    />
                 

                </div>
              </Main>
            </React.Fragment>}
        />
      </Switch>
    </Router>
  )
}

export default Routes
