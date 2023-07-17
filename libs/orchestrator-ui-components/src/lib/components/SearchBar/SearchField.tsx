import {
    EuiFormRow,
    EuiSearchBar,
    EuiSearchBarOnChangeArgs,
} from '@elastic/eui';

export type SearchFieldProps = {
    __filterQuery?: string; // Deprecated Pythia related way of passing querystring
    __setFilterQuery?: (updatedFilterQuery: string) => void; // Deprecated Pythia related way of setting querystring
    esQueryString?: string;
    onUpdateEsQueryString?: (esQueryString: string) => void;
};

export const SearchField = ({
    __filterQuery,
    __setFilterQuery,
    esQueryString,
    onUpdateEsQueryString,
}: SearchFieldProps) => {
    const queryString = __filterQuery || esQueryString;
    const queryIsValid = true; // Query validation turned of for now until ESQueries can be sent to the backend

    const onChange = ({ queryText }: EuiSearchBarOnChangeArgs) => {
        if (__setFilterQuery) {
            __setFilterQuery(queryText);
        } else {
            alert(
                'Passing an ES query string to the backend still needs to be implemented',
            );
            if (onUpdateEsQueryString) {
                onUpdateEsQueryString(queryText);
            }
        }
    };

    return (
        <EuiFormRow
            fullWidth
            isInvalid={!queryIsValid}
            error={['The query contains invalid parts']}
        >
            <EuiSearchBar
                query={queryString}
                onChange={onChange}
                box={{
                    // Todo: possible bug in EUI component EuiSearchBar
                    // https://github.com/workfloworchestrator/orchestrator-ui/issues/129
                    // setting the property 'isInvalid' to true has no effect
                    isInvalid: !queryIsValid,
                }}
            />
        </EuiFormRow>
    );
};
