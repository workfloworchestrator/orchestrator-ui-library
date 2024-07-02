/**
 * Dynamic Forms
 *
 * The main context of a dynamic form
 *
 * This will fetch the jsonScheme, parse it, and handle form state and validation
 */
import { useAppContext } from '~context/app';

import type { MouseEventHandler } from 'react';
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
    CsFlags,
    IsCsFlagEnabled,
} from '@/components/utility/ClientSideFF/ClientSideFF';
import {
    getErrorDetailsFromResponse,
    getFormValuesFromFieldOrLabels,
} from '@/core/helper';
import { useDynamicForm, useFormParser, useRefParser } from '@/core/hooks';
import { useCacheKey } from '@/core/hooks/useCacheKey';
import useCustomDataProvider from '@/core/hooks/useCustomDataProvider';
import useCustomZodValidation from '@/core/hooks/useCustomZodValidator';
import { useLabelProvider } from '@/core/hooks/useLabelProvider';
import { useLeavePageConfirm } from '@/core/hooks/useLeavePageConfirm';
import {
    IDynamicFormsContextInitialProps,
    IDynamicFormsContextProps,
    IValidationErrorDetails,
} from '@/types';

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
    formKey,
    formIdKey,
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
    const {
        dataProvider,
        labelProvider,
        formProvider,
        fieldDetailProvider,
        onFieldChangeHandler,
        dataProviderCacheKey,
        customValidationRules,
        tmp_pydanticFormsOriginalImplementation,
    } = config ?? {};

    const { api } = useAppContext();
    // option to enable the debug mode on the fly in the browser
    // by setting localStorage.setItem("dynamicFormsDebugMode", "true")
    // reload is required
    const debugMode = localStorage.getItem('dynamicFormsDebugMode') === '1';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formInputData, setFormInputData] = useState<any>([]);
    const [errorDetails, setErrorDetails] = useState<IValidationErrorDetails>();
    const [isFullFilled, setIsFullFilled] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [cacheKey] = useCacheKey(); // this ensures we refresh the data anytime ctx is re-initialized

    // fetch the labels of the form, but can also include the current form values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(
            labelProvider ?? api.portaal.Forms.getLabelsV1FormsLabelFormKeyGet,
            formKey,
            formIdKey,
            cacheKey,
        );

    const { data: customData, isLoading: isCustomDataLoading } =
        useCustomDataProvider(
            dataProviderCacheKey ? dataProviderCacheKey : cacheKey,
            dataProvider,
        );

    // fetch the form definition using SWR hook
    const {
        data: apiErrorResp,
        isLoading: isLoadingSchema,
        error,
    } = useDynamicForm(
        formKey,
        // TODO: remove this temp fix? ->
        formInputData,
        formProvider ?? api.portaal.Forms.newFormV1FormsFormKeyPost,
        !!tmp_pydanticFormsOriginalImplementation,
        metaData,
        cacheKey,
    );

    // we cache the form scheme so when there is an error, we still have the form
    // the form is not in the error response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rawSchema, setRawSchema] = useState<any>({});

    // parse the raw scheme refs so all data is where it should be in the schema
    const { data: schema } = useRefParser('form', rawSchema);

    // extract the JSON schema to a more usable custom schema
    const formData = useFormParser(
        schema,
        formLabels?.labels,
        fieldDetailProvider,
    );

    const rhfRef = useRef<ReturnType<typeof useForm>>();

    // build validation rules based on custom schema
    const resolver = useCustomZodValidation(
        formData,
        rhfRef.current,
        customValidationRules,
    );

    // initialize the react-hook-form
    const rhf = useForm({
        resolver: zodResolver(resolver),
        mode: 'all',
    });

    rhfRef.current = rhf;

    // prevent user from navigating away when there are unsaved changes
    const hasUnsavedData = !isFullFilled && rhf.formState.isDirty;
    useLeavePageConfirm(
        hasUnsavedData,
        'Er zijn aanpassingen in het formulier. \nWeet u zeker dat u de pagina wilt verlaten?',
    );

    // a useeffect for whenever the error response updates
    // sometimes we need to update the form,
    // some we need to update the errors
    useEffect(() => {
        if (apiErrorResp?.success) {
            setIsFullFilled(true);

            // a timeout to prevent conflicting with the leavePagePrevention
            setTimeout(() => {
                onSuccess?.(rhf.getValues());
            }, 1500);
        }

        // when we receive a form from the JSON, we fully reset the scheme
        if (apiErrorResp?.form) {
            setRawSchema(apiErrorResp.form);
            setErrorDetails(undefined);
        }

        // when we receive errors, we append to the scheme
        if (apiErrorResp?.validation_errors) {
            setErrorDetails(getErrorDetailsFromResponse(apiErrorResp));
        }

        setIsSending(false);
    }, [apiErrorResp, onSuccess, rhf]);

    const resetFormData = useCallback(() => {
        if (!formData) {
            return;
        }

        const initialData = getFormValuesFromFieldOrLabels(formData.fields, {
            ...formLabels?.data,
            ...customData,
        });

        rhf.reset(initialData);
    }, [rhf, formData, formLabels?.data, customData]);

    // a useeffect for filling data whenever formdefinition or labels update
    useEffect(() => {
        // this makes sure default values are set.
        resetFormData();
    }, [resetFormData]);

    // this is to show an error whenever there is an unexpected error from the backend
    // for instance a 500
    useEffect(() => {
        if (!error) {
            return;
        }

        setErrorDetails({
            detail: 'Er is iets misgegaan bij het verzenden.',
            source: [],
            mapped: {},
        });
    }, [error]);

    const submitFormFn = useCallback(() => {
        setIsSending(true);
        setFormInputData([rhf?.getValues()]);

        window.scrollTo(0, 0);
    }, [rhf]);

    const onClientSideError = useCallback(
        (data?: FieldValues) => {
            const enableInvalidFormSubmission = IsCsFlagEnabled(
                CsFlags.ALLOW_INVALID_FORMS,
            );

            if (data && enableInvalidFormSubmission) {
                rhf.clearErrors();
                submitFormFn();
            }
        },
        [rhf, submitFormFn],
    );

    const submitForm = rhf.handleSubmit(submitFormFn, onClientSideError);

    const resetForm = useCallback(
        (
            e:
                | MouseEventHandler<HTMLAnchorElement>
                | MouseEventHandler<HTMLButtonElement>
                | undefined,
        ) => {
            e.preventDefault();
            resetFormData();
            setErrorDetails(undefined);
            rhf.trigger();
        },
        [resetFormData, rhf],
    );

    // with this we have the possiblity to have listeners for specific fields
    // this could be used to trigger validations of related fields, casting changes to elsewhere, etc.
    useEffect(() => {
        let sub: Subscription;

        if (onFieldChangeHandler) {
            sub = rhf.watch((value, { name, type }) => {
                onFieldChangeHandler(
                    {
                        name,
                        type,
                        value,
                    },
                    rhf,
                );
            });
        }

        return () => {
            if (sub) {
                return sub.unsubscribe();
            }
        };
    }, [rhf, onFieldChangeHandler]);

    const isLoading =
        isLoadingFormLabels ||
        isLoadingSchema ||
        (dataProvider ? isCustomDataLoading : false);

    const DynamicFormsContextState = {
        // to prevent an issue where the sending state hangs
        // we check both the SWR hook state as our manual state
        isSending: isSending && isLoadingSchema,
        isLoading,
        rhf,
        formData: formData || undefined,
        headerComponent,
        footerComponent,
        onCancel,
        title,
        sendLabel,
        debugMode,
        isFullFilled,
        dataProvider,
        errorDetails,
        successNotice,
        submitForm,
        resetForm,
    };

    if (debugMode) {
        // eslint-disable-next-line no-console
        console.log('New context cycle', {
            resolver,
            DynamicFormsContextState,
        });

        const fieldWatcher = rhf.watch();
        console.log({ fieldWatcher });
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
