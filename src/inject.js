WAPI.waitNewMessages(false, (data) => {
    console.log(data)
    data.forEach(async (message) => {
        body = {};
        body.text = message.body;
        body.type = 'message';
        body.user = message.from._serialized;
        console.log(message)
        if (message.type == "chat") {
            if(message.isGroupMsg == true){
                console.log("Group message received from "+message.from._serialized);
                WAPI.sendSeen(message.from._serialized);
                if(message.quotedMsg !== undefined){
                    let phone_number = message.quotedMsg.body.match(/\([+]([^)]+)\)/)[1];
                    // phone_number = phone_number.substring(1)
                    console.log(phone_number)
                    if(phone_number !== null){
                        WAPI.sendMessageToID(phone_number+'@c.us', message.body);
                    }
                }
                if (message.body.toLowerCase() === "!register") {
                    console.log("Command register was received... Continuing...");
                    let group = {
                        grup_id: message.from._serialized,
                        tipe_grup: 'whatsapp'
                    }
                    console.log("Posting result to database");
                        let msg = await window.postToServer('https://sisfo.ppmrjbandung.com/api/group/register', group);
                        WAPI.sendMessage2(message.from._serialized, msg)
                }
                else if (message.body.toLowerCase() === "fotosaya"){
                    let img = message.sender.profilePicThumbObj.eurl
                    if(img === "" || img === null)
                        return WAPI.sendMessage(message.from._serialized, "Lu ga punya PP, bego")
                    let base64 = await window.toBase64(img)
                    WAPI.sendImage(base64, message.from._serialized, "foto-"+message.sender.pushname, "foto");
                }
                else if (message.body.toLowerCase() === "kocheng"){
                    let base64 = await window.loadCats()
                    WAPI.sendImage(base64, message.from._serialized, "kocheng", "kocheng");
                }
                else if(message.body.toLowerCase().startsWith("fotosaya")){
                    message.mentionedJidList.forEach(item => {
                        let img = WAPI.getProfilePicFromId(item._serialized)
                        console.log(img)
                    })
                }
            } else {
                let groupId = "6285777863880-1580955795@g.us";
                WAPI.sendMessage2(groupId, "Pesan dari "+message.sender.pushname+" (+"+message.from.user+"):\n"+message.body);
            }
            // if ((exactMatch || PartialMatch).file != undefined) {
            //     window.getFile((exactMatch || PartialMatch).file).then((base64Data) => {
            //         //console.log(file);
            //         WAPI.sendImage(base64Data, message.from._serialized, (exactMatch || PartialMatch).file);
            //     }).catch((error) => {
            //         window.log("Error in sending file\n" + error);
            //     })
            // }
        }
    });
});