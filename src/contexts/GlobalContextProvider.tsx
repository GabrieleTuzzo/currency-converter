import { createContext, useReducer } from 'react';
import { useCurrencies } from '../hooks/useCurrencies';
import type { State, Action } from '../types';

type GlobalContextType = {
    state: State;
    dispatch: React.Dispatch<Action>;
};

function reducer(state: State, action: Action): State {
    console.log('Reducer called with action:', action);
    switch (action.type) {
        case 'SET_FROM':
            return { ...state, from: action.payload };
        case 'SET_TO':
            return { ...state, to: action.payload };
        case 'SET_CURRENCIES':
            return { ...state, currencies: action.payload };
        default:
            return state;
    }
}

export const GlobalContext = createContext<GlobalContextType>({
    state: {
        currencies: {},
        from: ['1', 'Euro'],
        to: ['0', 'United States Dollar'],
    },
    dispatch: () => {},
});

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        currencies: {},
        from: ['1', 'Euro'],
        to: ['0', 'United States Dollar'],
    });

    useCurrencies(state, dispatch);
    // console.log(state);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
}
