import { Children, forwardRef, useState, } from 'react';
import clsx from 'clsx';
import { CallStats, CompositeButton, DeviceSelectorAudioInput, DeviceSelectorAudioOutput, DeviceSelectorVideo, Icon, IconButton, MenuToggle, MenuVisualType, useI18n, useMenuContext, } from '@stream-io/video-react-sdk';
import { LayoutSelector } from '../LayoutSelector';
import { VideoEffectsSettings } from './VideoEffects';
import { TranscriptionSettings } from './Transcriptions';
import { LanguageMenu } from './LanguageMenu';
import { CallRecordings } from '../CallRecordings';
import { useLanguage } from '../../hooks/useLanguage';
const Tab = ({ children, active, setActive }) => {
    return (<div className={clsx('rd__tab', {
            'rd__tab--active': active,
        })} onClick={setActive}>
      {children}
    </div>);
};
const TabPanel = ({ children }) => {
    const { close } = useMenuContext();
    return (<div className="rd__tab-panel">
      <div className="rd__tab-panel__header">
        <h2 className="rd__tab-panel__heading">Settings</h2>
        <IconButton className="rd__tab-panel__close" icon="close" onClick={close}/>
      </div>
      <div className="rd__tab-panel__content">{children}</div>
    </div>);
};
const SettingsTabModal = ({ children, activeTab = 0, }) => {
    const [active, setActive] = useState(activeTab);
    return (<div className="rd__tabmodal-container">
      <div className="rd__tabmodal-sidebar">
        <h2 className="rd__tabmodal-header">Settings</h2>
        {Children.map(children, (child, index) => {
            if (!child || !child.props.inMeeting || child.props.hidden) {
                return null;
            }
            return (<Tab key={index} active={index === active} setActive={() => setActive(index)}>
              <Icon className="rd__tab-icon" icon={child.props.icon}/>
              <span className="rd__tab-label">{child.props.label}</span>
            </Tab>);
        })}
      </div>
      <div className="rd__tabmodal-content">
        {Children.map(children, (child, index) => {
            if (index !== active)
                return null;
            return <TabPanel key={index}>{child}</TabPanel>;
        })}
      </div>
    </div>);
};
const TabWrapper = ({ children }) => {
    return children;
};
export const SettingsTabModalMenu = (props) => {
    const { setLanguage } = useLanguage();
    const { t } = useI18n();
    const { tabModalProps, layoutProps } = props;
    return (<SettingsTabModal {...tabModalProps}>
      <TabWrapper icon="device-settings" label={t('Device settings')} inMeeting>
        <>
          <DeviceSelectorVideo visualType="dropdown" title={t('Select a Camera')}/>
          <DeviceSelectorAudioInput visualType="dropdown" title={t('Select a Mic')}/>
          <DeviceSelectorAudioOutput visualType="dropdown" title={t('Select a Speaker')}/>
        </>
      </TabWrapper>
      <TabWrapper icon="video-effects" label="Effects" inMeeting>
        <VideoEffectsSettings />
      </TabWrapper>
      <TabWrapper icon="grid" label={t('Layout')} inMeeting>
        <LayoutSelector onMenuItemClick={layoutProps.onMenuItemClick} selectedLayout={layoutProps.selectedLayout}/>
      </TabWrapper>
      <TabWrapper icon="stats" label={t('Statistics')} inMeeting={tabModalProps.inMeeting}>
        <CallStats />
      </TabWrapper>

      <TabWrapper icon="transcriptions" label="Transcriptions" inMeeting >
        <TranscriptionSettings />
      </TabWrapper>

      <TabWrapper icon="language" label={t('Language')} inMeeting>
        <LanguageMenu setLanguage={setLanguage}/>
      </TabWrapper>

      <TabWrapper icon="film-roll" label={t('Recording library')} inMeeting={tabModalProps.inMeeting}>
        <CallRecordings />
      </TabWrapper>
    </SettingsTabModal>);
};
const ToggleSettingsMenuButton = forwardRef(function ToggleSettingsMenuButton(props, ref) {
    return (<CompositeButton ref={ref} active={props.menuShown} variant="primary">
      <Icon icon="device-settings"/>
    </CompositeButton>);
});
export const ToggleSettingsTabModal = (props) => {
    return (<MenuToggle placement="top-start" ToggleButton={ToggleSettingsMenuButton} visualType={MenuVisualType.PORTAL}>
      <SettingsTabModalMenu {...props}/>
    </MenuToggle>);
};