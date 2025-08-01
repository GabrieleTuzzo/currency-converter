import { useEffect } from 'react';
import type { State, Action } from '../types';
import axios from 'axios';
import { usePrevious } from './usePrevious';
import { convert } from '../utils/converter';
import { normalizeValue } from '../utils/utils';

export function useCurrencies(state: State, dispatch: React.Dispatch<Action>) {
    const previousState = usePrevious(state);

    // Fetch currencies on mount
    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://api.frankfurter.dev/v1/currencies',
                    { signal: controller.signal }
                );
                dispatch({
                    type: 'SET_CURRENCIES',
                    payload: response.data,
                });
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                } else {
                    console.error('Error fetching currencies:', error);
                }
            }
        };

        fetchData();
        return () => controller.abort();
    }, [dispatch]);

    useEffect(() => {
        let isUpdatingFrom = false;
        let isUpdatingTo = false;

        const fromChanged =
            normalizeValue(previousState?.from[0] || '0') !==
                normalizeValue(state.from[0]) ||
            previousState?.from[1] !== state.from[1];

        const toChanged =
            normalizeValue(previousState?.to[0] || '0') !==
                normalizeValue(state.to[0]) ||
            previousState?.to[1] !== state.to[1];

        if (
            fromChanged &&
            state.currencies &&
            normalizeValue(state.from[0]) !== 0 &&
            !isUpdatingTo
        ) {
            isUpdatingFrom = true;
            console.log('From changed:', state.from);
            convert(
                state.from[1],
                state.to[1],
                state.currencies,
                normalizeValue(state.from[0])
            ).then((result) => {
                if (
                    result !== undefined &&
                    normalizeValue(result) !== normalizeValue(state.to[0]) &&
                    normalizeValue(result) !==
                        normalizeValue(previousState?.to[0] || '0')
                ) {
                    dispatch({
                        type: 'SET_TO',
                        payload: [result, state.to[1]],
                    });
                }
                isUpdatingFrom = false;
            });
        }

        if (
            toChanged &&
            state.currencies &&
            normalizeValue(state.to[0]) !== 0 &&
            !isUpdatingFrom
        ) {
            isUpdatingTo = true;
            console.log('To changed:', state.to);
            convert(
                state.to[1],
                state.from[1],
                state.currencies,
                normalizeValue(state.to[0])
            ).then((result) => {
                if (
                    result !== undefined &&
                    normalizeValue(result) !== normalizeValue(state.from[0]) &&
                    normalizeValue(result) !==
                        normalizeValue(previousState?.from[0] || '0')
                ) {
                    dispatch({
                        type: 'SET_FROM',
                        payload: [result, state.from[1]],
                    });
                }
                isUpdatingTo = false;
            });
        }
    }, [state, state.currencies, dispatch]);

    // Use effect FROM
    // useEffect(() => {
    //     if (!state.currencies || Object.keys(state.currencies).length === 0)
    //         return;

    //     const convertCurrency = async () => {
    //         const fromKey = getKeyByValue(state.currencies, state.from[1]);
    //         const toKey = getKeyByValue(state.currencies, state.to[1]);
    //         const amountFrom = parseFloat(state.from[0]);

    //         if (fromKey && toKey && !isNaN(amountFrom)) {
    //             try {
    //                 const result = await convert(fromKey, toKey, amountFrom);

    //                 if (result !== state.to[0]) {
    //                     dispatch({
    //                         type: 'SET_TO',
    //                         payload: [result || '0', state.to[1]],
    //                     });
    //                 }
    //             } catch (error) {
    //                 console.error('Conversion error:', error);
    //             }
    //         }
    //     };

    //     convertCurrency();
    // }, [state.from, state.currencies, dispatch]);

    // Use effect TO
    // useEffect(() => {
    //     if (!state.currencies || Object.keys(state.currencies).length === 0)
    //         return;

    //     const convertCurrency = async () => {
    //         const fromKey = getKeyByValue(state.currencies, state.from[1]);
    //         const toKey = getKeyByValue(state.currencies, state.to[1]);
    //         const amountTo = parseFloat(state.to[0]);

    //         if (fromKey && toKey && !isNaN(amountTo)) {
    //             try {
    //                 const result = await convert(toKey, fromKey, amountTo);
    //                 if (result !== state.from[0]) {
    //                     dispatch({
    //                         type: 'SET_FROM',
    //                         payload: [result || '0', state.from[1]],
    //                     });
    //                 }
    //             } catch (error) {
    //                 console.error('Conversion error:', error);
    //             }
    //         }
    //     };

    //     convertCurrency();
    // }, [state.to, state.currencies, dispatch]);

    return null;
}
