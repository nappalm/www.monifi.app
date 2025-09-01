import { mainApiClient } from '@/lib/axios';

export const {{screamingSnakeCase name}}_ENDPOINT = '/home';
export const get{{pascalCase name}}Data = async () => {
  const response = await mainApiClient.get({{screamingSnakeCase name}}_ENDPOINT);
  return response.data;
};
