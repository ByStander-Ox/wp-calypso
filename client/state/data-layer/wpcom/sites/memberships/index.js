/** @format */

/**
 * External dependencies
 */

import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import {
	MEMBERSHIPS_PRODUCTS_RECEIVE,
	MEMBERSHIPS_PRODUCTS_LIST,
	MEMBERSHIPS_EARNINGS_GET,
	MEMBERSHIPS_EARNINGS_RECEIVE,
	MEMBERSHIPS_SUBSCRIBERS_RECEIVE,
	MEMBERSHIPS_SUBSCRIBERS_LIST,
} from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';

import { registerHandlers } from 'state/data-layer/handler-registry';

export const membershipProductFromApi = product => ( {
	ID: product.id || product.connected_account_product_id,
	currency: product.currency,
	description: product.description,
	email: '',
	featuredImageId: null,
	formatted_price: product.price,
	multiple: false,
	price: product.price,
	title: product.title,
	recurring: true,
	stripe_account: product.connected_destination_account_id,
	renewal_schedule: product.interval,
} );

export const handleMembershipProductsList = dispatchRequest( {
	fetch: action =>
		http(
			{
				method: 'GET',
				path: `/sites/${ action.siteId }/memberships/products`,
			},
			action
		),
	fromApi: function( endpointResponse ) {
		const products = endpointResponse.products.map( membershipProductFromApi );
		return products;
	},
	onSuccess: ( { siteId }, products ) => ( {
		type: MEMBERSHIPS_PRODUCTS_RECEIVE,
		siteId,
		products,
	} ),
	onError: noop,
} );

export const handleMembershipGetEarnings = dispatchRequest( {
	fetch: action =>
		http(
			{
				method: 'GET',
				path: `/sites/${ action.siteId }/memberships/earnings`,
				apiNamespace: 'wpcom/v2',
			},
			action
		),
	onSuccess: ( { siteId }, earnings ) => ( {
		type: MEMBERSHIPS_EARNINGS_RECEIVE,
		siteId,
		earnings,
	} ),
	onError: noop,
} );

export const handleMembershipGetSubscribers = dispatchRequest( {
	fetch: action =>
		http(
			{
				method: 'GET',
				path: `/sites/${ action.siteId }/memberships/subscribers?offset=${ action.offset }`,
				apiNamespace: 'wpcom/v2',
			},
			action
		),
	onSuccess: ( { siteId }, subscribers ) => ( {
		type: MEMBERSHIPS_SUBSCRIBERS_RECEIVE,
		siteId,
		subscribers,
	} ),
	onError: noop,
} );

registerHandlers( 'state/data-layer/wpcom/sites/memberships/index.js', {
	[ MEMBERSHIPS_PRODUCTS_LIST ]: [ handleMembershipProductsList ],
	[ MEMBERSHIPS_EARNINGS_GET ]: [ handleMembershipGetEarnings ],
	[ MEMBERSHIPS_SUBSCRIBERS_LIST ]: [ handleMembershipGetSubscribers ],
} );
