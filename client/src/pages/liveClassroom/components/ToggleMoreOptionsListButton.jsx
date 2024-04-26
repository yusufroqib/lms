import { forwardRef } from 'react';
import { CompositeButton, defaultReactions, DefaultReactionsMenu, Icon, MenuToggle, MenuVisualType, useI18n, } from '@stream-io/video-react-sdk';

const Menu = () => {
    return (<ul className="rd__more-menu">
      <li className="rd__more-menu__item">
        <DefaultReactionsMenu reactions={defaultReactions}/>
      </li>
  
    </ul>);
};
export const ToggleMenuButton = forwardRef(function ToggleMenuButton(props, ref) {
    return (<CompositeButton ref={ref} active={props.menuShown} variant="primary">
      <Icon icon="more"/>
    </CompositeButton>);
});
export const ToggleMoreOptionsListButton = () => {
    return (<MenuToggle placement="top-start" ToggleButton={ToggleMenuButton}>
      <Menu />
    </MenuToggle>);
};
