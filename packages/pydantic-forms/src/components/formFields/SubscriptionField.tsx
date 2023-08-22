/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiModal, EuiOverlayMask, EuiText } from "@elastic/eui";
import ServicePortSelectorModal from "components/modals/ServicePortSelectorModal";
import { SubscriptionsContext } from "components/subscriptionContext";
import { ListFieldProps } from "lib/uniforms-surfnet/src/ListField";
import { FieldProps } from "lib/uniforms-surfnet/src/types";
import { intl } from "locale/i18n";
import get from "lodash/get";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import ReactSelect from "react-select";
import { getReactSelectTheme } from "stylesheets/emotion/utils";
import { connectField, filterDOMProps, joinName, useField, useForm } from "uniforms";
import ApplicationContext from "utils/ApplicationContext";
import { productById } from "utils/Lookups";
import { Option, Organization, Product, ServicePortSubscription, Subscription as iSubscription } from "utils/types";
import { filterProductsByBandwidth } from "validations/Products";

import { subscriptionFieldStyling } from "./SubscriptionFieldStyling";

export function makeLabel(subscription: iSubscription, products: Product[], organisations?: Organization[]) {
    const organisation = organisations && organisations.find((org) => org.uuid === subscription.customer_id);
    const organisationName = organisation ? organisation.name : subscription.customer_id.substring(0, 8);
    const product = subscription.product || productById(subscription.product_id!, products);
    const description =
        subscription.description || intl.formatMessage({ id: "forms.widgets.subscription.missingDescription" });
    const subscription_substring = subscription.subscription_id.substring(0, 8);

    if (["Node"].includes(product.tag)) {
        const description =
            subscription.description || intl.formatMessage({ id: "forms.widgets.subscription.missingDescription" });
        return `${subscription.subscription_id.substring(0, 8)} ${description.trim()}`;
    } else if (["SP", "SPNL", "AGGSP", "AGGSPNL", "MSC", "MSCNL", "IRBSP"].includes(product.tag)) {
        let portSubscription = subscription as ServicePortSubscription;
        const portMode = getPortMode(portSubscription, products);
        return `${subscription_substring} ${portMode.toUpperCase()} ${description.trim()} ${organisationName}`;
    } else {
        return description.trim();
    }
}

export function getPortMode(subscription: ServicePortSubscription, products: Product[]) {
    const product = subscription.product || productById(subscription.product_id!, products);

    return subscription?.port_mode || (["MSC", "MSCNL", "IRBSP"].includes(product.tag!) ? "tagged" : "untagged");
}

declare module "uniforms" {
    interface FilterDOMProps {
        excludedSubscriptionIds: never;
        organisationId: never;
        organisationKey: never;
        visiblePortMode: never;
        bandwidth: never;
        bandwidthKey: never;
        tags: never;
        statuses: never;
    }
}
filterDOMProps.register(
    "productIds",
    "excludedSubscriptionIds",
    "organisationId",
    "organisationKey",
    "visiblePortMode",
    "bandwidth",
    "bandwidthKey",
    "tags",
    "statuses"
);

export type SubscriptionFieldProps = FieldProps<
    string,
    {
        productIds?: string[];
        excludedSubscriptionIds?: string[];
        organisationId?: string;
        organisationKey?: string;
        visiblePortMode?: string;
        bandwidth?: number;
        bandwidthKey?: string;
        tags?: string[]; // There is an assumption that using tags means you want port subscriptions
        statuses?: string[];
    } & WrappedComponentProps
>;

