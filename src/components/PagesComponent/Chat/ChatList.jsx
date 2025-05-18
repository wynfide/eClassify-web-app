"use client";
import NoChatListFound from "@/components/NoDataFound/NoChatListFound";
import UserBuyerChatTab from "@/components/Profile/UserBuyerChatTab";
import UserSellerChatTab from "@/components/Profile/UserSellerChatTab";
import ChatListSkeleton from "@/components/Skeleton/ChatListSkeleton";
import { saveOfferData } from "@/redux/reuducer/offerSlice";
import { isLogin, placeholderImage, t } from "@/utils";
import { chatListApi, getBlockedUsers } from "@/utils/api";
import { Popover } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiUserForbidLine } from "react-icons/ri";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatList = ({
  systemSettingsData,
  selectedTabData,
  setSelectedTabData,
  activeTab,
  setActiveTab,
  handleUnBlockUser,
  setBlockedUsersList,
  setBlockPopoverVisible,
  blockPopoverVisible,
  blockedUsersList,
  setReview,
  setRating,
  buyerChatList,
  setBuyerChatList,
  sellerChatList,
  setSellerChatList,
}) => {
  const [CurrentSellerPage, setCurrentSellerPage] = useState(1);
  const [CurrentBuyerPage, setCurrentBuyerPage] = useState(1);
  const [HasMoreBuyer, setHasMoreBuyer] = useState(false);
  const [HasMoreSeller, setHasMoreSeller] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);


  const fetchBuyerChatList = async (page = 1) => {
    if (page === 1) {
      setIsLoading(true);
    }
    try {
      const response = await chatListApi.chatList({ type: "buyer", page });
      const { data } = response?.data || {};
      const updatedData = data.data.map((chat) => ({ ...chat, tab: "buying" }));

      // Check if there's a matching chat and update selectedTabData and saveOfferData
      if (selectedTabData && selectedTabData?.tab === "buying") {
        const matchingChat = updatedData.find(chat => chat.id === selectedTabData.id);
        if (matchingChat) {
          setSelectedTabData(matchingChat);
          saveOfferData(matchingChat);
        }
      }

      if (page === 1) {

        if (
          selectedTabData &&
          selectedTabData?.tab === "buying" &&
          !updatedData.some((chat) => chat.id === selectedTabData.id)
        ) {
          setBuyerChatList([selectedTabData, ...updatedData]);
        } else {
          setBuyerChatList(updatedData || []);
        }
      } else {
        // setBuyerChatList((prev) => [...prev, ...data?.data]);
        setBuyerChatList((prev) => [
          ...prev,
          ...updatedData.filter(
            (newChat) => !prev.some((chat) => chat.id === newChat.id)
          ),
        ]);
      }
      setCurrentBuyerPage(data?.current_page);
      if (data?.current_page < data?.last_page) {
        setHasMoreBuyer(true);
      } else {
        setHasMoreBuyer(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellerChatList = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await chatListApi.chatList({ type: "seller", page });
      const { data } = response?.data || {};
      const updatedData = data.data.map((chat) => ({
        ...chat,
        tab: "selling",
      }));

      if (selectedTabData && selectedTabData?.tab === "selling") {
        const matchingChat = updatedData.find(chat => chat.id === selectedTabData.id);
        if (matchingChat) {
          setSelectedTabData(matchingChat);
          saveOfferData(matchingChat);
        }
      }

      if (page === 1) {
        if (
          selectedTabData &&
          selectedTabData?.tab === "selling" &&
          !updatedData.some((chat) => chat.id === selectedTabData.id)
        ) {
          setSellerChatList([selectedTabData, ...updatedData]);
        } else {
          setSellerChatList(updatedData || []);
        }
      } else {
        setSellerChatList((prev) => [
          ...prev,
          ...updatedData.filter(
            (newChat) => !prev.some((chat) => chat.id === newChat.id)
          ),
        ]);
      }
      setCurrentSellerPage(data?.current_page);
      if (data?.current_page < data?.last_page) {
        setHasMoreSeller(true);
      } else {
        setHasMoreSeller(false);
      }
    } catch (error) {
      console.log("Error fetching seller chat list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const response = await getBlockedUsers.blockedUsers({});
      const { data } = response;
      setBlockedUsersList(data?.data);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    }
  };

  useEffect(() => {
    if (blockPopoverVisible) {
      fetchBlockedUsers();
    }
  }, [blockPopoverVisible]);

  useEffect(() => {
    if (isLogin()) {
      activeTab === "buying" ? fetchBuyerChatList() : fetchSellerChatList();
    }
  }, [activeTab]);

  const handleActiveTab = (type) => {
    setActiveTab(type);
    saveOfferData(null);
    setSelectedTabData(null);
  };

  const popoverContent = (
    <div className="blocked-users-popover">
      {blockedUsersList.length > 0 ? (
        blockedUsersList.map((user) => (
          <div key={user?.id} className="blocked-user">
            <div className="user-info">
              <div className="user-image">
                <Image
                  src={
                    user?.profile ||
                    systemSettingsData?.data?.data?.placeholder_image
                  }
                  alt="User"
                  width={40}
                  height={40}
                  onErrorCapture={placeholderImage}
                />
              </div>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
              </div>
            </div>
            {/* Unblock button */}
            <button
              onClick={() => handleUnBlockUser(user.id)}
              className="unblock-button"
            >
              {t("unblock")}
            </button>
          </div>
        ))
      ) : (
        <p>{t("nousers")}</p>
      )}
    </div>
  );

  const handleBuyerChatTabClick = (chatData) => {
    if (chatData) {
      const updatedChatData = {
        ...chatData,
        unread_chat_count: 0, // Or any other value you want to set for chats_count
      };
      setSelectedTabData(updatedChatData);
      saveOfferData(updatedChatData);
      setReview("");
      setRating("");
      setBuyerChatList((prevList) =>
        prevList.map((chat) =>
          chat.id === chatData.id ? { ...chat, unread_chat_count: 0 } : chat
        )
      );
    }
  };
  const handleSellerChatTabClick = (chatData) => {
    if (chatData) {
      const updatedChatData = {
        ...chatData,
        unread_chat_count: 0, // Or any other value you want to set for chats_count
      };
      setSelectedTabData(updatedChatData);
      saveOfferData(updatedChatData);
      setReview("");
      setRating("");
      setSellerChatList((prevList) =>
        prevList.map((chat) =>
          chat.id === chatData.id ? { ...chat, unread_chat_count: 0 } : chat
        )
      );
    }
  };

  return IsLoading ? (
    <div className="chat_dashboard">
      <div className="chat_search_wrap">
        <span>{t("chat")}</span>
      </div>
      <div className="chat_header">
        <span
          className={`chat_tab ${activeTab === "selling" ? "active_chat_tab" : ""
            }`}
        >
          {t("selling")}
        </span>
        <span
          className={`chat_tab ${activeTab === "buying" ? "active_chat_tab" : ""
            }`}
        >
          {t("buying")}
        </span>
      </div>
      <ChatListSkeleton />
    </div>
  ) : (
    <div className="chat_dashboard">
      <div className="chat_search_wrap">
        <span>{t("chat")}</span>
        <div className="blockList">
          <Popover
            content={popoverContent}
            title="Blocked Users"
            visible={blockPopoverVisible}
            onVisibleChange={setBlockPopoverVisible}
            placement="bottom"
            trigger="click"
            className="blocklist"
          >
            <button>
              <RiUserForbidLine size={22} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="chat_header">
        <span
          className={`chat_tab ${activeTab === "selling" ? "active_chat_tab" : ""
            }`}
          onClick={() => handleActiveTab("selling")}
        >
          {t("selling")}
        </span>
        <span
          className={`chat_tab ${activeTab === "buying" ? "active_chat_tab" : ""
            }`}
          onClick={() => handleActiveTab("buying")}
        >
          {t("buying")}
        </span>
      </div>

      <div className="chat_list" id="chatList">
        <InfiniteScroll
          dataLength={
            activeTab === "buying"
              ? buyerChatList?.length
              : sellerChatList?.length
          }
          next={() => {
            activeTab === "buying"
              ? fetchBuyerChatList(CurrentBuyerPage + 1)
              : fetchSellerChatList(CurrentSellerPage + 1);
          }}
          hasMore={activeTab === "buying" ? HasMoreBuyer : HasMoreSeller}
          loader={<ChatListSkeleton />}
          scrollableTarget="chatList"
        >
          {activeTab === "buying" ? (
            <>
              {buyerChatList && buyerChatList?.length > 0 ? (
                buyerChatList?.map((chat, index) => (
                  <UserBuyerChatTab
                    key={index}
                    isActive={chat?.id === selectedTabData?.id}
                    chat={chat}
                    handleChatTabClick={handleBuyerChatTabClick}
                  />
                ))
              ) : (
                <div>
                  <NoChatListFound />
                </div>
              )}
            </>
          ) : (
            <>
              {sellerChatList && sellerChatList?.length > 0 ? (
                sellerChatList?.map((chat, index) => (
                  <UserSellerChatTab
                    key={index}
                    isActive={chat?.id === selectedTabData?.id}
                    chat={chat}
                    handleChatTabClick={handleSellerChatTabClick}
                  />
                ))
              ) : (
                <div className="no_data_conatiner">
                  <NoChatListFound />
                </div>
              )}
            </>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatList;
