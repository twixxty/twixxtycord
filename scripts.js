async function updateDiscordStatus() {
    const statusElement = document.getElementById("randomText");
    const statusEmoji = document.getElementById("statusEmoji");
    const pfp = document.getElementById("pfp");
  
    try {
      const res = await fetch("https://api.lanyard.rest/v1/users/798177330010521630");
      const data = await res.json();
      if (!data.success) throw new Error("API failed");
  
      const d = data.data;
  
    // If user is offline, set random text
    if (d.discord_status === "offline") {
        setRandomText();
        statusEmoji.textContent = "";
        return;
      }
      // Set profile picture
    
      // Determine if gaming
      const gameActivity = d.activities.find(a => a.type === 0 && a.name !== "Custom Status");
  
      // Show gaming status if present
      if (gameActivity) {
        const gameName = gameActivity.name || "a game";
        statusElement.innerHTML = `🎮 playing <b>${gameName}</b>`;
      } else {
        // Otherwise, show custom status
        const customStatus = d.activities.find(a => a.type === 4);
        const emoji = customStatus?.emoji?.name || "";
        const text = customStatus?.state || "";
        statusElement.textContent = `${emoji ? emoji + " " : ""}${text}`;
      }
        // If no game or custom status, fallback to presence text
        if (!gameActivity) {
            const customStatus = d.activities.find(a => a.type === 4);
            const hasCustom = customStatus?.emoji?.name || customStatus?.state;
    
            if (!hasCustom && ["online", "idle", "dnd"].includes(d.discord_status)) {
              let emoji = "";
              let text = "";
    
              if (d.discord_status === "online") {
                emoji = "(•ᴗ•)";
                text = "online";
              } else if (d.discord_status === "idle") {
                emoji = "‎꜀( ꜆-ࡇ-)꜆ ᶻ 𝗓 𐰁";
                text = "idle";
              } else if (d.discord_status === "dnd") {
                emoji = "( ` ᴖ ´ )";
                text = "do not disturb";
              }
    
              statusElement.textContent = `${emoji} ${text}`;
            }
          }
    
      // Status emoji with mobile indicator
      let emojiStatus = "";
      if (gameActivity) emojiStatus = "⛔";
      else if (d.discord_status === "online") emojiStatus = "🟢";
      else if (d.discord_status === "idle") emojiStatus = "🌙";
      else if (d.discord_status === "dnd") emojiStatus = "⛔";
  
      const onMobile = d.active_on_discord_mobile;
      statusEmoji.textContent = onMobile ? `🟢` : emojiStatus;
  
    } catch (err) {
      console.error("Status fetch failed:", err);
      statusElement.textContent = "lemme cook...";
      statusEmoji.textContent = "";
    }
  }
  
  updateDiscordStatus();
  setInterval(updateDiscordStatus, 30000);
  

 const toggleImage = document.getElementById('dark-mode-toggle');
    document.addEventListener("DOMContentLoaded", function(event) {
    // wait until window is loaded - all images, styles-sheets, fonts, links, and other media assets
    // you could also use addEventListener() instead
    window.onload = function() {
  console.log("I'm done");
}
})
        const images = [
            "images/1.jpg",
            "images/2.jpg",
            "images/3.jpg",
            "images/4.jpg",
            "images/5.jpg",
            "images/6.jpg",
            "images/7.jpg",
            "images/8.jpg",
            "images/9.jpg",
            "images/10.jpg",
            "images/11.jpg",
            "images/12.jpg",
            "images/13.jpg",
            "images/14.jpg",
            "images/15.jpg",
            "images/16.jpg",
            "images/17.jpg",
            "images/18.jpg"

        ];
        document.addEventListener("DOMContentLoaded", () => {
    const coolVideo = document.getElementById("coolVideo");

    coolVideo.addEventListener("click", () => {
        if (coolVideo.paused) {
            coolVideo.play();
        } 
    });

    coolVideo.addEventListener("pause", () => {
        coolVideo.style.display = "none"; // Hide the video when paused
    });

    coolVideo.addEventListener("play", () => {
        coolVideo.style.display = "block"; // Show the video when playing
    });
});

      async function fetchAccentColor() {
          const response = await fetch('https://discord-lookup-api-new-liard.vercel.app/v1/user/798177330010521630');
          const data = await response.json();
          if (data.accent_color) {
              document.documentElement.style.setProperty("--accent", `#${data.accent_color.toString(16)}`);
          }
      }
      fetchAccentColor();
  
      async function fetchUserData() {
          const response = await fetch('https://discord-lookup-api-new-liard.vercel.app/v1/user/798177330010521630');
          const data = await response.json();
          if (data.global_name && data.username) {
              document.getElementById("pageTitle").textContent = data.global_name;
              document.getElementById("displayHeader").innerHTML = `${data.global_name} <br><span style='font-size: 0.6em; color: var(--tapioca);'>(@${data.username})</span>`;
          }
      }
      fetchUserData();
  
      async function fetchProfilePicture() {
          const response = await fetch('https://discord-lookup-api-new-liard.vercel.app/v1/user/798177330010521630');
          const data = await response.json();
          if (data.avatar && data.avatar.link) {
              document.getElementById("pfp").src = data.avatar.link;
          }
        }
      fetchProfilePicture();
  
      function setRandomText() {
          const texts = [
              "is eepy...",
              "is thirsty...",
              "is not a robot ☑...",
              "is hungry...",
              "is probably dead...",
              "is 15...",
              "is silly...",
              "is indian...",
              "is a web developer...",
              "is a video editor...",
              "is probably playing roblox...",
              "is stupid...",
              "is a tech nerd...",
              "is hated by many :c...",
              "is cute :3...",
              "is cooking...",
              "is a male...",
              "is secretely evil mr. munchkins man..."
          ];
          document.getElementById("randomText").textContent = texts[Math.floor(Math.random() * texts.length)];
      }
      setRandomText();
  
      function setRandomAboutText() {
          const aboutTexts = [
              "A dumbo.",
              "A Roblox enjoyer.",
              "Hi I'm Hammad.",
              "The father of Glargle Cheeseball.",
              "A retired video editor. (too cringe)",
              "A tech enthusiast.",
              "A person who drinks water.",
              "The developer of twixxt.vercel.app",
              "A fellow pirate.",
              "A person that exists... somehow."
          ];
          document.getElementById("aboutText").textContent = aboutTexts[Math.floor(Math.random() * aboutTexts.length)];
      }
            setRandomAboutText();
      document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        toggleImage.style.filter = 'blur(0px)';
                document.querySelector("main").style.filter = "blur(0)";
        document.querySelector("main").style.scale = "1";
    }, 0); 
});

      const randomMessages = [
            "a human from india",
            "habibi welcome to india",
            "am indian",
            "india time lol",
            "am a sussy indian"
        ];
        const randomConnections = [
            "connections",
            "my accounts",
            "my stuff",
            "contact me lol",
            "also found here"
        ];
        document.getElementById("randomMessage").innerText = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        document.getElementById("randomMessage").innerText = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        document.getElementById("connections").innerText = getRandomItem(randomConnections);
