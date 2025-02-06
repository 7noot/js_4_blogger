<script>



    var players2 = [];
    var players = [];
    var iframes = [];

    function onYouTubeIframeAPIReady() {
        iframes = document.querySelectorAll(".youtube-player");

        iframes.forEach((iframe, index) => {
            let player = new YT.Player(iframe, {
                events: {
                    'onStateChange': function(event) {
                        if (event.data == YT.PlayerState.PLAYING) {
                            stopOtherVideos(index);
                            highlightPlayingVideo(index);
                        } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
                            removeHighlight(index);
                        }
                    }
                }
            });
            players.push(player);
            observeVideoVisibility(iframe, player);
        });
    }

    function stopOtherVideos(currentIndex) {
        players.forEach((player, index) => {
            if (index !== currentIndex) {
                player.pauseVideo();
                removeHighlight(index);
            }
        });
    }

    function observeVideoVisibility(iframe, player) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    player.pauseVideo();
                    removeHighlight(iframes.indexOf(entry.target));
                }
            });
        }, { threshold: 0.1 });

        observer.observe(iframe);
    }

    function highlightPlayingVideo(index) {
        iframes[index].style.border = "4px solid red";
        iframes[index].style.borderRadius = "10px"; // Optional: rounded corners
    }

    function removeHighlight(index) {
        if (iframes[index]) {
            iframes[index].style.border = "none";
        }
    }
  
  
    
  

    function loadYouTubeVideos() {
    

    fetch(sheetURL)
        .then(response => response.text())
        .then(csvText => {
            let rows = csvText.split("\n").slice(1);
            let videoContainer = document.getElementById("videoList");
            videoContainer.innerHTML = "";
            players = [];
            iframes = [];

            rows.forEach(row => {
                let columns = row.split(",");
                if (columns.length >= 7) {
                    let videoID = columns[0].trim();
                    let embedURL = columns[1].trim();
                    let clip = columns[2].trim();
                    let clipT = columns[3].trim();
                    let title = columns[4].trim();
                    let country = columns[5].trim();
                    let latitude = columns[6].trim();
                    let longitude = columns[7].trim();
                    let adresse = columns[8]?.trim() || "";

                    if (videoID && embedURL) {
                        let videoWrapper = document.createElement("div");
                        videoWrapper.className = "video-wrapper";
                        videoWrapper.style.marginBottom = "20px";

                        let titleContainer = document.createElement("div");
                        titleContainer.style.display = "flex";
                        titleContainer.style.alignItems = "center";
                     

                        let titleElement = document.createElement("h3");
                        titleElement.textContent = `[${title}]`;
                        titleElement.style.textAlign = "left";
                        titleElement.style.color = "#FFFFFF";
                        titleElement.style.marginBottom = "";
                        titleElement.style.marginright = "40px";
                        titleContainer.appendChild(titleElement);  
                        

                        // Add location icon if latitude & longitude exist
                        if (latitude && longitude) {
                            let locationLink = document.createElement("a");
                            locationLink.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
                            locationLink.target = "_blank";
                            locationLink.style.textDecoration = "none";

                            let locationIcon = document.createElement("i");
                            locationIcon.classList.add("fas", "fa-map-marker-alt");  // Font Awesome map marker icon
                            locationIcon.style.fontSize = "18px";
                            locationIcon.style.cursor = "pointer";
                            locationIcon.style.color = "red";  // This will make the icon red
                            locationIcon.title = "View location on Google Maps";

                            locationLink.appendChild(locationIcon);
                            titleContainer.appendChild(locationLink);
                        }
                      
                            

                        let iframe = document.createElement("iframe");
                        iframe.className = "youtube-player";
                        iframe.width = "392";
                        iframe.height = "220.5";
                        iframe.src = `https://www.youtube.com/embed/${videoID}?si=ZRwVApXm-pbqfUP9&clip=${clip}&clipt=${clipT}&enablejsapi=1`;
                        iframe.title = title;
                        iframe.frameBorder = "0";
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                        iframe.referrerPolicy = "strict-origin-when-cross-origin";
                        iframe.allowFullscreen = true;

                        videoWrapper.appendChild(titleContainer);
                        videoWrapper.appendChild(iframe);
                        videoContainer.appendChild(videoWrapper);
                    }
                }
            });
                setTimeout(() => {
                    if (typeof YT !== "undefined" && YT.Player) {
                        onYouTubeIframeAPIReady();
                    }
                }, 1000);
            })
            .catch(error => console.error("Error loading videos:", error));
    }

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



</script>
