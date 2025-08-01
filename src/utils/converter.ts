import axios from 'axios';

async function convert(
    from: string,
    to: string,
    object: Record<string, string>,
    amount: number
): Promise<string | undefined> {
    const fromKey = getKeyByValue(object, from);
    const toKey = getKeyByValue(object, to);

    if (!from || !to || isNaN(amount)) {
        console.error('Invalid parameters for conversion:', {
            from,
            to,
            amount,
        });
        return undefined;
    }

    if (!fromKey || !toKey) {
        console.error(`Invalid currency: from=${from}, to=${to}`);
        return undefined;
    }

    try {
        const res = await axios.get(
            `https://api.frankfurter.dev/v1/latest?base=${fromKey}&symbols=${toKey}`
        );

        const rate = res.data.rates[toKey];

        if (rate !== undefined) {
            const convertedAmount = (amount * rate).toFixed(2);
            return convertedAmount;
        } else {
            console.error(`Conversion rate not found for: ${toKey}`);
        }
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
    }
}

function getKeyByValue(
    object: Record<string, string>,
    value: string
): string | undefined {
    return Object.keys(object).find((key) => object[key] === value);
}

export { convert, getKeyByValue };