function updateIndiaTime() {
    const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
    const indiaTime = new Date().toLocaleTimeString("en-IN", options);
    document.getElementById("indiaTime").innerText = indiaTime;
}
function getRandomItem(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
updateIndiaTime();
setInterval(updateIndiaTime, 1000);
document.addEventListener("DOMContentLoaded", () => {
    const loadingTexts = [
        "loading",
        "hi",
        "welcome",
        "initialising",
        "wat",
        "fetching",
        "cooking",
        "preparing",
        "hold on",
        "be patient",
        "thinking",
        "im hammad",
        "sussy baka",
        "chairs r lowkey sat on",
        "playing",
        "waiting",
        "dapping",
        "thinking",
        "bazinga!",
        "khelega free fire",
        "hammad site",
        "3 seconds loading",
        "powered by 1900 lemons",
        "hello dude"
    ];

    document.getElementById("overlayText").textContent = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];

    setTimeout(() => {
        document.getElementById("overlayText").classList.add("hidden");
        setTimeout(() => {
            document.getElementById("overlayText").style.display = "none"; 
        }, 4000);
    }, 3000);
});
function updateTimeFunc() {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false };
    const hour = parseInt(new Intl.DateTimeFormat("en-IN", options).format(now));


    let message;
    if (hour >= 06 && hour < 10) {
        message = "probably awake";
    } else if (hour >= 10 && hour < 12) {
        message = "defenitely awake";
    } else if (hour >= 12 && hour < 15) {
        message = "busy with school";
    } else if (hour >= 15 && hour < 16) {
        message = "having lunch and resting";
    } else if (hour >= 16 && hour < 19) {
        message = "napping";
    } else if (hour >= 19 && hour < 21) {
        message = "busy with home work";
    } else if (hour >= 21 && hour < 22) {
        message = "having dinner";
    } else if (hour >= 22 && hour < 24) {
        message = "available";
    }  else {
        message = "sleeping";
    }

    document.getElementById("timefunc").innerText = message;
}

updateTimeFunc();
setInterval(updateTimeFunc, 1000);


