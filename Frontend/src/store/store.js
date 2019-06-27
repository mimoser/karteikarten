import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: localStorage.getItem('access_token') || null,
    },
    getters: {
        user(state) {
            return state.user;
        }
    },
    mutations: {
        user(state, payload) {
            state.user = payload.user;
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
                    console.log(response);
                    resolve(response);
                    // context.commit('addTodo', response.data)
                }).catch(error => {
                    console.log(error);
                    reject(error);
                })
            })
        },
        destroyToken(context) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            if (context.getters.user) {
                return new Promise((resolve, reject) => {
                    debugger;
                    axios.get('http://localhost:3000/logout')
                        .then(response => {
                            localStorage.removeItem('access_token')
                            context.commit('destroyToken')
                            console.log(response);
                            resolve(response)
                            // context.commit('addTodo', response.data)
                        })
                        .catch(error => {
                            localStorage.removeItem('access_token')
                            context.commit('destroyToken')
                            reject(error)
                        })
                })
            }
        },
    }
});