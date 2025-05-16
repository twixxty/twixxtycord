// Helper function (if not already defined globally or as a method)
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- START OF FUNCTION DEFINITIONS ---
// (All your functions like updateDiscordStatus, fetchAccentColor, initMagneticLinks, etc. should be defined here, OUTSIDE DOMContentLoaded)

function initMagneticLinks() {
    const magneticElements = document.querySelectorAll(
        'article a:not(.card-main-image-link):not([data-icon]):not(.testimonial-author-title a):not(#show-iframe),' + // Links
        'footer #backToTopBtn,' +                 // Back to top button
        '#coolStuffTrigger,' +                    // Cool stuff trigger
        '#pfp,'                                  // Profile picture
    );

    const attractionFactor = 0.20; // Adjusted from 0.50 as it might be too strong
    const maxTranslationText = 5;
    const maxTranslationImage = 8;
    const coolStuffTriggerMaxTranslation = 10;

    magneticElements.forEach(element => {
        let currentMaxTranslation = maxTranslationText;
        let isCoolStuffTrigger = element.id === 'coolStuffTrigger';
        let isImageElement = element.matches('#pfp, .friend-pfp') || isCoolStuffTrigger;

        if (isCoolStuffTrigger) {
            currentMaxTranslation = coolStuffTriggerMaxTranslation;
        } else if (isImageElement) {
            currentMaxTranslation = maxTranslationImage;
        }

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            let dx = mouseX - elementCenterX;
            let dy = mouseY - elementCenterY;

            let magneticTranslateX = dx * attractionFactor;
            let magneticTranslateY = dy * attractionFactor;

            magneticTranslateX = Math.max(-currentMaxTranslation, Math.min(currentMaxTranslation, magneticTranslateX));
            magneticTranslateY = Math.max(-currentMaxTranslation, Math.min(currentMaxTranslation, magneticTranslateY));

            if (isCoolStuffTrigger) {
                element.style.transform = `translateX(-50%) translate(${magneticTranslateX}px, ${magneticTranslateY}px)`;
            } else {
                element.style.transform = `translate(${magneticTranslateX}px, ${magneticTranslateY}px)`;
            }
        });

        element.addEventListener('mouseleave', () => {
            if (isCoolStuffTrigger) {
                element.style.transform = 'translateX(-50%)';
            } else {
                element.style.transform = 'translate(0px, 0px)';
            }
        });
    });
}


async function updateDiscordStatus() {
    const statusElement = document.getElementById("randomText");
    const statusEmoji = document.getElementById("statusEmoji");
    
    try {
      const res = await fetch("https://api.lanyard.rest/v1/users/798177330010521630");
      if (!res.ok) { // Check for non-2xx responses
          console.error("Lanyard API request failed with status:", res.status);
          setRandomText(); // Fallback
          if (statusEmoji) statusEmoji.textContent = "";
          return;
      }
      const data = await res.json();
      if (!data.success || !data.data) { // Check for Lanyard's success flag and data presence
          console.error("Lanyard API call did not succeed or data is missing:", data);
          setRandomText(); // Fallback
          if (statusEmoji) statusEmoji.textContent = "";
          return;
      }
  
      const d = data.data;
  
      if (d.discord_status === "offline") {
          setRandomText();
          if (statusEmoji) statusEmoji.textContent = "";
          return;
      }
      
      const gameActivity = d.activities.find(a => a.type === 0 && a.name !== "Custom Status");
      if (gameActivity) {
        const gameName = gameActivity.name || "a game";
        if (statusElement) statusElement.innerHTML = `🎮 playing <b>${gameName}</b>`;
      } else {
        const customStatus = d.activities.find(a => a.type === 4);
        const emoji = customStatus?.emoji?.name || "";
        const text = customStatus?.state || "";
        if (statusElement) statusElement.textContent = `${emoji ? emoji + " " : ""}${text}`;
        
        if (!customStatus?.state && !customStatus?.emoji?.name) { // If no custom status text/emoji
            if (["online", "idle", "dnd"].includes(d.discord_status)) {
              let presenceEmoji = "";
              let presenceText = "";
              if (d.discord_status === "online") { presenceEmoji = "(•ᴗ•)"; presenceText = "online"; }
              else if (d.discord_status === "idle") { presenceEmoji = "‎꜀( ꜆-ࡇ-)꜆ ᶻ 𝗓 𐰁"; presenceText = "idle"; }
              else if (d.discord_status === "dnd") { presenceEmoji = "( ` ᴖ ´ )"; presenceText = "do not disturb"; }
              if (statusElement) statusElement.textContent = `${presenceEmoji} ${presenceText}`;
            }
        }
      }
    
      let emojiStatusText = "";
      if (gameActivity) emojiStatusText = "🎮";
      else if (d.discord_status === "online") emojiStatusText = "🟢";
      else if (d.discord_status === "idle") emojiStatusText = "🌙";
      else if (d.discord_status === "dnd") emojiStatusText = "⛔";
  
      const onMobile = d.active_on_discord_mobile;
      if (statusEmoji) statusEmoji.textContent = onMobile && d.discord_status === "online" ? `📱` : emojiStatusText;
  
    } catch (err) {
      console.error("Status fetch failed (Lanyard):", err);
      setRandomText(); // Fallback
      if (statusEmoji) statusEmoji.textContent = "";
    }
}

function setRandomText() {
    const statusElement = document.getElementById("randomText");
    if (!statusElement) return;
    const texts = [
        "is eepy...", "is thirsty...", "is not a robot ☑...", "is hungry...",
        "is probably dead...", "is 15...", "is silly...", "is indian...",
        "is a web developer...", "is a video editor...", "is probably playing roblox...",
        "is stupid...", "is a tech nerd...", "is hated by many :c...",
        "is cute :3...", "is cooking...", "is a male...",
        "is secretely evil mr. munchkins man..."
    ];
    statusElement.textContent = texts[Math.floor(Math.random() * texts.length)];
}

async function fetchAccentColor() {
    try {
        const response = await fetch('https://discord-lookup-api-new-liard.vercel.app/v1/user/798177330010521630');
        if (!response.ok) throw new Error(`Discord Lookup API (accent) failed with status: ${response.status}`);
        const data = await response.json();
        if (data.accent_color) {
            document.documentElement.style.setProperty("--accent", `#${data.accent_color.toString(16)}`);
        }
    } catch (error) {
        console.error("Failed to fetch accent color:", error);
    }
}

