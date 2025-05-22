function getRandomItem(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
}

function initMagneticLinks() {
    const magneticElements = document.querySelectorAll(
        'article a:not(.card-main-image-link):not([data-icon]):not(.testimonial-author-title a):not(#show-iframe),' +
        'footer #backToTopBtn,' +
        '#coolStuffTrigger,' +
        '#pp,' +
        '.fried-pfp'
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
                } else {
                    if (["online", "idle", "dnd"].includes(d.discord_status)) {
                        let presenceEmoji = "";
                        let presenceText = "";
                        if (d.discord_status === "online") {
                            presenceEmoji = "(•ᴗ•)";
                            presenceText = "online";
                        } else if (d.discord_status === "idle") {
                            presenceEmoji = "‎꜀( ꜆-ࡇ-)꜆ ᶻ 𝗓 𐰁";
                            presenceText = "idle";
                        } else if (d.discord_status === "dnd") {
                            presenceEmoji = "( ` ᴖ ´ )";
                            presenceText = "do not disturb";
                        }
                        statusElement.textContent = `${presenceEmoji} ${presenceText}`;
                    }
                }
            }
        }

        let emojiStatusText = "";
        if (gameActivity) emojiStatusText = "🎮";
        else if (d.discord_status === "online") emojiStatusText = "🟢";
        else if (d.discord_status === "idle") emojiStatusText = "🌙";
        else if (d.discord_status === "dnd") emojiStatusText = "⛔";

        const onMobile = d.active_on_discord_mobile;
        if (statusEmoji) {
            statusEmoji.textContent = onMobile && d.discord_status === "online" && !gameActivity ? `🟢` : emojiStatusText;
        }

    } catch (err) {
        console.error("Status fetch failed (Lanyard):", err);
        setRandomText();
        if (statusElement) statusElement.textContent = "lemme cook...";
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
        "is secretely evil mr. munchkins man...", "A dumbo.", "A Roblox enjoyer.", "The father of Glargle Cheeseball.",
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
            if (pageTitle) pageTitle.textContent = "Hammad Alam Khan's Portfolio";
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
            pfp.src = "https://via.placeholder.com/128";
        }
    } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        const pfp = document.getElementById("pfp");
        if (pfp) pfp.src = "https://via.placeholder.com/128";
    }
}

function setRandomAboutText() {
    const aboutElement = document.getElementById("aboutText");
    if (!aboutElement) return;
    const aboutTexts = [
        "Hi! I'm Hammad, a 15 year old web designer/developer. I love making websites and Graphic Designing. I hope to earn some day and inspire others using my skills.",
      //  "hii im hammad, am 15 and a web designer/developer. i like making websites and can graphic design pretty well. give me money pls (im broke)",
    ];
    aboutElement.textContent = getRandomItem(aboutTexts);
}

function updateIndiaTime() {
    const indiaTimeElement = document.getElementById("indiaTime");
    if (!indiaTimeElement) return;
    const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    };
    const indiaTime = new Date().toLocaleTimeString("en-IN", options);
    indiaTimeElement.innerText = indiaTime;
}

function updateTimeFunc() {
    const timeFuncElement = document.getElementById("timefunc");
    if (!timeFuncElement) return;
    const now = new Date();
    const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        hour12: false
    };
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


const friendsList = [{
    id: "1108071513493614592",
    username: "Friend 1",
    sfx: "sounds/george.mp3"
}, {
    id: "916205370416975893",
    username: "Friend 2",
    sfx: "sounds/sirius.mp3"
}, {
    id: "860917681879253002",
    username: "Friend 3",
    sfx: "sounds/dhiren.mp3"
}, {
    id: "1256930587684634674",
    username: "Friend 4",
    sfx: "sounds/ladybug.mp3"
}, {
    id: "735955748579836025",
    username: "Friend 5",
    sfx: "sounds/penny.mp3"
}];
const moreFriendsList = [{
    id: "929308666606272563",
    username: "Friend A",
    sfx: "sounds/abhi.mp3"
}, {
    id: "1089305664108634162",
    username: "Friend B",
    sfx: "sounds/mijo.mp3"
}, {
    id: "1081451019260678245",
    username: "Friend C",
    sfx: "sounds/vro.mp3"
}, {
    id: "922389987889143849",
    username: "Friend D",
    sfx: "sounds/sounak.mp3"
}, {
    id: "852730635063656462",
    username: "Friend E",
    sfx: "sounds/lemon.mp3"
}];

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
            img.src = data.avatar && data.avatar.link ? data.avatar.link : "https://via.placeholder.com/50";
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
        }
    }
    setupFriendHoverEffects(container);
    initMagneticLinks();
}

