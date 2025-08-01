import { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContextProvider.tsx';

type CurrencyProps = {
    inputType: 'from' | 'to';
};

export default function Currency({ inputType }: CurrencyProps) {
    const { state, dispatch } = useContext(GlobalContext);

    function handleSetCurrency(type: 'from' | 'to', value: [string, string]) {
        dispatch({
            type: type === 'from' ? 'SET_FROM' : 'SET_TO',
            payload: value,
        });
    }

    function handleInputChange(value: string, type: 'input' | 'select') {
        if (type === 'input') {
            let cleanValue = value.replace(/[^0-9.,]/g, ''); // Remove invalid characters
            cleanValue = cleanValue.replace(',', '.'); // Replace commas with dots

            handleSetCurrency(inputType, [cleanValue, state[inputType][1]]);
            return;
        }

        if (type === 'select') {
            handleSetCurrency(inputType, [state[inputType][0], value]);
        }
    }

    return (
        <div className="currency-component">
            <input
                type="text"
                value={state[inputType][0]}
                onChange={(e) => {
                    handleInputChange(e.target.value, 'input');
                }}
            />
            <select
                name="currency"
                id="currency"
                value={state[inputType][1]}
                onChange={(e) => {
                    handleInputChange(e.target.value, 'select');
                }}
            >
                {state.currencies &&
                    Object.values(state.currencies).map((currency, i) => (
                        <option
                            key={i}
                            value={currency}
                            disabled={
                                state[
                                    inputType === 'from' ? 'to' : 'from'
                                ][1] === currency
                            }
                        >
                            {currency}
                        </option>
                    ))}
            </select>
        </div>
    );
}