const friendsList = [
            { id: "1108071513493614592", username: "Friend 1", sfx: "sounds/george.mp3" },
{ id: "916205370416975893", username: "Friend 2", sfx: "sounds/sirius.mp3" },

        { id: "860917681879253002", username: "Friend 3", sfx: "sounds/dhiren.mp3" },
        { id: "1256930587684634674", username: "Friend 4", sfx: "sounds/ladybug.mp3" },

        { id: "735955748579836025", username: "Friend 5", sfx: "sounds/penny.mp3" }
    ];

    async function fetchFriends() {
        const container = document.getElementById("friendsContainer");
        container.innerHTML = "";
        
        for (let i = 0; i < friendsList.length; i++) {
            const friend = friendsList[i];
            const response = await fetch(`https://discord-lookup-api-one-coral.vercel.app/v1/user/${friend.id}`);
            const data = await response.json();
            
            const friendDiv = document.createElement("div");
            friendDiv.classList.add("friend");
            friendDiv.dataset.username = data.global_name || data.username || friend.username;
            
            const img = document.createElement("img");
            img.src = data.avatar ? data.avatar.link : "default_avatar.png";
            img.classList.add("friend-pfp");
            
            img.addEventListener("click", () => {
                const audio = new Audio(friend.sfx);
                audio.play();
            });
            
            friendDiv.appendChild(img);
            container.appendChild(friendDiv);
        }

        document.querySelectorAll(".friend").forEach((friend, i, arr) => {
            friend.addEventListener("mouseover", () => {
                arr.forEach(f => f.classList.remove("active", "previous", "previous-2","previous-3", "next", "next-2","next-3"));
                friend.classList.add("active");
                if (friend.previousElementSibling) friend.previousElementSibling.classList.add("previous");
if (friend.previousElementSibling?.previousElementSibling) friend.previousElementSibling.previousElementSibling.classList.add("previous-2");
if (friend.previousElementSibling?.previousElementSibling?.previousElementSibling) friend.previousElementSibling.previousElementSibling.previousElementSibling.classList.add("previous-3");
if (friend.previousElementSibling?.previousElementSibling?.previousElementSibling?.previousElementSibling) friend.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add("previous-4");
                if (friend.nextElementSibling) friend.nextElementSibling.classList.add("next");
                if (friend.nextElementSibling?.nextElementSibling) friend.nextElementSibling.nextElementSibling.classList.add("next-2");
                if (friend.nextElementSibling?.nextElementSibling?.nextElementSibling) friend.nextElementSibling.nextElementSibling.nextElementSibling.classList.add("next-3");
                if (friend.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling) friend.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add("next-4");
            });
        });
    }

    fetchFriends();
    
    const moreFriendsList = [
        { id: "929308666606272563", username: "Friend A", sfx: "sounds/abhi.mp3" },
        { id: "1089305664108634162", username: "Friend B", sfx: "sounds/mijo.mp3" },
        { id: "1081451019260678245", username: "Friend C", sfx: "sounds/vro.mp3" },
        { id: "922389987889143849", username: "Friend D", sfx: "sounds/sounak.mp3" },
        { id: "852730635063656462", username: "Friend E", sfx: "sounds/lemon.mp3" }
    ];

    async function fetchMoreFriends() {
        const container = document.getElementById("morefriendsContainer");
        container.innerHTML = "";
        
        for (let i = 0; i < moreFriendsList.length; i++) {
            const friend = moreFriendsList[i];
            const response = await fetch(`https://discord-lookup-api-one-coral.vercel.app/v1/user/${friend.id}`);
            const data = await response.json();
            
            const friendDiv = document.createElement("div");
            friendDiv.classList.add("friend");
            friendDiv.dataset.username = data.global_name || data.username || friend.username;
            
            const img = document.createElement("img");
            img.src = data.avatar ? data.avatar.link : "default_avatar.png";
            img.classList.add("friend-pfp");
            
            img.addEventListener("click", () => {
                const audio = new Audio(friend.sfx);
                audio.play();
            });
            
            friendDiv.appendChild(img);
            container.appendChild(friendDiv);
        }

        document.querySelectorAll(".friend").forEach((friend, i, arr) => {
            friend.addEventListener("mouseover", () => {
                arr.forEach(f => f.classList.remove("active", "previous", "previous-2","previous-3", "next", "next-2","next-3"));
                friend.classList.add("active");
                if (friend.previousElementSibling) friend.previousElementSibling.classList.add("previous");
if (friend.previousElementSibling?.previousElementSibling) friend.previousElementSibling.previousElementSibling.classList.add("previous-2");
if (friend.previousElementSibling?.previousElementSibling?.previousElementSibling) friend.previousElementSibling.previousElementSibling.previousElementSibling.classList.add("previous-3");
if (friend.previousElementSibling?.previousElementSibling?.previousElementSibling?.previousElementSibling) friend.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add("previous-4");
                if (friend.nextElementSibling) friend.nextElementSibling.classList.add("next");
                if (friend.nextElementSibling?.nextElementSibling) friend.nextElementSibling.nextElementSibling.classList.add("next-2");
                if (friend.nextElementSibling?.nextElementSibling?.nextElementSibling) friend.nextElementSibling.nextElementSibling.nextElementSibling.classList.add("next-3");
                if (friend.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling) friend.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add("next-4");
            });
        });
    }

    fetchMoreFriends();
    document.getElementById("pfp").addEventListener("click", () => {
    const sounds = [
        "/sfx/1.mp3",
        "/sfx/2.mp3",
        "/sfx/3.mp3",
        "/sfx/4.mp3",
        "/sfx/5.mp3",
        "/sfx/6.mp3",
        "/sfx/7.mp3",
        "/sfx/8.mp3",
        "/sfx/9.mp3",
        "/sfx/10.mp3",
        "/sfx/11.mp3",
        "/sfx/12.mp3",
        "/sfx/13.mp3"
];

    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = new Audio(randomSound);
    audio.play();
    pfp.style.pointerEvents="none";
    setTimeout(() => {
        pfp.style.pointerEvents="auto";
    }, 50);
});
async function fetchWithRetry(url, retries = 3, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json(); 
            console.log("API Data:", data);
            return data;
        } catch (error) {
            console.warn(`Attempt ${attempt} failed:`, error.message);

            if (attempt < retries) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(res => setTimeout(res, delay)); 
                console.error("API request failed after multiple attempts.");
                return null;
            }
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
        const images = [
            "images/1.jpg",
            "images/2.jpg",
            "images/3.jpg",
            "images/4.jpg",
            "images/5.jpg"
        ];
        
        const videos = [
    "videos/video1.mp4",
    "videos/1 (1).mp4",
    "videos/1 (2).mp4",
    "videos/1 (3).mp4",
    "videos/1 (4).mp4",
    "videos/1 (5).mp4",
    "videos/1 (6).mp4",
    "videos/1 (7).mp4",
    "videos/1 (8).mp4",
    "videos/1 (9).mp4",
    "videos/1 (10).mp4",
    "videos/1 (11).mp4",
    "videos/1 (12).mp4",
    "videos/1 (13).mp4",
    "videos/1 (14).mp4",
    "videos/1 (15).mp4",
    "videos/1 (17).mp4",
    "videos/1 (18).mp4",
    "videos/1 (19).mp4",
    "videos/1 (20).mp4",
    "videos/1 (21).mp4",
    "videos/1 (22).mp4",
    "videos/1 (23).mp4",
    "videos/1 (24).mp4",
    "videos/1 (25).mp4",
    "videos/1 (26).mp4",
    "videos/1 (27).mp4",
    "videos/1 (28).mp4",
    "videos/1 (30).mp4",
    "videos/1 (31).mp4",
    "videos/1 (32).mp4",
    "videos/1 (33).mp4",
    "videos/1 (34).mp4",
    "videos/1 (35).mp4",
    "videos/1 (36).mp4",
    "videos/1 (37).mp4",
    "videos/1 (38).mp4",
    "videos/1 (39).mp4",
    "videos/1 (40).mp4",
    "videos/1 (41).mp4",
    "videos/1 (42).mp4",
    "videos/1 (43).mp4",
    "videos/1 (45).mp4",
    "videos/1 (46).mp4",
    "videos/1 (47).mp4",
    "videos/1 (48).mp4",
    "videos/1 (49).mp4",
    "videos/1 (50).mp4",
    "videos/1 (52).mp4",
    "videos/1 (53).mp4",
    "videos/1 (54).mp4",
    "videos/1 (55).mp4",
    "videos/1 (56).mp4",
    "videos/1 (57).mp4",
    "videos/1 (58).mp4",
    "videos/1 (59).mp4",
    "videos/1 (61).mp4",
    "videos/1 (62).mp4",
    "videos/1 (64).mp4",
    "videos/1 (65).mp4",
    "videos/1 (66).mp4",
    "videos/1 (67).mp4",
    "videos/1 (68).mp4",
    "videos/1 (69).mp4",
    "videos/1 (70).mp4",
    "videos/1 (71).mp4",
    "videos/1 (72).mp4",
    "videos/1 (73).mp4",
    "videos/1 (74).mp4",
    "videos/1 (75).mp4",
    "videos/1 (76).mp4",
    "videos/1 (77).mp4",
    "videos/1 (78).mp4",
    "videos/1 (79).mp4",
    "videos/1 (80).mp4",
    "videos/1 (81).mp4",
    "videos/1 (82).mp4",
    "videos/1 (83).mp4",
    "videos/1 (84).mp4",
    "videos/1 (85).mp4",
    "videos/1 (86).mp4",
    "videos/1 (87).mp4",
    "videos/1 (88).mp4",
    "videos/1 (89).mp4",
    "videos/1 (90).mp4",
    "videos/1 (91).mp4",
    "videos/1 (92).mp4"
];
    videoTrigger.addEventListener("click", () => {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        videoElement.src = randomVideo;
        videoElement.style.display = "block";
        videoElement.play();
        videoTrigger.style.display = "none";
    });
    
});
        const sound = "sounds/click.mp3";
        const imageElement = document.getElementById("randomImage");
        const overlay = document.getElementById("imageOverlay");
        const videoTrigger = document.getElementById("videoTrigger");
        const videoElement = document.getElementById("randomVideo");


       
   
