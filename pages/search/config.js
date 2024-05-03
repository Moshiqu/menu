import { searchUser } from '@/api/user'

// type 1:商家搜索
export const config = [{ type: 1, placeholder: '请输入商家名', emptySearchValue: "请输入商家名", searchApi: searchUser }]
