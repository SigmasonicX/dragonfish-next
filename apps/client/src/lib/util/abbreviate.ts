import numbro from 'numbro';

/**
 * Abbreviates long numbers.
 * @param toAbbreviate
 */
export function abbreviate(toAbbreviate: number): string {
    return numbro(toAbbreviate).format({ average: true });
}