imageElement.addEventListener("click", () => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    overlay.src = randomImage;
overlay.style.display = "block";
    
    const audio = new Audio(sound);
    audio.play();
    imageElement.style.pointerEvents = "none"; // Disable pointer events
    imageElement.style.display = "block";
    overlay.classList.add("animate-overlay");
    setTimeout(() => {
        overlay.classList.remove("animate-overlay");
            overlay.style.display = "none"; // Hide overlay after animation
            imageElement.style.pointerEvents = "auto";
            imageElement.style.display = "block"; // **Reappear the image**
    }, 1500);
});
        
       
        videoTrigger.addEventListener("click", () => {
            const randomVideo = videos[Math.floor(Math.random() * videos.length)];
            videoElement.src = randomVideo;
            videoElement.style.display = "block";
            videoElement.play();
        });

        videoElement.addEventListener("pause", () => {
            videoElement.style.display = "none";
            videoTrigger.style.display = "block";
            
        });
    
        document.addEventListener("DOMContentLoaded", () => {
        const fullscreenTrigger = document.getElementById("fullscreenTrigger");
        const fullscreenVideo = document.getElementById("fullscreenVideo");

        const videos = [
"videos/oia.mp4"
        ];

        fullscreenTrigger.addEventListener("click", () => {
            const randomVideo = videos[Math.floor(Math.random() * videos.length)];
            fullscreenVideo.src = randomVideo;
            fullscreenVideo.style.display = "block";
            fullscreenVideo.play();
        });

        fullscreenVideo.addEventListener("click", () => {
            fullscreenVideo.pause();
            fullscreenVideo.style.display = "none";
        });
        fullscreenVideo.addEventListener("pause", () => {
        fullscreenVideo.style.display = "none"; // Hide the video when paused
    });
    });

   
 
    document.addEventListener("DOMContentLoaded", function () {
        const caseohVisible = document.getElementById("caseohVisible");
        const caseohHidden = document.getElementById("caseohHidden");
        const shrinkSound = document.getElementById("shrinkSound");
        let dx = 3, dy = 3;
        let x = window.innerWidth / 2, y = window.innerHeight / 2;
        let width = 100, height = 100;
        const images = ["images/caseoh.jpg","images/caseoh1.webp", "images/caseoh2.webp", "images/caseoh3.webp","images/caseoh4.webp","images/caseoh5.webp","images/caseoh6.jpg",];
        let imageIndex = 0;
        let maxSize = Math.min(window.innerWidth, window.innerHeight) * 0;
        function updateBounds() {
            return { width: window.innerWidth, height: window.innerHeight };
        }

        let bounds = updateBounds();
        window.addEventListener("resize", () => { bounds = updateBounds(); });

         caseohVisible.addEventListener("click", function () {
            caseohVisible.style.display = "none";
            caseohHidden.style.display = "block";
            caseohHidden.style.left = `${x}px`;
            caseohHidden.style.top = `${y}px`;
            animateCaseoh();
        });

        function animateCaseoh() {
            setInterval(() => {
                x += dx;
                y += dy;
                
                if (x + caseohHidden.clientWidth >= bounds.width || x <= 0) {
                    dx = -dx;
                    changeImage();
                    increaseSize();
                    playSound();
                    x = Math.max(0, Math.min(x, bounds.width - caseohHidden.clientWidth));
                }
                if (y + caseohHidden.clientHeight >= bounds.height || y <= 0) {
                    dy = -dy;
                    changeImage();
                    playSound();
                    increaseSize();
                    y = Math.max(0, Math.min(y, bounds.height - caseohHidden.clientHeight));
                }
                
                caseohHidden.style.left = `${x}px`;
                caseohHidden.style.top = `${y}px`;
                caseohFollower.style.left = `${x + 20}px`;
                caseohFollower.style.top = `${y + 20}px`;
            }, 20);
        }

        function changeImage() {
            imageIndex = (imageIndex + 1) % images.length;
            caseohHidden.src = images[imageIndex];
            function applyBlur(timeout = 1000) {  // Default timeout: 1 second

    
}
        }
        
        function increaseSize() {
          
        }
    });
    let currentBlur = 0;
    function playSound() {
            const sound = new Audio("sounds/stomp.mp3");
            sound.play();
            
            currentBlur += 2;
            document.querySelector("main").style.filter = `blur(${currentBlur}px)`;
        }
    
        function increaseSize() {
            let newWidth = caseohHidden.clientWidth + 0;
            let newHeight = caseohHidden.clientHeight + 0;
            caseohHidden.style.width = `${newWidth}px`;
            caseohHidden.style.height = `${newHeight}px`;
        }
        document.addEventListener("DOMContentLoaded", () => {
        const startChase = document.getElementById("startChase");
        const chaseImage = document.getElementById("chaseImage");
        const timerElement = document.getElementById("timer");
        const jumpscare = document.getElementById("jumpscare");
        const scaryImage = document.getElementById("scaryImage");
        const scarySound = document.getElementById("scarySound");
        const mainElement = document.querySelector("main");
        const retrosus = document.getElementById("retrosus");

        let chasing = false;
        let speed = 1;
        let seconds = 0;
        let interval;
        let mouseMoving = false;

        startChase.addEventListener("click", () => {
            startChase.style.display = "none";
            mainElement.style.filter = "blur(10px),brightness(0.5)";
            mainElement.style.filter = "";
            mainElement.style.pointerEvents = "none";
            setTimeout(() => {
                chaseImage.style.top = Math.random() * window.innerHeight + "px";
                chaseImage.style.left = Math.random() * window.innerWidth + "px";
                chaseImage.style.display = "block";
                chasing = true;
                interval = setInterval(() => {
                    if (mouseMoving) {
                        seconds++;
                        timerElement.innerText = seconds + "s";
                        speed += 0.5;
                    }
                }, 1000);
            }, 500);
        });

        document.addEventListener("mousemove", (event) => {
            mouseMoving = true;
            setTimeout(() => mouseMoving = false, 500);
            if (chasing) {
                const rect = chaseImage.getBoundingClientRect();
                const dx = event.clientX - (rect.left + rect.width / 2);
                const dy = event.clientY - (rect.top + rect.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 20) {
                    clearInterval(interval);
                    jumpscare.style.display = "flex";
                    scaryImage.style.opacity = "1";
                    scarySound.play();
                    setTimeout(() => {
                        scaryImage.style.opacity = "0";
                        setTimeout(() => {
                            jumpscare.style.display = "none";
                            chasing = false;
                            seconds = 0;
                            speed = 1;
                            timerElement.innerText = "";
                            startChase.style.display = "block";
                            chaseImage.style.display = "none";
                            mainElement.style.filter = "none";
                            window.close();
                                    location.reload();  // Reload the page after the timeout
    
                        }, 500);
                    }, 500);
                }

                chaseImage.style.left = parseFloat(chaseImage.style.left) + (dx / distance * speed) + "px";
                chaseImage.style.top = parseFloat(chaseImage.style.top) + (dy / distance * speed) + "px";
            }
        });
    });
    const coolText = document.getElementById('coolText');
    const retroMode = document.getElementById("retroMode");
    const retroImage = document.getElementById("retroImage");
    const retroLines = document.getElementById("retroLines");
    let retroModeState = false;

    retroMode.addEventListener("click", function () {
            document.body.style.background = "#0000FF";
            document.body.style.color = "#FFFF00";
            document.body.style.fontFamily = "comic";
            document.body.style.textShadow = "2px 2px 2px black";
            document.querySelector('main').style.filter = "blur(0.6px)";
            retrosus.play();
            gtaMode.style.display = 'inline-block';
            gtaMode.style.setProperty('font-family', 'san', 'important');
            retroMode.style.display = 'none';
            gtaMode.classList.add('custom-font');
            classicMode.classList.add('custom-fonty');
            toggleImage.style.display = 'none';

            document.querySelectorAll("button, img, a, h1, h2, h3, video").forEach(el => {
                el.style.border = "3px solid red";
                el.style.background = "#ff69b4";
                el.style.color = "white";
                el.style.fontFamily = "comic";
                document.documentElement.style.background = "#ff69b4";
                el.style.textDecoration = 'underline wavy';  // Change 'red' to your desired color

            });
            retroImage.style.display = "block";
            retroLines.style.display = "block";


        });
        const gtaMode = document.getElementById('gtaMode');
        gtaMode.addEventListener('click', (e) => {
            document.body.style.background = "#00000000";
            document.body.style.color = "#9bb2d6";
            document.body.style.fontFamily = "san";
            document.body.style.textShadow = "2px 2px 2px black";
            document.querySelector('main').style.filter = "blur(0.6px)";
            new Audio('sounds/gta-menu.mp3').play();
            gtaMode.style.display = 'none';
retroMode.style.display = 'none';
document.body.style.background = 'url("images/gta-bg.jpg") no-repeat center center fixed';document.body.style.backgroundSize = 'cover';
document.body.style.overflow = 'auto';  // Prevent scrolling
classicMode.style.display = 'inline-block';


            document.querySelectorAll("button, img,  h1, h2, h3, a, video").forEach(el => {
                el.style.fontFamily = "sant";
                document.documentElement.style.background = "#000000";
                el.style.border = "0px solid red";
                el.style.background = "#00000000";
                el.style.color = "#9bb2d6";
                el.style.textDecoration = 'underline wavy';  // Change 'red' to your desired color

            });
           

        });
        const classicMode = document.getElementById('classicMode');
        const refresh = document.getElementById('refresh');
        classicMode.addEventListener('click', (e) => {
            document.body.style.background = "#212529";
            document.body.style.color = "#E5989B";
            document.body.style.fontFamily = "vintext";
            document.body.style.textShadow = "0px 0px 0px black";
            document.querySelector('main').style.filter = "blur(0px)";
            new Audio('sounds/vintage.mp3').play();
            gtaMode.style.display = 'none';
retroMode.style.display = 'none';
classicMode.style.display = 'none';
refresh.style.display = 'inline-block';
refresh.classList.add('custom-fonti');

            document.querySelectorAll("button, img,  h1, h2, h3, a, video").forEach(el => {
                el.style.fontFamily = "vintage";
                document.documentElement.style.background = "#212529";
                el.style.border = "0px solid red";
                el.style.background = "#212529";
                el.style.color = "#B5828C";
                el.style.textDecoration = 'underline wavy';  // Change 'red' to your desired color

            });

        });
        
        refresh.addEventListener('click', (e) => {
    document.querySelector("main").style.filter = "blur(700px)";

    new Audio('sounds/bye.mp3').play();  // Play sound immediately
    setTimeout(function() {
        location.reload();  // Reload the page after the timeout
    }, 2000);  // Timeout for 2 seconds
});
function toggleTheme() {
    setTimeout(function() {

            const elements = document.querySelectorAll('*'); // Select all elements
            const isDark = document.body.classList.toggle('light-mode');
            elements.forEach(el => {
                if (isDark) {
                    document.body.classList.toggle('dark-mode');                   document.body.style.backgroundColor = "#FFFFFF"; // Change to any color
                    document.documentElement.style.backgroundColor = "#FFFFFF"; // Change to any color
                toggleImage.style.backgroundColor = "#FFF";
                    el.style.color = "#212529";
                    document.querySelector("main").style.filter = "blur(2px)";
                    toggleImage.src = 'images/sunny.png'; // Moon icon for dark mode                    el.style.color = "#212529";

                } else {
                    location.reload();  // Reload the page after the timeout
                    document.body.classList.toggle('light-mode');                    el.style.background = "#ffffff";

                }
            });  }, 1500);  // Timeout for 2 seconds
        }  

        setTimeout(() => {
  toggleImage.classList.add('fade-in');
}, 4000);  

  
toggleImage.addEventListener('click', function() {
  
  document.body.classList.toggle('dark-mode');
  
  // Create full-screen image element
  const fullScreenImage = document.createElement('div');
  fullScreenImage.classList.add('full-screen-image');
  
  if (document.body.classList.contains('dark-mode')) {
    fullScreenImage.style.backgroundImage = 'url(images/think.webp)';
    new Audio('sounds/light.mp3').play();

  } else {
    fullScreenImage.style.backgroundImage = 'url(images/think.webp)';
    new Audio('sounds/light.mp3').play();

  }
  document.body.appendChild(fullScreenImage);

  setTimeout(() => {

}, 100); // Fade-out delay

  setTimeout(() => {
    document.querySelector('main').style.transition = "none"; // Disable any transition

    fullScreenImage.style.opacity = 0;
    setTimeout(() => fullScreenImage.remove(), 1000);

  }, 1500); // Fade-out delay
});

