// Helper function (if not already defined globally or as a method)
function getRandomItem(arr) {
    if (!arr || arr.length === 0) return ""; // Safeguard for empty arrays
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- START OF FUNCTION DEFINITIONS ---

function initMagneticLinks() {
    const magneticElements = document.querySelectorAll(
        'article a:not(.card-main-image-link):not([data-icon]):not(.testimonial-author-title a):not(#show-iframe),' + // Links
        'footer #backToTopBtn,' +                 // Back to top button
        '#coolStuffTrigger,' +                    // Cool stuff trigger
        '#pp,' +                                 // Profile picture
        '.fried-pfp'                             // Friend PFPs (Note: class name was 'fiend-pfp', corrected to 'friend-pfp')
    );

    const attractionFactor = 0.20;
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
    // const pfp = document.getElementById("pfp"); // pfp update is handled by fetchProfilePicture now

    try {
      const res = await fetch("https://api.lanyard.rest/v1/users/798177330010521630");
      if (!res.ok) {
          console.error("Lanyard API request failed with status:", res.status);
          setRandomText();
          if (statusEmoji) statusEmoji.textContent = "";
          return;
      }
      const data = await res.json();
      if (!data.success || !data.data) {
          console.error("Lanyard API call did not succeed or data is missing:", data);
          setRandomText();
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

        if (statusElement) {
            if (emoji || text) {
                statusElement.textContent = `${emoji ? emoji + " " : ""}${text}`;
            } else { // No game, no custom status, fallback to presence text
                 if (["online", "idle", "dnd"].includes(d.discord_status)) {
                    let presenceEmoji = "";
                    let presenceText = "";
                    if (d.discord_status === "online") { presenceEmoji = "(•ᴗ•)"; presenceText = "online"; }
                    else if (d.discord_status === "idle") { presenceEmoji = "‎꜀( ꜆-ࡇ-)꜆ ᶻ 𝗓 𐰁"; presenceText = "idle"; }
                    else if (d.discord_status === "dnd") { presenceEmoji = "( ` ᴖ ´ )"; presenceText = "do not disturb"; }
                    statusElement.textContent = `${presenceEmoji} ${presenceText}`;
                }
            }
        }
      }

      let emojiStatusText = "";
      if (gameActivity) emojiStatusText = "🎮"; // Game icon takes precedence for status
      else if (d.discord_status === "online") emojiStatusText = "🟢";
      else if (d.discord_status === "idle") emojiStatusText = "🌙";
      else if (d.discord_status === "dnd") emojiStatusText = "⛔";

      const onMobile = d.active_on_discord_mobile;
      if (statusEmoji) {
          // Show green dot for mobile only if online and not gaming
          statusEmoji.textContent = onMobile && d.discord_status === "online" && !gameActivity ? `🟢` : emojiStatusText;
      }

    } catch (err) {
      console.error("Status fetch failed (Lanyard):", err);
      setRandomText(); // Fallback
      if (statusElement) statusElement.textContent = "lemme cook..."; // From original scripts.js
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
        "is secretely evil mr. munchkins man...","A dumbo.", "A Roblox enjoyer.", "The father of Glargle Cheeseball.",
        "A retired video editor. (too cringe)", "A tech enthusiast.", "A person who drinks water.",
        "The developer of twixxt.vercel.app", "A fellow pirate.", "A person that exists... somehow."
    
    ];
    statusElement.textContent = getRandomItem(texts);
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
            pfp.src = "https://via.placeholder.com/128"; // Fallback
        }
    } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        const pfp = document.getElementById("pfp");
        if (pfp) pfp.src = "https://via.placeholder.com/128"; // Fallback
    }
}

function setRandomAboutText() {
    const aboutElement = document.getElementById("aboutText");
    if (!aboutElement) return;
    const aboutTexts = [ // Combined and refined
        "Hi! I'm Hammad, a 15 year old web designer/developer. I love making websites and Graphic Designing. I hope to earn some day and inspire others using my skills.",
        "hii im hammad, am 15 and a web designer/developer. i like making websites and can graphic design pretty well. give me money pls (im broke)",
        ];
    aboutElement.textContent = getRandomItem(aboutTexts);
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
            img.classList.add("friend-pfp"); // Corrected class name

            img.addEventListener("click", () => {
                if (friend.sfx) {
                    new Audio(friend.sfx).play().catch(e => console.error("Error playing friend sfx:", e));
                }
            });

            friendDiv.appendChild(img);
            container.appendChild(friendDiv);
        } catch (error) {
            console.error(`Failed to fetch/populate friend data for ${friend.id}:`, error);
        }
    }
    setupFriendHoverEffects(container);
    initMagneticLinks(); // Re-apply magnetic effect after new .friend-pfp elements are added
}

