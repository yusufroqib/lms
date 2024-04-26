import { useCallback } from 'react';
import { DropDownSelect, DropDownSelectOption, } from '@stream-io/video-react-sdk';
const LANGUAGES = {
    de: 'German',
    en: 'English',
    es: 'Spanish',
};
export const LanguageMenu = ({ setLanguage }) => {
    const handleSelect = useCallback((index) => {
        const selected = Object.keys(LANGUAGES)[index];
        setLanguage(selected);
    }, [setLanguage]);
    return (<DropDownSelect icon="language" defaultSelectedIndex={0} defaultSelectedLabel="English" handleSelect={handleSelect}>
      {Object.entries(LANGUAGES).map(([lngCode, languageName]) => (<DropDownSelectOption key={lngCode} label={languageName} icon="language"/>))}
    </DropDownSelect>);
};