const video = document.getElementById('sigma');
const keywordInput = document.getElementById('keyword-input');

const playKeywords = ['yes', 'sure', 'ye', 'yep', 'of course', 'ofc', 'ya', 'agree'];

keywordInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {  
    event.preventDefault(); // Prevent form submission
    
    const inputValue = keywordInput.value.toLowerCase().trim();

    // Check if the input matches any of the predefined keywords
    if (playKeywords.includes(inputValue) && video.paused) {
      video.style.display = 'block'; // Show the video
      video.play(); // Play the video

      // Only disable input & change placeholder if video plays
      keywordInput.disabled = true;
      keywordInput.placeholder = 'tanks vro :3';
      keywordInput.value = ''; // Clear input
    } else {
      keywordInput.value = ''; // Clear input if no match, but keep enabled
    }
  }
});

// Listen for a click on the video to pause or play
video.addEventListener('click', function() {
  if (video.paused) {
    video.play(); // Play the video if it was paused
  } else {
    video.pause(); // Pause the video if it's currently playing
  }
});

// Listen for the pause event to hide the video when it's paused
video.addEventListener('pause', function() {
  video.style.display = 'none'; // Hide the video when paused
});
const link = document.getElementById('show-iframe');
const mainContent = document.querySelector('main');

link.addEventListener('click', function(event) {
  event.preventDefault();
  
  mainContent.style.filter = 'blur(70px)';
  
  const overlay = document.createElement('div');
  overlay.id = 'overlay-iframe';

  const iframe = document.createElement('iframe');
  iframe.src = 'https://twixxt.vercel.app/tos.html'; // This is where you can specify the URL (e.g., tos.html)
  iframe.title = 'Terms of Service';
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
  setTimeout(() => {
    iframe.style.transform = 'translateX(-50%)'; // Animate to full size
  }, 1000);

  overlay.addEventListener('click', function() {
    document.body.removeChild(overlay);
    mainContent.style.filter = 'none';
  });
});
let cursorX = 0, cursorY = 0;
            let targetX = 0, targetY = 0;
            let lastX = 0;

            document.addEventListener("mousemove", (e) => {
                targetX = e.clientX;
                targetY = e.clientY;

                const velocity = targetX - lastX; // Calculate velocity by tracking movement speed
                const rotation = velocity * 2;
                customCursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
                floatingImage.style.transform = `translate(-50%, -10%) rotate(${rotation}deg)`;                lastX = targetX;
            });