async function fetchUserData() {
    try {
        const response = await fetch('https://discord-lookup-api-new-liard.vercel.app/v1/user/798177330010521630');
        if (!response.ok) throw new Error(`Discord Lookup API (user data) failed with status: ${response.status}`);
        const data = await response.json();
        const pageTitle = document.getElementById("pageTitle");
        const displayHeader = document.getElementById("displayHeader");

        if (data.global_name && data.username) {
            if (pageTitle) pageTitle.textContent = data.global_name;
            if (displayHeader) displayHeader.innerHTML = `${data.global_name} <br><span style='font-size: 0.6em; color: var(--tapioca);'>(@${data.username})</span>`;
        } else {
            console.warn("User data from Discord API missing global_name or username.");
        }
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

async function fetchProfilePicture() {
    try {
        const response = await fetch('https://discord-lookup-api-new-liard.vercel.app/v1/user/798177330010521630');
         if (!response.ok) throw new Error(`Discord Lookup API (pfp) failed with status: ${response.status}`);
        const data = await response.json();
        const pfp = document.getElementById("pfp");
        if (pfp && data.avatar && data.avatar.link) {
            pfp.src = data.avatar.link;
        } else if (pfp) {
            console.warn("Avatar link missing from Discord API response for PFP.");
            pfp.src = "https://via.placeholder.com/150"; // Fallback
        }
    } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        const pfp = document.getElementById("pfp");
        if (pfp) pfp.src = "https://via.placeholder.com/150"; // Fallback
    }
}

function setRandomAboutText() {
    const aboutElement = document.getElementById("aboutText");
    if (!aboutElement) return;
    const aboutTexts = [
        "Hi! I'm Hammad, a 15 year old web designer/developer. I love making websites and Graphic Designing. I hope to earn some day and inspire others using my skills.",
        "hii im hammad, am 15 and a web designer/developer. i like making websites and can graphic design pretty well. give me money pls (im broke)",
    ];
    aboutElement.textContent = aboutTexts[Math.floor(Math.random() * aboutTexts.length)];
}

function updateIndiaTime() {
    const indiaTimeElement = document.getElementById("indiaTime");
    if (!indiaTimeElement) return;
    const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
    const indiaTime = new Date().toLocaleTimeString("en-IN", options);
    indiaTimeElement.innerText = indiaTime;
}

function updateTimeFunc() {
    const timeFuncElement = document.getElementById("timefunc");
    if (!timeFuncElement) return;
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false };
    const hour = parseInt(new Intl.DateTimeFormat("en-IN", options).format(now));

    let message;
    if (hour >= 6 && hour < 10) message = "probably awake";
    else if (hour >= 10 && hour < 12) message = "defenitely awake";
    else if (hour >= 12 && hour < 15) message = "busy with school";
    else if (hour >= 15 && hour < 16) message = "having lunch and resting";
    else if (hour >= 16 && hour < 19) message = "napping";
    else if (hour >= 19 && hour < 21) message = "busy with home work";
    else if (hour >= 21 && hour < 22) message = "having dinner";
    else if (hour >= 22 && hour < 24) message = "available";
    else message = "sleeping";
    timeFuncElement.innerText = message;
}


const friendsList = [
    { id: "1108071513493614592", username: "Friend 1", sfx: "sounds/george.mp3" },
    { id: "916205370416975893", username: "Friend 2", sfx: "sounds/sirius.mp3" },
    { id: "860917681879253002", username: "Friend 3", sfx: "sounds/dhiren.mp3" },
    { id: "1256930587684634674", username: "Friend 4", sfx: "sounds/ladybug.mp3" },
    { id: "735955748579836025", username: "Friend 5", sfx: "sounds/penny.mp3" }
];
const moreFriendsList = [
    { id: "929308666606272563", username: "Friend A", sfx: "sounds/abhi.mp3" },
    { id: "1089305664108634162", username: "Friend B", sfx: "sounds/mijo.mp3" },
    { id: "1081451019260678245", username: "Friend C", sfx: "sounds/vro.mp3" },
    { id: "922389987889143849", username: "Friend D", sfx: "sounds/sounak.mp3" },
    { id: "852730635063656462", username: "Friend E", sfx: "sounds/lemon.mp3" }
];

async function populateFriends(containerId, friendArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    
    for (const friend of friendArray) {
        try {
            const response = await fetch(`https://discord-lookup-api-one-coral.vercel.app/v1/user/${friend.id}`);
            if (!response.ok) throw new Error(`Friend API for ${friend.id} failed: ${response.status}`);
            const data = await response.json();
            
            const friendDiv = document.createElement("div");
            friendDiv.classList.add("friend");
            friendDiv.dataset.username = data.global_name || data.username || friend.username;
            
            const img = document.createElement("img");
            img.src = data.avatar && data.avatar.link ? data.avatar.link : "https://via.placeholder.com/50"; // Placeholder
            img.alt = friendDiv.dataset.username;
            img.classList.add("friend-pfp");
            
            img.addEventListener("click", () => {
                if (friend.sfx) {
                    new Audio(friend.sfx).play().catch(e => console.error("Error playing friend sfx:", e));
                }
            });
            
            friendDiv.appendChild(img);
            container.appendChild(friendDiv);
        } catch (error) {
            console.error(`Failed to fetch/populate friend data for ${friend.id}:`, error);
            // Optionally add a fallback UI element to the container for this friend
        }
    }
    setupFriendHoverEffects(container);
    initMagneticLinks(); // Re-apply magnetic effect after new .friend-pfp elements are added
}

function setupFriendHoverEffects(container) {
    const friendsInContainer = container.querySelectorAll(".friend");
    friendsInContainer.forEach((friend) => {
        friend.addEventListener("mouseover", () => {
            friendsInContainer.forEach(f => f.classList.remove("active", "previous", "previous-2", "previous-3", "previous-4", "next", "next-2", "next-3", "next-4"));
            friend.classList.add("active");
            let current = friend;
            for (let i = 1; i <= 4; i++) {
                current = current.previousElementSibling;
                if (current && current.classList.contains('friend')) current.classList.add(`previous${i > 1 ? '-' + i : ''}`); else break;
            }
            current = friend;
            for (let i = 1; i <= 4; i++) {
                current = current.nextElementSibling;
                if (current && current.classList.contains('friend')) current.classList.add(`next${i > 1 ? '-' + i : ''}`); else break;
            }
        });
    });
}

