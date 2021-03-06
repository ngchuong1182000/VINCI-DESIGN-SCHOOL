"use strict";

var cld = cloudinary.Cloudinary["new"]({
  cloud_name: "mycloud1108",
  secure: true,
  private_cdn: true,
  secure_distribution: 'https://www.facebook.com/chuongcnbhaf180208/'
});
var player = cld.videoPlayer('video');
var video = document.getElementById("video").dataset["default"];
console.log(video);
player.source(video); // const lisGroupItem = document.querySelectorAll('.list-group-item')
// for (let index = 0; index < lisGroupItem.length; index++) {
//   const item = lisGroupItem[index];
//   item.addEventListener('click', (e) => {
//     e.preventDefault();
//     let videoid = document.getElementById("videoId");
//     let data = item.dataset.src;
//     player.source(data);
//     videoid.value = data;
//   })
// }
// document.oncontextmenu = () => false