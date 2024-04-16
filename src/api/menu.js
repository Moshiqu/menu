import { request } from '@/src/utils/request';
export const getMenu = (options) => request({ url: '/api/menu/getMenu', method: 'GET', data: options })