function setupFriendHoverEffects(container) {
    const friendsInContainer = container.querySelectorAll(".friend");
    friendsInContainer.forEach((friend) => {
        friend.addEventListener("mouseover", () => {
            friendsInContainer.forEach(f => f.classList.remove("active", "previous", "previous-2", "previous-3", "previous-4", "next", "next-2", "next-3", "next-4"));
            friend.classList.add("active");

            let currentPrev = friend.previousElementSibling;
            for (let i = 1; i <= 4 && currentPrev; i++) {
                if (currentPrev.classList.contains('friend')) {
                    currentPrev.classList.add(`previous${i > 1 ? '-' + i : ''}`);
                }
                currentPrev = currentPrev.previousElementSibling;
            }

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


function fetchFriends() {
    populateFriends("friendsContainer", friendsList);
}

function fetchMoreFriends() {
    populateFriends("morefriendsContainer", moreFriendsList);
}


function setupCoolStuffInteractions() {
    const images = ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg", "images/9.jpg", "images/10.jpg", "images/11.jpg", "images/12.jpg", "images/13.jpg", "images/14.jpg", "images/15.jpg", "images/16.jpg", "images/17.jpg", "images/18.jpg"];
    const videos = ["videos/video1.mp4", "videos/1 (1).mp4", "videos/1 (2).mp4", "videos/1 (3).mp4", "videos/1 (4).mp4", "videos/1 (5).mp4", "videos/1 (6).mp4", "videos/1 (7).mp4", "videos/1 (8).mp4", "videos/1 (9).mp4", "videos/1 (10).mp4", "videos/1 (11).mp4", "videos/1 (12).mp4", "videos/1 (13).mp4", "videos/1 (14).mp4", "videos/1 (15).mp4", "videos/1 (17).mp4", "videos/1 (18).mp4", "videos/1 (19).mp4", "videos/1 (20).mp4", "videos/1 (21).mp4", "videos/1 (22).mp4", "videos/1 (23).mp4", "videos/1 (24).mp4", "videos/1 (25).mp4", "videos/1 (26).mp4", "videos/1 (27).mp4", "videos/1 (28).mp4", "videos/1 (30).mp4", "videos/1 (31).mp4", "videos/1 (32).mp4", "videos/1 (33).mp4", "videos/1 (34).mp4", "videos/1 (35).mp4", "videos/1 (36).mp4", "videos/1 (37).mp4", "videos/1 (38).mp4", "videos/1 (39).mp4", "videos/1 (40).mp4", "videos/1 (41).mp4", "videos/1 (42).mp4", "videos/1 (43).mp4", "videos/1 (45).mp4", "videos/1 (46).mp4", "videos/1 (47).mp4", "videos/1 (48).mp4", "videos/1 (49).mp4", "videos/1 (50).mp4", "videos/1 (52).mp4", "videos/1 (53).mp4", "videos/1 (54).mp4", "videos/1 (55).mp4", "videos/1 (56).mp4", "videos/1 (57).mp4", "videos/1 (58).mp4", "videos/1 (59).mp4", "videos/1 (61).mp4", "videos/1 (62).mp4", "videos/1 (64).mp4", "videos/1 (65).mp4", "videos/1 (66).mp4", "videos/1 (67).mp4", "videos/1 (68).mp4", "videos/1 (69).mp4", "videos/1 (70).mp4", "videos/1 (71).mp4", "videos/1 (72).mp4", "videos/1 (73).mp4", "videos/1 (74).mp4", "videos/1 (75).mp4", "videos/1 (76).mp4", "videos/1 (77).mp4", "videos/1 (78).mp4", "videos/1 (79).mp4", "videos/1 (80).mp4", "videos/1 (81).mp4", "videos/1 (82).mp4", "videos/1 (83).mp4", "videos/1 (84).mp4", "videos/1 (85).mp4", "videos/1 (86).mp4", "videos/1 (87).mp4", "videos/1 (88).mp4", "videos/1 (89).mp4", "videos/1 (90).mp4", "videos/1 (91).mp4", "videos/1 (92).mp4"];
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
            if (videoTrigger) videoTrigger.style.display = "block";
        });
        randomVideoElement.addEventListener("ended", () => {
            randomVideoElement.style.display = "none";
            if (videoTrigger) videoTrigger.style.display = "block";
        });
    }

    if (coolVideo) {
        coolVideo.addEventListener("click", () => {
            if (coolVideo.paused) coolVideo.play();
        });
        coolVideo.addEventListener("pause", () => {
            coolVideo.style.display = "none";
        });
        coolVideo.addEventListener("ended", () => {
            coolVideo.style.display = "none";
        });
        coolVideo.addEventListener("play", () => {
            coolVideo.style.display = "block";
        });
    }

    if (fullscreenTrigger && fullscreenVideo) {
        fullscreenTrigger.addEventListener("click", () => {
            const randomVidSrc = getRandomItem(fullscreenVideos);
            fullscreenVideo.src = randomVidSrc;
            fullscreenVideo.style.display = "block";
            fullscreenVideo.play();
        });
        fullscreenVideo.addEventListener("click", () => {
            fullscreenVideo.pause();
        });
        fullscreenVideo.addEventListener("pause", () => {
            fullscreenVideo.style.display = "none";
        });
        fullscreenVideo.addEventListener("ended", () => {
            fullscreenVideo.style.display = "none";
        });
    }
}

function setupCaseOh() {
    const caseohVisibleTrigger = document.getElementById("caseohVisible");
    const caseohHiddenImage = document.getElementById("caseohHidden");
    const mainBoundaryElement = document.querySelector("main");

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

    let screenTierSpeed = 3;
    if (window.innerWidth < 768) {
        screenTierSpeed = 1.5;
    } else if (window.innerWidth < 480) {
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
            'div', 'arcticle',
            'html', 'body', 'main',
            'article', 'section', 'header', 'footer', 'nav', 'aside',
        ].join(','),
        perishAnimation: {
            opacity: '0',
            transform: 'scale(0.5) rotate(15deg)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            hideDelay: 300
        }
    };

    let isActive = false;
    let currentX, currentY;
    let directionX = config.speed;
    let directionY = config.speed;
    let currentImageIndex = 0;
    let animationFrameId = null;
    let mainBounds = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
    };

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
    };

    const changeImage = () => {
        currentImageIndex = (currentImageIndex + 1) % config.images.length;
        if (config.images.length > 0) {
            caseohHiddenImage.src = config.images[currentImageIndex];
        }
    };

    const initializeAndShowCaseOh = () => {
        if (isActive) return;

        caseohVisibleTrigger.style.display = 'none';

        caseohHiddenImage.style.visibility = 'hidden';
        caseohHiddenImage.style.display = 'block';
        let imgWidth = caseohHiddenImage.offsetWidth;
        let imgHeight = caseohHiddenImage.offsetHeight;

        if (imgWidth === 0 || imgHeight === 0) {
            console.warn("CaseOh: Image dimensions are 0, using fallback 100x100.");
            imgWidth = 100;
            imgHeight = 100;
        }


        updateMainBounds();

        const maxX = Math.max(0, mainBounds.width - imgWidth);
        const maxY = Math.max(0, mainBounds.height - imgHeight);

        if (mainBounds.width <= 0 || mainBounds.height <= 0) {
            console.error("CaseOh: <main> boundary element has zero width or height. Cannot place CaseOh.");
            caseohHiddenImage.style.display = 'none';
            caseohVisibleTrigger.style.display = 'block';
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
        const imgWidth = caseohHiddenImage.offsetWidth || 100;
        const imgHeight = caseohHiddenImage.offsetHeight || 100;
        let collided = false;

        if (currentX + imgWidth > mainBounds.left + mainBounds.width) {
            currentX = mainBounds.left + mainBounds.width - imgWidth;
            directionX = -Math.abs(config.speed);
            collided = true;
        } else if (currentX < mainBounds.left) {
            currentX = mainBounds.left;
            directionX = Math.abs(config.speed);
            collided = true;
        }

        if (currentY + imgHeight > mainBounds.top + mainBounds.height) {
            currentY = mainBounds.top + mainBounds.height - imgHeight;
            directionY = -Math.abs(config.speed);
            collided = true;
        } else if (currentY < mainBounds.top) {
            currentY = mainBounds.top;
            directionY = Math.abs(config.speed);
            collided = true;
        }

        if (collided) {
            changeImage();
            const speedVariance = Math.random() * 0.4 + 0.8;
            if (Math.abs(directionX) === config.speed) {
                directionY = (Math.random() > 0.5 ? 1 : -1) * config.speed * speedVariance;
            }
            if (Math.abs(directionY) === config.speed) {
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
                        if (el.style.opacity === config.perishAnimation.opacity) {}
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

    const stopAnimationLoop = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        isActive = false;
    };

    const handleTriggerClick = () => {
        initializeAndShowCaseOh();
    };

    const handleWindowResize = () => {
        let newSpeedTier = 3;
        if (window.innerWidth < 768) {
            newSpeedTier = 1.5;
        } else if (window.innerWidth < 480) {
            newSpeedTier = 1;
        }

        if (config.speed !== newSpeedTier) {
            const oldSpeed = config.speed;
            config.speed = newSpeedTier;
            if (isActive && oldSpeed !== 0) {
                directionX = (directionX / oldSpeed) * config.speed;
                directionY = (directionY / oldSpeed) * config.speed;
            } else {
                directionX = (directionX > 0 ? 1 : -1) * config.speed;
                directionY = (directionY > 0 ? 1 : -1) * config.speed;
            }
        }

        if (isActive) {
            updateMainBounds();
            const imgWidth = caseohHiddenImage.offsetWidth || 100;
            const imgHeight = caseohHiddenImage.offsetHeight || 100;
            currentX = Math.max(mainBounds.left, Math.min(currentX, mainBounds.left + mainBounds.width - imgWidth));
            currentY = Math.max(mainBounds.top, Math.min(currentY, mainBounds.top + mainBounds.height - imgHeight));
        }
    };

    if (caseohVisibleTrigger) {
        caseohVisibleTrigger.addEventListener("click", handleTriggerClick);
    }
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

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

    let chasing = false,
        speed = 1,
        seconds = 0,
        interval, mouseMoving = false,
        gameActive = false;

    startChase.addEventListener("click", () => {
        if (gameActive) return;
        gameActive = true;
        startChase.style.display = "none";
        mainElement.style.setProperty('filter', 'blur(10px) brightness(0.5)', 'important');
        mainElement.style.pointerEvents = "none";

        setTimeout(() => {
            chaseImage.style.position = 'fixed';
            chaseImage.style.top = Math.random() * (window.innerHeight - chaseImage.offsetHeight) + "px";
            chaseImage.style.left = Math.random() * (window.innerWidth - chaseImage.offsetWidth) + "px";
            chaseImage.style.display = "block";

            chasing = true;
            seconds = 0;
            speed = 1;
            timerElement.innerText = "0s";
            timerElement.style.display = "block";
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                if (mouseMoving && chasing) {
                    seconds++;
                    timerElement.innerText = seconds + "s";
                    speed += 0.5;
                }
            }, 1000);
        }, 500);
    });

    document.addEventListener("mousemove", (event) => {
        mouseMoving = true;
        setTimeout(() => mouseMoving = false, 200);
        if (chasing && gameActive) {
            const rect = chaseImage.getBoundingClientRect();
            const chaseCenterX = rect.left + rect.width / 2;
            const chaseCenterY = rect.top + rect.height / 2;

            const dx = event.clientX - chaseCenterX;
            const dy = event.clientY - chaseCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
                clearInterval(interval);
                chasing = false;
                jumpscareDiv.style.display = "flex";
                scaryImage.style.opacity = "1";
                scarySound.play();
                setTimeout(() => {
                    scaryImage.style.opacity = "0";
                    setTimeout(() => {
                        jumpscareDiv.style.display = "none";
                        timerElement.style.display = "none";
                        timerElement.innerText = "";
                        startChase.style.display = "block";
                        chaseImage.style.display = "none";
                        mainElement.style.filter = "none";
                        mainElement.style.pointerEvents = "auto";
                        gameActive = false;
                    }, 500);
                }, 500);
            } else if (distance > 0) {
                let currentLeft = parseFloat(chaseImage.style.left || "0");
                let currentTop = parseFloat(chaseImage.style.top || "0");

                let newLeft = currentLeft + (dx / distance * speed);
                let newTop = currentTop + (dy / distance * speed);

                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - chaseImage.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - chaseImage.offsetHeight));

                chaseImage.style.left = newLeft + "px";
                chaseImage.style.top = newTop + "px";
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
    const retroImage = document.getElementById("retroImage");
    const retroLines = document.getElementById("retroLines");

    if (!retroMode || !gtaMode || !classicMode || !refresh) {
        console.warn("Mode Toggles: One or more mode trigger buttons not found. Functionality may be limited.");
    }
    if (!retrosus) console.warn("Mode Toggles: retrosus audio element not found.");
    if (!toggleImage) console.warn("Mode Toggles: dark-mode-toggle image not found.");
    if (!retroImage) console.warn("Mode Toggles: retroImage element not found.");
    if (!retroLines) console.warn("Mode Toggles: retroLines element not found.");


    if (retroMode) {
        retroMode.addEventListener("click", function(e) {
            e.preventDefault();

            document.body.style.background = "#0000FF";
            document.body.style.color = "#FFFF00";
            document.body.style.fontFamily = "'Comic Sans MS', comic, cursive";
            document.body.style.textShadow = "2px 2px 2px black";

            document.documentElement.style.background = "#ff69b4";

            const mainElement = document.querySelector('main');
            if (mainElement) mainElement.style.filter = "blur(0.6px)";

            if (retrosus) retrosus.play().catch(err => console.error("Error playing retrosus:", err));

            if (gtaMode) gtaMode.style.display = 'inline-block';
            retroMode.style.display = 'none';
            if (classicMode) classicMode.style.display = 'none';
            if (toggleImage) toggleImage.style.display = 'none';

            document.querySelectorAll("button, img, a, h1, h2, h3, video").forEach(el => {
                el.style.setProperty('border', '3px solid red', 'important');
                el.style.setProperty('background', '#ff69b4', 'important');
                el.style.setProperty('color', 'white', 'important');
                el.style.setProperty('font-family', "'Comic Sans MS', comic, cursive", 'important');
                el.style.setProperty('text-decoration', 'underline wavy', 'important');
            });

            if (retroImage) retroImage.style.display = "block";
            if (retroLines) retroLines.style.display = "block";

            if (gtaMode) gtaMode.style.setProperty('font-family', "'sant', sans-serif", 'important');
            if (classicMode) classicMode.style.setProperty('font-family', "'vintage', serif", 'important');
        });
    }

    if (gtaMode) {
        gtaMode.addEventListener('click', (e) => {
            e.preventDefault();

            document.body.style.background = 'url("images/gta-bg.jpg") no-repeat center center fixed';
            document.body.style.backgroundSize = 'cover';
            document.body.style.color = "#9bb2d6";
            document.body.style.fontFamily = "'sant', sans-serif";
            document.body.style.textShadow = "2px 2px 2px black";
            document.body.style.overflow = 'auto';

            document.documentElement.style.background = "#000000";

            const mainElement = document.querySelector('main');
            if (mainElement) mainElement.style.filter = "blur(0.6px)";

            new Audio('sounds/gta-menu.mp3').play().catch(err => console.error("Error playing gta-menu:", err));

            gtaMode.style.display = 'none';
            if (retroMode) retroMode.style.display = 'none';
            if (classicMode) classicMode.style.display = 'inline-block';
            if (toggleImage) toggleImage.style.display = 'none';

            document.querySelectorAll("button, img, h1, h2, h3, a, video").forEach(el => {
                el.style.setProperty('font-family', "'sant', sans-serif", 'important');
                el.style.setProperty('border', '0px solid red', 'important');
                el.style.setProperty('background', 'transparent', 'important');
                el.style.setProperty('color', '#9bb2d6', 'important');
                el.style.setProperty('text-decoration', 'none', 'important');

            });
            classicMode.style.display = 'inline-block';
            classicMode.style.fontFamily = "'vintext', serif";
            classicMode.style.color = '#9bb2d6';
            if (retroImage) retroImage.style.display = "none";
            if (retroLines) retroLines.style.display = "none";
        });
    }

    if (classicMode) {
        classicMode.addEventListener('click', (e) => {
            e.preventDefault();

            document.body.style.background = "#212529";
            document.body.style.color = "#B5828C";
            document.body.style.fontFamily = "'vintage', serif";
            document.body.style.textShadow = "0px 0px 0px black";
            document.body.style.overflow = 'auto';

            document.documentElement.style.background = "#212529";

            const mainElement = document.querySelector('main');
            if (mainElement) mainElement.style.filter = "blur(0px)";

            new Audio('sounds/vintage.mp3').play().catch(err => console.error("Error playing vintage sound:", err));

            classicMode.style.display = 'none';
            if (retroMode) retroMode.style.display = 'none';
            if (gtaMode) gtaMode.style.display = 'none';
            if (refresh) refresh.style.display = 'inline-block';
            if (toggleImage) toggleImage.style.display = 'none';

            document.querySelectorAll("button, img, h1, h2, h3, a, video").forEach(el => {
                el.style.setProperty('font-family', "'vintage', serif", 'important');
                el.style.setProperty('border', '0px solid red', 'important');
                el.style.setProperty('background', '#212529', 'important');
                el.style.setProperty('color', '#B5828C', 'important');
                el.style.setProperty('text-decoration', 'none', 'important');
            });
            if (refresh) refresh.style.setProperty('font-family', "'poppins', monospace", 'important');

            if (retroImage) retroImage.style.display = "none";
            if (retroLines) retroLines.style.display = "none";
        });
    }

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

    const lightModeTransition = {
        image: 'url(images/think.webp)',
        sound: 'sounds/light.mp3'
    };
    const darkModeTransition = {
        image: 'url(images/dark.gif)',
        sound: 'sounds/dark.mp3'
    };
    const imageVisibleDuration = 1500;
    const imageFadeOutDuration = 1000;
    const themeChangeEffectDelay = 150;

    setTimeout(() => {
        toggleImageButton.classList.add('fade-in');
    }, 4000);

    toggleImageButton.addEventListener('click', function() {
        const isCurrentlyLight = document.body.classList.contains('light-mode');
        let transitionConfig;

        if (isCurrentlyLight) {
            transitionConfig = darkModeTransition;
        } else {
            transitionConfig = lightModeTransition;
        }

        const fullScreenImage = document.createElement('div');
        fullScreenImage.classList.add('full-screen-image');
        fullScreenImage.style.backgroundImage = transitionConfig.image;
        document.body.appendChild(fullScreenImage);

        if (transitionConfig.sound) {
            new Audio(transitionConfig.sound).play().catch(err => console.error("Error playing theme sound:", err));
        }

        setTimeout(() => {
            fullScreenImage.style.opacity = 0;
        }, imageVisibleDuration);

        setTimeout(() => {
            if (fullScreenImage.parentNode) {
                fullScreenImage.remove();
            }
        }, imageVisibleDuration + imageFadeOutDuration);

        setTimeout(() => {
            if (isCurrentlyLight) {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                document.body.style.backgroundColor = "";
                document.documentElement.style.backgroundColor = "";
                toggleImageButton.style.backgroundColor = "#111";
                toggleImageButton.src = 'images/moon.png';
            } else {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
                document.body.style.backgroundColor = "#FFFFFF";
                document.documentElement.style.backgroundColor = "#FFFFFF";
                toggleImageButton.style.backgroundColor = "#FFF";
                toggleImageButton.src = 'images/sunny.png';
            }

            if (mainContent) {
                mainContent.style.transition = "filter 0.5s ease-out";
                mainContent.style.filter = "blur(2px)";
                setTimeout(() => {
                    if (mainContent) mainContent.style.filter = "blur(0px)";
                }, 1400);
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
                video.style.display = 'block';
                video.play();
                keywordInput.disabled = true;
                keywordInput.placeholder = 'tanks vro :3';
                keywordInput.value = '';
            } else {
                keywordInput.value = '';
            }
        }
    });
    video.addEventListener('click', () => video.paused ? video.play() : video.pause());
    video.addEventListener('pause', () => {
        video.style.display = 'none';
        keywordInput.disabled = true;
        keywordInput.placeholder = 'watch it fully next time';
    });
    video.addEventListener('ended', () => {
        video.style.display = 'none';
        keywordInput.disabled = true;
        keywordInput.placeholder = 'thanks vro';
    });
}

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

    if (!tosOverlayElement) {
        tosOverlayElement = document.createElement('div');
        tosOverlayElement.id = 'overlay-iframe';

        tosIframeElement = document.createElement('iframe');
        tosIframeElement.src = 'https://twixxt.vercel.app/tos.html';

        tosOverlayElement.appendChild(tosIframeElement);
        document.body.appendChild(tosOverlayElement);

        tosOverlayElement.addEventListener('click', function(e) {
            if (e.target === tosOverlayElement) {
                closeTOSIframe();
            }
        });
    }

    link.addEventListener('click', function(event) {
        event.preventDefault();

        if (coolStuffTrigger && bottomTray && bottomTray.classList.contains('open')) {
            coolStuffTrigger.click();
        }

        if (mainContent) {
            mainContent.style.filter = 'blur(5px)';
        }

        if (tosOverlayElement) {
            tosOverlayElement.style.display = 'flex';

            requestAnimationFrame(() => {
                tosOverlayElement.style.opacity = '1';

                if (tosIframeElement) {
                    tosIframeElement.style.opacity = '1';
                    tosIframeElement.style.filter = 'blur(0px)'

                    tosIframeElement.style.transform = 'scale(1) translate(-50% -50%)';
                    tosIframeElement.style.top = '50%';

                }
            });
            document.body.classList.add('tos-iframe-open');
        }
    });
}

function closeTOSIframe() {
    const mainContent = document.querySelector('main');

    if (tosOverlayElement) {
        if (tosIframeElement) {
            tosIframeElement.style.opacity = '0';
        }
        tosOverlayElement.style.opacity = '0';
        const transitionDuration = 300;

        setTimeout(() => {
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

function setupGunMode() {
    const gunImageToggle = document.getElementById("gunimg");
    const customCursorElement = document.getElementById("customCursor");
    const floatingGunImgElement = document.getElementById("floatingImage");
    const mainElement = document.querySelector("main");
    const articleElement = document.querySelector("article");

    if (!gunImageToggle || !customCursorElement || !floatingGunImgElement || !mainElement) {
        console.warn("Gun mode elements or main element not found.");
        return;
    }

    let gunModeActive = false;
    let cursorX = 0,
        cursorY = 0,
        targetX = 0,
        targetY = 0,
        lastX = 0;
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
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") toggleGunMode();
    });
    document.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    document.addEventListener("click", (e) => {
        if (gunModeActive) {
            e.preventDefault();
            e.stopPropagation();

            new Audio('sfx/pistol-shot.mp3').play().catch(err => console.error("Error playing pistol sfx:", err));
            customCursorElement.classList.remove("animate");
            void customCursorElement.offsetWidth;
            customCursorElement.classList.add("animate");

            const clickedElement = e.target;

            const gunUiElements = [
                customCursorElement,
                floatingGunImgElement,
                gunImageToggle
            ];

            const corePageElements = [
                document.body,
                document.documentElement,
                mainElement,
                articleElement
            ];


            if (corePageElements.includes(clickedElement)) {
                console.log("Core page structure (body, html, main) clicked, no destruction.");
            } else if (gunUiElements.includes(clickedElement) || gunUiElements.some(uiEl => uiEl.contains(clickedElement))) {
                console.log("Gun UI element clicked, no self-destruction.");
            } else {
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

function countdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    function getNextBirthday() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const birthdayThisYear = new Date(currentYear, 3, 14);
        if (now.getMonth() === 3 && now.getDate() === 14) return now;
        return now >= birthdayThisYear ? new Date(currentYear + 1, 3, 14) : birthdayThisYear;
    }

    function updateCountdown() {
        if (!countdownEl) return;
        const now = new Date();
        const targetDate = getNextBirthday();
        const diff = targetDate - now;

        if (now.getMonth() === 3 && now.getDate() === 14) {
            countdownEl.textContent = "is todayyy!!!1!!!1!!11!! 🔪🔪🎂🎂";
            return;
        }
        if (diff < 0) {
            countdownEl.textContent = "has passed! Next year...";
            return;
        }

        const s = Math.floor((diff / 1000) % 60);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const w = Math.floor(d / 7);
        const mo = Math.floor(d / 30.4375);

        let disp = '';
        if (mo >= 2) disp = `is in ${mo} months`;
        else if (w >= 2) disp = `is in ${w} weeks`;
        else if (d >= 1) disp = `is in ${d} days, ${h}h`;
        else if (h >= 1) disp = `is in ${h}h, ${m}m`;
        else if (m >= 1) disp = `is in ${m}m, ${s}s`;
        else disp = `is in ${s} seconds`;
        countdownEl.textContent = disp;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

function initWavyDivider() {
    const allDividers = document.querySelectorAll('.dynamic-wavy-divider-container');
    if (allDividers.length === 0) {
        console.warn("No wavy SVG dividers found.");
        return;
    }

    allDividers.forEach(container => {
        const svg = container.querySelector('svg');
        const svgPath = svg ? svg.querySelector('path') : null;
        if (!svg || !svgPath) {
            console.error("Wavy SVG or path not found in a container.", container);
            return;
        }

        const waveConfig = {
            amplitude: parseFloat(svg.dataset.amplitude) || 10,
            frequency: parseFloat(svg.dataset.frequency) || 0.1,
            phaseShiftSpeed: parseFloat(svg.dataset.speed) || 0.02,
            points: parseInt(svg.dataset.points) || 100
        };
        let currentPhase = Math.random() * Math.PI * 2;

        function generateWavePath() {
            const width = svg.clientWidth;
            const height = svg.clientHeight;
            if (width === 0 || height === 0) return `M 0 ${height/2}`;
            const effectiveYOffset = height / 2;
            let pathData = `M 0 ${effectiveYOffset}`;
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
                    animateWave();
                    observer.unobserve(svg);
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
    numberIndicator.innerHTML = '';
    numberIndicator.style.display = 'flex';
    numberIndicator.style.alignItems = 'center';
    const staticZero = document.createElement('div');
    staticZero.classList.add('static-project-zero');
    staticZero.textContent = '0';
    const dynamicDigitsReelContainer = document.createElement('div');
    dynamicDigitsReelContainer.classList.add('dynamic-digits-reel-container');
    const dynamicDigitsReelInnerEl = document.createElement('div');
    dynamicDigitsReelInnerEl.classList.add('dynamic-digits-reel-inner');
    dynamicDigitsReelInnerEl.style.transition = 'transform 0.15s ease-out';
    projects.forEach((project, index) => {
        const projectIdFull = project.dataset.projectId || String(index + 1).padStart(2, '0');
        const dynamicDigit = projectIdFull.length > 1 ? projectIdFull.substring(1) : projectIdFull;
        const digitSlot = document.createElement('div');
        digitSlot.classList.add('dynamic-digit-only-slot');
        digitSlot.textContent = dynamicDigit;
        dynamicDigitsReelInnerEl.appendChild(digitSlot);
    });
    dynamicDigitsReelContainer.appendChild(dynamicDigitsReelInnerEl);
    numberIndicator.appendChild(staticZero);
    numberIndicator.appendChild(dynamicDigitsReelContainer);
    let currentActiveProjectIndex = -1;

    function updateActiveProjectBasedOnScroll() {
        const viewportCenterY = window.innerHeight / 2;
        let bestMatchIndex = -1;
        let minAbsDistanceToCenter = Infinity;
        const indicatorHeight = numberIndicator ? numberIndicator.offsetHeight : 80;
        projects.forEach((project, index) => {
            const rect = project.getBoundingClientRect();
            if (rect.bottom > indicatorHeight && rect.top < window.innerHeight) {
                const projectCenterY = rect.top + rect.height / 2;
                const absDistance = Math.abs(projectCenterY - viewportCenterY);
                if (absDistance < minAbsDistanceToCenter) {
                    minAbsDistanceToCenter = absDistance;
                    bestMatchIndex = index;
                }
            }
        });
        if (bestMatchIndex !== -1 && bestMatchIndex !== currentActiveProjectIndex) {
            currentActiveProjectIndex = bestMatchIndex;
            const translateY = currentActiveProjectIndex * -numberSlotHeightRem;
            dynamicDigitsReelInnerEl.style.transform = `translateY(${translateY}rem)`;
        }
    }
    if (window.lenisInstance && typeof window.lenisInstance.on === 'function') window.lenisInstance.on('scroll', updateActiveProjectBasedOnScroll);
    else {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveProjectBasedOnScroll, 50);
        }, {
            passive: true
        });
    }
    setTimeout(updateActiveProjectBasedOnScroll, 250);
}

function initStylishCardHoverEffect() {
    const cardImageWrappers = document.querySelectorAll('.card-main-image-wrapper');
    cardImageWrappers.forEach(wrapper => {
        const viewIndicator = wrapper.querySelector('.card-view-box-indicator');
        if (!viewIndicator) return;
        let currentX = 0,
            currentY = 0,
            targetX = 0,
            targetY = 0;
        const easingFactor = 0.15;
        let animationFrameId = null;

        function animateIndicator() {
            currentX += (targetX - currentX) * easingFactor;
            currentY += (targetY - currentY) * easingFactor;
            viewIndicator.style.left = `${currentX}px`;
            viewIndicator.style.top = `${currentY}px`;
            if (wrapper.matches(':hover') && (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1)) {
                animationFrameId = requestAnimationFrame(animateIndicator);
            } else {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
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
            currentX = e.clientX - rect.left - (indicatorWidth / 2);
            currentY = e.clientY - rect.top - (indicatorHeight / 2);
            targetX = currentX;
            targetY = currentY;
            viewIndicator.style.left = `${currentX}px`;
            viewIndicator.style.top = `${currentY}px`;
            viewIndicator.style.opacity = '1';
            if (!animationFrameId) animationFrameId = requestAnimationFrame(animateIndicator);
        });
        wrapper.addEventListener('mouseleave', () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            viewIndicator.style.opacity = '0';
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
            bottomTray.classList.remove('open');
            trayBackgroundOverlay.classList.remove('active');
            document.body.classList.remove('tray-open');
            coolStuffTrigger.style.bottom = '20px';
        } else {
            bottomTray.classList.add('open');
            trayBackgroundOverlay.classList.add('active');
            document.body.classList.add('tray-open');
            const trayHeight = bottomTray ? bottomTray.offsetHeight : 200;
            coolStuffTrigger.style.bottom = `calc(${trayHeight}px + 20px)`;
        }
    });
    trayBackgroundOverlay.addEventListener('click', () => {
        if (bottomTray.classList.contains('open')) coolStuffTrigger.click();
    });
}

function initBackToTop() {
    const backToTopButton = document.getElementById('backToTopBtn');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.lenisInstance) {
                window.lenisInstance.scrollTo(0, {
                    duration: 1.5
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });

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
        scrollHandler();
    }
}

function initTestimonialSlider() {
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (!testimonialsSection) return;
    const testimonialItems = Array.from(testimonialsSection.querySelectorAll('.testimonial-item'));
    const prevButton = document.getElementById('testimonialPrev');
    const nextButton = document.getElementById('testimonialNext');
    if (testimonialItems.length === 0) return;
    let currentTestimonialIndex = 0,
        isDesktopMode = false, 
        isAnimating = false;
    const animationDuration = 500;

    function setMode() {
        const newIsDesktopMode = window.matchMedia("(min-width: 769px)").matches;

        if (newIsDesktopMode === isDesktopMode && testimonialsSection.dataset.modeInitialized === 'true') {
            return;
        }

        isDesktopMode = newIsDesktopMode; 
        testimonialsSection.dataset.modeInitialized = 'true'; 

        testimonialsSection.classList.toggle('desktop-mode', isDesktopMode);
        testimonialsSection.classList.toggle('mobile-mode', !isDesktopMode);

        testimonialItems.forEach(item => item.classList.remove('active', 'is-leaving', 'is-entering'));

        if (isDesktopMode && testimonialItems.length > 0) {
            testimonialItems[currentTestimonialIndex].classList.add('active');
        } else if (!isDesktopMode) {
            testimonialItems.forEach(item => item.classList.add('active'));
        }
    }

    function showTestimonialDesktop(newIndex) {
        if (isAnimating || newIndex === currentTestimonialIndex) return;
        isAnimating = true;
        const oldItem = testimonialItems[currentTestimonialIndex];
        const newItem = testimonialItems[newIndex];
        if (oldItem) {
            oldItem.classList.add('is-leaving');
            oldItem.classList.remove('active');
        }
        if (newItem) {
            newItem.classList.remove('is-leaving');
            newItem.classList.add('is-entering');
            void newItem.offsetWidth;
            newItem.classList.add('active');
            newItem.classList.remove('is-entering');
        }
        currentTestimonialIndex = newIndex;
        setTimeout(() => {
            if (oldItem) oldItem.classList.remove('is-leaving');
            isAnimating = false;
        }, animationDuration + 50); 
    }

    setMode();
    window.addEventListener('resize', setMode);

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            if (isDesktopMode) { 
                showTestimonialDesktop((currentTestimonialIndex - 1 + testimonialItems.length) % testimonialItems.length);
            }
        });
        nextButton.addEventListener('click', () => {
            if (isDesktopMode) { 
                showTestimonialDesktop((currentTestimonialIndex + 1) % testimonialItems.length);
            }
        });
    } else if (isDesktopMode && testimonialItems.length > 0) {
       }
}


document.addEventListener('DOMContentLoaded', () => {
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
                        svgElement.classList.add('icon');
                        svgElement.setAttribute('aria-hidden', 'true');
                        link.prepend(svgElement);
                    } else {
                        console.warn("Parsed SVG element not found in:", iconUrl);
                    }
                }).catch(error => console.error('Error fetching/parsing SVG:', error));
        }
    });

    const triggerButton = document.querySelector('.cool-stuff-trigger-button');
    if (triggerButton) setTimeout(() => triggerButton.classList.add('is-visible'), 4000);
    else console.warn('Cool stuff trigger button not found.');

    updateDiscordStatus();
    setInterval(updateDiscordStatus, 30000);

    fetchAccentColor();
    fetchUserData();
    fetchProfilePicture();

    setRandomAboutText();
    const randomMessages = ["a human from india", "habibi welcome to india", "am indian", "india time lol", "am a sussy indian"];
    const randomConnections = ["connections", "my accounts", "my stuff", "contact me lol", "also found here"];
    const randomMsgEl = document.getElementById("randomMessage");
    const connectionsEl = document.getElementById("connections");
    if (randomMsgEl) randomMsgEl.innerText = getRandomItem(randomMessages);
    if (connectionsEl) connectionsEl.innerText = getRandomItem(randomConnections);

    updateIndiaTime();
    setInterval(updateIndiaTime, 1000);
    updateTimeFunc();
    setInterval(updateTimeFunc, 1000);

    const overlayTextElement = document.getElementById("overlayText");
    const pageLoadOverlay = document.getElementById('pageLoadOverlay');
    const mainElement = document.querySelector('main');
    const loadingTexts = ["loading", "hi", "welcome", "initialising", "wat", "fetching", "cooking", "preparing", "hold on", "be patient", "thinking", "im hammad", "sussy baka", "chairs r lowkey sat on", "playing", "waiting", "dapping", "thinking", "bazinga!", "khelega free fire", "hammad site", "3 seconds loading", "powered by 1900 lemons", "hello dude"];
    if (overlayTextElement) overlayTextElement.textContent = getRandomItem(loadingTexts);

    if (overlayTextElement && pageLoadOverlay && mainElement) {
        overlayTextElement.style.animation = 'animateInFromBottom 1s forwards ease-out';

        overlayTextElement.addEventListener('animationend', function onOverlayTextAnimationEnd() {
            setTimeout(() => {
                pageLoadOverlay.style.animation = 'revealWithBend 0.8s forwards ease-in-out';
                pageLoadOverlay.addEventListener('animationend', function onPageOverlayAnimationEnd() {
                    pageLoadOverlay.style.display = 'none';
                    mainElement.style.animation = 'animateInFromBottom 1s forwards ease-out';
                    mainElement.style.opacity = '1';
                }, {
                    once: true
                });
            }, 1000);
        }, {
            once: true
        });
    } else {
        if (pageLoadOverlay) pageLoadOverlay.style.display = 'none';
        if (mainElement) {
            mainElement.style.opacity = '1';
            mainElement.style.filter = 'none';
            mainElement.style.transform = 'none';
        }
    }

    fetchFriends();
    fetchMoreFriends();

    const pfpElement = document.getElementById("pfp");
    if (pfpElement) {
        pfpElement.addEventListener("click", () => {
            const sounds = ["/sfx/1.mp3", "/sfx/2.mp3", "/sfx/3.mp3", "/sfx/4.mp3", "/sfx/5.mp3", "/sfx/6.mp3", "/sfx/7.mp3", "/sfx/8.mp3", "/sfx/9.mp3", "/sfx/10.mp3", "/sfx/11.mp3", "/sfx/12.mp3", "/sfx/13.mp3"];
            new Audio(getRandomItem(sounds)).play();
            pfpElement.style.pointerEvents = "none";
            setTimeout(() => {
                pfpElement.style.pointerEvents = "auto";
            }, 100);
        });
    }

    setupCoolStuffInteractions();
    setupCaseOh();
    setupChaseGame();
    setupModeToggles();
    setupThemeToggle();
    setupSigmaVideo();
    setupTOSIframe();
    setupGunMode();
    countdown();
    initWavyDivider();

    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis();

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        window.lenisInstance = lenis;
    } else {
        console.warn("Lenis library not found. Smooth scroll will not be initialized.");
    }

    initProjectScrollNumber();
    initStylishCardHoverEffect();
    initCoolStuffTray();
    initBackToTop();
    initTestimonialSlider();
    initMagneticLinks();

});