function setupFriendHoverEffects(container) {
    const friendsInContainer = container.querySelectorAll(".friend");
    friendsInContainer.forEach((friend) => {
        friend.addEventListener("mouseover", () => {
            // Clear all effects from all friends in this container
            friendsInContainer.forEach(f => f.classList.remove("active", "previous", "previous-2", "previous-3", "previous-4", "next", "next-2", "next-3", "next-4"));
            friend.classList.add("active");

            // Apply previous classes
            let currentPrev = friend.previousElementSibling;
            for (let i = 1; i <= 4 && currentPrev; i++) {
                if (currentPrev.classList.contains('friend')) {
                    currentPrev.classList.add(`previous${i > 1 ? '-' + i : ''}`);
                }
                currentPrev = currentPrev.previousElementSibling;
            }

            // Apply next classes
            let currentNext = friend.nextElementSibling;
            for (let i = 1; i <= 4 && currentNext; i++) {
                 if (currentNext.classList.contains('friend')) {
                    currentNext.classList.add(`next${i > 1 ? '-' + i : ''}`);
                }
                currentNext = currentNext.nextElementSibling;
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
    const imageOverlay = document.getElementById("imageOverlay"); // Renamed from 'overlay' in scripts.js to avoid conflict
    const videoTrigger = document.getElementById("videoTrigger");
    const randomVideoElement = document.getElementById("randomVideo"); // Renamed from 'videoElement'
    const coolVideo = document.getElementById("coolVideo");
    const fullscreenTrigger = document.getElementById("fullscreenTrigger");
    const fullscreenVideo = document.getElementById("fullscreenVideo");
    const fullscreenVideos = ["videos/oia.mp4"];


    if (imageElement && imageOverlay) {
        imageElement.addEventListener("click", () => {
            const randomImageSrc = getRandomItem(images);
            imageOverlay.src = randomImageSrc;
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
            const randomVidSrc = getRandomItem(videos);
            randomVideoElement.src = randomVidSrc;
            randomVideoElement.style.display = "block";
            randomVideoElement.play();
            videoTrigger.style.display = "none";
        });
        randomVideoElement.addEventListener("pause", () => {
            randomVideoElement.style.display = "none";
            if(videoTrigger) videoTrigger.style.display = "block";
        });
         randomVideoElement.addEventListener("ended", () => { // Hide when video ends too
            randomVideoElement.style.display = "none";
            if(videoTrigger) videoTrigger.style.display = "block";
        });
    }

    if (coolVideo) {
        coolVideo.addEventListener("click", () => { if (coolVideo.paused) coolVideo.play(); });
        coolVideo.addEventListener("pause", () => { coolVideo.style.display = "none"; });
        coolVideo.addEventListener("ended", () => { coolVideo.style.display = "none"; }); // Hide when video ends
        coolVideo.addEventListener("play", () => { coolVideo.style.display = "block"; });
    }

    if (fullscreenTrigger && fullscreenVideo) {
        fullscreenTrigger.addEventListener("click", () => {
            const randomVidSrc = getRandomItem(fullscreenVideos);
            fullscreenVideo.src = randomVidSrc;
            fullscreenVideo.style.display = "block";
            fullscreenVideo.play();
        });
        fullscreenVideo.addEventListener("click", () => { fullscreenVideo.pause(); }); // Click to pause
        fullscreenVideo.addEventListener("pause", () => { fullscreenVideo.style.display = "none"; });
        fullscreenVideo.addEventListener("ended", () => { fullscreenVideo.style.display = "none"; }); // Hide when video ends
    }
}
function setupCaseOh() {
    // --- DOM Element References ---
    const caseohVisibleTrigger = document.getElementById("caseohVisible");
    const caseohHiddenImage = document.getElementById("caseohHidden");
    const mainBoundaryElement = document.querySelector("main"); // Explicitly using <main>

    // --- Initial Sanity Checks ---
    if (!caseohVisibleTrigger) {
        console.warn("CaseOh: Trigger element #caseohVisible not found. Aborting.");
        return;
    }
    if (!caseohHiddenImage) {
        console.warn("CaseOh: Image element #caseohHidden not found. Aborting.");
        return;
    }
    if (!mainBoundaryElement) {
        console.warn("CaseOh: Boundary element <main> not found. Aborting.");
        return;
    }

    // --- Configuration ---
    let screenTierSpeed = 3; // Default speed
    if (window.innerWidth < 768) { // Example: Slower speed for smaller screens
        screenTierSpeed = 1.5;
    } else if (window.innerWidth < 480) { // Example: Even slower for very small screens
        screenTierSpeed = 1;
    }

    const config = {
        speed: screenTierSpeed,
        images: [
            "images/caseoh.jpg", "images/caseoh1.webp", "images/caseoh2.webp",
            "images/caseoh3.webp", "images/caseoh4.webp", "images/caseoh5.webp",
            "images/caseoh6.jpg"
        ],
        sounds: {
            perish: "sounds/stomp.mp3"
        },
        perishExceptions: [
            '#caseohHidden', '#caseohVisible',
            'script', 'style', 'link', 'meta', 'title', 'head',
            'div','arcticle',
            'html', 'body', 'main', // Core structure, main is the boundary
            'article', 'section', 'header', 'footer', 'nav', 'aside',
            // Add any other specific IDs or classes critical to your layout:
            // e.g., '.important-layout-container', '#my-sidebar'
        ].join(','),
        perishAnimation: {
            opacity: '0',
            transform: 'scale(0.5) rotate(15deg)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            hideDelay: 300 // ms after animation to set display:none
        }
    };

    // --- State Variables ---
    let isActive = false;
    let currentX, currentY; // Top-left position relative to the document
    let directionX = config.speed;
    let directionY = config.speed;
    let currentImageIndex = 0;
    let animationFrameId = null;
    let mainBounds = { top: 0, left: 0, width: 0, height: 0 }; // Absolute document coordinates of <main>

    // --- Utility Functions ---
    const playSound = (soundPath) => {
        if (soundPath) {
            new Audio(soundPath).play().catch(e => console.error(`CaseOh: Error playing sound "${soundPath}":`, e));
        }
    };

    const updateMainBounds = () => {
        const rect = mainBoundaryElement.getBoundingClientRect();
        mainBounds = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
        // For debugging the <main> element's actual position and size:
        // console.log("CaseOh - <main> bounds updated:", JSON.stringify(mainBounds), "Viewport W:", window.innerWidth);
    };

    const changeImage = () => {
        currentImageIndex = (currentImageIndex + 1) % config.images.length;
        if (config.images.length > 0) { // Prevent error if images array is empty
            caseohHiddenImage.src = config.images[currentImageIndex];
        }
    };

    // --- Core Logic Functions ---
    const initializeAndShowCaseOh = () => {
        if (isActive) return;

        caseohVisibleTrigger.style.display = 'none';

        // Ensure image is loaded enough to get dimensions, or use fallback.
        // visibility:hidden + display:block is a common trick.
        caseohHiddenImage.style.visibility = 'hidden';
        caseohHiddenImage.style.display = 'block';
        let imgWidth = caseohHiddenImage.offsetWidth;
        let imgHeight = caseohHiddenImage.offsetHeight;

        if (imgWidth === 0 || imgHeight === 0) { // Fallback if offsetWidth is 0 (e.g. image not loaded)
            console.warn("CaseOh: Image dimensions are 0, using fallback 100x100.");
            imgWidth = 100;
            imgHeight = 100;
            // You might want to set caseohHiddenImage.style.width/height here if they aren't in CSS
        }


        updateMainBounds();

        const maxX = Math.max(0, mainBounds.width - imgWidth);
        const maxY = Math.max(0, mainBounds.height - imgHeight);

        if (mainBounds.width <= 0 || mainBounds.height <= 0) {
            console.error("CaseOh: <main> boundary element has zero width or height. Cannot place CaseOh.");
            caseohHiddenImage.style.display = 'none'; // Hide it again
            caseohVisibleTrigger.style.display = 'block'; // Show trigger
            return;
        }


        currentX = mainBounds.left + Math.random() * maxX;
        currentY = mainBounds.top + Math.random() * maxY;

        directionX = (Math.random() > 0.5 ? 1 : -1) * config.speed;
        directionY = (Math.random() > 0.5 ? 1 : -1) * config.speed;

        caseohHiddenImage.style.left = `${currentX}px`;
        caseohHiddenImage.style.top = `${currentY}px`;
        caseohHiddenImage.style.visibility = 'visible';

        isActive = true;
        startAnimationLoop();
    };

    const checkWallCollisionsAndUpdateDirection = () => {
        const imgWidth = caseohHiddenImage.offsetWidth || 100; // Use fallback if 0
        const imgHeight = caseohHiddenImage.offsetHeight || 100;
        let collided = false;

        // Right boundary
        if (currentX + imgWidth > mainBounds.left + mainBounds.width) {
            currentX = mainBounds.left + mainBounds.width - imgWidth;
            directionX = -Math.abs(config.speed); // Go left
            collided = true;
        }
        // Left boundary
        else if (currentX < mainBounds.left) {
            currentX = mainBounds.left;
            directionX = Math.abs(config.speed); // Go right
            collided = true;
        }

        // Bottom boundary
        if (currentY + imgHeight > mainBounds.top + mainBounds.height) {
            currentY = mainBounds.top + mainBounds.height - imgHeight;
            directionY = -Math.abs(config.speed); // Go up
            collided = true;
        }
        // Top boundary
        else if (currentY < mainBounds.top) {
            currentY = mainBounds.top;
            directionY = Math.abs(config.speed); // Go down
            collided = true;
        }

        if (collided) {
            changeImage();
            // Optional: Add slight randomness to the perpendicular direction to avoid perfect loops
            const speedVariance = Math.random() * 0.4 + 0.8; // 80% to 120% of base speed
            if (Math.abs(directionX) === config.speed) { // If just reversed X or started
                directionY = (Math.random() > 0.5 ? 1 : -1) * config.speed * speedVariance;
            }
            if (Math.abs(directionY) === config.speed) { // If just reversed Y or started
                directionX = (Math.random() > 0.5 ? 1 : -1) * config.speed * speedVariance;
            }
        }
    };

    const checkElementCollisionsAndPerish = () => {
        const caseohRect = caseohHiddenImage.getBoundingClientRect();
        const targetElements = mainBoundaryElement.querySelectorAll(`*:not(${config.perishExceptions})`);

        targetElements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.opacity !== '0' && style.display !== 'none' && style.visibility !== 'hidden') {
                const elRect = el.getBoundingClientRect();
                if (
                    caseohRect.left < elRect.right &&
                    caseohRect.right > elRect.left &&
                    caseohRect.top < elRect.bottom &&
                    caseohRect.bottom > elRect.top
                ) {
                    el.style.transition = config.perishAnimation.transition;
                    el.style.opacity = config.perishAnimation.opacity;
                    el.style.transform = config.perishAnimation.transform;
                    el.style.pointerEvents = 'none';
                    setTimeout(() => {
                        if (el.style.opacity === config.perishAnimation.opacity) {
                        }
                    }, config.perishAnimation.hideDelay);
                    playSound(config.sounds.perish);
                }
            }
        });
    };

    const gameAnimationLoop = () => {
        if (!isActive) return;

        currentX += directionX;
        currentY += directionY;

        checkWallCollisionsAndUpdateDirection();
        checkElementCollisionsAndPerish();

        caseohHiddenImage.style.left = `${currentX}px`;
        caseohHiddenImage.style.top = `${currentY}px`;

        animationFrameId = requestAnimationFrame(gameAnimationLoop);
    };

    const startAnimationLoop = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(gameAnimationLoop);
    };

    const stopAnimationLoop = () => { // Not explicitly used but good to have
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        isActive = false;
    };

    // --- Event Handlers ---
    const handleTriggerClick = () => {
        initializeAndShowCaseOh();
    };

    const handleWindowResize = () => {
        // Update speed tier based on new window width
        let newSpeedTier = 3;
        if (window.innerWidth < 768) {
            newSpeedTier = 1.5;
        } else if (window.innerWidth < 480) {
            newSpeedTier = 1;
        }

        if (config.speed !== newSpeedTier) {
            const oldSpeed = config.speed;
            config.speed = newSpeedTier;
            // Adjust current direction proportionally if speed changes
            if (isActive && oldSpeed !== 0) { // Prevent division by zero if oldSpeed was 0
                directionX = (directionX / oldSpeed) * config.speed;
                directionY = (directionY / oldSpeed) * config.speed;
            } else { // If not active or old speed was 0, just set to new base speed for next activation
                directionX = (directionX > 0 ? 1 : -1) * config.speed;
                directionY = (directionY > 0 ? 1 : -1) * config.speed;
            }
            // console.log("CaseOh: Speed tier updated on resize to", config.speed);
        }

        if (isActive) {
            updateMainBounds();
            const imgWidth = caseohHiddenImage.offsetWidth || 100;
            const imgHeight = caseohHiddenImage.offsetHeight || 100;
            currentX = Math.max(mainBounds.left, Math.min(currentX, mainBounds.left + mainBounds.width - imgWidth));
            currentY = Math.max(mainBounds.top, Math.min(currentY, mainBounds.top + mainBounds.height - imgHeight));
        }
    };

    // --- Setup ---
    if (caseohVisibleTrigger) {
        caseohVisibleTrigger.addEventListener("click", handleTriggerClick);
    }
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize(); // Call once to set initial speed based on screen size and get initial bounds

    console.log("CaseOh: Setup complete. Initial speed:", config.speed);
}

function setupChaseGame() {
    const startChase = document.getElementById("startChase");
    const chaseImage = document.getElementById("chaseImage");
    const timerElement = document.getElementById("timer");
    const jumpscareDiv = document.getElementById("jumpscare");
    const scaryImage = document.getElementById("scaryImage");
    const scarySound = document.getElementById("scarySound");
    const mainElement = document.querySelector("main");

    if (!startChase || !chaseImage || !timerElement || !jumpscareDiv || !scaryImage || !scarySound || !mainElement) {
        console.warn("Chase game elements not found.");
        return;
    }

    let chasing = false, speed = 1, seconds = 0, interval, mouseMoving = false, gameActive = false;

    startChase.addEventListener("click", () => {
        if (gameActive) return; gameActive = true;
        startChase.style.display = "none";
        mainElement.style.setProperty('filter', 'blur(10px) brightness(0.5)', 'important');
        mainElement.style.pointerEvents = "none";

        setTimeout(() => {
            // Ensure chaseImage is positioned relative to the viewport for initial placement
            chaseImage.style.position = 'fixed'; // Or 'absolute' if its parent is the body/viewport
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
        mouseMoving = true; setTimeout(() => mouseMoving = false, 200); // Reset mouseMoving flag
        if (chasing && gameActive) {
            const rect = chaseImage.getBoundingClientRect(); // Use getBoundingClientRect for viewport-relative position
            const chaseCenterX = rect.left + rect.width / 2;
            const chaseCenterY = rect.top + rect.height / 2;

            const dx = event.clientX - chaseCenterX;
            const dy = event.clientY - chaseCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) { // Caught
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
                        // location.reload(); // From original scripts.js, uncomment if page should reload
                    }, 500);
                }, 500);
            } else if (distance > 0) { // Move towards cursor
                let currentLeft = parseFloat(chaseImage.style.left || "0");
                let currentTop = parseFloat(chaseImage.style.top || "0");

                let newLeft = currentLeft + (dx / distance * speed);
                let newTop = currentTop + (dy / distance * speed);

                // Boundary checks (against viewport dimensions)
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - chaseImage.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - chaseImage.offsetHeight));

                chaseImage.style.left = newLeft + "px";
                chaseImage.style.top = newTop + "px";
            }
        }
    });
}


