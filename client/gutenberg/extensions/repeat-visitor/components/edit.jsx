/** @format */
/**
 * External dependencies
 */
import { Notice, TextControl, RadioControl, Placeholder } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/editor';
import { withSelect } from '@wordpress/data';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { sprintf } from '@wordpress/i18n';
import { __, _n } from 'gutenberg/extensions/presets/jetpack/utils/i18n';
import { CRITERIA_AFTER, CRITERIA_BEFORE } from '../constants';
import { icon } from '../index';

const RADIO_OPTIONS = [
	{
		value: CRITERIA_AFTER,
		label: __( 'Show after threshold' ),
	},
	{
		value: CRITERIA_BEFORE,
		label: __( 'Show before threshold' ),
	},
];

class RepeatVisitorEdit extends Component {
	setCriteria = criteria => this.props.setAttributes( { criteria } );
	setThreshold = threshold => {
		threshold.length &&
			Number.isFinite( +threshold ) &&
			+threshold > 0 &&
			this.props.setAttributes( { threshold } );
	};

	getNoticeLabel() {
		if ( this.props.attributes.criteria === CRITERIA_AFTER ) {
			return sprintf(
				_n(
					'This block will only appear to people who have visited this page at least once.',
					'This block will only appear to people who have visited this page at least %d times.',
					+this.props.attributes.threshold
				),
				this.props.attributes.threshold
			);
		}

		return sprintf(
			_n(
				'This block will only appear to people who have never visited this page before.',
				'This block will only appear to people who have visited this page less than %d times.',
				+this.props.attributes.threshold
			),
			this.props.attributes.threshold
		);
	}

	render() {
		return (
			<div
				className={ classNames( this.props.className, {
					'wp-block-jetpack-repeat-visitor--is-unselected': ! this.props.isSelected,
				} ) }
			>
				<Placeholder
					icon={ icon }
					label={ __( 'Repeat Visitor' ) }
					className="wp-block-jetpack-repeat-visitor-placeholder"
				>
					<TextControl
						className="wp-block-jetpack-repeat-visitor-threshold"
						label={ __( 'Visit count threshold' ) }
						defaultValue={ this.props.attributes.threshold }
						min="1"
						onChange={ this.setThreshold }
						type="number"
					/>

					<RadioControl
						label={ __( 'Visibility' ) }
						selected={ this.props.attributes.criteria }
						options={ RADIO_OPTIONS }
						onChange={ this.setCriteria }
					/>
				</Placeholder>

				<Notice status="info" isDismissible={ false }>
					{ this.getNoticeLabel() }
				</Notice>
				<InnerBlocks />
			</div>
		);
	}
}

export default withSelect( ( select, ownProps ) => {
	const { isBlockSelected, hasSelectedInnerBlock } = select( 'core/editor' );
	return {
		isSelected: isBlockSelected( ownProps.clientId ) || hasSelectedInnerBlock( ownProps.clientId ),
	};
} )( RepeatVisitorEdit );
