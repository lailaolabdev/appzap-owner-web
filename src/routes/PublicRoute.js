import React from 'react'
import { Route } from 'react-router-dom'

/**
 *
 * return not authenticated header & component
 */
function PublicRoute({ component: Component, headerTitle, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) => {
				return (
					<div>
						{/* <Header isAuthenticated={false} headerTitle={headerTitle} /> */}
						<Component {...props} />
					</div>
				)
			}}
		/>
	)
}

export default PublicRoute
