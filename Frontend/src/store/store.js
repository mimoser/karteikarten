import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
    namespaced: true,
    state: {
        user: null,
        accessToken: localStorage.getItem('access_token') || null
    },
    getters: {
        isLoggedIn(state) {
            return state.accessToken;
        }
    },
    mutations: {
        retrieveToken(state, payload) {
            state.accessToken = payload;
        },
        destroyToken(state){
            state.accessToken = null;
        }
    },
    actions: {
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:3000/login', {
                    email: credentials.email,
                    password: credentials.password,
                }).then(response => {
                    const token = response.data.access_token;
                    localStorage.setItem('access_token', token);
                    context.commit('retrieveToken', token);
                    // alert(response.data);
                    // eslint-disable-next-line
                    resolve(response);
                    // context.commit('addTodo', response.data)
                }).catch(error => {
                    // eslint-disable-next-line
                    reject(error);
                })
            })
        },
        destroyToken(context) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.accessToken;

            if (context.getters.isLoggedIn) {
                return new Promise((resolve, reject) => {
                    axios.post('http://localhost:3000/logout')
                        .then(response => {
                            localStorage.removeItem('access_token')
                            context.commit('destroyToken')
                            // eslint-disable-next-line
                            resolve(response)
                            // context.commit('addTodo', response.data)
                        })
                        .catch(error => {
                            localStorage.removeItem('access_token')
                            // eslint-disable-next-line

                            context.commit('destroyToken')
                            reject(error)
                        })
                })
            }
        },
        register(context, credentials){
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:3000/register', {
                    email: credentials.email,
                    password: credentials.password,
                }).then(response => {
                    const token = response.data.access_token;
                    localStorage.setItem('access_token', token);
                    context.commit('retrieveToken', token);
                    // alert(response.data);
                    // eslint-disable-next-line
                    resolve(response);
                    // context.commit('addTodo', response.data)
                }).catch(error => {
                    // eslint-disable-next-line
                    reject(error);
                })
            })
        }
    }
});