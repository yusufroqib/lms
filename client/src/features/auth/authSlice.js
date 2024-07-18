import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        setSignUpToken: (state, action) => {
            const { activationToken } = action.payload
            state.activationToken = activationToken
            // console.log(activationToken)
        },
        setSignUpEmail: (state, action) => {
            const { signUpEmail } = action.payload
            state.signUpEmail = signUpEmail
            // console.log(activationToken)
        },
        logOut: (state, action) => {
            state.token = null
        },
        setLoggedUser: (state, action) => {
            // console.log(action)
          const { loggedUser } = action.payload
          state.loggedUser = loggedUser
        //   console.log(user)
        }
        
    }
})

export const { setCredentials, logOut, setSignUpToken, setUser, setLoggedUser, setSignUpEmail } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentActivationToken = (state) => state.auth.activationToken
export const selectCurrentSignUpEmail = (state) => state.auth.signUpEmail