/*
 * ============================================================================
 * For validating the `fires-description` plugin and `publish` template in the
 * JS package `tracking-jsdoc` in this repo.
 * ============================================================================
 */

/**
 * Modal to greet the user, after successful completion of onboarding.
 *
 * @fires modal_closed with `action: 'create-paid-campaign' | 'maybe-later' | 'view-product-feed' | 'dismiss'`
 * @emits modal_opened with `context: GUIDE_NAMES.SUBMISSION_SUCCESS`
 */
export const SuccessGuide = () => {
	return 1;
};

/**
 * Renders `DateRangeFilterPicker`, handles range selection, fires applicable track events.
 *
 * @fires datepicker_update with `report: props.trackEventReportId` and `data` given by `DateRangeFilterPicker`'s `onRangeSelect` callback.
 */
export const DatepickerStartDate = () => {
	return 1;
};

/**
 * Set of filters to be used in Programs Report page.
 * Contains date and program pickers.
 *
 * @emits datepicker_update
 */
export default function DatepickerEndDate() {
	return 1;
}
