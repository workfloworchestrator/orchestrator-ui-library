import { css } from '@emotion/react';

// Todo: theme with decent colors from theme (style was copied from v1)
const PRIMARY_COLOR = '#0077cc';
const LIGHT_GREY_COLOR = '#eff2f3';
const MEDIUM_GREY_COLOR = '#a6b6be';

export const boolFieldStyling = css`

  .bool-field {
    .euiCheckbox .euiCheckbox__input ~ .euiCheckbox__label {
      z-index: unset;
    }

    label {
      display: inline-block;
      margin: 3px 0;
      &.info {
        margin-left: 10px;
        cursor: pointer;
      }
    }

    input[type="checkbox"] + label span {
      font-size: 11px;
      background-color: white;
      border: 1px solid ${PRIMARY_COLOR};
      border-radius: 3px;
      padding: 1px 2px;
      margin: 2px 0;
      cursor: pointer;
      i {
        color: transparent;
        padding: 0 1px;
      }
    }

    input[type="checkbox"]:disabled + label span {
      border: 1px solid ${MEDIUM_GREY_COLOR}
      background-color: ${LIGHT_GREY_COLOR};
      cursor: not-allowed;
    }

    input[type="checkbox"]:checked + label span {
      border: 2px solid ${PRIMARY_COLOR};
      border-radius: 2px;
      box-shadow: none;
      padding: 0;
      i {
        background-color: ${PRIMARY_COLOR};
        color: white;
        padding: 3px 2px;
      }
    }

    input[type="checkbox"]:checked:disabled + label span {
      border: 3px solid ${MEDIUM_GREY_COLOR};
      cursor: default;
      i {
        background-color: ${MEDIUM_GREY_COLOR};
      }
    }
  }
`;
