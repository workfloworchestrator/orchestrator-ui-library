/* global module, require */
const React = require('react');

module.exports = {
    CopilotSidebar: ({ children }) =>
        React.createElement(
            'div',
            { 'data-testid': 'copilot-sidebar' },
            children,
        ),
};
