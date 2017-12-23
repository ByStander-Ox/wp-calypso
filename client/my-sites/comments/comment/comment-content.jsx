/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import AutoDirection from 'components/auto-direction';
import CommentPostLink from 'my-sites/comments/comment/comment-post-link';
import Emojify from 'components/emojify';
import QueryComment from 'components/data/query-comment';
import { stripHTML, decodeEntities } from 'lib/formatting';
import { getParentComment, getSiteComment } from 'state/selectors';
import { isJetpackSite } from 'state/sites/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';

export class CommentContent extends Component {
	static propTypes = {
		commentId: PropTypes.number,
		isBulkMode: PropTypes.bool,
		isPostView: PropTypes.bool,
	};

	renderInReplyTo = () => {
		const { isBulkMode, parentCommentContent, parentCommentUrl, translate } = this.props;

		if ( ! parentCommentContent ) {
			return null;
		}

		return (
			<div className="comment__in-reply-to">
				{ isBulkMode && <Gridicon icon="reply" size={ 18 } /> }
				<span>{ translate( 'In reply to:' ) }</span>
				<a href={ parentCommentUrl } tabIndex={ isBulkMode ? -1 : 0 }>
					<Emojify>{ parentCommentContent }</Emojify>
				</a>
			</div>
		);
	};

	render() {
		const {
			commentContent,
			commentId,
			commentIsPending,
			isBulkMode,
			isParentCommentLoaded,
			isPostView,
			parentCommentContent,
			parentCommentId,
			siteId,
			translate,
		} = this.props;
		return (
			<div className="comment__content">
				{ ! isParentCommentLoaded && (
					<QueryComment commentId={ parentCommentId } siteId={ siteId } forceWpcom />
				) }

				{ isBulkMode && (
					<div className="comment__content-preview">
						{ this.renderInReplyTo() }

						<AutoDirection>
							<Emojify>{ decodeEntities( stripHTML( commentContent ) ) }</Emojify>
						</AutoDirection>
					</div>
				) }

				{ ! isBulkMode && (
					<div className="comment__content-full">
						{ ( commentIsPending || parentCommentContent || ! isPostView ) && (
							<div className="comment__content-info">
								{ commentIsPending && (
									<div className="comment__status-label">{ translate( 'Pending' ) }</div>
								) }

								{ ! isPostView && <CommentPostLink { ...{ commentId, isBulkMode } } /> }

								{ this.renderInReplyTo() }
							</div>
						) }

						<AutoDirection>
							<Emojify>
								<div
									className="comment__content-body"
									dangerouslySetInnerHTML={ { __html: commentContent } } //eslint-disable-line react/no-danger
								/>
							</Emojify>
						</AutoDirection>
					</div>
				) }
			</div>
		);
	}
}

const mapStateToProps = ( state, { commentId } ) => {
	const siteId = getSelectedSiteId( state );
	const siteSlug = getSelectedSiteSlug( state );
	const isJetpack = isJetpackSite( state, siteId );

	const comment = getSiteComment( state, siteId, commentId );
	const postId = get( comment, 'post.ID' );

	const parentComment = getParentComment( state, siteId, postId, commentId );
	const parentCommentId = get( comment, 'parent.ID', 0 );
	const parentCommentContent = decodeEntities( stripHTML( get( parentComment, 'content' ) ) );

	const parentCommentUrl = isJetpack
		? get( parentComment, 'URL' )
		: `/comment/${ siteSlug }/${ parentCommentId }`;

	return {
		commentContent: get( comment, 'content' ),
		commentIsPending: 'unapproved' === get( comment, 'status' ),
		isJetpack,
		isParentCommentLoaded: ! parentCommentId || !! parentCommentContent,
		parentCommentContent,
		parentCommentId,
		parentCommentUrl,
		postId,
		siteId,
	};
};

export default connect( mapStateToProps )( localize( CommentContent ) );
