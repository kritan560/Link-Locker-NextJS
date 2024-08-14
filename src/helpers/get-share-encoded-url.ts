/**
 * This function will generate the encoded URI for Reddit with given title & URL
 * @param title - the title for the post
 * @param url - The URL you want to share
 * @returns
 */
export function getRedditShareURL(title: string, url: string) {
  const encodedURL = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return `https://www.reddit.com/submit?url=${encodedURL}&title=${encodedTitle}`;
}

/**
 * This function will generate the encoded URI for WhatsApp with given URL
 * @param url - The URL you want to share
 * @returns
 */
export function getWhatsAppShareURL(url: string) {
  const encodedURL = encodeURIComponent(url);
  return `https://api.whatsapp.com/send/?text=${encodedURL}`;
}

/**
 * This function will generate the encoded URI for X with given URL
 * @param url - The URL you want to share
 * @returns
 */
export function getXShareURL(url: string) {
  const encodedXShareURL = encodeURIComponent(url);
  const fullURL = `https://x.com/intent/post?url=${encodedXShareURL}`;
  return fullURL;
}

/**
 * This function will generate the encoded URI for linkedIn with given URL
 * @param url - The URL you want to share
 * @returns
 */
export function getLinkedinURL(url: string) {
  const encodedLinkedinURL = encodeURIComponent(url);

  const fullURL = `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodedLinkedinURL}`;

  return fullURL;
}

/**
 * This function will generate the encoded URI for facebook with given URL
 * @param url - The URL you want to share
 * @returns
 */
export function getFacebookURL(url: string) {
  const encodedLinkedinURL = encodeURIComponent(url);

  const fullURL = `https://www.facebook.com/share_channel/?link=${encodedLinkedinURL}&app_id=87741124305&source_surface=external_reshare&display=popup&hashtag`;

  return fullURL;
}
