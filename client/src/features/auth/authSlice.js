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
        logOut: (state, action) => {
            state.token = null
        },
        setUser: (state, action) => {
            // console.log(action)
          const { user } = action.payload
          state.user = user
        //   console.log(user)
        }
        
    }
})

export const { setCredentials, logOut, setSignUpToken, setUser } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentActivationToken = (state) => state.auth.activationToken