window.addEventListener("DOMContentLoaded", () => {

const gunImage = document.getElementById("gunimg");
        const customCursor = document.getElementById("customCursor");
        const overlay = document.getElementById("overlay");
        const floatingImage = document.getElementById("floatingImage");

        let pointerMode = false;
        let pointerModeActive = false; // Pointer mode starts inactive

        gunImage.addEventListener("click", () => {
            togglePointerMode();
            const bgMusic = new Audio('sfx/doom-eternal.mp3');
            bgMusic.loop = false; // Ensure background music loops
            bgMusic.play();
            pointerMode = !pointerMode;
            pointerModeActive = true;

            document.body.classList.toggle("no-pointer");
            customCursor.style.display = pointerMode ? "block" : "none";
            document.body.style.cursor = state ? "none" : "default";                });

        document.addEventListener("mousemove", (e) => {
            if (pointerMode) {
                customCursor.style.left = `${e.pageX}px`;
                customCursor.style.top = `${e.pageY}px`;
            }
        });

        overlay-gun.addEventListener("mouseenter", () => {
            if (pointerMode) customCursor.style.display = "block";
            document.body.style.cursor = state ? "none" : "default";        });

        overlay-gun.addEventListener("mouseleave", () => {
            customCursor.style.display = "none";
            document.body.style.cursor = state ? "none" : "default";        });
    })
    window.addEventListener("DOMContentLoaded", () => {
            const customCursor = document.getElementById("customCursor");

            document.addEventListener("mousemove", (e) => {
                customCursor.style.left = `${e.clientX}px`;
                customCursor.style.top = `${e.clientY}px`;
            });
        });
