import { CompositeButton, Icon, MenuToggle, MenuVisualType, useBackgroundFilters, } from '@stream-io/video-react-sdk';
import { forwardRef } from 'react';
import { useLayoutSwitcher } from '../hooks';
import { SettingsTabModalMenu } from './Settings/SettingsTabModal';
const ToggleEffectsMenuButton = forwardRef(function ToggleEffectsMenuButton(props, ref) {
    const { isSupported: effectsSupported } = useBackgroundFilters();
    return (<CompositeButton ref={ref} disabled={!effectsSupported} active={props.menuShown} title={effectsSupported
            ? 'Video effects'
            : 'Video effects are not supported on this device'} variant="primary">
      <Icon icon="video-effects"/>
    </CompositeButton>);
});
export const ToggleEffectsButton = (props) => {
    const { inMeeting = true } = props;
    const { layout, setLayout } = useLayoutSwitcher();
    return (<MenuToggle ToggleButton={ToggleEffectsMenuButton} placement="top-start" visualType={MenuVisualType.PORTAL}>
      <SettingsTabModalMenu tabModalProps={{
            inMeeting,
            activeTab: 1,
        }} layoutProps={{
            selectedLayout: layout,
            onMenuItemClick: setLayout,
        }}/>
    </MenuToggle>);
};
