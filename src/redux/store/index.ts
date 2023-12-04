import { configureStore } from "@reduxjs/toolkit";

import { generalAccount, categoryAccount, accountAccount } from "../reducers";
import { generalAdmin, categoryAdmin, accountAdmin } from "../reducers";
import { pagination } from "../reducers";

const store = configureStore({
    reducer: {
        generalAdmin: generalAdmin.reducer,
        categoryAdmin: categoryAdmin.reducer,
        accountAdmin: accountAdmin.reducer,
        generalAccount: generalAccount.reducer,
        categoryAccount: categoryAccount.reducer,
        accountAccount: accountAccount.reducer,
        pagination: pagination.reducer
    }
})

export { store }
export const showToastAdmin = generalAdmin.actions.showToast
export const shareSectionShowAdmin = categoryAdmin.actions.shareSectionShow
export const errorAuthAdmin = accountAdmin.actions.errorAuth
export const showToastAccount = generalAccount.actions.showToast
export const shareSectionShowAccount = categoryAccount.actions.shareSectionShow
export const errorAuthAccount = accountAccount.actions.errorAuth
export const shareCurrentPage = pagination.actions.shareCurrentPage