// Make sure these variables are defined globally or accessible in this scope
let pointerMode = false; // Default value
let customCursor = document.getElementById('customCursor'); // Make sure this exists
let floatingImage = document.getElementById('floatingImage'); // Make sure this exists

// First define the function
function togglePointerMode() {
    pointerMode = !pointerMode;
    console.log("Pointer mode:", pointerMode);
    
    // Update UI to show current mode
    if (pointerMode) {
        // Show custom cursor or other visual indicator
        customCursor.style.display = "block";
       
          
    } else {
        customCursor.style.display = "none";
    }
}
const links = document.querySelectorAll("a");
let storedHrefs = new Map();


function disableLinks() {
    links.forEach(link => {
        storedHrefs.set(link, link.getAttribute("href")); // Save original href
        link.removeAttribute("href"); // Remove href to disable
    });
}

function enableLinks() {
    links.forEach(link => {
        if (storedHrefs.has(link)) {
            link.setAttribute("href", storedHrefs.get(link)); // Restore href
        }
    });
}

// Call disableLinks() when pointerMode is active
if (pointerMode) {
}

// Call enableLinks() when pointerMode is deactivated
if (!pointerMode) {
    enableLinks();
}
// Then add the event listeners
document.addEventListener("click", (e) => {
    console.log("Click detected, pointerMode:", pointerMode);
    
    if (pointerMode) {  // Only shoot when pointerMode is active
        disableLinks();

        new Audio('sfx/pistol-shot.mp3').play();
        customCursor.classList.remove("animate");
        void customCursor.offsetWidth;
        customCursor.classList.add("animate");
        floatingImage.style.display = "block";
        const clickedElement = e.target;
        if (
            clickedElement !== customCursor &&
            clickedElement !== floatingImage &&
            clickedElement !== document.body &&
            clickedElement.tagName !== "HTML" &&
            clickedElement.tagName !== "ARTICLE"
        ) {
            clickedElement.classList.add("perish");
            new Audio('sfx/toms-screams.mp3').play();
            clickedElement.style.display = 'none';
            console.log(`Clicked element: ${clickedElement.tagName}`);
        }
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "p" || e.key === "P") { // Use 'p' key to toggle pointer mode
        togglePointerMode();
    }
});   
            function animateElements() {
                cursorX += (targetX - cursorX) * 0.1;
                cursorY += (targetY - cursorY) * 0.1;
                customCursor.style.left = `${targetX}px`;
                customCursor.style.top = `${targetY}px`;
                floatingImage.style.left = `${cursorX}px`;
                floatingImage.style.top = `${cursorY}px`;
                requestAnimationFrame(animateElements);
            }

            animateElements();
            function countdown() {
    const countdownEl = document.getElementById('countdown');

    function getNextBirthday() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const birthdayThisYear = new Date(currentYear, 3, 14); // April 14

        if (
            now.getMonth() === 3 && 
            now.getDate() === 14
        ) {
            return now;
        }

        return now >= birthdayThisYear 
            ? new Date(currentYear + 1, 3, 14) 
            : birthdayThisYear;
    }

    function updateCountdown() {
        const now = new Date();
        const targetDate = getNextBirthday();
        const diff = targetDate - now;

        if (now.getMonth() === 3 && now.getDate() === 14) {
            countdownEl.textContent = "is todayyy!!!1!!!1!!11!! 🔪🔪🎂🎂";
            return;
        }

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        let displayText = '';

        if (months >= 2) {
            displayText = `is in ${months} months`;
        } else if (weeks >= 2) {
            displayText = `is in ${weeks} weeks`;
        } else if (days >= 1) {
            displayText = `is in ${days} days`;
        } else if (hours >= 2) {
            displayText = `is in ${hours} hours and ${minutes} minutes`;
        } else if (minutes >= 2) {
            displayText = `is in ${minutes} minutes and ${seconds} seconds`;
        } else {
            displayText = `is in ${seconds} seconds`;
        }

        countdownEl.textContent = displayText;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
}