function fetchFriends() { populateFriends("friendsContainer", friendsList); }
function fetchMoreFriends() { populateFriends("morefriendsContainer", moreFriendsList); }


function setupCoolStuffInteractions() {
    const images = [ "images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg", "images/9.jpg", "images/10.jpg", "images/11.jpg", "images/12.jpg", "images/13.jpg", "images/14.jpg", "images/15.jpg", "images/16.jpg", "images/17.jpg", "images/18.jpg" ];
    const videos = [ "videos/video1.mp4", "videos/1 (1).mp4", "videos/1 (2).mp4", "videos/1 (3).mp4", "videos/1 (4).mp4", "videos/1 (5).mp4", "videos/1 (6).mp4", "videos/1 (7).mp4", "videos/1 (8).mp4", "videos/1 (9).mp4", "videos/1 (10).mp4", "videos/1 (11).mp4", "videos/1 (12).mp4", "videos/1 (13).mp4", "videos/1 (14).mp4", "videos/1 (15).mp4", "videos/1 (17).mp4", "videos/1 (18).mp4", "videos/1 (19).mp4", "videos/1 (20).mp4", "videos/1 (21).mp4", "videos/1 (22).mp4", "videos/1 (23).mp4", "videos/1 (24).mp4", "videos/1 (25).mp4", "videos/1 (26).mp4", "videos/1 (27).mp4", "videos/1 (28).mp4", "videos/1 (30).mp4", "videos/1 (31).mp4", "videos/1 (32).mp4", "videos/1 (33).mp4", "videos/1 (34).mp4", "videos/1 (35).mp4", "videos/1 (36).mp4", "videos/1 (37).mp4", "videos/1 (38).mp4", "videos/1 (39).mp4", "videos/1 (40).mp4", "videos/1 (41).mp4", "videos/1 (42).mp4", "videos/1 (43).mp4", "videos/1 (45).mp4", "videos/1 (46).mp4", "videos/1 (47).mp4", "videos/1 (48).mp4", "videos/1 (49).mp4", "videos/1 (50).mp4", "videos/1 (52).mp4", "videos/1 (53).mp4", "videos/1 (54).mp4", "videos/1 (55).mp4", "videos/1 (56).mp4", "videos/1 (57).mp4", "videos/1 (58).mp4", "videos/1 (59).mp4", "videos/1 (61).mp4", "videos/1 (62).mp4", "videos/1 (64).mp4", "videos/1 (65).mp4", "videos/1 (66).mp4", "videos/1 (67).mp4", "videos/1 (68).mp4", "videos/1 (69).mp4", "videos/1 (70).mp4", "videos/1 (71).mp4", "videos/1 (72).mp4", "videos/1 (73).mp4", "videos/1 (74).mp4", "videos/1 (75).mp4", "videos/1 (76).mp4", "videos/1 (77).mp4", "videos/1 (78).mp4", "videos/1 (79).mp4", "videos/1 (80).mp4", "videos/1 (81).mp4", "videos/1 (82).mp4", "videos/1 (83).mp4", "videos/1 (84).mp4", "videos/1 (85).mp4", "videos/1 (86).mp4", "videos/1 (87).mp4", "videos/1 (88).mp4", "videos/1 (89).mp4", "videos/1 (90).mp4", "videos/1 (91).mp4", "videos/1 (92).mp4" ];
    const sound = "sounds/click.mp3";

    const imageElement = document.getElementById("randomImage");
    const imageOverlay = document.getElementById("imageOverlay");
    const videoTrigger = document.getElementById("videoTrigger");
    const randomVideoElement = document.getElementById("randomVideo");
    const coolVideo = document.getElementById("coolVideo");
    const fullscreenTrigger = document.getElementById("fullscreenTrigger");
    const fullscreenVideo = document.getElementById("fullscreenVideo");
    const fullscreenVideos = ["videos/oia.mp4"];

    if (imageElement && imageOverlay) {
        imageElement.addEventListener("click", () => {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            imageOverlay.src = randomImage;
            imageOverlay.style.display = "block";
            new Audio(sound).play();
            imageElement.style.pointerEvents = "none";
            imageOverlay.classList.add("animate-overlay");
            setTimeout(() => {
                imageOverlay.classList.remove("animate-overlay");
                imageOverlay.style.display = "none";
                imageElement.style.pointerEvents = "auto";
            }, 1500);
        });
    }

    if (videoTrigger && randomVideoElement) {
        videoTrigger.addEventListener("click", () => {
            const randomVidSrc = videos[Math.floor(Math.random() * videos.length)];
            randomVideoElement.src = randomVidSrc;
            randomVideoElement.style.display = "block";
            randomVideoElement.play();
            videoTrigger.style.display = "none";
        });
        randomVideoElement.addEventListener("pause", () => {
            randomVideoElement.style.display = "none";
            if(videoTrigger) videoTrigger.style.display = "block";
        });
         randomVideoElement.addEventListener("ended", () => {
            randomVideoElement.style.display = "none";
            if(videoTrigger) videoTrigger.style.display = "block";
        });
    }
    
    if (coolVideo) {
        coolVideo.addEventListener("click", () => { if (coolVideo.paused) coolVideo.play(); });
        coolVideo.addEventListener("pause", () => { coolVideo.style.display = "none"; });
        coolVideo.addEventListener("ended", () => { coolVideo.style.display = "none"; });
        coolVideo.addEventListener("play", () => { coolVideo.style.display = "block"; });
    }

    if (fullscreenTrigger && fullscreenVideo) {
        fullscreenTrigger.addEventListener("click", () => {
            const randomVidSrc = fullscreenVideos[Math.floor(Math.random() * fullscreenVideos.length)];
            fullscreenVideo.src = randomVidSrc;
            fullscreenVideo.style.display = "block";
            fullscreenVideo.play();
        });
        fullscreenVideo.addEventListener("click", () => { fullscreenVideo.pause(); });
        fullscreenVideo.addEventListener("pause", () => { fullscreenVideo.style.display = "none"; });
        fullscreenVideo.addEventListener("ended", () => { fullscreenVideo.style.display = "none"; });
    }
}

