/**
 * External dependencies
 */
import { controls } from '@wordpress/data-controls';
import { plugins, registerStore, use } from '@wordpress/data';

import { STORE_KEY } from './constants';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import persistOptions from './persist';
import { SelectFromMap, DispatchFromMap } from '@automattic/data-stores';

use( plugins.persistence, persistOptions );

registerStore< State >( STORE_KEY, {
	actions,
	controls,
	reducer: reducer as any,
	selectors,
	persist: [ 'selectedPlanSlug' ],
} );

declare module '@wordpress/data' {
	function dispatch( key: typeof STORE_KEY ): DispatchFromMap< typeof actions >;
	function select( key: typeof STORE_KEY ): SelectFromMap< typeof selectors >;
}

export type State = import('./reducer').State;
export { STORE_KEY };
