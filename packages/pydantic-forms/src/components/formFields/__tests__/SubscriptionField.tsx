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

import waitForComponentToPaint from "__tests__/waitForComponentToPaint";
import withApplicationContext from "__tests__/withApplicationContext";
import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import withSubscriptions from "lib/uniforms-surfnet/__tests__/_withSubscriptions";
import { ListField, SubscriptionField } from "lib/uniforms-surfnet/src";
import { getPortMode, makeLabel } from "lib/uniforms-surfnet/src/SubscriptionField";
import ReactSelect from "react-select";
import { apiClient, customApiClient } from "utils/ApplicationContext";
import { Product, ServicePortSubscription } from "utils/types";

const APP_CONTEXT = {
    products: [
        { product_id: "P1", tag: "A", fixed_inputs: [{ name: "port_speed", value: "1000" }] } as Product,
        { product_id: "P2", tag: "A", fixed_inputs: [{ name: "port_speed", value: "10000" }] } as Product,
        { product_id: "P3", tag: "B" } as Product,
        { product_id: "P4", tag: "C" } as Product,
    ],
};

describe("<SubscriptionField>", () => {
    test("<SubscriptionField> - renders an input", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);
        expect(wrapper.find(ReactSelect)).toHaveLength(1);
    });

    test("<SubscriptionField> - renders a select with correct disabled state", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" disabled />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);
        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("isDisabled")).toBe(true);
    });

    test("<SubscriptionField> - renders a select with correct id (inherited)", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);
        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("id")).toBeTruthy();
    });

    test("<SubscriptionField> - renders a select with correct id (specified)", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" id="y" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);
        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("id")).toBe("y");
    });

    test("<SubscriptionField> - renders a select with correct name", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);
        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("name")).toBe("x");
    });

    test("<SubscriptionField> - renders a select with correct options (no filter)", async () => {
        const { element, getSubscriptions } = withSubscriptions(<SubscriptionField name="x" id="snapshot-test" />);
        getSubscriptions.mockReturnValue([
            { subscription_id: "a", customer_id: "c1", description: "d1", product: { tag: "" } as Product },
            { subscription_id: "b", customer_id: "c2", description: "d2", product: { tag: "" } as Product },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }, undefined, "subscriptionfield-nofilter"));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "d1", value: "a" },
            { label: "d2", value: "b" },
        ]);
        expect(wrapper.render()).toMatchSnapshot();
    });

    test("<SubscriptionField> - renders a select with correct options (tags filtered)", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" tags={["A"]} />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                product: { product_id: "P1", tag: "A" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { product_id: "P2", tag: "A" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(undefined, undefined, ["A"], undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "d1", value: "a" },
            { label: "d2", value: "b" },
        ]);
    });

    test("<SubscriptionField> - renders a select with correct options (status filtered)", async () => {
        const { element, getSubscriptions } = withSubscriptions(<SubscriptionField name="x" statuses={["active"]} />);
        getSubscriptions.mockReturnValue([
            { subscription_id: "a", customer_id: "c1", description: "d1", product: { tag: "" } as Product },
            { subscription_id: "b", customer_id: "c2", description: "d2", product: { tag: "" } as Product },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, ["active"]);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "d1", value: "a" },
            { label: "d2", value: "b" },
        ]);
    });

    test("<SubscriptionField> - renders a select with correct options (excluded subscriptions)", async () => {
        const { element, getSubscriptions } = withSubscriptions(
            <SubscriptionField name="x" excludedSubscriptionIds={["a"]} />
        );
        getSubscriptions.mockReturnValue([
            { subscription_id: "a", customer_id: "c1", description: "d1", product: { tag: "" } as Product },
            { subscription_id: "b", customer_id: "c2", description: "d2", product: { tag: "" } as Product },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([{ label: "d2", value: "b" }]);
    });

    test("<SubscriptionField> - renders a select with correct options (organisationId)", async () => {
        const { element, getSubscriptions } = withSubscriptions(<SubscriptionField name="x" organisationId="c2" />);
        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                product: { tag: "A" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "A" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([{ label: "d2", value: "b" }]);
    });

    test("<SubscriptionField> - renders a select with correct options (organisationKey not filled in yet)", async () => {
        const { element, getSubscriptions } = withSubscriptions(<SubscriptionField name="x" organisationKey="key" />);
        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                product: { tag: "A" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "A" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }, { model: {} }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([]);
    });

    test("<SubscriptionField> - renders a select with correct options (organisationKey)", async () => {
        const { element, getSubscriptions } = withSubscriptions(<SubscriptionField name="x" organisationKey="key" />);
        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                product: { tag: "A" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "A" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }, { model: { key: "c2" } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([{ label: "d2", value: "b" }]);
    });

    test("<SubscriptionField> - renders a select with correct options (visiblePortMode tagged)", async () => {
        const { element, getSubscriptions } = withSubscriptions(
            <SubscriptionField name="x" visiblePortMode="tagged" />
        );
        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                port_mode: "untagged",
                product: { tag: "SP" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "MSC" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([{ label: "b TAGGED d2 c2", value: "b" }]);
    });

    test("<SubscriptionField> - renders a select with correct options (visiblePortMode normal)", async () => {
        const { element, getSubscriptions } = withSubscriptions(
            <SubscriptionField name="x" visiblePortMode="normal" />
        );
        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                port_mode: "untagged",
                product: { tag: "SP" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "MSC" } as Product,
            },
            {
                subscription_id: "c",
                customer_id: "c3",
                description: "d3",
                port_mode: "link_member",

                product: { tag: "SP" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(getSubscriptions).toHaveBeenCalledWith(apiClient, customApiClient, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "a UNTAGGED d1 c1", value: "a" },
            { label: "b TAGGED d2 c2", value: "b" },
        ]);
    });

    test("<SubscriptionField> - renders a select with correct options (productIds filtered products)", async () => {
        const elementWithContext = withApplicationContext(
            <SubscriptionField name="x" productIds={["P1", "P2"]} />,
            APP_CONTEXT
        );
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);

        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                port_mode: "untagged",
                product: { tag: "A", product_id: "P1" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "A", product_id: "P4" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        // Ignore application context api clients due to withApplicationContext
        expect(getSubscriptions).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([{ label: "d1", value: "a" }]);
    });
    test("<SubscriptionField> - renders a select with correct options (bandwith filterd products)", async () => {
        const elementWithContext = withApplicationContext(
            <SubscriptionField name="x" bandwidth={10000} />,
            APP_CONTEXT
        );
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);

        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                port_mode: "untagged",
                product: { tag: "A", product_id: "P2" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "A", product_id: "P3" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        // Ignore application context api clients due to withApplicationContext
        expect(getSubscriptions).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "d1", value: "a" },
            { label: "d2", value: "b" },
        ]);
    });
    test("<SubscriptionField> - renders a select with correct options (bandwithKey filterd products)", async () => {
        const elementWithContext = withApplicationContext(
            <SubscriptionField name="x" bandwidthKey="bandwidth" />,
            APP_CONTEXT
        );
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);

        getSubscriptions.mockReturnValue([
            {
                subscription_id: "a",
                customer_id: "c1",
                description: "d1",
                port_mode: "untagged",
                product: { tag: "A", product_id: "P2" } as Product,
            },
            {
                subscription_id: "b",
                customer_id: "c2",
                description: "d2",
                product: { tag: "A", product_id: "P3" } as Product,
            },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }, { model: { bandwidth: "10000" } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        // Ignore application context api clients due to withApplicationContext
        expect(getSubscriptions).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "d1", value: "a" },
            { label: "d2", value: "b" },
        ]);
    });

    test("<SubscriptionField> - renders a select with correct placeholder", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" placeholder="" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);

        const wrapper = mount(
            element,
            createContext({
                x: { type: String, optional: true },
            })
        );
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("placeholder")).toBe("Search and select a subscription...");
    });

    test("<SubscriptionField> - renders a select with correct value (default)", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);
        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("value")).toBe(undefined);
    });

    test("<SubscriptionField> - renders a select with correct value (model)", async () => {
        const { element, getSubscriptions } = withSubscriptions(<SubscriptionField name="x" value="b" />);
        getSubscriptions.mockReturnValue([
            { subscription_id: "b", customer_id: "abc", description: "dec", product: { tag: "" } as Product },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }, { model: { x: "b" } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("value")).toStrictEqual({ label: "dec", value: "b" });
    });

    test("<SubscriptionField> - renders a select with correct value (specified)", async () => {
        const { element, getSubscriptions } = withSubscriptions(<SubscriptionField name="x" value="b" />);
        getSubscriptions.mockReturnValue([
            { subscription_id: "b", customer_id: "abc", description: "dec", product: { tag: "" } as Product },
        ]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("value")).toStrictEqual({ label: "dec", value: "b" });
    });

    test("<SubscriptionField> - renders a select which correctly reacts on change", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);

        const onChange = jest.fn();

        const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        wrapper.find(ReactSelect).invoke("onChange")({ value: "b" });

        expect(onChange).toHaveBeenLastCalledWith("x", "b");
    });

    test("<SubscriptionField> - renders a select which correctly reacts on change (empty)", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);
        const onChange = jest.fn();

        const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        wrapper.find(ReactSelect).invoke("onChange")(undefined);

        expect(onChange).toHaveBeenLastCalledWith("x", undefined);
    });

    test("<SubscriptionField> - renders a select which correctly reacts on change (same value)", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);
        const onChange = jest.fn();

        const wrapper = mount(element, createContext({ x: { type: String } }, { model: { x: "b" }, onChange }));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        wrapper.find(ReactSelect).invoke("onChange")({ value: "b" });

        expect(onChange).toHaveBeenLastCalledWith("x", "b");
    });

    test("<SubscriptionField> - renders a label", async () => {
        const elementWithContext = withApplicationContext(<SubscriptionField name="x" label="y" />, APP_CONTEXT);
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);
        const wrapper = mount(element, createContext({ x: { type: String } }, undefined, "subscriptionfield-label"));
        await waitForComponentToPaint(wrapper);

        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").prop("children")).toContain("y");
        expect(wrapper.find("label").prop("htmlFor")).toBe("subscriptionfield-label-0000");
    });

    test("<SubscriptionField> - renders a sync button", async () => {
        const elementWithContext = withApplicationContext(
            <SubscriptionField name="x" id="snapshot-test" />,
            APP_CONTEXT
        );
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);
        const wrapper = mount(
            element,
            createContext({ x: { type: String } }, undefined, "subscriptionfield-syncbutton")
        );
        await waitForComponentToPaint(wrapper);

        // EUIButtonIcon and the surrounding div will receive the class
        expect(wrapper.find(".reload-subscriptions-icon-button")).toHaveLength(2);
        // No service port should be visible
        expect(wrapper.find(".show-service-port-modal-icon-button")).toHaveLength(0);
        expect(wrapper.render()).toMatchSnapshot();
    });

    test("<SubscriptionField> - renders a wrapper with unknown props", async () => {
        const elementWithContext = withApplicationContext(
            <SubscriptionField name="x" data-x="x" data-y="y" data-z="z" />,
            APP_CONTEXT
        );
        const { element, getSubscriptions } = withSubscriptions(elementWithContext);
        getSubscriptions.mockReturnValue([]);

        const wrapper = mount(element, createContext({ x: { type: String } }));
        await waitForComponentToPaint(wrapper);
        expect(wrapper.find("section").at(0).prop("data-x")).toBe("x");
        expect(wrapper.find("section").at(0).prop("data-y")).toBe("y");
        expect(wrapper.find("section").at(0).prop("data-z")).toBe("z");
    });

    test("<SubscriptionField> - renders a select with correct value (as uniqueItem list child)", async () => {
        const { element, getSubscriptions } = withSubscriptions(
            <ListField name="x">
                <SubscriptionField name="$" id="snapshot-test" />
            </ListField>
        );
        getSubscriptions.mockReturnValue([
            { subscription_id: "a", customer_id: "abc1", description: "dec1", product: { tag: "" } as Product },
            { subscription_id: "b", customer_id: "abc2", description: "dec2", product: { tag: "" } as Product },
        ]);
        const wrapper = mount(
            element,
            createContext(
                {
                    x: { type: Array, uniforms: { uniqueItems: true } },
                    "x.$": { type: String },
                },
                { model: { x: ["a", undefined] } },
                "subscriptionfield-uniqueitem"
            )
        );

        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(2);
        expect(wrapper.find(ReactSelect).at(0).prop("value")).toStrictEqual({ label: "dec1", value: "a" });
        expect(wrapper.find(ReactSelect).at(1).prop("value")).toStrictEqual(undefined);
        expect(wrapper.find(ReactSelect).at(1).prop("options")).toStrictEqual([{ label: "dec2", value: "b" }]);
        expect(wrapper.render()).toMatchSnapshot();
    });

    function makeSubscription(tag: string, port_mode?: string): ServicePortSubscription {
        let sub = {
            subscription_id: "abcdefgh-ijkl-mnop-qrst",
            customer_id: "abc",
            description: "dec",
            product: { tag } as Product,
        } as ServicePortSubscription;

        if (port_mode) {
            sub.port_mode = port_mode;
        }

        return sub;
    }

    test("makeLabel - Works for other subscriptions", async () => {
        expect(makeLabel(makeSubscription("IP_PREFIX"), [], [])).toBe("dec");
    });
    test("makeLabel - Works for Node subscriptions", async () => {
        expect(makeLabel(makeSubscription("Node"), [], [])).toBe("abcdefgh dec");
    });

    test("makeLabel - Works for Sn8 Port subscriptions", async () => {
        expect(makeLabel(makeSubscription("SP", "tagged"), [], [])).toBe("abcdefgh TAGGED dec abc");
        expect(makeLabel(makeSubscription("SP", "untagged"), [], [])).toBe("abcdefgh UNTAGGED dec abc");
        expect(makeLabel(makeSubscription("MSC"), [], [])).toBe("abcdefgh TAGGED dec abc");
    });

    test("getPortMode - Works for Sn8  subscriptions", async () => {
        expect(getPortMode(makeSubscription("SP", "tagged"), [])).toBe("tagged");
        expect(getPortMode(makeSubscription("AGGSP", "tagged"), [])).toBe("tagged");
        expect(getPortMode(makeSubscription("SP", "untagged"), [])).toBe("untagged");
        expect(getPortMode(makeSubscription("AGGSP", "untagged"), [])).toBe("untagged");
        expect(getPortMode(makeSubscription("MSC"), [])).toBe("tagged");
    });
});
