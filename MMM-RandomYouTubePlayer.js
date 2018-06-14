﻿/* MagicMIrror Module - MMM-RandomYouTubePlayer
 *
 * This is a module for the [MagicMirror² By Michael Teeuw http://michaelteeuw.nl]
 * (https://github.com/MichMich/MagicMirror/).
 *
 * this module pulls a specified playlist from YouTube, shuffles the video list,
 * then gets a random video and plays it
 * it starts the player with a random video,
 * then continues to play random videos throughout the list
 *
 * NOT tested with Raspberry Pi or Linux-Based systems.
 * It DOES work with Windows 10!!!
 *
 * version: 2.0.0
 *
 * By Jim Hallock (justjim1220@gmail.com)
 *
 * a huge, huge THANKS goes out to asimhsidd for his collaboration, hints, and pointers!!!
 * (Dude, you saved me from some major headaches!!!)
 *
 * Licensed with a crapload of good ole' Southern Sweet Tea
 * and a lot of Cheyenne Extreme Menthol cigars!!!
 */

Module.register("MMM-RandomYouTubePlayer", {
	defaults: {
		listType: "playlist",
		// playlist ID is found in the URL on YouTube:
		// https://www.youtube.com/playlist?list=PLl_KM23gznEAZW-INW8ty4QNaHH8JCnNW
		// whereas "PLl_KM23gznEAZW-INW8ty4QNaHH8JCnNW" is the 'list' you need to replace below
		list: "PLl_KM23gznEAZW-INW8ty4QNaHH8JCnNW",
		cc_load_policy: "true", // shows or hides closed captions if available
		color: "red", // shows status bar color on the player, "red" or "white"
		controls: "true", // shows or hides the player controls
		disablekb: "0", // enables or disables keyboard functions
		enablejsapi: "true", // Enables the player to be controlled via IFrame API calls
		fs: "false", // enables or disables the fullscreen player
		iv_load_policy: "1", // shows or hides video annotations
		modestbranding: "true", // shows or hides the YouTube logo on the player
		showinfo: "true", // shows or hides the video's information
		rel: "false", // shows or hides related videos at end of video
		volume: "100%", // percentage of starting sound 0-100
		height: "394", // specified in pixels (px)
		width: "700", // specified in pixels (px)
		autoplay: "true", // to automatically play when player gets loaded
		loop: "true" // to replay the playlist continuously
	},

	start: function(){
		self = this;
		self.loaded = false;
		var el = document.createElement("script");
		el.src = "//www.youtube.com/iframe_api";
		el.onload = function(){
			self.loaded = true;
			setTimeout( function(){
				console.log("MMM-RandomYTPlayer: Video wrapper made!");
				var wrapper = document.getElementById(self.identifier + "_wrapper"),
					playerDiv = document.createElement("div");
				wrapper.innerHTML = "";
				wrapper.className = "";
				playerDiv.id = "YT_Player";
				wrapper.appendChild(playerDiv);

				self.player = new YT.Player("YT_Player", {
					volume: self.config.volume,
					height: self.config.height,
					width: self.config.width,
					autoplay: self.config.autoplay,
					playerVars:
					{
						listType:"playlist",
						list: self.config.list
					},
					loop: self.config.loop,
					events: {
						onReady: self.onPlayerReady
					}
				});
			}, 500);
		};
		document.querySelector("body").appendChild(el);
	},
	getDom: function() {
		var self = this;
		var wrapper = document.createElement("div");
		wrapper.id = self.identifier + "_wrapper";
		if (!self.loaded) {
			wrapper.innerHTML = this.translate("MMM-RandomYouTubePlayer is Loading.");
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		return wrapper;
	},
	onPlayerReady: function (event) {
		event.target.setShuffle(shufflePlaylist="true");
		event.target.playVideo();
	}
});