function setupModeToggles() {
    // --- Element References from your proposed code ---
    const retroMode = document.getElementById("retroMode");
    const gtaMode = document.getElementById("gtaMode");
    const classicMode = document.getElementById("classicMode");
    const refresh = document.getElementById("refresh");

    // References needed from original that are used in your proposed code
    const retrosus = document.getElementById("retrosus"); // Audio element for retro mode
    const toggleImage = document.getElementById('dark-mode-toggle'); // Theme toggle image, hidden by modes
    const retroImage = document.getElementById("retroImage"); // Specific image for retro mode
    const retroLines = document.getElementById("retroLines"); // Specific overlay for retro mode

    // --- Sanity checks for essential elements ---
    if (!retroMode || !gtaMode || !classicMode || !refresh) {
        console.warn("Mode Toggles: One or more mode trigger buttons not found. Functionality may be limited.");
        // Decide if you want to return early or let it proceed if some buttons are optional
    }
    // It's also good to check for retrosus, toggleImage, retroImage, retroLines if they are critical
    if (!retrosus) console.warn("Mode Toggles: retrosus audio element not found.");
    if (!toggleImage) console.warn("Mode Toggles: dark-mode-toggle image not found.");
    if (!retroImage) console.warn("Mode Toggles: retroImage element not found.");
    if (!retroLines) console.warn("Mode Toggles: retroLines element not found.");


    // --- Retro Mode ---
    if (retroMode) {
        retroMode.addEventListener("click", function (e) {
            e.preventDefault(); // Good practice for links acting as buttons

            // Set body styles
            document.body.style.background = "#0000FF";
            document.body.style.color = "#FFFF00"; // Note: This might be overridden by the loop below for specific tags
            document.body.style.fontFamily = "'Comic Sans MS', comic, cursive"; // More robust comic font stack
            document.body.style.textShadow = "2px 2px 2px black";

            // Set html (document element) styles
            document.documentElement.style.background = "#ff69b4";

            // Main content filter
            const mainElement = document.querySelector('main');
            if (mainElement) mainElement.style.filter = "blur(0.6px)";

            // Sound
            if (retrosus) retrosus.play().catch(err => console.error("Error playing retrosus:", err));

            // Toggle button visibility
            if (gtaMode) gtaMode.style.display = 'inline-block';
            retroMode.style.display = 'none';
            if (classicMode) classicMode.style.display = 'none';
            if (toggleImage) toggleImage.style.display = 'none';

            // Apply styles to specific elements
            // Your proposed code targets a limited set of tags directly.
            // The original targeted more broadly with exceptions.
            document.querySelectorAll("button, img, a, h1, h2, h3, video").forEach(el => {
                el.style.setProperty('border', '3px solid red', 'important');
                el.style.setProperty('background', '#ff69b4', 'important');
                el.style.setProperty('color', 'white', 'important');
                el.style.setProperty('font-family', "'Comic Sans MS', comic, cursive", 'important'); // Consistent font
                el.style.setProperty('text-decoration', 'underline wavy', 'important');
            });

            // Show retro-specific elements
            if (retroImage) retroImage.style.display = "block";
            if (retroLines) retroLines.style.display = "block";

            // Ensure fonts on gtaMode/classicMode (which become visible) are not comic sans
            // This was in your proposal with classList.add, but direct style is more consistent here.
            if (gtaMode) gtaMode.style.setProperty('font-family', "'sant', sans-serif", 'important'); // Assuming 'sant' is your GTA font
            if (classicMode) classicMode.style.setProperty('font-family', "'vintage', serif", 'important'); // Assuming 'vintage' is your Classic font
        });
    }

    // --- GTA Mode ---
    if (gtaMode) {
        gtaMode.addEventListener('click', (e) => {
            e.preventDefault();

            // Body styles
            document.body.style.background = 'url("images/gta-bg.jpg") no-repeat center center fixed';
            document.body.style.backgroundSize = 'cover';
            document.body.style.color = "#9bb2d6"; // Default text color for body
            document.body.style.fontFamily = "'sant', sans-serif"; // Default font
            document.body.style.textShadow = "2px 2px 2px black";
            document.body.style.overflow = 'auto'; // As per your code, though usually you'd want to control this carefully

            // HTML (document element) styles
            document.documentElement.style.background = "#000000";

            // Main content filter
            const mainElement = document.querySelector('main');
            if (mainElement) mainElement.style.filter = "blur(0.6px)";

            // Sound
            new Audio('sounds/gta-menu.mp3').play().catch(err => console.error("Error playing gta-menu:", err));

            // Toggle button visibility
            gtaMode.style.display = 'none';
            if (retroMode) retroMode.style.display = 'none'; // Keep retroMode hidden
            if (classicMode) classicMode.style.display = 'inline-block';
            if (toggleImage) toggleImage.style.display = 'none';

            // Apply styles to specific elements
            document.querySelectorAll("button, img, h1, h2, h3, a, video").forEach(el => {
                el.style.setProperty('font-family', "'sant', sans-serif", 'important');
                el.style.setProperty('border', '0px solid red', 'important'); // Effectively no border
                el.style.setProperty('background', 'transparent', 'important'); // Transparent background
                el.style.setProperty('color', '#9bb2d6', 'important');
                el.style.setProperty('text-decoration', 'none', 'important'); // Remove underlines
           
            }
        );
    classicMode.style.display = 'inline-block'; // Make it visible
    classicMode.style.fontFamily = "'vintext', serif";
    classicMode.style.color = '#9bb2d6';
            // Hide retro-specific elements
            if (retroImage) retroImage.style.display = "none";
            if (retroLines) retroLines.style.display = "none";
        });
    }

    // --- Classic Mode ---
    if (classicMode) {
        classicMode.addEventListener('click', (e) => {
            e.preventDefault();

            // Body styles
            document.body.style.background = "#212529";
            document.body.style.color = "#B5828C"; // Default text color
            document.body.style.fontFamily = "'vintage', serif"; // Default font
            document.body.style.textShadow = "0px 0px 0px black"; // No shadow
            document.body.style.overflow = 'auto'; // Reset overflow if GTA mode changed it

            // HTML (document element) styles
            document.documentElement.style.background = "#212529";

            // Main content filter
            const mainElement = document.querySelector('main');
            if (mainElement) mainElement.style.filter = "blur(0px)"; // No blur

            // Sound
            new Audio('sounds/vintage.mp3').play().catch(err => console.error("Error playing vintage sound:", err));

            // Toggle button visibility
            classicMode.style.display = 'none';
            if (retroMode) retroMode.style.display = 'none';
            if (gtaMode) gtaMode.style.display = 'none';
            if (refresh) refresh.style.display = 'inline-block';
            if (toggleImage) toggleImage.style.display = 'none';

            // Apply styles to specific elements
            document.querySelectorAll("button, img, h1, h2, h3, a, video").forEach(el => {
                el.style.setProperty('font-family', "'vintage', serif", 'important');
                el.style.setProperty('border', '0px solid red', 'important');
                el.style.setProperty('background', '#212529', 'important'); // Match body/html background
                el.style.setProperty('color', '#B5828C', 'important');
                el.style.setProperty('text-decoration', 'none', 'important');
            });
            if (refresh) refresh.style.setProperty('font-family', "'poppins', monospace", 'important'); // Specific font for refresh button as per your code

            // Hide retro-specific elements
            if (retroImage) retroImage.style.display = "none";
            if (retroLines) retroLines.style.display = "none";
        });
    }

    // --- Refresh Action ---
    if (refresh) {
        refresh.addEventListener('click', (e) => {
            e.preventDefault();
            const mainElement = document.querySelector("main");
            if (mainElement) mainElement.style.filter = "blur(700px)";

            new Audio('sounds/bye.mp3').play().catch(err => console.error("Error playing bye sound:", err));
            setTimeout(function() {
                location.reload();
            }, 2000);
        });
    }
}


