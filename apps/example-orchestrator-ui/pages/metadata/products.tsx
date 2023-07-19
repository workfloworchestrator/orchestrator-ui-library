import { MetaDataLayout } from '../../components/Metadata/PageLayout/layout';
import {
    Products,
    PRODUCT_FIELD_NAME,
} from '../../components/Metadata/Products/Products';

import {
    getSortDirectionFromString,
    useDataDisplayParams,
} from '@orchestrator-ui/orchestrator-ui-components';
import type { Product } from '@orchestrator-ui/orchestrator-ui-components';

import { SortOrder } from '@orchestrator-ui/orchestrator-ui-components';
import { useRouter } from 'next/router';

const ProductsPageContent = () => {
    const router = useRouter();
    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Product>({
            sortBy: {
                field: PRODUCT_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const sortOrder = getSortDirectionFromString(
        dataDisplayParams.sortBy?.order,
    );
    if (!sortOrder) {
        router.replace('/metadata/products');
        return null;
    }

    return (
        <Products
            dataDisplayParams={dataDisplayParams}
            setDataDisplayParam={setDataDisplayParam}
        />
    );
};

export const ProductsPage = () => (
    <MetaDataLayout>
        <ProductsPageContent />
    </MetaDataLayout>
);

export default ProductsPage;
