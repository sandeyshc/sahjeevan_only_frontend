import 'bootstrap/dist/css/bootstrap.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button';
import "./ChatPage.scss";
import React, { useState, useEffect, useRef } from "react";
import CloseIcon from '@material-ui/icons/Close';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';

import firebase from 'firebase';
// import fi

// import { db } from '../Services/firebase';
import {db,f,realtime} from './Services/db'
import { ChannelListMessenger } from 'stream-chat-react';


export default function SahjeevanChat({ showChatBox }) {
    const [showChat, setShowChat] = useState(showChatBox);
    const [showOnlineMember, setShowOnlineMember] = useState(false);
    const [chats,setchats]=useState([])
    const [allUserData,setallUserData]=useState([])
    const [index,setindex]=useState(44444444)
    const [chatData,setchatData]=useState([])
    const [oldChats,setoldChats]=useState([])
    const [alloponentmails,setalloponentmails]=useState([])
    const [currentOpponentmail,setcurrentOpponentmail]=useState("")
    const [useremail,setuseremail]=useState(localStorage.getItem("username"))
    const [sendtext,setsendtext]=useState("")
    const messagesEndRef = useRef(null)
    const [currentOpponentname,setcurrentOpponentname]=useState("")
    const [currentUrl,setcurrentUrl]=useState("")
    const [currentstatus,setcurrentstatus]=useState(null)

    const setupdates = async () => {
        console.log("yes compo",index,chatData)
          if(index!=null && chatData.messages!=undefined){
            // console.log('component did update',this.state.chatData.messages)
        const chat = chatData.messages.length;
        // const { oldChats } = this.state;
        console.log(chat,oldChats,oldChats!==chat,"aaa")
        if (chat !== oldChats) {
          await isChatChanged(chat);
        }
    }
      };
    
      const isChatChanged = async (chat) => {
        console.log("hello");
        // await this.scrollingToEnd();
        setoldChats(chat);

        // document.getElementsByClassName('messages_list')[0].animate({
        //     scrollTop: document.getElementsByClassName('messages_list')[0].scrollHeight
        //  }, 500);
      };



    const handleSendClick=async()=>{
        const  docid  = chatData.docid;
        const  userEmail = useremail;
        const  text  = sendtext;
        const time = new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
            minute: "numeric",
          });
      
          const timestamp = Date.now();
      
          // const isBlocked = await this.blockList();
          // console.log(f,f.firestore.) 
          // console.log(Object.keys(db))
        //   console.log(this.state.user,userEmail,text,time,text,timestamp,"www")
  
              if(sendtext!=""){
              await db
                .collection("chats")
                .doc(docid)
                .update({
                  messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: userEmail,
                    message: text,
                    time: time,
                    type: "text",
                  }),
                  time: timestamp,
                })
                .then(()=>{
                    setsendtext("")
                })
      
            //   await this.scrollingToEnd();
              }


    }

    const handleChatIconClick = () => {
    setShowChat(!showChat);
    };
    const handleOnlineIconClick = () => {
    setShowOnlineMember(!showOnlineMember);
    };
    const handleMemberClick = (indexs) => {
        console.log(indexs,chats,chats[indexs])
        setcurrentOpponentmail(chats[indexs].users[0]===useremail ? chats[indexs].users[1]: chats[indexs].users[0])
        setindex(indexs)
        setchatData({...chats[indexs]})
        setShowChat(true);
        console.log(currentOpponentmail,"enna")
        console.log(chats[indexs].users[1],useremail)
        // setcurrentOpponentname(allUserData.name)
    };
    useEffect(()=>{
        console.log(currentOpponentmail,"HAHAHA")
    },[currentOpponentmail])
    const handleOnlineBoxCloseClick = () => {
        setShowOnlineMember(false);
    };
    const handleChatBoxCloseClick = () => {
        setShowChat(false);
    };
    useEffect(async()=>{
        console.log("hello,hello",alloponentmails)
        await getInfo()
        if(index!=44444444){
            await setoldChats(chatData.messages.length );
        }
        const useee=useremail.replace(/\./g,',')
        realtime.ref('/users/'+useremail.replace(/\./g,',')).update({
            isOnline:"Online"
        })
        console.log(useremail.replace(/\./g,','))
        realtime
  .ref('/users/'+useremail.replace(/\./g,',')+"/isOnline") // Making a reference to a key-value pair in the old real-time database structure
  .onDisconnect() // Setting up the onDisconnect hook
  .set('Offline');
  console.log(realtime.ref('/users/'+useremail.replace(/\./g,',')),"qqqqqq")
        
        // await getAllUsersData()

    },[]);

    const getAllUsersData = async () => {
        console.log("getuserdaata",alloponentmails)
      // await db.collection("users").onSnapshot(async (snapshot) => {
      //   var dt = snapshot.docs.map((docs) => docs.data());
  
      //   await this.setState({ allUserData: dt });
      //   await console.log(this.state.allUserData,"cool")
      // //   await this.getBlockList();
      // });
      await db.collection('users').where("email","in",alloponentmails).onSnapshot(async(snapshot)=>{
        var dt = snapshot.docs.map((docs) => docs.data());
        
        // await this.setState({ allUserData: dt });
        await setallUserData(dt)
        await console.log("completed",dt,allUserData,chats,dt)
        var reqw={};
        dt.map((rs,index)=>{
            console.log(rs.email,"rs")
            const eree=rs.email.replace(/\./g,',')
            realtime.ref('/users/'+eree).on('value',(snapshot)=>{
            //     console.log(snapshot,snapshot.child('isOnline').key,"ok",snapshot.child('isOnline').val())
            //     snapshot.forEach((er)=>console.log(er.val(),er.key,er,"dsdsdd"))
            //     console.log(snapshot.child('isOnline').key,snapshot.child('isOnline'),snapshot.child('isOnline'))
            // console.log(snapshot.key,"hahahaha",snapshot.val())
            console.log(snapshot.child("isOnline").val(),currentstatus)
            reqw={
                ...reqw,
                [rs.email]:snapshot.child('isOnline').val(),
            }
            console.log(reqw,"dsdsdqw")
            setcurrentstatus({
                ...reqw
            })
        })
        })

      })
    // .then(()=>{
        //   realtime.ref('/users'+rs.replace(/\./g,','))
                // allUserData.map((rs,index)=>{
                //     console.log(rs)
        // realtime.ref('/users'+rs.replace(/\./g,',')).on('value', (snapshot) => {
        //     console.log(snapshot.val(),"hellosss",rs);
        //   }, (errorObject) => {
        //     console.log('The read failed: ' + errorObject.name);
        //   }); 

        // realtime.ref('/users').on('value',(snapshot)=>{
        //     console.log(snapshot.val())
        // })
        // })
        // allUserData.map((rs,index)=>{
        //     setcurrentstatus({
        //         [rs.name]:
        //     })
        // })
    //   })
      
    };
    useEffect(async()=>{
        console.log("hello,hellodsd",alloponentmails!=[],alloponentmails!=null,alloponentmails[0]!=undefined)
        if(alloponentmails[0]!=undefined){
        await getAllUsersData()
        }
        // await getAllUsersData()

    },[alloponentmails]);
    useEffect(async()=>{
        // console.log("hello,hellodsd",alloponentmails!=[],alloponentmails!=null,alloponentmails[0]!=undefined)
        // if(alloponentmails[0]!=undefined){
        // await getAllUsersData()
        // }
        // await getAllUsersData()
        console.log(currentOpponentmail,"dsdsdsdsdsd")
        if(currentOpponentmail!="" || currentOpponentmail!=null){
            allUserData.map((ds,index)=>{if(ds.email==currentOpponentmail){
                setcurrentOpponentname(ds.name)
                setcurrentUrl(ds.URL)
            
            }})
                    // setcurrentOpponentname(allUserData.map((ds,index)=>{if(ds.email==currentOpponentmail){return ds.name}}))
                    // setcurrentUrl
        }

    },[currentOpponentmail]);

    useEffect(async()=>{
        // console.log("hello,hellodsd",alloponentmails!=[],alloponentmails!=null,alloponentmails[0]!=undefined)
        // if(chats[0]!=undefined){
        // await getAllUsersData()
        // }
        // await getAllUsersData()
        console.log(chats,"hohoho",chatData.messages,chatData.messages!=undefined)
        if(chatData.messages!=undefined){
            // setchatData(chats[index])
            await chats.map((lio,index)=>{console.log(currentOpponentmail,lio.users[0]==currentOpponentmail,lio.users[1]==currentOpponentmail,"dsdsqq");if(lio.users[0]==currentOpponentmail || lio.users[1]==currentOpponentmail){console.log(lio,"dwsfsf");setchatData(lio);setindex(index)}})
        
            console.log("setted")
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

            // setchatData(Object.assign({},chats[index]))

        }
    },[chats]);
    useEffect(async()=>{
        if(index!=44444444){
            console.log("kya",chats[index],chatData)
        // setchatData(chats[index])
        await chats.map((lio,index)=>{console.log(currentOpponentmail,lio.users[0]==currentOpponentmail,lio.users[1]==currentOpponentmail,"dsdsqq");if(lio.users[0]==currentOpponentmail || lio.users[1]==currentOpponentmail){console.log(lio,"dwsfsf");setchatData(lio);setindex(index)}})
        await console.log(chatData,chatData.messages,"hwe")
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" , block: "end", inline: "nearest"})
        }
    },[chatData])



    const getInfo = async (emails) => {
        console.log("enetered")
        await db
          .collection("chats")
          .where("users", "array-contains", useremail)
          
          .onSnapshot(async (res) => {
            const chatss = res.docs.map((docs) => docs.data());
            console.log(chatss.map((di)=>di.users),"dsdsdsdsd")
            await setalloponentmails(chatss.map((di)=>{if(di.users[0]!=useremail){ return(di.users[0])}else{return(di.users[1])}}))
            // ,()=>{this.getAllUsersData()})
            await console.log(alloponentmails,"gdfgdrgh",chatss)
            // await console.log("allopoo",this.state.alloponentmails)
            chatss.sort((a, b) => {
              if (a.time < b.time) {
                return 1;
              } else if (a.time > b.time) {
                return -1;
              } else {
                return 0;
              }
            });
    
            var chatList = [];

    
            if (emails) {
              chatList = await chatss.filter((chatss) => {
                var getEmail =
                  chatss.users[0] !== useremail ? chatss.users[0] : chatss.users[1];
    
                if (emails.includes(getEmail)) {
                  return chatss;
                }
                return null
              });
            }
            console.log(emails,chatss,chatList,"temppp")
            if (!emails) {
            //   await this.setState({
            //     email: useremail,
            //     chats: chats,
            //   });
            await setuseremail(useremail)
            await setchats(chatss)
            console.log(useremail,chatss,"firs")

            } else {
            //   await this.setState({
            //     email: useremail,
            //     chats: chatList,
            //   });
            await setuseremail(useremail)
            await setchats(chatList)
            console.log(useremail,chatList,"sec")
            }
            console.log(index,"whynot",index!=44444444)
            // await console.log("ssss",this.state.chats,this.state.index!=44444444,this.state.index!=null,this.state.chats[this.state.index],this.state.index)
            // if(index!=44444444 ){
            //     console.log("hohohp")
            //     // if(this.chats)
            //     await chats.map((lio,index)=>{console.log(currentOpponentmail,lio.users[0]==currentOpponentmail,lio.users[1]==currentOpponentmail,"dsdsqq");if(lio.users[0]==currentOpponentmail || lio.users[1]==currentOpponentmail){console.log(lio,"dwsfsf");setchatData(lio);setindex(index)}})
            //     await console.log(chatData,chatData.messages,"hwe")
            // }
            // console.log(this.state.email,this.state.chats)
            await setupdates();
          });

        //   return this.state.alloponentmails
      };
  return (
  <>
    <div style={{ display: 'block',
                  width: 700,
                  padding: 30 }}>
              <OverlayTrigger
                placement="left"
                trigger="click"
                show={showChat}
                overlay={(
                  <Popover>
                    <Popover.Title as="div">
                        {console.log(allUserData)}
                    {/* {chatData.docid!=undefined && chatData.messages.map((list, index)=>( */}
                          <div className="chatBoxHeader" onClick={handleChatBoxCloseClick}>
                            <img src={currentUrl} alt="" class="rounded-circle"
                            style={{ border: "1px solid white",height:"50px",width:"50px"}}
                            />
                            <div className="meta">
                                <span className="onlineName">{currentOpponentname? currentOpponentname:"Noone"}</span>
                                <div className="chatBoxClose">
                                    <CloseIcon />
                                </div>
                                {console.log(currentstatus,currentOpponentmail,"whynotsss")}
                            
                                 <p className="activeStatus">{currentOpponentmail? currentstatus[currentOpponentmail]: "Offlines"}</p>
                                {console.log(currentstatus,currentOpponentmail,currentOpponentmail? currentstatus[currentOpponentmail]: "Offlines",currentOpponentmail? currentstatus.currentOpponentmail: "Offlines","whynotsss")}
                            </div>
                        </div>
                    {/* ))} */}
                    {/* "http://emilcarlsson.se/assets/louislitt.png" */}
                    </Popover.Title>
                    <Popover.Content>
                        <div className="card chatBoxContent">
                        <ul className="messages_list">
                            {console.log(chatData)}
                            {console.log(chatData.messages,"list")}
                        {chatData.docid!=undefined && chatData.messages.map((list, index)=>(

                                
                                <li className={list.sender==useremail ? "message sent" :"message reply"}>
                                    <div className="chatWrap ">
                                        <div className="meta">
                                            <p className="msgText">{list.message}</p>
                                        </div>
                                    </div>
                                </li>
                                

                        ))}
                        <div ref={messagesEndRef} style={{marginTop:"20px"}} />
                            </ul>

                      </div>
                      <div className="message-input">
                        <div className="wrap">
                        <input type="text" placeholder="Write your message..." value={sendtext} onChange={(e)=>setsendtext(e.target.value)}/>
                        <button className="submit" onClick={handleSendClick}><i className="fa fa-paper-plane" aria-hidden="true">Send</i></button>
                        </div>
                    </div>
                      </Popover.Content>
                   </Popover>
                    )}>
                    <span variant="success" className="chatBoxIconParent" onClick={handleChatIconClick}>
                    </span>
              </OverlayTrigger>
    </div>

    <div style={{ display: 'block',
                  width: 700,
                  padding: 30 }}>
              <OverlayTrigger
                placement="top"
                trigger="click"
               show={showOnlineMember}
                overlay={(
                  <Popover >
                    <Popover.Title as="h3">
                      <span className="OnlineBoxHeader">Chats</span>
                        <div className="onlineBoxClose" onClick={handleOnlineBoxCloseClick}>
                            <CloseIcon />
                        </div>
                    </Popover.Title>
                    <Popover.Content>
                        <div className="card onlineContent">
                            <ul className="membersList">
                            {chats.length > 0 ? (
                    <div >
                      {chats.map((chat, indexs) => (
                                <li className="onlineMember active" onClick={()=>handleMemberClick(indexs)}>
                                    <div className="wrap">
                                        {console.log("'contact-status '+{currentstatus}","'contact-status '+{$currentstatusc}",
                                        chat.users[0] !== useremail
                                                  ? chat.users[0]
                                                  : chat.users[1],
                                        // chat.users[0] !== useremail        
                                        //         ? currentstatus[chat.users[0]]
                                        //         : currentstatus[chat.users[1]],
                                                currentstatus
                                                  )
                                                  }
                                        {/* {
                                        var csw=(chat.users[0] !== useremail
                                        ? chat.users[0]
                                        : chat.users[1])
                                        }            */}
                                        {/* {
                                            chat.users[0] !== useremail
                                            ? chat.users[0]
                                            : chat.users[1],
                                        } */}
                                        
                                        {
                                        currentstatus!=null?
                                          (chat.users[0] !== useremail
                                          ? <span className={currentstatus[chat.users[0]]=="Offline" ? "contact-status busy": "contact-status online"}></span>
                                          : <span className={currentstatus[chat.users[1]]=="Offline" ? "contact-status busy": "contact-status online"}></span>)
                                          : <p></p>
                                        }
                                        {/* <span className={()=>{
                                            console.log(chat.users,'wrere')
                                            if(chat.users[0] !== useremail){
                                                console.log(chat.users[0],"wrere")
                                            }
                                            else{
                                                console.log(chat.users[1],"wrere")
                                            }
                                            // console.log(currentstatus[crq])
                                            return("contact-status busy")
                                            
                                        }}></span> */}
                                        {/* <span
                                        class={
                                            allUserData
                                            .map((list) => {
                                              if (
                                                list.email ===
                                                (chat.users[0] !== useremail
                                                  ? chat.users[0]
                                                  : chat.users[1])
                                              ) {
                                                return list.email
                                              } else {
                                                return "";
                                              }
                                            })
                                            .join("")
                                            .trim("")

                                        }
                                        ></span> */}
                                        
                                        {/* {
                                        console.log(csw,"csw",currentstatus[csw])  
                                        } */}
                                        {/* <span className="contact-status busy"></span> */}
                                        <img 
                                        src={allUserData
                                            .map((list) => {
                                              if (
                                                list.email ===
                                                (chat.users[0] !== useremail
                                                  ? chat.users[0]
                                                  : chat.users[1])
                                              ) {
                                                return list.URL;
                                              } else {
                                                return "";
                                              }
                                            })
                                            .join("")
                                            .trim("")}
                                        alt=""
                                        style={{ border: "1px solid white",height:"50px",width:"50px"}}
                                        // style={{ border: "1px solid white",height:"50px",width:"40px",borderRadius:"10px",float:"left", marginRight:"10px",marginTop:"5px",marginLeft:"5px"}}
                                        />
                                        <div className="meta">
                                            <p className="onlineName">
                                            {console.log(allUserData,"checking")}
                                            {allUserData.map((list) => {
                                                if (
                                                    list.email ===
                                                    (chat.users[0] !== useremail
                                                    ? chat.users[0]
                                                    : chat.users[1])
                                                ) {
                                                    return list.name;
                                                }
                                                })}
                                            </p>
                                            <p className="preview">
                                            {/* <span > */}
                                                {chat.messages.length > 0
                                                ? chat.messages[
                                                    chat.messages.length - 1
                                                    ].message.substring(0, 13)
                                                : ""}
                                            {/* </span> */}

                                            </p>
                                        </div>
                                    </div>
                                </li>

                       ))}
                      </div>
                      ):<p>Sorry not chats</p>} 

                            </ul>
                      </div>
                      </Popover.Content>
                   </Popover>
                    )}>
                    <span variant="success" className="onlineIconParent" onClick={handleOnlineIconClick}>
                        <ForumOutlinedIcon className="onlineIcon" />
                    </span>
              </OverlayTrigger>
    </div>
   </>
  );
}