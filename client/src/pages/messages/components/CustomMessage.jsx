import { useRef, useState } from "react";
import { MessageOptions, MessageRepliesCountButton, MessageText, useComponentContext, useMessageContext } from "stream-chat-react";

export const CustomMessage = () => {
	const [hovering, setHovering] = useState(false);
  
	const { message } = useMessageContext();
	const { PinIndicator } = useComponentContext();
  
	const messageWrapperRef = useRef(null);
  
	const { pinned } = message;
  
	return (
	  <div
		className={pinned ? 'pinned-custom-message-wrapper' : 'custom-message-wrapper'}
		onMouseEnter={() => setHovering(true)}
		onMouseLeave={() => setHovering(false)}
	  >
		<div className='custom-message-wrapper-content'>
		  <div className='custom-message-header'>
			<div className='custom-message-header-name'>{message.user?.name || message.user?.id}</div>
		  </div>
		  <MessageText />
		  <MessageRepliesCountButton reply_count={message.reply_count} />
		</div>
		<div className='custom-message-right-wrapper'>
		  {hovering ? (
			<MessageOptions messageWrapperRef={messageWrapperRef} />
		  ) : (
			pinned && <PinIndicator />
		  )}
		</div>
	  </div>
	);
  };