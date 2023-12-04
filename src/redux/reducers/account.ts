
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const generalAccount = createSlice({
    name: 'generalAccount',
    initialState: {
        showToast: false,
        typeToast: 'success',
        messageToast: ''
    },
    reducers: {
        showToast: (state, action: PayloadAction<{ showToast: boolean, messageToast: string, typeToast: string }>) => {
            state.showToast = action.payload.showToast
            state.typeToast = action.payload.typeToast
            state.messageToast = action.payload.messageToast
        }
    }
})

const categoryAccount = createSlice({
    name: 'categoryAccount',
    initialState: {
        sectionShow: 'account'
    },
    reducers: {
        shareSectionShow: (state, action: PayloadAction<{ sectionShow: string }>) => {
            state.sectionShow = action.payload.sectionShow
        }
    }
})

const accountAccount = createSlice({
    name: 'accountAccount',
    initialState: {
        errorAuth: false,
        messageErrorAuth: ''
    },
    reducers: {
        errorAuth: (state, action: PayloadAction<{ errorAuth: boolean, messageErrorAuth: string }>) => {
            state.errorAuth = action.payload.errorAuth
            state.messageErrorAuth = action.payload.messageErrorAuth
        }
    }
})

export {
    generalAccount,
    categoryAccount,
    accountAccount
}