import { MetaDataLayout } from '../../components/Metadata/PageLayout/layout';
import {
    Products,
    PRODUCT_FIELD_NAME,
} from '../../components/Metadata/Products/Products';

import { useDataDisplayParams } from '@orchestrator-ui/orchestrator-ui-components';
import type { Product } from '@orchestrator-ui/orchestrator-ui-components';

import { SortOrder } from '@orchestrator-ui/orchestrator-ui-components';

const ProductsPageContent = () => {
    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Product>({
            sortBy: {
                field: PRODUCT_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

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
