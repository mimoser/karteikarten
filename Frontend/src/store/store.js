import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
    namespaced: true,
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        accessToken: localStorage.getItem('access_token') || null,
        publicDecks: null,
        userDecks: null
    },
    getters: {
        isLoggedIn(state) {
            return state.accessToken;
        },
        user(state) {
            return state.user;
        },
        publicDecks(state) {
            return state.publicDecks;
        },
        userDecks(state) {
            return state.userDecks;
        }
    },
    mutations: {
        retrieveToken(state, payload) {
            state.accessToken = payload;
            localStorage.setItem('access_token', state.accessToken);
        },
        destroyToken(state) {
            state.accessToken = null;
        },
        setUser(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        setUserDecks(state, decks){
            state.userDecks = decks;
        },
        setPulicDecks(state, publicDecks) {
            state.publicDecks = publicDecks;
        },
        updateUserProfileData(state, userProfileData) {
            state.user.name = userProfileData.name;
            state.user.email = userProfileData.email;
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    },
    actions: {
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:3000/api/login', {
                    email: credentials.email,
                    password: credentials.password,
                }).then(response => {
                    const token = response.data.access_token;
                    const user = response.data.user;

                    context.commit('retrieveToken', token);
                    context.commit('setUser', user);
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
                    axios.post('http://localhost:3000/api/logout')
                        .then(response => {
                            localStorage.removeItem('access_token');
                            context.commit('destroyToken');
                            context.commit('setUser', null);
                            // eslint-disable-next-line
                            resolve(response);
                            // context.commit('addTodo', response.data)
                        })
                        .catch(error => {
                            localStorage.removeItem('access_token');
                            // eslint-disable-next-line

                            context.commit('destroyToken');
                            context.commit('setUser', null);
                            reject(error);
                        })
                })
            }
        },
        register(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:3000/api/register', {
                    email: credentials.email,
                    password: credentials.password,
                    username: credentials.username,
                }).then(response => {
                    // const token = response.data.access_token;
                    // const userId = response.data.userId;
                    // localStorage.setItem('userId', userId);
                    // localStorage.setItem('access_token', token);
                    // context.commit('setUser');
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
        fetchUserDecks(context){
            return new Promise((resolve, reject)=> {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.accessToken;
                axios.get('http://localhost:3000/api/userDecks').then(response => {
                    context.commit('setUserDecks', response.data);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            })
        },
        fetchPublicDecks(context) {
            return new Promise((resolve, reject)=> {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.accessToken;
                axios.get('http://localhost:3000/api/publicDecks').then(response => {
                    context.commit('setPublicDecks', response.data);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            })
        },
        fetchDeck(context, deckId){
            return new Promise((resolve, reject) => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.accessToken;
                axios.get(`http://localhost:3000/api/deck/?deckId=${deckId}`).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            })
        },
        updateProfile(context, profileData) {
            return new Promise((resolve, reject) => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.accessToken;
                axios.put('http://localhost:3000/api/updateProfile', {
                    profileData: profileData
                }).then(response => {
                    console.log(response);
                    context.commit('updateUserProfileData', response.data);
                    resolve(response);
                }).catch(error => {
                    // console.log(error);
                    reject(error);
                });
            })
        },
        saveDeck(context, deck){
            return new Promise((resolve, reject) => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.accessToken;
                if(deck._id){
                    // update
                    axios.put('http://localhost:3000/api/deck', {
                        deck: deck
                    }).then(response => {
                        console.log(response);
                        resolve(response);
                    }).catch(error => {
                        // console.log(error);
                        reject(error);
                    });
                } else {
                    // add new one
                    axios.post('http://localhost:3000/api/deck', {
                        deck: deck
                    }).then(response => {
                        console.log(response);
                        resolve(response);
                    }).catch(error => {
                        // console.log(error);
                        reject(error);
                    });
                }
            })
        },
        deleteDeck(context, deckId){
            return new Promise((resolve, reject) => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.accessToken;
                axios.delete(`http://localhost:3000/api/deck/?id=${deckId}`).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
});

export default store;