function Subscription({
    disabled,
    id,
    inputRef,
    label,
    description,
    name,
    onChange,
    placeholder,
    readOnly,
    required,
    type,
    value,
    error,
    showInlineError,
    errorMessage,
    className = "",
    productIds,
    excludedSubscriptionIds,
    organisationId,
    organisationKey,
    visiblePortMode = "all",
    bandwidth,
    bandwidthKey,
    tags,
    statuses,
    inlist,
    intl,
    ...props
}: SubscriptionFieldProps) {
    const { theme, organisations, products: allProducts, apiClient, customApiClient } = useContext(ApplicationContext);
    const { getSubscriptions, clearSubscriptions } = useContext(SubscriptionsContext);

    const nameArray = joinName(null, name);
    let parentName = joinName(nameArray.slice(0, -1));
    // We cant call useField conditionally so we call it for ourselfs if there is no parent
    if (parentName === "") {
        parentName = name;
    }
    const parent = useField(parentName, {}, { absoluteName: true })[0];
    const { model, schema } = useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);

    let [subscriptions, updateSubscriptions] = useState<iSubscription[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [loading, setLoading] = useState<boolean>(false);

    const bandwithFromField = bandwidthKey
        ? get(model, bandwidthKey!) || schema.getInitialValue(bandwidthKey, {})
        : undefined;

    const usedBandwidth = bandwidth || bandwithFromField;

    // Get value from org field if organisationKey is set.
    const usedOrganisationId = organisationKey
        ? get(model, organisationKey, "nonExistingOrgToFilterEverything")
        : organisationId;

    const filteredProductIds = useMemo(() => {
        let products = allProducts;
        if (tags?.length) {
            products = allProducts.filter((product) => tags?.includes(product.tag));
        }

        if (productIds?.length) {
            products = allProducts.filter((product) => productIds?.includes(product.product_id));
        }

        if (usedBandwidth) {
            products = filterProductsByBandwidth(products, usedBandwidth);
        }

        return products.map((product) => product.product_id);
    }, [allProducts, usedBandwidth, productIds, tags]);

    useEffect(() => {
        getSubscriptions(apiClient, customApiClient, tags, statuses).then((result) => updateSubscriptions(result));
    }, [getSubscriptions, tags, statuses, apiClient, customApiClient]);

    // Filter by product, needed because getSubscriptions might return more than we want
    let subscriptionsFiltered =
        filteredProductIds.length === allProducts.length
            ? subscriptions
            : subscriptions.filter((sp) => filteredProductIds.includes(sp.product.product_id));

    if (excludedSubscriptionIds) {
        subscriptionsFiltered = subscriptionsFiltered.filter(
            (item) => !excludedSubscriptionIds.includes(item.subscription_id)
        );
    }

    // Port mode filter
    if (visiblePortMode !== "all") {
        if (visiblePortMode === "normal") {
            subscriptionsFiltered = subscriptionsFiltered.filter(
                (item) => getPortMode(item, allProducts) === "tagged" || getPortMode(item, allProducts) === "untagged"
            );
        } else {
            subscriptionsFiltered = subscriptionsFiltered.filter(
                (item) => getPortMode(item, allProducts) === visiblePortMode
            );
        }
    }

    // Customer filter toggle
    if (usedOrganisationId) {
        subscriptionsFiltered = subscriptionsFiltered.filter((item) => item.customer_id === usedOrganisationId);
    }

    if (parentName !== name) {
        if (parent.fieldType === Array && (parent as ListFieldProps).uniqueItems) {
            const allValues: string[] = get(model, parentName, []);
            const chosenValues = allValues.filter(
                (_item, index) => index.toString() !== nameArray[nameArray.length - 1]
            );

            subscriptionsFiltered = subscriptionsFiltered.filter(
                (subscription) => !chosenValues.includes(subscription.subscription_id)
            );
        }
    }

    const options = subscriptionsFiltered.map((subscription: iSubscription) => ({
        label: makeLabel(subscription, allProducts, organisations),
        value: subscription.subscription_id,
    }));

    const selectedValue = options.find((option: Option) => option.value === value);

    const selectSubscriptionFromModal = (s: any) => {
        onChange(s);
        closeModal();
    };
    const customStyles = getReactSelectTheme(theme);

    return (
        <EuiFlexItem css={subscriptionFieldStyling} grow={1}>
            <section
                {...filterDOMProps(props)}
                className={`${className} subscription-field${disabled ? "-disabled" : ""}`}
            >
                <EuiFormRow
                    label={label}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    error={showInlineError ? errorMessage : false}
                    isInvalid={error}
                    id={id}
                    fullWidth
                >
                    <div>
                        {!disabled && (
                            <EuiFlexGroup alignItems={"center"} gutterSize={"none"} responsive={false}>
                                <EuiButtonIcon
                                    className="reload-subscriptions-icon-button"
                                    id={`refresh-icon-${id}`}
                                    aria-label={`reload-${label}`}
                                    iconType="refresh"
                                    iconSize="l"
                                    onClick={() => {
                                        setLoading(true);
                                        clearSubscriptions();
                                        getSubscriptions(apiClient, customApiClient, tags, statuses).then((result) => {
                                            updateSubscriptions(result);
                                            setLoading(false);
                                        });
                                    }}
                                />
                                {tags?.includes("SP") && (
                                    <EuiButtonIcon
                                        className="show-service-port-modal-icon-button"
                                        id={`filter-icon-${id}`}
                                        aria-label={`service-port-modal-${name}`}
                                        onClick={showModal}
                                        iconType="filter"
                                        iconSize="l"
                                    />
                                )}
                            </EuiFlexGroup>
                        )}

                        {isModalVisible && (
                            <EuiOverlayMask>
                                <EuiModal onClose={closeModal} initialFocus="[id=modalNodeSelector]">
                                    <ServicePortSelectorModal
                                        selectedTabId="nodeFilter"
                                        handleSelect={selectSubscriptionFromModal}
                                        subscriptions={subscriptionsFiltered}
                                    />
                                </EuiModal>
                            </EuiOverlayMask>
                        )}
                        <ReactSelect<Option, false>
                            id={id}
                            inputId={`${id}.search`}
                            name={name}
                            onChange={(option) => {
                                onChange(option?.value);
                            }}
                            options={options}
                            value={selectedValue}
                            isSearchable={true}
                            isClearable={false}
                            placeholder={intl.formatMessage({ id: "forms.widgets.subscription.placeholder" })}
                            isDisabled={disabled || readOnly}
                            styles={customStyles}
                            className="subscription-field-select"
                        />
                    </div>
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
}

export default connectField(injectIntl(Subscription), { kind: "leaf" });
