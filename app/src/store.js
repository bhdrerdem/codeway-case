import { createStore } from "vuex";
import { auth } from "./firebase";
import { api } from "./api";
import {
    browserLocalPersistence,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const state = {
    user: null,
    isLoading: true,
    data: [],
};

const getters = {
    user(state) {
        return state.user;
    },
    isLoading: (state) => state.isLoading,
    data: (state) => state.data,
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_IS_LOADING(state, val) {
        state.isLoading = val;
    },
    SET_DATA(state, data) {
        state.data = data;
    },
    ADD_CONFIG(state, config) {
        state.data.push(config);
    },
    UPDATE_CONFIG(state, updatedConfig) {
        const index = state.data.findIndex((c) => c.id === updatedConfig.id);
        if (index !== -1) {
            state.data[index] = updatedConfig;
        }
    },
    DELETE_CONFIG(state, id) {
        const index = state.data.findIndex((c) => c.id === id);
        if (index !== -1) {
            state.data.splice(index, 1);
        }
    },
};

const actions = {
    async signIn(context, { email, password }) {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (response == null || response.user == null) {
                throw new Error("Failed to signin, please try again.");
            }
        } catch (error) {
            console.error(error);
            if (error?.message?.includes("auth/invalid-credential")) {
                throw new Error(
                    "The email or password you entered is incorrect. Please check your details and try again."
                );
            }
            throw new Error("Something went wrong, please try again.");
        }
    },

    async signout(context) {
        await signOut(auth);
    },

    async fetchAllConfigs(context) {
        const data = await api.fetchAllConfigs();
        context.commit("SET_DATA", data);
    },

    async createConfig(context, configData) {
        const newConfig = await api.createConfig(configData);
        context.commit("ADD_CONFIG", newConfig);
    },

    async updateConfig(context, config) {
        await api.updateConfig(config.id, {
            parameterKey: config.parameterKey,
            value: config.value,
            description: config.description,
        });
        context.commit("UPDATE_CONFIG", config);
    },

    async deleteConfig(context, id) {
        await api.deleteConfig(id);
        context.commit("DELETE_CONFIG", id);
    },

    setUser(context, user) {
        context.commit("SET_USER", user);

        if (user) {
            api.setIdToken(user.getIdToken());
        }
    },

    setLoading(context, val) {
        context.commit("SET_IS_LOADING", val);
    },
};

const store = createStore({
    state,
    getters,
    mutations,
    actions,
});

export default store;
