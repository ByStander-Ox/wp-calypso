/** @format */

/**
 * External dependencies
 */
import assert from 'assert'; // eslint-disable-line import/no-nodejs-modules
import { isFunction, fromPairs, partial } from 'lodash';

/**
 * Internal dependencies
 */
import { useSandbox } from 'test/helpers/use-sinon';

describe( 'wrap-es6-functions', () => {
	function assertCall( obj, args, key ) {
		test( key, () => {
			if ( isFunction( obj[ key ] ) ) {
				obj[ key ].apply( obj, args );
				assert( console.error.calledOnce ); // eslint-disable-line no-console
			}
		} );
	}

	useSandbox( sandbox => {
		sandbox.stub( console, 'error' );

		fromPairs(
			[
				[ Array, [ 'keys', 'entries', 'values', 'findIndex', 'fill', 'find', 'includes' ] ],
				[ String, [ 'codePointAt', 'normalize', 'repeat', 'startsWith', 'endsWith', 'includes' ] ],
			],
			( object, keys ) => {
				keys.forEach( key => {
					if ( isFunction( object.prototype[ key ] ) ) {
						sandbox.spy( object.prototype, key );
					}
				} );
			}
		);

		require( '../' )();
	} );

	describe( 'Array', () => {
		[ 'keys', 'entries', 'values', 'includes' ].forEach(
			partial( assertCall, Array.prototype, [] )
		);
		[ 'findIndex', 'find' ].forEach( partial( assertCall, Array.prototype, [ () => true ] ) );
		[ 'fill' ].forEach( partial( assertCall, Array.prototype, [ 1 ] ) );
	} );

	describe( 'String', () => {
		[ 'codePointAt', 'repeat' ].forEach( partial( assertCall, 'hello', [ 1 ] ) );
		[ 'startsWith', 'endsWith', 'includes' ].forEach( partial( assertCall, 'hello', [ 'a' ] ) );
		[ 'normalize' ].forEach( partial( assertCall, 'hello', [] ) );
	} );
} );