function setupCaseOh() {
    const caseohVisible = document.getElementById("caseohVisible");
    const caseohHidden = document.getElementById("caseohHidden");
    if (!caseohVisible || !caseohHidden) return;

    let dx = 3, dy = 3;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    const images = ["images/caseoh.jpg","images/caseoh1.webp", "images/caseoh2.webp", "images/caseoh3.webp","images/caseoh4.webp","images/caseoh5.webp","images/caseoh6.jpg"];
    let imageIndex = 0;
    let animationInterval;
    let currentBlur = 0;
    
    function updateBounds() { return { width: window.innerWidth, height: window.innerHeight }; }
    let bounds = updateBounds();
    window.addEventListener("resize", () => { bounds = updateBounds(); });

    caseohVisible.addEventListener("click", function () {
        caseohVisible.style.display = "none";
        caseohHidden.style.display = "block";
        caseohHidden.style.left = `${x}px`;
        caseohHidden.style.top = `${y}px`;
        if (animationInterval) clearInterval(animationInterval);
        currentBlur = 0; // Reset blur when game starts
        document.querySelector("main").style.filter = "blur(0px)"; // Clear previous blur
        animateCaseoh();
    });

    function playCaseOhSoundAndBlur() {
        new Audio("sounds/stomp.mp3").play();
        currentBlur += 2;
        document.querySelector("main").style.filter = `blur(${currentBlur}px)`;
    }

    function changeImageAndEffects() {
        imageIndex = (imageIndex + 1) % images.length;
        caseohHidden.src = images[imageIndex];
        playCaseOhSoundAndBlur();
    }

    function animateCaseoh() {
        animationInterval = setInterval(() => {
            x += dx; y += dy;
            if (x + caseohHidden.offsetWidth >= bounds.width || x <= 0) {
                dx = -dx; changeImageAndEffects();
                x = Math.max(0, Math.min(x, bounds.width - caseohHidden.offsetWidth));
            }
            if (y + caseohHidden.offsetHeight >= bounds.height || y <= 0) {
                dy = -dy; changeImageAndEffects();
                y = Math.max(0, Math.min(y, bounds.height - caseohHidden.offsetHeight));
            }
            caseohHidden.style.left = `${x}px`; caseohHidden.style.top = `${y}px`;
        }, 20);
    }
}

function setupChaseGame() {
    const startChase = document.getElementById("startChase");
    const chaseImage = document.getElementById("chaseImage");
    const timerElement = document.getElementById("timer");
    const jumpscareDiv = document.getElementById("jumpscare"); // Renamed to avoid conflict
    const scaryImage = document.getElementById("scaryImage");
    const scarySound = document.getElementById("scarySound");
    const mainElement = document.querySelector("main");

    if (!startChase || !chaseImage || !timerElement || !jumpscareDiv || !scaryImage || !scarySound || !mainElement) return;

    let chasing = false, speed = 1, seconds = 0, interval, mouseMoving = false, gameActive = false;

    startChase.addEventListener("click", () => {
        if (gameActive) return; gameActive = true;
        startChase.style.display = "none";
        mainElement.style.setProperty('filter', 'blur(10px) brightness(0.5)', 'important');
        mainElement.style.pointerEvents = "none";
        
        setTimeout(() => {
            chaseImage.style.top = Math.random() * (window.innerHeight - chaseImage.offsetHeight) + "px";
            chaseImage.style.left = Math.random() * (window.innerWidth - chaseImage.offsetWidth) + "px";
            chaseImage.style.display = "block";
            chasing = true; seconds = 0; speed = 1;
            timerElement.innerText = "0s"; timerElement.style.display = "block";
            if(interval) clearInterval(interval);
            interval = setInterval(() => {
                if (mouseMoving && chasing) {
                    seconds++; timerElement.innerText = seconds + "s"; speed += 0.5;
                }
            }, 1000);
        }, 500);
    });

    document.addEventListener("mousemove", (event) => {
        mouseMoving = true; setTimeout(() => mouseMoving = false, 200);
        if (chasing && gameActive) {
            const rect = chaseImage.getBoundingClientRect();
            const dx = event.clientX - (rect.left + rect.width / 2);
            const dy = event.clientY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
                clearInterval(interval); chasing = false;
                jumpscareDiv.style.display = "flex"; scaryImage.style.opacity = "1"; scarySound.play();
                setTimeout(() => {
                    scaryImage.style.opacity = "0";
                    setTimeout(() => {
                        jumpscareDiv.style.display = "none";
                        timerElement.style.display = "none"; timerElement.innerText = "";
                        startChase.style.display = "block"; chaseImage.style.display = "none";
                        mainElement.style.filter = "none"; mainElement.style.pointerEvents = "auto";
                        gameActive = false;
                    }, 500);
                }, 500);
            } else {
                 let newLeft = parseFloat(chaseImage.style.left || "0") + (dx / distance * speed);
                 let newTop = parseFloat(chaseImage.style.top || "0") + (dy / distance * speed);
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - chaseImage.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - chaseImage.offsetHeight));
                chaseImage.style.left = newLeft + "px"; chaseImage.style.top = newTop + "px";
            }
        }
    });
}

function setupModeToggles() {
    const retroMode = document.getElementById("retroMode");
    const gtaMode = document.getElementById("gtaMode");
    const classicMode = document.getElementById("classicMode");
    const refresh = document.getElementById("refresh");
    const retrosus = document.getElementById("retrosus");
    const toggleImage = document.getElementById('dark-mode-toggle');

    function applyGlobalStyles(styles) {
        document.querySelectorAll("button, img, a, h1, h2, h3, video, p, div, span, li, article, header, footer, section, aside, nav, input, main, body, html").forEach(el => {
            for (const prop in styles) {
                el.style.setProperty(prop, styles[prop], 'important');
            }
        });
    }
    
    if (retroMode) retroMode.addEventListener("click", (e) => {
        e.preventDefault();
        if(retrosus) retrosus.play();
        if(gtaMode) gtaMode.style.display = 'inline-block';
        retroMode.style.display = 'none';
        if(toggleImage) toggleImage.style.display = 'none';
        applyGlobalStyles({
            'background': '#ff69b4', 'color': 'white', 'font-family': "'comic', cursive",
            'text-shadow': '2px 2px 2px black', 'border': '3px solid red',
            'text-decoration': 'underline wavy'
        });
        document.body.style.background = "#0000FF"; // Specific for body
        document.documentElement.style.background = '#ff69b4';
        document.querySelector('main').style.filter = "blur(0.6px)";
    });

    if (gtaMode) gtaMode.addEventListener('click', (e) => {
        e.preventDefault();
        new Audio('sounds/gta-menu.mp3').play();
        gtaMode.style.display = 'none';
        if(classicMode) classicMode.style.display = 'inline-block';
        applyGlobalStyles({
            'background': 'transparent', 'color': '#9bb2d6', 'font-family': "'sant', sans-serif",
            'text-shadow': '2px 2px 2px black', 'border': '0px solid red',
            'text-decoration': 'none'
        });
        document.body.style.background = 'url("images/gta-bg.jpg") no-repeat center center fixed';
        document.body.style.backgroundSize = 'cover';
        document.documentElement.style.background = 'black';
         document.querySelector('main').style.filter = "blur(0.6px)";
    });

    if (classicMode) classicMode.addEventListener('click', (e) => {
        e.preventDefault();
        new Audio('sounds/vintage.mp3').play();
        classicMode.style.display = 'none';
        if(refresh) refresh.style.display = 'inline-block';
         applyGlobalStyles({
            'background': '#212529', 'color': '#B5828C', 'font-family': "'vintage', serif",
            'text-shadow': '0px 0px 0px black', 'border': '0px solid red',
            'text-decoration': 'none'
        });
        document.documentElement.style.background = '#212529';
        document.querySelector('main').style.filter = "blur(0px)";
    });
    
    if (refresh) refresh.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector("main").style.filter = "blur(700px)";
        new Audio('sounds/bye.mp3').play();
        setTimeout(() => location.reload(), 2000);
    });
}


