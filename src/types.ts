export interface State {
    currencies: Record<string, string>;
    from: [string, string];
    to: [string, string];
}

interface SetFromAction {
    type: 'SET_FROM';
    payload: [string, string];
}

interface SetToAction {
    type: 'SET_TO';
    payload: [string, string];
}

interface SetCurrenciesAction {
    type: 'SET_CURRENCIES';
    payload: Record<string, string>;
}

export type Action = SetFromAction | SetToAction | SetCurrenciesAction;
