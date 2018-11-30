/** @format */
/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { EditorProvider, ErrorBoundary } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import Layout from './components/layout';
import './store';

function Editor( { settings, hasFixedToolbar, focusMode, post, overridePost, onError, ...props } ) {
	if ( ! post ) {
		return null;
	}

	const editorSettings = {
		...settings,
		hasFixedToolbar,
		focusMode,
	};

	return (
		<EditorProvider settings={ editorSettings } post={ { ...post, ...overridePost } } { ...props }>
			<ErrorBoundary onError={ onError }>
				<Layout />
			</ErrorBoundary>
		</EditorProvider>
	);
}

export default withSelect( select => ( {
	hasFixedToolbar: select( 'core/edit-post' ).isFeatureActive( 'fixedToolbar' ),
	focusMode: select( 'core/edit-post' ).isFeatureActive( 'focusMode' ),
} ) )( Editor );
