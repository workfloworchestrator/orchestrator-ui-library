import { ServiceTicketProcessState } from '../../types';
import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';

const { NEW, OPEN, OPEN_RELATED, OPEN_ACCEPTED, UPDATED, ABORTED, CLOSED } =
    ServiceTicketProcessState;

// This probably will be subject to change
export const mapStateToColor = (
    state: ServiceTicketProcessState,
    theme: EuiThemeComputed,
) => {
    switch (state) {
        case OPEN || NEW:
            return {
                backgroundColor: theme.colors.success,
                textColor: theme.colors.successText,
            };
        case OPEN_ACCEPTED || OPEN_RELATED:
            return {
                backgroundColor: theme.colors.warning,
                textColor: theme.colors.warningText,
            };
        case UPDATED:
            return {
                backgroundColor: theme.colors.primary,
                textColor: theme.colors.primaryText,
            };
        case CLOSED || ABORTED:
            return {
                backgroundColor: theme.colors.lightShade,
                textColor: theme.colors.text,
            };
        default:
            return {
                backgroundColor: theme.colors.lightShade,
                textColor: theme.colors.text,
            };
    }
};
