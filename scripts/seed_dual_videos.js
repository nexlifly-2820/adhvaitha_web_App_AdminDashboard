const payload = {
  header_video_enabled: true,
  header_video_url: "https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4",
  enabled: true,
  video_url: "https://res.cloudinary.com/dxynqm0zo/video/upload/v1792920192/adhvaitha_foods_videos/okhemjaycs9mffdyoca9.mp4",
  featured_video_url: "https://res.cloudinary.com/dxynqm0zo/video/upload/v1792920192/adhvaitha_foods_videos/okhemjaycs9mffdyoca9.mp4",
  title: "AmbhuJakshi Royal Collection"
};

fetch('http://api.adhvaithafoods.in/api/app_settings.php?doc_id=home_video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(data => {
  console.log('Update result:', data);
  return fetch('http://api.adhvaithafoods.in/api/app_settings.php?doc_id=home_video');
})
.then(r => r.json())
.then(getRes => {
  console.log('Current live DB home_video:', JSON.stringify(getRes, null, 2));
})
.catch(err => {
  console.error('Error:', err);
});