function setupThemeToggle() {
    const toggleImageButton = document.getElementById('dark-mode-toggle');
    const mainContent = document.querySelector("main");

    if (!toggleImageButton) {
        console.warn("Theme Toggle: #dark-mode-toggle button not found.");
        return;
    }

    // --- Configuration for Transitions ---
    const lightModeTransition = {
        image: 'url(images/think.webp)', // Image for transitioning TO light mode
        sound: 'sounds/light.mp3'   // Sound for transitioning TO light mode
    };
    const darkModeTransition = {
        image: 'url(images/dark.gif)', // Image for transitioning TO dark mode
        sound: 'sounds/dark.mp3'     // Sound for transitioning TO dark mode
    };
    const imageVisibleDuration = 1500;    // How long the transition image stays fully visible (ms)
    const imageFadeOutDuration = 1000;   // How long the fade-out animation takes (must match CSS)
    const themeChangeEffectDelay = 150; // Delay before applying theme class changes and blur

    // Initial fade-in for the toggle button
    setTimeout(() => {
        toggleImageButton.classList.add('fade-in');
    }, 4000);

    toggleImageButton.addEventListener('click', function() {
        const isCurrentlyLight = document.body.classList.contains('light-mode');
        let transitionConfig;

        // Determine which transition configuration to use
        if (isCurrentlyLight) {
            // Currently light, will switch TO DARK mode
            transitionConfig = darkModeTransition;
        } else {
            // Currently dark (or no theme class), will switch TO LIGHT mode
            transitionConfig = lightModeTransition;
        }

        // --- Full-Screen Image Effect ---
        const fullScreenImage = document.createElement('div');
        fullScreenImage.classList.add('full-screen-image');
        fullScreenImage.style.backgroundImage = transitionConfig.image;
        document.body.appendChild(fullScreenImage);

        if (transitionConfig.sound) {
            new Audio(transitionConfig.sound).play().catch(err => console.error("Error playing theme sound:", err));
        }

        // --- Timing for Full-Screen Image ---
        setTimeout(() => {
            fullScreenImage.style.opacity = 0; // Start fade-out
        }, imageVisibleDuration);

        setTimeout(() => {
            if (fullScreenImage.parentNode) {
                fullScreenImage.remove();
            }
        }, imageVisibleDuration + imageFadeOutDuration); // Remove after fade-out

        // --- Apply Actual Theme Changes & Button Update ---
        setTimeout(() => {
            if (isCurrentlyLight) {
                // Switching TO DARK Mode
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                document.body.style.backgroundColor = ""; // Let CSS .dark-mode rule apply
                document.documentElement.style.backgroundColor = ""; // Let CSS .dark-mode rule apply
                toggleImageButton.style.backgroundColor = "#111"; // Dark mode button bg
                toggleImageButton.src = 'images/moon.png';     // Moon icon for dark
            } else {
                // Switching TO LIGHT Mode
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
                document.body.style.backgroundColor = "#FFFFFF";
                document.documentElement.style.backgroundColor = "#FFFFFF";
                toggleImageButton.style.backgroundColor = "#FFF";  // Light mode button bg
                toggleImageButton.src = 'images/sunny.png';    // Sun icon for light
            }

            // Blur effect on main content
            if (mainContent) {
                mainContent.style.transition = "filter 0.5s ease-out";
                mainContent.style.filter = "blur(2px)";
                setTimeout(() => {
                    if (mainContent) mainContent.style.filter = "blur(0px)";
                }, 1400); // Duration for blur effect visibility
            }
        }, themeChangeEffectDelay);
    });
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
    video.addEventListener('pause', () => { video.style.display = 'none'; keywordInput.disabled = true; keywordInput.placeholder='watch it fully next time'; }); // Re-enable input
    video.addEventListener('ended', () => { video.style.display = 'none'; keywordInput.disabled = true; keywordInput.placeholder='thanks vro'; }); // Re-enable input
}

