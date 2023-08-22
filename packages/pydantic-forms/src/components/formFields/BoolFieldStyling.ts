import { css } from "@emotion/core";

import { LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, PRIMARY_COLOR } from "../../../stylesheets/emotion/colors";
import { shadeColor } from "../../../stylesheets/emotion/utils";

export const boolFieldStyling = css`
  .bool-field {
    .euiCheckbox .euiCheckbox__input ~ .euiCheckbox__label {
      z-index: unset;
    }

    input[type="checkbox"] {
      display: none;
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
      border: 1px solid ${shadeColor(MEDIUM_GREY_COLOR, -5)}
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
