/**
 * Dynamic Forms
 *
 * The main context of a dynamic form
 *
 * This will fetch the jsonScheme, parse it, and handle form state and validation
 */
import React from 'react';
import { useMemo } from 'react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Subscription } from 'react-hook-form/dist/utils/createSubject';

import i18next from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

import { zodResolver } from '@hookform/resolvers/zod';

import {
    getErrorDetailsFromResponse,
    getFormValuesFromFieldOrLabels,
} from '@/dynamic-forms/core/helper';
import {
    useDynamicForm,
    useFormParser,
    useRefParser,
} from '@/dynamic-forms/core/hooks';
import { useCacheKey } from '@/dynamic-forms/core/hooks/useCacheKey';
import useCustomDataProvider from '@/dynamic-forms/core/hooks/useCustomDataProvider';
import useCustomZodValidation from '@/dynamic-forms/core/hooks/useCustomZodValidator';
import { useLabelProvider } from '@/dynamic-forms/core/hooks/useLabelProvider';
import { useLeavePageConfirm } from '@/dynamic-forms/core/hooks/useLeavePageConfirm';
import {
    DynamicFormsMetaData,
    IDynamicFormsContextInitialProps,
    IDynamicFormsContextProps,
    IValidationErrorDetails,
} from '@/dynamic-forms/types';
import { CsFlags, IsCsFlagEnabled } from '@/dynamic-forms/utils';

import translation from './translations/nl.json';

// lng and resources key depend on your locale.
i18next.init({
    lng: 'nl',
    resources: {
        nl: {
            zod: translation,
        },
    },
});
z.setErrorMap(zodI18nMap);

export const DynamicFormsContext =
    createContext<IDynamicFormsContextProps | null>(null);