countdown();
document.addEventListener('DOMContentLoaded', () => {
    const svgPath = document.getElementById('wavyLinePath');
    // const svgPath2 = document.getElementById('wavyLinePath2'); // Uncomment if using second wave
    const svg = document.getElementById('wavySvg');

    if (!svgPath || !svg) {
        console.error("SVG elements not found for wave animation.");
        return;
    }

    // --- Configuration ---
    const waveConfig = {
        amplitude: 10,      // Max height of the wave peaks from center
        frequency: 0.1,    // How many waves across the width (lower = wider waves)
        phaseShiftSpeed: 0.02, // How fast the wave animates
        points: 60,        // Number of points to define the wave (more = smoother, but more perf cost)
        yOffset: svg.clientHeight / 2 // Vertical center
    };

    // Optional: Config for a second wave (if you uncomment HTML/JS for it)
    /*
    const waveConfig2 = {
        amplitude: 12,
        frequency: 0.025,
        phaseShiftSpeed: 0.07,
        points: 100,
        yOffset: svg.clientHeight / 2 + 5 // Slightly offset
    };
    */

    let currentPhase = 0;
    // let currentPhase2 = Math.PI / 2; // Start second wave at a different phase

    function generateWavePath(config, phase) {
        const width = svg.clientWidth;
        const height = svg.clientHeight; // Re-read in case of resize
        const effectiveYOffset = height / 2; // Recalculate yOffset based on current height

        let pathData = `M 0 ${effectiveYOffset}`; // Start Move To command

        for (let i = 0; i <= config.points; i++) {
            const x = (width / config.points) * i;
            // Sine wave: y = amplitude * sin(frequency * x + phase)
            const y = effectiveYOffset + config.amplitude * Math.sin(x * config.frequency + phase);
            pathData += ` L ${x.toFixed(2)} ${y.toFixed(2)}`; // Line To command
        }
        return pathData;
    }

    function animateWave() {
        // Update phase for animation
        currentPhase += waveConfig.phaseShiftSpeed;
        // currentPhase2 += waveConfig2.phaseShiftSpeed; // Uncomment for second wave

        // Generate new path data
        const newPathData = generateWavePath(waveConfig, currentPhase);
        svgPath.setAttribute('d', newPathData);

        /*
        // Uncomment for second wave
        const newPathData2 = generateWavePath(waveConfig2, currentPhase2);
        svgPath2.setAttribute('d', newPathData2);
        */


        requestAnimationFrame(animateWave); // Loop the animation
    }

    function onResize() {
       
    }

    window.addEventListener('resize', onResize);

   
    if (svg.clientWidth > 0 && svg.clientHeight > 0) {
        animateWave();
    } else {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === svg && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    animateWave();
                    observer.unobserve(svg); // Stop observing once sized and animation started
                    break;
                }
            }
        });
        observer.observe(svg);
    }
});