// ... (other functions like initCoolStuffTray, setupGunMode, etc.) ...
// Keep this variable in a scope accessible by the setup and close functions
let tosOverlayElement = null;
let tosIframeElement = null;

function setupTOSIframe() {
    const link = document.getElementById('show-iframe');
    const mainContent = document.querySelector('main');
    const coolStuffTrigger = document.getElementById('coolStuffTrigger');
    const bottomTray = document.getElementById('bottomTray');

    if (!link || !mainContent) {
        console.warn("TOS Iframe trigger 'show-iframe' or 'main' content not found.");
        return;
    }
    // coolStuffTrigger and bottomTray are optional for the core TOS functionality

    // Create the overlay and iframe only once
    if (!tosOverlayElement) {
        tosOverlayElement = document.createElement('div');
        tosOverlayElement.id = 'overlay-iframe';
        /* Expected CSS for #overlay-iframe:
           position: fixed; top: 0; left: 0; width: 100%; height: 100%;
           background-color: rgba(0,0,0,0.7);
           display: none; // Initially hidden
           opacity: 0;     // Start transparent for fade-in
           justify-content: center; align-items: center; z-index: 1000;
           transition: opacity 0.3s ease-out; // For smooth fade-in of overlay
        */

        tosIframeElement = document.createElement('iframe');
        tosIframeElement.src = 'https://twixxt.vercel.app/tos.html';
        /* Expected CSS for #overlay-iframe iframe:
           width: 80%; height: 80%; max-width: 800px; max-height: 600px;
           border: none; background-color: white; border-radius: 8px;
           opacity: 0; // Start transparent
           transform: scale(0.95) translateY(10px); // Start slightly small/offset for pop-in
           transition: opacity 0.3s ease-out 0.1s, transform 0.3s ease-out 0.1s; // Delayed/staggered transition
        */

        tosOverlayElement.appendChild(tosIframeElement);
        document.body.appendChild(tosOverlayElement);

        tosOverlayElement.addEventListener('click', function(e) {
            if (e.target === tosOverlayElement) { // Click on overlay background
                closeTOSIframe();
            }
        });
    }

    link.addEventListener('click', function(event) {
        event.preventDefault();

        if (coolStuffTrigger && bottomTray && bottomTray.classList.contains('open')) {
            coolStuffTrigger.click(); // Close tray if open
        }

        if (mainContent) {
            mainContent.style.filter = 'blur(5px)'; // Adjusted blur
        }

        if (tosOverlayElement) {
            tosOverlayElement.style.display = 'flex'; // Show overlay container

            // Use requestAnimationFrame to ensure 'display: flex' is processed
            // before changing opacity/transform, allowing CSS transitions to run smoothly.
            requestAnimationFrame(() => {
                tosOverlayElement.style.opacity = '1'; // Trigger overlay fade-in

                if (tosIframeElement) {
                    // Set final styles for iframe, CSS transitions will animate this
                    tosIframeElement.style.opacity = '1';
                    tosIframeElement.style.filter = 'blur(0px)'

                    tosIframeElement.style.transform = 'scale(1) translate(-50% -50%)'; // Or just 'scale(1)' or 'none'
                                        tosIframeElement.style.top = '50%'; // Or just 'scale(1)' or 'none'

                }
            });
            document.body.classList.add('tos-iframe-open'); // For global styles if needed
        }
    });
}

