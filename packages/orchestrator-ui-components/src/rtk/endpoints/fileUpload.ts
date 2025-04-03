import { BaseQueryTypes, orchestratorApi } from '@/rtk';

export interface FileUploadPayload {
    url: string;
    file: File;
}

interface FileUploadReturnValue {
    id: string;
}

const fileUploadApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        uploadFile: build.mutation<FileUploadReturnValue, FileUploadPayload>({
            query: ({ url, file }) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url,
                    method: 'POST',
                    body: formData,
                };
            },
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
                apiName: 'cim',
            },
        }),
    }),
});

export const { useUploadFileMutation } = fileUploadApi;
