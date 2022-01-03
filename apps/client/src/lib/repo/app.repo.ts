import { Store, createState, withProps, select } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { ContentFilter } from '$lib/models/content';
import { CardSize, ThemePref } from '$lib/models/site';
import { Observable } from 'rxjs';

//#region ---STORE METADATA---

interface AppState {
    isOfAge: boolean;
    filter: ContentFilter;
    theme: ThemePref;
    darkMode: boolean;
    cardSize: CardSize;
}

const { state, config } = createState(
    withProps<AppState>({
        isOfAge: false,
        filter: ContentFilter.Default,
        theme: ThemePref.Crimson,
        darkMode: false,
        cardSize: CardSize.Small,
    }),
);

const store = new Store({ state, name: 'app', config });
persistState(store, { key: 'app', storage: localStorageStrategy });

//#endregion

export const cardSize$ = store.pipe(select((state) => state.cardSize));
export const theme$ = store.pipe(select((state) => state.theme));
export const darkMode$ = store.pipe(select((state) => state.darkMode));
export const filter$ = store.pipe(select((state) => state.filter));
export const isOfAge$ = store.pipe(select((state) => state.isOfAge));

export function setOfAge(): void {
    store.update((state) => ({
        ...state,
        isOfAge: true,
    }));
}

export function setContentFilter(enableMature: boolean, enableExplicit: boolean): void {
    const filter = determineContentFilter(enableMature, enableExplicit);
    store.update((state) => ({
        ...state,
        filter: filter,
    }));
}

export function setTheme(newPref: ThemePref): void {
    store.update((state) => ({
        ...state,
        theme: newPref,
    }));
}

export function setDarkMode(pref: Observable<boolean>): void {
    store.update((state) => ({
        ...state,
        darkMode: pref,
    }));
}

export function setWorkCardSize(newSize: CardSize): void {
    store.update((state) => ({
        ...state,
        cardSize: newSize,
    }));
}

//#region ---GETTERS---

export const filter = (): ContentFilter => store.getValue().filter;

//#endregion

//#region ---PRIVATE---

/**
 * Sets the contentFilter based on the values of the two provided booleans.
 *
 * @param enableMature Enable mature check
 * @param enableExplicit Enable explicit check
 */
function determineContentFilter(enableMature: boolean, enableExplicit: boolean) {
    let filterSetting: ContentFilter = ContentFilter.Default;

    if (enableMature === true && enableExplicit === false) {
        filterSetting = ContentFilter.MatureEnabled;
    } else if (enableMature === false && enableExplicit === true) {
        filterSetting = ContentFilter.ExplicitEnabled;
    } else if (enableMature === true && enableExplicit === true) {
        filterSetting = ContentFilter.Everything;
    } else if (enableMature === false && enableExplicit === false) {
        filterSetting = ContentFilter.Default;
    }

    return filterSetting;
}

//#endregion
