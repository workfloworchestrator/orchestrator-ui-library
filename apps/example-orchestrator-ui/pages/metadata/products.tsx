import { MetaDataLayout } from './layout';
import { Products } from '../../components/Metadata/Products/Products';
import { useDataDisplayParams } from '@orchestrator-ui/orchestrator-ui-components';

import type { Product } from '@orchestrator-ui/orchestrator-ui-components';

const DEFAULT_PRODUCT_PAGE_SIZE = 10;

const ProductsPageContent = () => {
    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Product>({
            pageSize: DEFAULT_PRODUCT_PAGE_SIZE,
            pageIndex: 1,
        });

    return (
        <>
            <div>METADATA PRODUCTS</div>
            <Products
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
            />
        </>
    );
};

export const ProductsPage = () => (
    <MetaDataLayout>
        <ProductsPageContent />
    </MetaDataLayout>
);

export default ProductsPage;