function toggleTheme() {
    const toggleImage = document.getElementById('dark-mode-toggle');
    const isCurrentlyDark = !document.body.classList.contains('light-mode');
    const mainContent = document.querySelector("main");

    const fullScreenImage = document.createElement('div');
    fullScreenImage.classList.add('full-screen-image');
    fullScreenImage.style.backgroundImage = 'url(images/think.webp)';
    document.body.appendChild(fullScreenImage);
    new Audio('sounds/light.mp3').play();

    setTimeout(() => {
        if (isCurrentlyDark) { // To Light Mode
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            document.body.style.backgroundColor = "#FFFFFF";
            document.documentElement.style.backgroundColor = "#FFFFFF";
            if (toggleImage) { toggleImage.style.backgroundColor = "#FFF"; toggleImage.src = 'images/sunny.png';}
        } else { // To Dark Mode
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            document.body.style.backgroundColor = ""; 
            document.documentElement.style.backgroundColor = "";
            if (toggleImage) { toggleImage.style.backgroundColor = "#111"; toggleImage.src = 'images/moon.png';}
        }
        if(mainContent) mainContent.style.filter = "blur(2px)";
        setTimeout(() => { if(mainContent) mainContent.style.filter = "blur(0px)"; }, 1500);

        fullScreenImage.style.opacity = 0;
        setTimeout(() => { if (fullScreenImage.parentNode) fullScreenImage.remove(); }, 1000);
    }, 100);
}


function setupSigmaVideo() {
    const video = document.getElementById('sigma');
    const keywordInput = document.getElementById('keyword-input');
    if (!video || !keywordInput) return;
    const playKeywords = ['yes', 'sure', 'ye', 'yep', 'of course', 'ofc', 'ya', 'agree'];
    keywordInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {  
        event.preventDefault();
        const inputValue = keywordInput.value.toLowerCase().trim();
        if (playKeywords.includes(inputValue) && video.paused) {
          video.style.display = 'block'; video.play();
          keywordInput.disabled = true; keywordInput.placeholder = 'tanks vro :3'; keywordInput.value = '';
        } else { keywordInput.value = ''; }
      }
    });
    video.addEventListener('click', () => video.paused ? video.play() : video.pause());
    video.addEventListener('pause', () => video.style.display = 'none');
    video.addEventListener('ended', () => video.style.display = 'none');
}

function setupTOSIframe() {
    const link = document.getElementById('show-iframe');
    const mainContent = document.querySelector('main');
    if (!link || !mainContent) return;
    link.addEventListener('click', function(event) {
      event.preventDefault(); mainContent.style.filter = 'blur(70px)';
      const overlay = document.createElement('div'); overlay.id = 'overlay-iframe';
      const iframe = document.createElement('iframe');
      iframe.src = 'https://twixxt.vercel.app/tos.html'; iframe.title = 'Terms of Service';
      overlay.appendChild(iframe); document.body.appendChild(overlay);
      overlay.addEventListener('click', function() {
        iframe.style.transform = 'translateX(-50%) scale(0)';
        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            mainContent.style.filter = 'none';
        }, 500);
      });
    });
}