function DynamicFormsProvider({
    workflowName,
    metaData,
    title,
    sendLabel,
    headerComponent,
    footerComponent,
    successNotice,
    onSuccess,
    onCancel,
    children,
    config,
}: IDynamicFormsContextInitialProps) {
    console.log('WHAAAAATTTTTTTTTTTTTTTTTTTTTTT');
    const {
        fieldDetailProvider,
        onFieldChangeHandler,
        dataProviderCacheKey,
        customValidationRules,
    } = config;

    // option to enable the debug mode on the fly in the browser
    // by setting localStorage.setItem("dynamicFormsDebugMode", "true")
    // reload is required
    const debugMode = localStorage.getItem('dynamicFormsDebugMode') === '1';

    const initialUserInput = metaData ? [metaData] : [];
    const [formInputData, setFormInputData] =
        useState<DynamicFormsMetaData[]>(initialUserInput);
    const [errorDetails, setErrorDetails] = useState<IValidationErrorDetails>();
    const [isFullFilled, setIsFullFilled] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [cacheKey] = useCacheKey(); // this ensures we refresh the data anytime ctx is re-initialized

    // fetch the labels of the form, but can also include the current form values
    const { formLabels, isLoadingFormLabels, hasErrorFormLabels } =
        useLabelProvider(workflowName, cacheKey);

    const { data: customData, isLoading: isCustomDataLoading } =
        useCustomDataProvider(
            dataProviderCacheKey ? dataProviderCacheKey : cacheKey,
        );

    const theDynamicForm = useMemo(() => {
        return {};
    }, []); //useDynamicForm(workflowName, formInputData);

    // we cache the form scheme so when there is an error, we still have the form
    // the form is not in the error response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rawSchema, setRawSchema] = useState<any>({});
    // parse the raw scheme refs so all data is where it should be in the schema
    const { data: schema } = useRefParser('form', rawSchema);
    // extract the JSON schema to a more usable custom schema
    const formData = useFormParser(schema, formLabels, fieldDetailProvider);

    const theReactHookFormRef = useRef<ReturnType<typeof useForm>>();

    // build validation rules based on custom schema
    /*
    const resolver = useCustomZodValidation(
        formData,
        theReactHookFormRef.current,
        customValidationRules,
    );
*/
    // initialize the react-hook-form
    const theReactHookForm = useForm({
        resolver: zodResolver(z.object({})),
        mode: 'all',
    });

    theReactHookFormRef.current = theReactHookForm;

    // prevent user from navigating away when there are unsaved changes

    const hasUnsavedData =
        !isFullFilled &&
        theReactHookForm?.formState &&
        theReactHookForm.formState.isDirty;
    useLeavePageConfirm(
        hasUnsavedData,
        'Er zijn aanpassingen in het formulier. \nWeet u zeker dat u de pagina wilt verlaten?',
    );

    // a useeffect for whenever the error response updates
    // sometimes we need to update the form,
    // sometimes we need to update the errors

    useEffect(() => {
        console.log('retriggering useeffect!!!!!!!');
        if (
            theDynamicForm?.workflowResult &&
            theDynamicForm?.workflowResult.id
        ) {
            setIsFullFilled(true);

            // a timeout to prevent conflicting with the leavePagePrevention

            setTimeout(() => {
                onSuccess?.(theReactHookForm.getValues());
            }, 1500);
        }

        // when we receive a form from the JSON, we fully reset the scheme
        if (theDynamicForm?.formSchema) {
            console.log('updating the raw schema');
            setRawSchema(theDynamicForm.formSchema);
            setErrorDetails(undefined);
        }

        // when we receive errors, we append to the scheme
        if (theDynamicForm?.validationErrors) {
            console.log('updating the error details');
            setErrorDetails(theDynamicForm?.validationErrors);
        }

        setIsSending(false);
    }, [theDynamicForm, theReactHookForm]);

    const resetFormData = useCallback(() => {
        if (!formData) {
            return;
        }

        const initialData = getFormValuesFromFieldOrLabels(formData.fields, {
            ...formLabels,
            ...customData,
        });

        theReactHookForm.reset(initialData);
    }, [theReactHookForm, formData, formLabels, customData]);

    // a useeffect for filling data whenever formdefinition or labels update
    /*
    useEffect(() => {
        // this makes sure default values are set.
        resetFormData();
    }, [resetFormData]);
*/
    // this is to show an error whenever there is an unexpected error from the backend
    // for instance a 500

    useEffect(() => {
        if (!theDynamicForm?.hasUnexpectedError) {
            return;
        }

        setErrorDetails({
            detail: 'Er is iets misgegaan bij het verzenden.',
            source: [],
            mapped: {},
        });
    }, [theDynamicForm?.hasUnexpectedError]);

    const submitFormFn = useCallback(() => {
        setIsSending(true);
        setFormInputData((formInput) => {
            return [...formInput, theReactHookForm?.getValues()];
        });
        window.scrollTo(0, 0);
    }, [theReactHookForm]);

    const onClientSideError = useCallback(
        (data?: FieldValues) => {
            const enableInvalidFormSubmission = IsCsFlagEnabled(
                CsFlags.ALLOW_INVALID_FORMS,
            );

            if (data && enableInvalidFormSubmission) {
                theReactHookForm.clearErrors();
                submitFormFn();
            }
        },
        [theReactHookForm, submitFormFn],
    );

    const submitForm = theReactHookForm.handleSubmit(
        submitFormFn,
        onClientSideError,
    );

    const resetForm = useCallback(() => {
        resetFormData();
        setErrorDetails(undefined);
        theReactHookForm.trigger();
    }, [resetFormData, theReactHookForm]);

    // with this we have the possiblity to have listeners for specific fields
    // this could be used to trigger validations of related fields, casting changes to elsewhere, etc.
    useEffect(() => {
        let sub: Subscription;

        if (onFieldChangeHandler) {
            sub = theReactHookForm.watch((value, { name, type }) => {
                onFieldChangeHandler(
                    {
                        name,
                        type,
                        value,
                    },
                    theReactHookForm,
                );
            });
        }

        return () => {
            if (sub) {
                return sub.unsubscribe();
            }
        };
    }, [theReactHookForm, onFieldChangeHandler]);

    const isLoading =
        isLoadingFormLabels || theDynamicForm?.isLoading || isCustomDataLoading;

    const DynamicFormsContextState = {
        // to prevent an issue where the sending state hangs
        // we check both the SWR hook state and our manual state
        isSending: isSending && theDynamicForm?.isLoading,
        isLoading,
        theReactHookForm,
        formData: formData || undefined,
        headerComponent,
        footerComponent,
        onCancel,
        title,
        sendLabel,
        debugMode,
        isFullFilled,
        errorDetails,
        successNotice,
        submitForm,
        resetForm,
    };

    if (debugMode) {
        // eslint-disable-next-line no-console
        console.warn('New context cycle', {
            resolver,
            DynamicFormsContextState,
        });

        const fieldWatcher = theReactHookForm.watch();
        console.warn({ fieldWatcher });
    }

    return (
        <DynamicFormsContext.Provider value={DynamicFormsContextState}>
            {children(DynamicFormsContextState)}
        </DynamicFormsContext.Provider>
    );
}

export function useDynamicFormsContext() {
    const context = useContext(DynamicFormsContext);

    if (!context) {
        throw new Error(
            'useDynamicFormsContext must be used within a DynamicFormsProvider',
        );
    }

    return context;
}

export default DynamicFormsProvider;
