/** @format */

/**
 * External dependencies
 */

import { find } from 'lodash';

/**
 * Internal dependencies
 */
import { prepareComparableUrl } from 'state/reader/follows/utils';
import getReaderAliasedFollowFeedUrl from 'state/selectors/get-reader-aliased-follow-feed-url';

export default function isFollowing( state, { feedUrl, feedId, blogId } ) {
	let follow;
	if ( feedUrl ) {
		const url = getReaderAliasedFollowFeedUrl( state, feedUrl );
		follow = state.reader.follows.items[ prepareComparableUrl( url ) ];
	} else if ( feedId ) {
		follow = find( state.reader.follows.items, { feed_ID: feedId } );
	} else if ( blogId ) {
		follow = find( state.reader.follows.items, { blog_ID: blogId } );
	}
	return !! follow && follow.is_following;
}
