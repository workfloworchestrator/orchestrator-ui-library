import { MetaDataLayout } from './layout';
import { Products } from '../../components/Metadata/Products/Products';
import { useDataDisplayParams } from '@orchestrator-ui/orchestrator-ui-components';

import type { Product } from '@orchestrator-ui/orchestrator-ui-components';

import { SortOrder } from '@orchestrator-ui/orchestrator-ui-components';

const ProductsPageContent = () => {
    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Product>({
            sortBy: {
                field: 'name',
                order: SortOrder.Asc,
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
