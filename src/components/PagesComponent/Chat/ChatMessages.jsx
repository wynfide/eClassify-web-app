'use client'
import { formatChatMessageTime, formatMessageDate, placeholderImage, t } from "@/utils";
import Image from "next/image";
import { useSelector } from "react-redux";

const ChatMessages = ({ chatMessages, selectedTabData, openImageViewer, systemSettingsData, IsLoadPrevMesg, CurrentMessagesPage, HasMoreChatMessages, fetchChatMessgaes }) => {

    const isLoggedIn = useSelector((state) => state.UserSignup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    return (
        <>
            {
                HasMoreChatMessages &&
                <button disabled={IsLoadPrevMesg} className='date-separator loadPrevMessages' onClick={() => fetchChatMessgaes(selectedTabData.id, CurrentMessagesPage + 1)}>
                    {t('loadPrevMesgs')}
                </button>
            }

            {
                chatMessages && chatMessages.length > 0 && Object?.entries(
                    chatMessages.reduce((acc, message) => {
                        const date = formatMessageDate(message.created_at) || 'Invalid Date';
                        if (!acc[date]) acc[date] = [];
                        acc[date].push(message);
                        return acc;
                    }, {})

                )
                    .reverse()
                    .map(([date, messages], dateIndex) => (
                        <div key={`date-group-${dateIndex}`} className="date-message-group">
                            <div className="date-separator">
                                <span>{date}</span>
                            </div>
                            <div className="chat_render_msgs">
                                {messages.map((message, messageIndex) => (
                                    <div key={`message-${dateIndex}-${messageIndex}`}>
                                        {message.message_type === "text" && (
                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                <p className="sender_single_text_cont">
                                                    {message?.message}
                                                </p>
                                                <p className="chat_time">{formatChatMessageTime(message?.created_at)}</p>
                                            </div>
                                        )}
                                        {message.message_type === "file" && (
                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                <div className="file_img" onClick={() => openImageViewer(message?.file)}>
                                                    <Image src={message?.file ? message?.file : systemSettingsData?.data?.data?.placeholder_image} width={0} height={0} alt='file' className='chat_file_img' loading='lazy' onErrorCapture={placeholderImage} />
                                                </div>
                                                <p className="chat_time">{formatChatMessageTime(message?.created_at)}</p>
                                            </div>
                                        )}
                                        {message.message_type === "audio" && (
                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                <div className="chat_audio">
                                                    <audio controls>
                                                        <source src={message?.audio} type="audio/mpeg" />
                                                        {t('browserDoesNotSupportAudio')}
                                                    </audio>
                                                </div>
                                                <p className="chat_time">{formatChatMessageTime(message?.created_at)}</p>
                                            </div>
                                        )}
                                        {message.message_type === "file_and_text" && (
                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                <div className="file_text">
                                                    <div className="text_file_img" onClick={() => openImageViewer(message?.file)}>
                                                        <Image src={message?.file ? message?.file : systemSettingsData?.data?.data?.placeholder_image} width={0} height={0} alt='file' className='chat_file_img' loading='lazy' onErrorCapture={placeholderImage} />
                                                        <div className="text">
                                                            <span>{message.message}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="chat_time">{formatChatMessageTime(message?.created_at)}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
            }
        </>
    )
}

export default ChatMessages