function closeTOSIframe() {
    const mainContent = document.querySelector('main');

    if (tosOverlayElement) { // Check if it exists
        // Trigger transitions to hide
        if (tosIframeElement) {
            tosIframeElement.style.opacity = '0';
        }
        tosOverlayElement.style.opacity = '0'; // Fade out overlay
        // Wait for transitions to complete before setting display to none
        // This duration should match the longest transition (likely the overlay's opacity).
        const transitionDuration = 300; // in milliseconds (e.g., 0.3s)
        
        setTimeout(() => {
            // Check again in case it was closed/opened rapidly or doesn't exist anymore
            if (tosOverlayElement) { 
                 tosOverlayElement.style.display = 'none';
            }
        }, transitionDuration);
    }
    document.body.classList.remove('tos-iframe-open');
    if (mainContent) {
        mainContent.style.filter = 'none';
    }
}

// ... (ensure initCoolStuffTray is called in DOMContentLoaded)

// ... (other functions remain the same) ...

// ... (other functions remain the same) ...

function setupGunMode() {
    const gunImageToggle = document.getElementById("gunimg");
    const customCursorElement = document.getElementById("customCursor");
    const floatingGunImgElement = document.getElementById("floatingImage");
    const mainElement = document.querySelector("main"); // Get a reference to the main element
    const articleElement = document.querySelector("article"); // Get a reference to the main element

    if (!gunImageToggle || !customCursorElement || !floatingGunImgElement || !mainElement) {
        console.warn("Gun mode elements or main element not found.");
        return;
    }

    let gunModeActive = false;
    let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0, lastX = 0;
    let animationFrameRequest;
    const storedLinkHrefs = new Map();

    function animateGunCursor() {
        cursorX += (targetX - cursorX) * 0.2;
        cursorY += (targetY - cursorY) * 0.2;

        customCursorElement.style.left = `${targetX}px`;
        customCursorElement.style.top = `${targetY}px`;
        floatingGunImgElement.style.left = `${cursorX}px`;
        floatingGunImgElement.style.top = `${cursorY}px`;

        const velocity = targetX - lastX;
        const rotation = velocity * 1.5;

        customCursorElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0.8)`;
        floatingGunImgElement.style.transform = `translate(-50%, -20%) rotate(${rotation}deg)`;

        lastX = targetX;
        if (gunModeActive) animationFrameRequest = requestAnimationFrame(animateGunCursor);
    }

    function toggleGunMode() {
        gunModeActive = !gunModeActive;
        if (gunModeActive) {
            new Audio('sfx/doom-eternal.mp3').play().catch(e => console.error("Error playing doom sfx:", e));
            document.body.classList.add("no-pointer");
            customCursorElement.style.display = "block";
            floatingGunImgElement.style.display = "block";
            disablePageLinks();
            if (animationFrameRequest) cancelAnimationFrame(animationFrameRequest);
            animateGunCursor();
        } else {
            document.body.classList.remove("no-pointer");
            customCursorElement.style.display = "none";
            floatingGunImgElement.style.display = "none";
            enablePageLinks();
            if (animationFrameRequest) cancelAnimationFrame(animationFrameRequest);
        }
    }

    gunImageToggle.addEventListener("click", toggleGunMode);
    document.addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "p") toggleGunMode(); });
    document.addEventListener("mousemove", (e) => { targetX = e.clientX; targetY = e.clientY; });

    document.addEventListener("click", (e) => {
        if (gunModeActive) {
            e.preventDefault();
            e.stopPropagation();

            new Audio('sfx/pistol-shot.mp3').play().catch(err => console.error("Error playing pistol sfx:", err));
            customCursorElement.classList.remove("animate");
            void customCursorElement.offsetWidth;
            customCursorElement.classList.add("animate");

            const clickedElement = e.target;

            // --- More Dangerous Destruction Logic with MAIN protection ---
            const gunUiElements = [
                customCursorElement,
                floatingGunImgElement,
                gunImageToggle
            ];

            // Core page structure elements to protect
            const corePageElements = [
                document.body,
                document.documentElement,
                mainElement,
                                articleElement // <<< ADDED MAIN ELEMENT HERE
 // <<< ADDED MAIN ELEMENT HERE
            ];


            if (corePageElements.includes(clickedElement)) {
                console.log("Core page structure (body, html, main) clicked, no destruction.");
            }
            else if (gunUiElements.includes(clickedElement) || gunUiElements.some(uiEl => uiEl.contains(clickedElement))) {
                console.log("Gun UI element clicked, no self-destruction.");
            }
            // Add any other specific containers you want to protect by ID or class
            // else if (clickedElement.closest('#important-container-to-protect')) {
            //     console.log("Protected container clicked.");
            // }
            else {
                new Audio('sfx/toms-screams.mp3').play().catch(err => console.error("Error playing scream sfx:", err));

                clickedElement.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                clickedElement.style.opacity = '0';
                clickedElement.style.transform = 'scale(0.5)';
setTimeout(() => {
    clickedElement.style.pointerEvents = 'none';
}, 101);
                console.log(`Element targeted: ${clickedElement.tagName} (ID: ${clickedElement.id}, Class: ${clickedElement.className})`);

              
            }
        }
    });

    function disablePageLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                storedLinkHrefs.set(link, href);
                link.removeAttribute('href');
            }
        });
    }

    function enablePageLinks() {
        storedLinkHrefs.forEach((href, link) => {
            link.setAttribute('href', href);
        });
        storedLinkHrefs.clear();
    }
}

// ... (rest of your scripts (1).js file) ...

// ... (rest of your scripts (1).js file) ...

function countdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    function getNextBirthday() {
        const now = new Date(); const currentYear = now.getFullYear();
        const birthdayThisYear = new Date(currentYear, 3, 14); // April 14
        if (now.getMonth() === 3 && now.getDate() === 14) return now; // It's today!
        return now >= birthdayThisYear ? new Date(currentYear + 1, 3, 14) : birthdayThisYear;
    }
    function updateCountdown() {
        if (!countdownEl) return;
        const now = new Date(); const targetDate = getNextBirthday(); const diff = targetDate - now;

        if (now.getMonth() === 3 && now.getDate() === 14) {
            countdownEl.textContent = "is todayyy!!!1!!!1!!11!! 🔪🔪🎂🎂";
            return;
        }
        if (diff < 0) { // Should not happen if getNextBirthday is correct, but a safeguard
             countdownEl.textContent = "has passed! Next year...";
             return;
        }

        const s = Math.floor((diff / 1000) % 60);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const w = Math.floor(d / 7);
        const mo = Math.floor(d / 30.4375); // Average days in a month

        let disp = '';
        if (mo >= 2) disp = `is in ${mo} months`;
        else if (w >= 2) disp = `is in ${w} weeks`;
        else if (d >= 1) disp = `is in ${d} days, ${h}h`;
        else if (h >= 1) disp = `is in ${h}h, ${m}m`;
        else if (m >= 1) disp = `is in ${m}m, ${s}s`;
        else disp = `is in ${s} seconds`;
        countdownEl.textContent = disp;
    }
    setInterval(updateCountdown, 1000); updateCountdown(); // Initial call
}

function initWavyDivider() {
    const allDividers = document.querySelectorAll('.dynamic-wavy-divider-container');
    if (allDividers.length === 0) { console.warn("No wavy SVG dividers found."); return; }

    allDividers.forEach(container => {
        const svg = container.querySelector('svg');
        const svgPath = svg ? svg.querySelector('path') : null;
        if (!svg || !svgPath) { console.error("Wavy SVG or path not found in a container.", container); return; }

        const waveConfig = {
            amplitude: parseFloat(svg.dataset.amplitude) || 10,
            frequency: parseFloat(svg.dataset.frequency) || 0.1,
            phaseShiftSpeed: parseFloat(svg.dataset.speed) || 0.02,
            points: parseInt(svg.dataset.points) || 100
        };
        let currentPhase = Math.random() * Math.PI * 2;

        function generateWavePath() {
            const width = svg.clientWidth; const height = svg.clientHeight;
            if (width === 0 || height === 0) return `M 0 ${height/2}`; // Avoid division by zero or NaN paths
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
                    // Update yOffset here as well, if it's dependent on height
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
    projects.forEach((project, index) => {
        const projectIdFull = project.dataset.projectId || String(index + 1).padStart(2, '0');
        const dynamicDigit = projectIdFull.length > 1 ? projectIdFull.substring(1) : projectIdFull;
        const digitSlot = document.createElement('div'); digitSlot.classList.add('dynamic-digit-only-slot');
        digitSlot.textContent = dynamicDigit; dynamicDigitsReelInnerEl.appendChild(digitSlot);
    });
    dynamicDigitsReelContainer.appendChild(dynamicDigitsReelInnerEl);
    numberIndicator.appendChild(staticZero); numberIndicator.appendChild(dynamicDigitsReelContainer);
    let currentActiveProjectIndex = -1;
    function updateActiveProjectBasedOnScroll() {
        const viewportCenterY = window.innerHeight / 2; let bestMatchIndex = -1; let minAbsDistanceToCenter = Infinity;
        const indicatorHeight = numberIndicator ? numberIndicator.offsetHeight : 80;
        projects.forEach((project, index) => {
            const rect = project.getBoundingClientRect();
            // Check if project is somewhat in view and above the "fold" or indicator
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
    setTimeout(updateActiveProjectBasedOnScroll, 250); // Initial check
}

function initStylishCardHoverEffect() {
    const cardImageWrappers = document.querySelectorAll('.card-main-image-wrapper');
    cardImageWrappers.forEach(wrapper => {
        const viewIndicator = wrapper.querySelector('.card-view-box-indicator');
        if (!viewIndicator) return;
        let currentX = 0, currentY = 0, targetX = 0, targetY = 0; const easingFactor = 0.15; let animationFrameId = null;
        function animateIndicator() {
            currentX += (targetX - currentX) * easingFactor; currentY += (targetY - currentY) * easingFactor;
            viewIndicator.style.left = `${currentX}px`; viewIndicator.style.top = `${currentY}px`;
            if (wrapper.matches(':hover') && (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1)) { // Continue if hovering and not yet at target
                animationFrameId = requestAnimationFrame(animateIndicator);
            } else {
                cancelAnimationFrame(animationFrameId); animationFrameId = null;
            }
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
            targetX = currentX; targetY = currentY; // Set target immediately for smooth entry
            viewIndicator.style.left = `${currentX}px`; viewIndicator.style.top = `${currentY}px`;
            viewIndicator.style.opacity = '1'; // Make visible on enter
            if (!animationFrameId) animationFrameId = requestAnimationFrame(animateIndicator);
        });
        wrapper.addEventListener('mouseleave', () => {
            if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
            viewIndicator.style.opacity = '0'; // Hide on leave
        });
    });
}


function initCoolStuffTray() {
    const coolStuffTrigger = document.getElementById('coolStuffTrigger');
    const bottomTray = document.getElementById('bottomTray');
    const trayBackgroundOverlay = document.getElementById('trayBackgroundOverlay');
    if (!coolStuffTrigger || !bottomTray || !trayBackgroundOverlay) return;
    coolStuffTrigger.addEventListener('click', () => {
        const isOpen = bottomTray.classList.contains('open');
        if (isOpen) {
            bottomTray.classList.remove('open'); trayBackgroundOverlay.classList.remove('active');
            document.body.classList.remove('tray-open'); coolStuffTrigger.style.bottom = '20px';
        } else {
            bottomTray.classList.add('open'); trayBackgroundOverlay.classList.add('active');
            document.body.classList.add('tray-open');
            const trayHeight = bottomTray ? bottomTray.offsetHeight : 200;
            coolStuffTrigger.style.bottom = `calc(${trayHeight}px + 20px)`;
        }
    });
    trayBackgroundOverlay.addEventListener('click', () => { if (bottomTray.classList.contains('open')) coolStuffTrigger.click(); });
}

function initBackToTop() {
    const backToTopButton = document.getElementById('backToTopBtn');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.lenisInstance) {
                window.lenisInstance.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Show/hide button based on scroll (optional, good UX)
        const scrollHandler = () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        };
        if (window.lenisInstance && typeof window.lenisInstance.on === 'function') {
            window.lenisInstance.on('scroll', (e) => {
                if (e.scroll > 300) backToTopButton.classList.add('visible');
                else backToTopButton.classList.remove('visible');
            });
        } else {
            window.addEventListener('scroll', scrollHandler);
        }
        scrollHandler(); // Initial check
    }
}

function initTestimonialSlider() {
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (!testimonialsSection) return;
    const testimonialItems = Array.from(testimonialsSection.querySelectorAll('.testimonial-item'));
    const prevButton = document.getElementById('testimonialPrev'); const nextButton = document.getElementById('testimonialNext');
    if (testimonialItems.length === 0) return;
    let currentTestimonialIndex = 0, isDesktopMode = false, isAnimating = false; const animationDuration = 500;
    function setMode() {
        const newIsDesktopMode = window.innerWidth > 768;
        if (newIsDesktopMode === isDesktopMode && testimonialsSection.dataset.modeInitialized === 'true') return;
        isDesktopMode = newIsDesktopMode; testimonialsSection.dataset.modeInitialized = 'true';
        testimonialsSection.classList.toggle('desktop-mode', isDesktopMode); testimonialsSection.classList.toggle('mobile-mode', !isDesktopMode);
        testimonialItems.forEach(item => item.classList.remove('active', 'is-leaving', 'is-entering'));
        if (isDesktopMode && testimonialItems.length > 0) {
             testimonialItems[currentTestimonialIndex].classList.add('active');
        } else if (!isDesktopMode) { // On mobile, make all visible initially for scrolling
             testimonialItems.forEach(item => item.classList.add('active'));
        }
    }
    function showTestimonialDesktop(newIndex) {
        if (isAnimating || newIndex === currentTestimonialIndex) return; isAnimating = true;
        const oldItem = testimonialItems[currentTestimonialIndex]; const newItem = testimonialItems[newIndex];
        if (oldItem) { oldItem.classList.add('is-leaving'); oldItem.classList.remove('active'); }
        if (newItem) {
            newItem.classList.remove('is-leaving'); newItem.classList.add('is-entering');
            void newItem.offsetWidth; // Trigger reflow
            newItem.classList.add('active'); newItem.classList.remove('is-entering');
        }
        currentTestimonialIndex = newIndex;
        setTimeout(() => {
            if (oldItem) oldItem.classList.remove('is-leaving');
            isAnimating = false;
        }, animationDuration + 50);
    }
    setMode(); window.addEventListener('resize', setMode);
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => { if (isDesktopMode) showTestimonialDesktop((currentTestimonialIndex - 1 + testimonialItems.length) % testimonialItems.length); });
        nextButton.addEventListener('click', () => { if (isDesktopMode) showTestimonialDesktop((currentTestimonialIndex + 1) % testimonialItems.length); });
    } else if (isDesktopMode && testimonialItems.length > 0) {
        testimonialItems[0].classList.add('active'); // Default active for desktop if no buttons
    }
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
    const triggerButton = document.querySelector('.cool-stuff-trigger-button'); // Renamed for clarity
    if (triggerButton) setTimeout(() => triggerButton.classList.add('is-visible'), 4000);
    else console.warn('Cool stuff trigger button not found.');

    // Lanyard/Discord Status Update
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 30000);

    // Accent Color, User Data, PFP Fetches
    fetchAccentColor();
    fetchUserData();
    fetchProfilePicture();

    // Static random text setups
    setRandomAboutText();
    const randomMessages = ["a human from india", "habibi welcome to india", "am indian", "india time lol", "am a sussy indian"];
    const randomConnections = ["connections", "my accounts", "my stuff", "contact me lol", "also found here"];
    const randomMsgEl = document.getElementById("randomMessage"); // Used for both Indian messages in original
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
        // Start intro animation for text
        overlayTextElement.style.animation = 'animateInFromBottom 1s forwards ease-out';

        overlayTextElement.addEventListener('animationend', function onOverlayTextAnimationEnd() {
            // Once text animation is done, wait a bit, then animate overlay out
            setTimeout(() => {
                pageLoadOverlay.style.animation = 'revealWithBend 0.8s forwards ease-in-out';
                // When overlay animation is done, hide it and animate main content in
                pageLoadOverlay.addEventListener('animationend', function onPageOverlayAnimationEnd() {
                    pageLoadOverlay.style.display = 'none'; // Or remove from DOM
                    mainElement.style.animation = 'animateInFromBottom 1s forwards ease-out';
                    mainElement.style.opacity = '1'; // Ensure it's visible after animation
                }, { once: true });
            }, 1000); // Delay after text animates in
        }, { once: true });
    } else { // Fallback if elements are missing
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
            setTimeout(() => { pfpElement.style.pointerEvents = "auto"; }, 100);
        });
    }

    // Initialize other UI features
    setupCoolStuffInteractions();
    setupCaseOh();
    setupChaseGame();
    setupModeToggles();
    setupThemeToggle(); // For dark/light mode
    setupSigmaVideo();
    setupTOSIframe();
    setupGunMode();
    countdown();
    initWavyDivider();

    // Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis();
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        window.lenisInstance = lenis;
    } else {
        console.warn("Lenis library not found. Smooth scroll will not be initialized.");
    }

    // Feature Initializations that might depend on Lenis or final DOM state
    initProjectScrollNumber();
    initStylishCardHoverEffect();
    initCoolStuffTray();
    initBackToTop();
    initTestimonialSlider();
    initMagneticLinks(); // Initial call for already present elements

    // Remove blur from main and toggle after load (from original scripts.js)
    // This is now handled by the loading animation sequence, but keep as a fallback if needed
    // setTimeout(() => {
    //     const toggleImageEl = document.getElementById('dark-mode-toggle');
    //     if (toggleImageEl) toggleImageEl.style.filter = 'blur(0px)';
    //     if (mainElement) {
    //         mainElement.style.filter = "blur(0)";
    //         mainElement.style.scale = "1";
    //     }
    // }, 0); // Original timeout was 0, might be better tied to loading sequence end

}); // --- END OF DOMContentLoaded ---