function setupGunMode() {
    const gunImageToggle = document.getElementById("gunimg"); // Renamed for clarity
    const customCursor = document.getElementById("customCursor");
    const floatingGunImg = document.getElementById("floatingImage"); // Renamed for clarity
    if (!gunImageToggle || !customCursor || !floatingGunImg) return;

    let pointerModeActive = false;
    let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0, lastX = 0;
    let animationFrameRequest;

    function animateGunCursor() {
        cursorX += (targetX - cursorX) * 0.2; cursorY += (targetY - cursorY) * 0.2;
        customCursor.style.left = `${targetX}px`; customCursor.style.top = `${targetY}px`;
        floatingGunImg.style.left = `${cursorX}px`; floatingGunImg.style.top = `${cursorY}px`;
        const velocity = targetX - lastX; const rotation = velocity * 1.5;
        customCursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0.8)`;
        floatingGunImg.style.transform = `translate(-50%, -20%) rotate(${rotation}deg)`;
        lastX = targetX;
        if (pointerModeActive) animationFrameRequest = requestAnimationFrame(animateGunCursor);
    }
    
    gunImageToggle.addEventListener("click", () => {
        pointerModeActive = !pointerModeActive;
        if (pointerModeActive) {
            new Audio('sfx/doom-eternal.mp3').play();
            document.body.classList.add("no-pointer");
            customCursor.style.display = "block"; floatingGunImg.style.display = "block";
            disablePageLinks();
            if (animationFrameRequest) cancelAnimationFrame(animationFrameRequest);
            animateGunCursor();
        } else {
            document.body.classList.remove("no-pointer");
            customCursor.style.display = "none"; floatingGunImg.style.display = "none";
            enablePageLinks();
            if (animationFrameRequest) cancelAnimationFrame(animationFrameRequest);
        }
    });

    document.addEventListener("mousemove", (e) => { targetX = e.clientX; targetY = e.clientY; });

    document.addEventListener("click", (e) => {
        if (pointerModeActive) {
            e.preventDefault(); e.stopPropagation();
            new Audio('sfx/pistol-shot.mp3').play();
            customCursor.classList.remove("animate"); void customCursor.offsetWidth; customCursor.classList.add("animate");
            const clickedElement = e.target;
            if (clickedElement && clickedElement !== document.body && clickedElement.tagName !== "HTML" &&
                !clickedElement.closest('#bottomTray') &&
                clickedElement !== gunImageToggle && clickedElement !== customCursor && clickedElement !== floatingGunImg) 
            {
                clickedElement.classList.add("hit-by-gun"); // CSS can style this, e.g., opacity: 0.5;
            }
        }
    });
    
    document.addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "p") gunImageToggle.click(); });

    const pageLinks = new Map();
    function disablePageLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.getAttribute('href')) { pageLinks.set(link, link.getAttribute('href')); link.removeAttribute('href');}
        });
    }
    function enablePageLinks() {
        pageLinks.forEach((href, link) => link.setAttribute('href', href));
        pageLinks.clear();
    }
}


function countdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    function getNextBirthday() { /* ... (same as before) ... */ 
        const now = new Date(); const currentYear = now.getFullYear();
        const birthdayThisYear = new Date(currentYear, 3, 14);
        if (now.getMonth() === 3 && now.getDate() === 14) return now;
        return now >= birthdayThisYear ? new Date(currentYear + 1, 3, 14) : birthdayThisYear;
    }
    function updateCountdown() { /* ... (same as before, ensures countdownEl exists before using) ... */
        if (!countdownEl) return;
        const now = new Date(); const targetDate = getNextBirthday(); const diff = targetDate - now;
        if (now.getMonth() === 3 && now.getDate() === 14) { countdownEl.textContent = "is todayyy!!!1!!!1!!11!! 🔪🔪🎂🎂"; return; }
        const s = Math.floor((diff / 1000) % 60), m = Math.floor((diff / (1000 * 60)) % 60), h = Math.floor((diff / (1000 * 60 * 60)) % 24), d = Math.floor(diff / (1000 * 60 * 60 * 24)), w = Math.floor(d / 7), mo = Math.floor(d / 30.4375);
        let disp = '';
        if (mo >= 2) disp = `is in ${mo} months`; else if (w >= 2) disp = `is in ${w} weeks`; else if (d >= 1) disp = `is in ${d} days, ${h}h`; else if (h >= 1) disp = `is in ${h}h, ${m}m`; else if (m >= 1) disp = `is in ${m}m, ${s}s`; else disp = `is in ${s} seconds`;
        countdownEl.textContent = disp;
    }
    setInterval(updateCountdown, 1000); updateCountdown();
}

function initWavyDivider() {
    const allDividers = document.querySelectorAll('.dynamic-wavy-divider-container'); // Select all
    if (allDividers.length === 0) { console.warn("No wavy SVG dividers found."); return; }

    allDividers.forEach(container => {
        const svg = container.querySelector('svg');
        const svgPath = svg ? svg.querySelector('path') : null;
        if (!svg || !svgPath) { console.error("Wavy SVG or path not found in a container.", container); return; }

        const waveConfig = { amplitude: 10, frequency: 0.1, phaseShiftSpeed: 0.02, points: 100 };
        let currentPhase = Math.random() * Math.PI * 2; // Randomize start phase for each

        function generateWavePath() {
            const width = svg.clientWidth; const height = svg.clientHeight;
            if (width === 0 || height === 0) return `M 0 ${height/2}`;
            const effectiveYOffset = height / 2; let pathData = `M 0 ${effectiveYOffset}`;
            for (let i = 0; i <= waveConfig.points; i++) {
                const x = (width / waveConfig.points) * i;
                const y = effectiveYOffset + waveConfig.amplitude * Math.sin(x * waveConfig.frequency + currentPhase);
                pathData += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
            }
            return pathData;
        }
        function animateWave() {
            currentPhase += waveConfig.phaseShiftSpeed;
            svgPath.setAttribute('d', generateWavePath());
            requestAnimationFrame(animateWave);
        }
        if (svg.clientWidth > 0 && svg.clientHeight > 0) animateWave();
        else {
            const observer = new ResizeObserver(entries => {
                if (entries[0].target === svg && entries[0].contentRect.width > 0 && entries[0].contentRect.height > 0) {
                    animateWave(); observer.unobserve(svg);
                }
            });
            observer.observe(svg);
        }
    });
}


function initProjectScrollNumber() {
    const projects = Array.from(document.querySelectorAll('.project-item'));
    const numberIndicator = document.querySelector('.project-number-indicator');
    if (!projects.length || !numberIndicator) return;
    const numberSlotHeightRem = 4; 
    numberIndicator.innerHTML = ''; numberIndicator.style.display = 'flex'; numberIndicator.style.alignItems = 'center';
    const staticZero = document.createElement('div'); staticZero.classList.add('static-project-zero'); staticZero.textContent = '0';
    const dynamicDigitsReelContainer = document.createElement('div'); dynamicDigitsReelContainer.classList.add('dynamic-digits-reel-container');
    const dynamicDigitsReelInnerEl = document.createElement('div'); dynamicDigitsReelInnerEl.classList.add('dynamic-digits-reel-inner');
    dynamicDigitsReelInnerEl.style.transition = 'transform 0.15s ease-out';
    projects.forEach((project, index) => { /* ... (same as before) ... */
        const projectIdFull = project.dataset.projectId || String(index + 1).padStart(2, '0');
        const dynamicDigit = projectIdFull.length > 1 ? projectIdFull.substring(1) : projectIdFull; 
        const digitSlot = document.createElement('div'); digitSlot.classList.add('dynamic-digit-only-slot');
        digitSlot.textContent = dynamicDigit; dynamicDigitsReelInnerEl.appendChild(digitSlot);
    });
    dynamicDigitsReelContainer.appendChild(dynamicDigitsReelInnerEl);
    numberIndicator.appendChild(staticZero); numberIndicator.appendChild(dynamicDigitsReelContainer);
    let currentActiveProjectIndex = -1;
    function updateActiveProjectBasedOnScroll() { /* ... (same as before, ensure numberIndicator.offsetHeight check is safe) ... */
        const viewportCenterY = window.innerHeight / 2; let bestMatchIndex = -1; let minAbsDistanceToCenter = Infinity;
        const indicatorHeight = numberIndicator ? numberIndicator.offsetHeight : 80; // Fallback height
        projects.forEach((project, index) => {
            const rect = project.getBoundingClientRect();
            if (rect.bottom > indicatorHeight && rect.top < window.innerHeight) {
                const projectCenterY = rect.top + rect.height / 2;
                const absDistance = Math.abs(projectCenterY - viewportCenterY);
                if (absDistance < minAbsDistanceToCenter) { minAbsDistanceToCenter = absDistance; bestMatchIndex = index; }
            }
        });
        if (bestMatchIndex !== -1 && bestMatchIndex !== currentActiveProjectIndex) {
            currentActiveProjectIndex = bestMatchIndex;
            const translateY = currentActiveProjectIndex * -numberSlotHeightRem;
            dynamicDigitsReelInnerEl.style.transform = `translateY(${translateY}rem)`;
        }
    }
    if (window.lenisInstance && typeof window.lenisInstance.on === 'function') window.lenisInstance.on('scroll', updateActiveProjectBasedOnScroll);
    else { let scrollTimeout; window.addEventListener('scroll', () => { clearTimeout(scrollTimeout); scrollTimeout = setTimeout(updateActiveProjectBasedOnScroll, 50); }, { passive: true }); }
    setTimeout(updateActiveProjectBasedOnScroll, 250);
}

function initStylishCardHoverEffect() {
    const cardImageWrappers = document.querySelectorAll('.card-main-image-wrapper');
    cardImageWrappers.forEach(wrapper => { /* ... (same as before, ensure viewIndicator.offsetWidth/Height check is safe) ... */
        const viewIndicator = wrapper.querySelector('.card-view-box-indicator');
        if (!viewIndicator) return;
        let currentX = 0, currentY = 0, targetX = 0, targetY = 0; const easingFactor = 0.15; let animationFrameId = null;
        function animateIndicator() {
            currentX += (targetX - currentX) * easingFactor; currentY += (targetY - currentY) * easingFactor;
            viewIndicator.style.left = `${currentX}px`; viewIndicator.style.top = `${currentY}px`;
            if (wrapper.matches(':hover')) animationFrameId = requestAnimationFrame(animateIndicator);
            else { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        }
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const indicatorWidth = viewIndicator ? viewIndicator.offsetWidth : 0;
            const indicatorHeight = viewIndicator ? viewIndicator.offsetHeight : 0;
            targetX = e.clientX - rect.left - (indicatorWidth / 2);
            targetY = e.clientY - rect.top - (indicatorHeight / 2);
            if (!animationFrameId && wrapper.matches(':hover')) animationFrameId = requestAnimationFrame(animateIndicator);
        });
        wrapper.addEventListener('mouseenter', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const indicatorWidth = viewIndicator ? viewIndicator.offsetWidth : 0;
            const indicatorHeight = viewIndicator ? viewIndicator.offsetHeight : 0;
            currentX = e.clientX - rect.left - (indicatorWidth / 2); currentY = e.clientY - rect.top - (indicatorHeight / 2);
            targetX = currentX; targetY = currentY;
            viewIndicator.style.left = `${currentX}px`; viewIndicator.style.top = `${currentY}px`;
            if (!animationFrameId) animationFrameId = requestAnimationFrame(animateIndicator);
        });
        wrapper.addEventListener('mouseleave', () => { if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }});
    });
}


function initCoolStuffTray() {
    const coolStuffTrigger = document.getElementById('coolStuffTrigger');
    const bottomTray = document.getElementById('bottomTray');
    const trayBackgroundOverlay = document.getElementById('trayBackgroundOverlay');
    if (!coolStuffTrigger || !bottomTray || !trayBackgroundOverlay) return;
    coolStuffTrigger.addEventListener('click', () => { /* ... (same as before, ensure bottomTray.offsetHeight check is safe) ... */
        const isOpen = bottomTray.classList.contains('open');
        if (isOpen) {
            bottomTray.classList.remove('open'); trayBackgroundOverlay.classList.remove('active');
            document.body.classList.remove('tray-open'); coolStuffTrigger.style.bottom = '20px';
        } else {
            bottomTray.classList.add('open'); trayBackgroundOverlay.classList.add('active');
            document.body.classList.add('tray-open');
            const trayHeight = bottomTray ? bottomTray.offsetHeight : 200; // Fallback height
            coolStuffTrigger.style.bottom = `calc(${trayHeight}px + 20px)`; 
        }
    });
    trayBackgroundOverlay.addEventListener('click', () => { if (bottomTray.classList.contains('open')) coolStuffTrigger.click(); });
}

function initBackToTop() {
    const backToTopButton = document.getElementById('backToTopBtn');
    if (backToTopButton) backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initTestimonialSlider() {
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (!testimonialsSection) return;
    const testimonialItems = Array.from(testimonialsSection.querySelectorAll('.testimonial-item'));
    const prevButton = document.getElementById('testimonialPrev'); const nextButton = document.getElementById('testimonialNext');
    if (testimonialItems.length === 0) return;
    let currentTestimonialIndex = 0, isDesktopMode = false, isAnimating = false; const animationDuration = 500;
    function setMode() { /* ... (same as before) ... */
        const newIsDesktopMode = window.innerWidth > 768;
        if (newIsDesktopMode === isDesktopMode && testimonialsSection.dataset.modeInitialized === 'true') return;
        isDesktopMode = newIsDesktopMode; testimonialsSection.dataset.modeInitialized = 'true';
        testimonialsSection.classList.toggle('desktop-mode', isDesktopMode); testimonialsSection.classList.toggle('mobile-mode', !isDesktopMode);
        testimonialItems.forEach(item => item.classList.remove('active', 'is-leaving', 'is-entering'));
        if (isDesktopMode && testimonialItems.length > 0) testimonialItems[currentTestimonialIndex].classList.add('active');
    }
    function showTestimonialDesktop(newIndex) { /* ... (same as before) ... */
        if (isAnimating || newIndex === currentTestimonialIndex) return; isAnimating = true;
        const oldItem = testimonialItems[currentTestimonialIndex]; const newItem = testimonialItems[newIndex];
        if (oldItem) { oldItem.classList.add('is-leaving'); oldItem.classList.remove('active'); }
        newItem.classList.remove('is-leaving'); newItem.classList.add('is-entering');
        void newItem.offsetWidth; newItem.classList.add('active'); newItem.classList.remove('is-entering');
        currentTestimonialIndex = newIndex;
        setTimeout(() => { if (oldItem) oldItem.classList.remove('is-leaving'); isAnimating = false; }, animationDuration + 50);
    }
    setMode(); window.addEventListener('resize', setMode);
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => { if (isDesktopMode) showTestimonialDesktop((currentTestimonialIndex - 1 + testimonialItems.length) % testimonialItems.length); });
        nextButton.addEventListener('click', () => { if (isDesktopMode) showTestimonialDesktop((currentTestimonialIndex + 1) % testimonialItems.length); });
    } else if (isDesktopMode && testimonialItems.length > 0) testimonialItems[0].classList.add('active');
}

// --- END OF FUNCTION DEFINITIONS ---


// --- START OF DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize SVG icons for links
    const linksWithIcons = document.querySelectorAll('.connections-column a[data-icon]');
    linksWithIcons.forEach(link => {
        const iconUrl = link.dataset.icon;
        if (iconUrl) {
            fetch(iconUrl)
                .then(response => response.ok ? response.text() : Promise.reject(`SVG fetch failed: ${response.status}`))
                .then(svgText => {
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                    const svgElement = svgDoc.querySelector('svg');
                    if (svgElement) {
                        svgElement.classList.add('icon'); svgElement.setAttribute('aria-hidden', 'true');
                        link.prepend(svgElement);
                    } else { console.warn("Parsed SVG element not found in:", iconUrl); }
                }).catch(error => console.error('Error fetching/parsing SVG:', error));
        }
    });

    // Cool stuff trigger button visibility
    const triggerButton = document.querySelector('.cool-stuff-trigger-button');
    if (triggerButton) setTimeout(() => triggerButton.classList.add('is-visible'), 4000);
    else console.warn('Cool stuff trigger button not found.');

    // Lanyard/Discord Status Update
    updateDiscordStatus(); // Initial call
    setInterval(updateDiscordStatus, 30000); // Then every 30s

    // Accent Color, User Data, PFP Fetches
    fetchAccentColor();
    fetchUserData();
    fetchProfilePicture();

    // Static random text setups
    setRandomAboutText();
    const randomMessages = ["a human from india", "habibi welcome to india", "am indian", "india time lol", "am a sussy indian"];
    const randomConnections = ["connections", "my accounts", "my stuff", "contact me lol", "also found here"];
    const randomMsgEl = document.getElementById("randomMessage");
    const connectionsEl = document.getElementById("connections");
    if(randomMsgEl) randomMsgEl.innerText = getRandomItem(randomMessages);
    if(connectionsEl) connectionsEl.innerText = getRandomItem(randomConnections);
    
    // Time updates
    updateIndiaTime(); setInterval(updateIndiaTime, 1000);
    updateTimeFunc(); setInterval(updateTimeFunc, 1000);

    // Loading Animation Sequence
    const overlayTextElement = document.getElementById("overlayText");
    const pageLoadOverlay = document.getElementById('pageLoadOverlay');
    const mainElement = document.querySelector('main');
    const loadingTexts = [ "loading", "hi", "welcome", "initialising", "wat", "fetching", "cooking", "preparing", "hold on", "be patient", "thinking", "im hammad", "sussy baka", "chairs r lowkey sat on", "playing", "waiting", "dapping", "thinking", "bazinga!", "khelega free fire", "hammad site", "3 seconds loading", "powered by 1900 lemons", "hello dude" ];
    if (overlayTextElement) overlayTextElement.textContent = getRandomItem(loadingTexts);

    if (overlayTextElement && pageLoadOverlay && mainElement) {
        overlayTextElement.style.animation = 'animateInFromBottom 1s forwards ease-out';
        overlayTextElement.addEventListener('animationend', function onOverlayTextAnimationEnd() {
            overlayTextElement.removeEventListener('animationend', onOverlayTextAnimationEnd);
            setTimeout(() => {
                pageLoadOverlay.style.animation = 'revealWithBend 0.8s forwards ease-in-out';
                pageLoadOverlay.addEventListener('animationend', function onPageOverlayAnimationEnd() {
                    pageLoadOverlay.removeEventListener('animationend', onPageOverlayAnimationEnd);
                    pageLoadOverlay.style.display = 'none';
                    mainElement.style.animation = 'animateInFromBottom 1s forwards ease-out';
                }, { once: true }); // Use { once: true } for event listeners
            }, 1000);
        }, { once: true });
    } else {
        if(pageLoadOverlay) pageLoadOverlay.style.display = 'none';
        if(mainElement) { mainElement.style.opacity = '1'; mainElement.style.filter = 'none'; mainElement.style.transform = 'none'; }
    }

    // Friends Lists (will also call initMagneticLinks after populating)
    fetchFriends();
    fetchMoreFriends();

    // PFP Click Sound
    const pfpElement = document.getElementById("pfp");
    if (pfpElement) {
        pfpElement.addEventListener("click", () => {
            const sounds = [ "/sfx/1.mp3", "/sfx/2.mp3", "/sfx/3.mp3", "/sfx/4.mp3", "/sfx/5.mp3", "/sfx/6.mp3", "/sfx/7.mp3", "/sfx/8.mp3", "/sfx/9.mp3", "/sfx/10.mp3", "/sfx/11.mp3", "/sfx/12.mp3", "/sfx/13.mp3" ];
            new Audio(getRandomItem(sounds)).play();
            pfpElement.style.pointerEvents = "none";
            setTimeout(() => { pfpElement.style.pointerEvents = "auto"; }, 100); // Increased delay slightly
        });
    }
    
    // Initialize other UI features
    setupCoolStuffInteractions();
    setupCaseOh();
    setupChaseGame();
    setupModeToggles();
    
    // Dark Mode Toggle visual cue
    const toggleImage = document.getElementById('dark-mode-toggle');
    if(toggleImage) setTimeout(() => toggleImage.classList.add('fade-in'), 4000);

    setupSigmaVideo();
    setupTOSIframe();
    setupGunMode();
    countdown();
    initWavyDivider();

    // Lenis Smooth Scroll
    const lenis = new Lenis();
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.lenisInstance = lenis; // Make instance accessible for project scroll

    // Feature Initializations that might depend on Lenis or final DOM state
    initProjectScrollNumber();
    initStylishCardHoverEffect();
    initCoolStuffTray();
    initBackToTop();
    initTestimonialSlider();
    initMagneticLinks(); // Initial call for already present elements

}); // --- END OF DOMContentLoaded ---