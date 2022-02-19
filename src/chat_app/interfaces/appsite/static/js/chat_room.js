const roomName = JSON.parse(document.getElementById('room-name').textContent);

        var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

        const chatSocket = new WebSocket(
            ws_scheme
            + '://'
            + window.location.host
            +'/chats/'
            + roomName
            + '/'
        );

    const month_names = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];

     chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            var username = document.getElementById('me').value;

            var time_data = new Date();

            var date = getDate(time_data);
            var time = getTime(time_data);

            var timestamp = date + ', ' + time;


            if(username == data.username){
                document.querySelector('#chat-log').innerHTML += '<div class="message sender-message">'+ (data.message + '\n') +
                '<br><p style="opacity:0.5;font-size:12px;margin-bottom:-10px;">'+ timestamp +'</p></div>';
            }
            else{
                document.querySelector('#chat-log').innerHTML += '<div class="message receiver-message">' + (data.message + '\n') +
                '<br><p style="opacity:0.5;font-size:12px;margin-bottom:-10px;">'+timestamp+'</p></div>';
            }

            // keep bottom page on added contetn
            window.scrollTo(0,document.body.scrollHeight);
        };

        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };

        document.querySelector('#chat-message-input').focus();
        document.querySelector('#chat-message-input').onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#chat-message-submit').click();
            }
        };

           document.querySelector('#chat-message-submit').onclick = function(e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            const room_name = JSON.parse(document.getElementById('room-name').textContent);
            const username = document.getElementById('me').value;
            chatSocket.send(JSON.stringify({
                'message': message,
                'username': username,
                'room_name':room_name,
            }));
            messageInputDom.value = '';

        };


        function getDate(timestamp){
            var month = month_names[timestamp.getMonth()].substring(0,3);
            var day = timestamp.getDate();
            var year = timestamp.getFullYear();
            var date = month + '. ' + day + ', ' + year;
            return date;
        }


        function getTime(timestamp){
            var hours = timestamp.getHours();
            var minutes = timestamp.getMinutes();
            var make_time = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var time = hours + ':' + minutes + ' ' + make_time;
            return time;
        }